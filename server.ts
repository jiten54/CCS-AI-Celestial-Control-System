import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { spawn, ChildProcess } from 'child_process';
import { SimulationEngine } from './backend/simulation_engine';

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: '*' }
  });

  const PORT = 3000;
  const engine = new SimulationEngine();

  // AI Process Management
  let anomalyProcess: ChildProcess | null = null;
  let predictionProcess: ChildProcess | null = null;

  function startAIProcesses() {
    try {
      anomalyProcess = spawn('python3', [path.join(process.cwd(), 'ai_engine', 'anomaly_detection.py')]);
      predictionProcess = spawn('python3', [path.join(process.cwd(), 'ai_engine', 'prediction_model.py')]);

      anomalyProcess.stdout?.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach((line: string) => {
          if (!line) return;
          try {
            const result = JSON.parse(line);
            if (result.type === 'anomaly_result') {
              const node = engine.nodes.find((n: any) => n.id === result.node_id);
              if (node) node.isAnomaly = result.is_anomaly;
            }
          } catch (e) {}
        });
      });

      predictionProcess.stdout?.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach((line: string) => {
          if (!line) return;
          try {
            const result = JSON.parse(line);
            if (result.type === 'prediction_result') {
              const node = engine.nodes.find((n: any) => n.id === result.node_id);
              if (node) node.prediction = result.prediction;
            }
          } catch (e) {}
        });
      });

      anomalyProcess.stderr?.on('data', (data) => console.error(`AI Anomaly Error: ${data}`));
      predictionProcess.stderr?.on('data', (data) => console.error(`AI Prediction Error: ${data}`));

    } catch (e) {
      console.error('Failed to start AI processes. Ensure python3 and dependencies are installed.');
    }
  }

  startAIProcesses();

  // Simulation Loop
  setInterval(() => {
    const state = engine.update();
    
    // Pipe telemetry to AI processes
    state.nodes.forEach(node => {
      const telemetryMsg = JSON.stringify({
        type: 'telemetry',
        node_id: node.id,
        payload: node.telemetry
      }) + '\n';
      
      anomalyProcess?.stdin?.write(telemetryMsg);
      predictionProcess?.stdin?.write(telemetryMsg);
    });

    io.emit('system_state', state);
  }, 1000);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('inject_anomaly', (nodeId) => {
      engine.injectAnomaly(nodeId);
      io.emit('event', { type: 'ANOMALY_INJECTED', nodeId, timestamp: Date.now() });
    });

    socket.on('set_load', ({ nodeId, load }) => {
      engine.setLoad(nodeId, load);
    });

    socket.on('reset_system', () => {
      engine.reset();
      io.emit('event', { type: 'SYSTEM_RESET', timestamp: Date.now() });
    });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`CCS-AI Server running at http://localhost:${PORT}`);
  });
}

startServer();
