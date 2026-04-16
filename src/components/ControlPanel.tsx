import { Terminal, RefreshCw, Zap, Sliders, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import socket from '../lib/socket';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  state: {
    nodes: any[];
  };
  events: any[];
}

export default function ControlPanel({ state, events }: Props) {
  return (
    <div className="h-full flex flex-col gap-4 pointer-events-auto font-mono">
      {/* Simulation Controls */}
      <div className="bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Sliders className="w-4 h-4" />
          Simulation Controls
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-blue-400/70 uppercase">
              <span>Global Load Factor</span>
              <span>1.0x</span>
            </div>
            <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 h-8 text-[10px]"
              onClick={() => socket.emit('reset_system')}
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              RESET
            </Button>
            <Button 
              variant="outline" 
              className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 h-8 text-[10px]"
              onClick={() => {
                const randomNode = state.nodes[Math.floor(Math.random() * state.nodes.length)];
                socket.emit('inject_anomaly', randomNode.id);
              }}
            >
              <Zap className="w-3 h-3 mr-2" />
              ANOMALY
            </Button>
          </div>
        </div>
      </div>

      {/* Node Status List */}
      <div className="flex-1 bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-lg overflow-hidden flex flex-col">
        <div className="bg-blue-500/10 p-3 border-b border-blue-500/30 flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <ActivityIcon className="w-4 h-4" />
          System Nodes
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-2">
            {state.nodes.map(node => (
              <div key={node.id} className="bg-white/5 p-2 rounded border border-white/5 hover:border-blue-500/30 transition-colors group">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-white">{node.name}</span>
                  <span className={`text-[10px] ${node.status === 'CRITICAL' ? 'text-red-500' : node.status === 'WARNING' ? 'text-yellow-500' : 'text-blue-400'}`}>
                    {node.status}
                  </span>
                </div>
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${node.status === 'CRITICAL' ? 'bg-red-500' : node.status === 'WARNING' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    style={{ width: `${node.telemetry.load}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[8px] text-white/30 uppercase">
                  <span>Load: {Math.round(node.telemetry.load)}%</span>
                  <span>Prob: {Math.round((node.prediction?.failure_probability || 0) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Event Logs */}
      <div className="h-48 bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-lg overflow-hidden flex flex-col">
        <div className="bg-blue-500/10 p-3 border-b border-blue-500/30 flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
          <Terminal className="w-4 h-4" />
          Event Logs
        </div>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-1">
            <AnimatePresence initial={false}>
              {events.map((event, i) => (
                <motion.div 
                  key={event.timestamp + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[9px] leading-tight flex gap-2"
                >
                  <span className="text-blue-500/50">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                  <span className={event.type === 'ANOMALY_INJECTED' ? 'text-red-400' : 'text-blue-300'}>
                    {event.type}: {event.nodeId || 'SYSTEM'}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function ActivityIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
