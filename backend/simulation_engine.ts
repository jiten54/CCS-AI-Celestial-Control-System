import fs from 'fs';
import path from 'path';

interface NodeTelemetry {
  load: number;
  latency: number;
  error_rate: number;
  throughput: number;
}

interface NodeState {
  id: string;
  name: string;
  telemetry: NodeTelemetry;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  prediction?: {
    status: string;
    failure_probability: number;
    prediction_window: string;
  };
  isAnomaly: boolean;
  position: [number, number, number];
}

export class SimulationEngine {
  public nodes: NodeState[] = [];
  public connections: { from: string; to: string }[] = [];
  private config: any;
  private stabilityIndex: number = 100;

  constructor() {
    this.loadConfig();
    this.initializeNodes();
  }

  private loadConfig() {
    try {
      const configPath = path.join(process.cwd(), 'config', 'config.json');
      this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (e) {
      this.config = {
        nodes: 10,
        anomaly_probability: 0.1,
        update_interval: 1000,
        cascading_failure_chance: 0.3
      };
    }
  }

  private initializeNodes() {
    const nodeCount = this.config.nodes || 10;
    for (let i = 0; i < nodeCount; i++) {
      this.nodes.push({
        id: `N${i}`,
        name: `System-${String.fromCharCode(65 + i)}`,
        telemetry: {
          load: 20 + Math.random() * 20,
          latency: 10 + Math.random() * 10,
          error_rate: Math.random() * 0.01,
          throughput: 100 + Math.random() * 50
        },
        status: 'NORMAL',
        isAnomaly: false,
        position: [
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 30
        ]
      });
    }

    // Create some random connections
    for (let i = 0; i < nodeCount; i++) {
      const target = Math.floor(Math.random() * nodeCount);
      if (target !== i) {
        this.connections.push({ from: this.nodes[i].id, to: this.nodes[target].id });
      }
    }
  }

  public update() {
    this.nodes.forEach(node => {
      // Base load fluctuation
      node.telemetry.load += (Math.random() - 0.5) * 5;
      
      // Random anomalies
      if (Math.random() < this.config.anomaly_probability / 10) {
        node.telemetry.load += 40;
      }

      // Clamp values
      node.telemetry.load = Math.max(0, Math.min(100, node.telemetry.load));
      node.telemetry.latency = 10 + (node.telemetry.load / 2) + Math.random() * 5;
      node.telemetry.error_rate = (node.telemetry.load > 80 ? 0.05 : 0.001) + Math.random() * 0.01;
      node.telemetry.throughput = 150 - (node.telemetry.load / 2) + Math.random() * 20;

      // Update status
      if (node.telemetry.load > 90 || node.telemetry.error_rate > 0.1) {
        node.status = 'CRITICAL';
      } else if (node.telemetry.load > 70) {
        node.status = 'WARNING';
      } else {
        node.status = 'NORMAL';
      }
    });

    // Cascading failures
    this.connections.forEach(conn => {
      const fromNode = this.nodes.find(n => n.id === conn.from);
      const toNode = this.nodes.find(n => n.id === conn.to);
      if (fromNode && toNode && fromNode.status === 'CRITICAL') {
        if (Math.random() < this.config.cascading_failure_chance) {
          toNode.telemetry.load += 10;
        }
      }
    });

    this.calculateStability();
    return { nodes: this.nodes, connections: this.connections, stability: this.stabilityIndex };
  }

  private calculateStability() {
    const criticalCount = this.nodes.filter(n => n.status === 'CRITICAL').length;
    const warningCount = this.nodes.filter(n => n.status === 'WARNING').length;
    this.stabilityIndex = 100 - (criticalCount * 10 + warningCount * 3);
    this.stabilityIndex = Math.max(0, this.stabilityIndex);
  }

  public injectAnomaly(nodeId: string) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.telemetry.load = 95;
      node.telemetry.error_rate = 0.2;
    }
  }

  public setLoad(nodeId: string, load: number) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.telemetry.load = load;
    }
  }

  public reset() {
    this.nodes = [];
    this.connections = [];
    this.initializeNodes();
    this.stabilityIndex = 100;
  }
}
