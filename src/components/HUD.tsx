import { Shield, Activity, Zap, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  state: {
    nodes: any[];
    stability: number;
  };
}

export default function HUD({ state }: Props) {
  const criticalCount = state.nodes.filter(n => n.status === 'CRITICAL').length;
  const warningCount = state.nodes.filter(n => n.status === 'WARNING').length;

  return (
    <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between z-10 font-mono">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-blue-500/30 p-4 rounded-lg">
            <div className="p-3 bg-blue-500/20 rounded-full">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter">CCS-AI CORE</h1>
              <p className="text-[10px] text-blue-400/70 uppercase tracking-[0.3em]">Celestial Control System v4.0.1</p>
            </div>
          </div>

          <div className="flex gap-4">
            <StatBox label="ACTIVE NODES" value={state.nodes.length} color="text-blue-400" />
            <StatBox label="WARNINGS" value={warningCount} color="text-yellow-400" />
            <StatBox label="CRITICAL" value={criticalCount} color="text-red-500" />
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-blue-500/30 p-6 rounded-lg text-right">
          <p className="text-xs text-blue-400/70 uppercase mb-2 tracking-widest">Global Stability Index</p>
          <div className={`text-6xl font-black tabular-nums ${state.stability > 80 ? 'text-blue-400' : state.stability > 50 ? 'text-yellow-400' : 'text-red-500'}`}>
            {Math.round(state.stability)}%
          </div>
          <div className="w-64 h-2 bg-blue-900/30 mt-4 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${state.stability > 50 ? 'bg-blue-500' : 'bg-red-500'}`}
              animate={{ width: `${state.stability}%` }}
              transition={{ type: 'spring', bounce: 0 }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end">
        <div className="bg-black/40 backdrop-blur-md border border-blue-500/30 p-4 rounded-lg flex gap-8">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-[10px] text-blue-400/50 uppercase">Network Throughput</p>
              <p className="text-lg font-bold text-white">4.8 GB/s</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-[10px] text-blue-400/50 uppercase">Avg Latency</p>
              <p className="text-lg font-bold text-white">12.4 ms</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-[10px] text-blue-400/50 uppercase">AI Confidence</p>
              <p className="text-lg font-bold text-white">94.2%</p>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-blue-400/30 uppercase tracking-widest">
          Secure Link Established // Deep Space Relay 09
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="bg-black/40 backdrop-blur-md border border-blue-500/30 p-3 rounded-lg w-32">
      <p className="text-[10px] text-blue-400/50 uppercase mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
