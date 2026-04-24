import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Zap, Bug, ShieldAlert, Cpu, Search, Activity, Lock, Globe, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ZeroDay {
  id: string;
  title: string;
  vector: string;
  severity: 'CRITICAL' | 'HIGH';
  status: 'RESEARCHING' | 'REPLICATED' | 'WEAPONIZED';
  description: string;
  mitigation: string;
}

const RESEARCH_DATA: ZeroDay[] = [
  {
    id: 'z-001',
    title: 'Neural Injection in LLM Gateways',
    vector: 'Prompt Engineering / Inference Hooking',
    severity: 'CRITICAL',
    status: 'WEAPONIZED',
    description: 'Exploiting the lack of input sanitization in transformer model gateways. Allows for weight-shifting and unauthorized instruction overrides.',
    mitigation: 'Implement semantic layer firewalls and token-level authorization.'
  },
  {
    id: 'z-002',
    title: 'Atomic Swap Race Condition in DeFi Bridges',
    vector: 'Smart Contract / Temporal Integrity',
    severity: 'HIGH',
    status: 'REPLICATED',
    description: 'A 200ms window during cross-chain swaps where state reconciliation can be forced into a collision, causing double-spending.',
    mitigation: 'Multi-layer finality checks and centralized reconciliation checkpoints.'
  },
  {
    id: 'z-003',
    title: 'Zero-Click WebRTC Buffer Overflow',
    vector: 'Memory Corruption / Peer-to-Peer',
    severity: 'CRITICAL',
    status: 'RESEARCHING',
    description: 'Vulnerability in the handling of negotiated media descriptors. Can lead to remote code execution during an incoming call session.',
    mitigation: 'Update libwebrtc to v124+ and disable non-standard codecs.'
  }
];

export const ZeroDayLab: React.FC = () => {
  const [selectedZday, setSelectedZday] = useState<ZeroDay>(RESEARCH_DATA[0]);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => setIsSimulating(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-black/40 font-mono">
      <div className="p-4 lg:p-6 border-b border-terminal-border bg-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-terminal-text flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            ZERO-DAY RESEARCH LAB
          </h2>
          <p className="text-[10px] text-terminal-text/40 uppercase tracking-[0.2em] mt-1">Experimental Vulnerability Research • Gemini-Driven</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right">
             <div className="text-[9px] text-terminal-text/30 uppercase">Active Vectors</div>
             <div className="text-sm font-bold text-accent">14 PRE-AUTH</div>
           </div>
           <div className="w-[1px] h-8 bg-terminal-border" />
           <div className="text-right">
             <div className="text-[9px] text-terminal-text/30 uppercase">Global Replicas</div>
             <div className="text-sm font-bold text-white">LOW_DENSITY</div>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Sidebar */}
        <div className="w-full lg:w-80 border-r border-terminal-border bg-black/20 overflow-y-auto custom-scrollbar">
          <div className="p-4 space-y-2">
            <div className="text-[10px] font-bold text-terminal-text/30 uppercase tracking-widest mb-4 px-2">High-Potential Candidates</div>
            {RESEARCH_DATA.map((z) => (
              <button
                key={z.id}
                onClick={() => setSelectedZday(z)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all group",
                  selectedZday.id === z.id 
                    ? "bg-accent/10 border-accent/40 shadow-lg shadow-accent/5" 
                    : "bg-black/40 border-terminal-border hover:border-accent/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-accent">{z.id}</span>
                  <Badge variant="outline" className={cn(
                    "text-[8px] border-none",
                    z.severity === 'CRITICAL' ? "bg-red-500/20 text-red-500" : "bg-orange-500/20 text-orange-500"
                  )}>
                    {z.severity}
                  </Badge>
                </div>
                <div className="text-xs font-bold text-terminal-text mb-1 group-hover:text-accent transition-colors truncate">{z.title}</div>
                <div className="text-[9px] text-terminal-text/40 lowercase truncate">{z.vector}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 space-y-10">
          <motion.div
            key={selectedZday.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded bg-accent/10 border border-accent/20">
                     <Lock className="w-5 h-5 text-accent" />
                   </div>
                   <h3 className="text-2xl lg:text-3xl font-black text-terminal-text tracking-tight uppercase">{selectedZday.title}</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline" className="bg-black border-terminal-border text-terminal-text/60 py-1 px-3">
                    VECTOR: {selectedZday.vector}
                  </Badge>
                  <Badge variant="outline" className={cn(
                    "bg-black py-1 px-3 border-none font-bold",
                    selectedZday.status === 'WEAPONIZED' ? "text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" : "text-terminal-cyan"
                  )}>
                    STATUS: {selectedZday.status}
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={startSimulation}
                disabled={isSimulating}
                className="bg-terminal-green text-black hover:bg-terminal-green/90 h-14 px-8 font-black tracking-[0.2em]"
              >
                {isSimulating ? "REPLICATING ATTACK..." : "COMMENCE SIMULATION"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div className="flex items-center gap-2 text-accent">
                    <Search className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Research Abstract</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-terminal-border text-sm leading-relaxed text-terminal-text/70 italic">
                    {selectedZday.description}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center gap-2 text-terminal-cyan">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Mitigation Strategy</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-black/60 border border-terminal-border text-sm leading-relaxed text-terminal-cyan/80 font-mono">
                    {selectedZday.mitigation}
                  </div>
               </div>
            </div>

            {isSimulating ? (
              <div className="p-12 rounded-3xl bg-black/80 border border-terminal-green/30 relative overflow-hidden flex flex-col items-center justify-center space-y-8 min-h-[400px]">
                 <div className="absolute inset-0 flex items-center justify-center opacity-10">
                   <Globe className="w-96 h-96 text-terminal-green animate-pulse" />
                 </div>
                 <div className="relative z-10 flex flex-col items-center gap-6">
                   <div className="w-20 h-20 rounded-full border-4 border-terminal-green border-t-transparent animate-spin" />
                   <div className="text-center space-y-2">
                     <div className="text-2xl font-black text-terminal-green tracking-widest animate-pulse">RUNNING ATTACK VECTOR</div>
                     <div className="text-xs text-terminal-text/40 uppercase tracking-[0.5em]">Neural Link Established</div>
                   </div>
                 </div>
                 <div className="w-full max-w-xl bg-white/5 h-1 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 3 }}
                     className="h-full bg-terminal-green shadow-[0_0_10px_#10b981]"
                   />
                 </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Complexity", value: "Level 11", icon: Cpu },
                  { label: "Stability", value: "Unstable", icon: Activity },
                  { label: "Persistence", value: "Volatile", icon: Bug },
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-4 text-center group hover:bg-accent/5 transition-all">
                    <stat.icon className="w-8 h-8 text-terminal-text/20 group-hover:text-accent transition-colors" />
                    <div>
                      <div className="text-[10px] text-terminal-text/30 uppercase mb-1">{stat.label}</div>
                      <div className="text-lg font-bold text-terminal-text">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
