import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Target, 
  Zap, 
  Activity, 
  Search, 
  Cpu, 
  Lock, 
  Globe, 
  Terminal,
  ChevronRight,
  AlertTriangle,
  Layers,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { generateAPTPlaybook } from '@/src/services/gemini';

const APT_ACTORS = [
  { id: 'apt28', name: 'APT28 (Fancy Bear)', origin: 'Russia', focus: 'Government, Military' },
  { id: 'lazarus', name: 'Lazarus Group', origin: 'North Korea', focus: 'Finance, Crypto' },
  { id: 'fin7', name: 'FIN7', origin: 'Eastern Europe', focus: 'Retail, Hospitality' },
  { id: 'apt41', name: 'APT41 (Double Dragon)', origin: 'China', focus: 'Healthcare, Tech' },
  { id: 'sandworm', name: 'Sandworm', origin: 'Russia', focus: 'Energy, Infrastructure' },
];

interface APTEmulationProps {
  onWeaponize?: (finding: string) => void;
}

export const APTEmulation: React.FC<APTEmulationProps> = ({ onWeaponize }) => {
  const [selectedActor, setSelectedActor] = useState(APT_ACTORS[0]);
  const [playbook, setPlaybook] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateAPTPlaybook(selectedActor.name);
    setPlaybook(result);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col h-full bg-black/40">
      <div className="p-6 border-b border-terminal-border bg-black/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-terminal-text flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-500" />
              APT EMULATION ENGINE
            </h2>
            <p className="text-xs font-mono text-terminal-text/40 mt-1 uppercase tracking-widest">Advanced Threat Actor Playbook Generation</p>
          </div>
          <Badge variant="outline" className="border-cyan-500/20 text-cyan-500 font-mono">
            INTEL_LEVEL: ELITE
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {APT_ACTORS.map((actor) => (
            <button
              key={actor.id}
              onClick={() => setSelectedActor(actor)}
              className={cn(
                "p-4 rounded-xl border transition-all text-left group relative overflow-hidden",
                selectedActor.id === actor.id 
                  ? "bg-cyan-500/10 border-cyan-500/50" 
                  : "bg-black/40 border-terminal-border hover:border-cyan-500/30"
              )}
            >
              <div className="relative z-10">
                <div className="text-[10px] font-mono text-terminal-text/40 mb-1">{actor.origin}</div>
                <div className="text-sm font-bold text-terminal-text group-hover:text-cyan-400 transition-colors">{actor.name}</div>
                <div className="text-[9px] font-mono text-terminal-text/30 mt-2 uppercase">{actor.focus}</div>
              </div>
              {selectedActor.id === actor.id && (
                <motion.div 
                  layoutId="actor-glow"
                  className="absolute inset-0 bg-cyan-500/5 blur-xl" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Playbook Content */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar border-r border-terminal-border">
          <AnimatePresence mode="wait">
            {!playbook && !isGenerating ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center">
                  <Target className="w-10 h-10 text-cyan-500/40" />
                </div>
                <div className="max-w-md">
                  <h3 className="text-lg font-bold text-terminal-text mb-2">Initialize Threat Emulation</h3>
                  <p className="text-sm text-terminal-text/40 font-mono">
                    Select a threat actor to generate a comprehensive offensive playbook based on known TTPs and infrastructure patterns.
                  </p>
                </div>
                <Button 
                  onClick={handleGenerate}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-8 h-12 gap-2"
                >
                  <Zap className="w-4 h-4" />
                  GENERATE PLAYBOOK
                </Button>
              </motion.div>
            ) : isGenerating ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative">
                  <Brain className="w-12 h-12 text-cyan-500 animate-pulse" />
                  <div className="absolute inset-0 bg-cyan-500/20 blur-xl animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono text-cyan-500">ANALYZING_ACTOR_DNA...</p>
                  <p className="text-[10px] font-mono text-terminal-text/30 mt-1 uppercase">Correlating MITRE ATT&CK patterns</p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-cyan max-w-none font-mono text-sm"
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-terminal-border">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-cyan-500 text-black font-bold">PLAYBOOK_v1.0</Badge>
                    <span className="text-terminal-text/40 text-[10px] uppercase tracking-widest">Target: {selectedActor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {onWeaponize && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onWeaponize(`APT TTPs for ${selectedActor.name}`)}
                        className="text-[10px] border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10 gap-2"
                      >
                        <Zap className="w-3 h-3" />
                        WEAPONIZE TTPs
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setPlaybook(null)} className="text-[10px] border-terminal-border">
                      RESET
                    </Button>
                  </div>
                </div>
                <ReactMarkdown>{playbook!}</ReactMarkdown>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Intel */}
        <div className="w-full lg:w-80 bg-black/20 p-6 space-y-6 overflow-y-auto no-scrollbar">
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" />
              Live Intel Stream
            </h4>
            <div className="space-y-3">
              {[
                { time: '02:14', msg: 'New C2 infrastructure detected for APT28', type: 'alert' },
                { time: '04:45', msg: 'Lazarus Group shifting to crypto-drainers', type: 'info' },
                { time: '05:12', msg: 'FIN7 phishing campaign targeting retail', type: 'alert' },
              ].map((log, i) => (
                <div key={i} className="flex gap-3 text-[10px] font-mono">
                  <span className="text-terminal-text/20">{log.time}</span>
                  <span className={cn(log.type === 'alert' ? "text-red-500/60" : "text-cyan-500/60")}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10 space-y-3">
            <div className="flex items-center gap-2 text-cyan-500">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Proactive Defense</span>
            </div>
            <p className="text-[10px] font-mono text-terminal-text/60 leading-relaxed">
              Use these playbooks to simulate actor-specific behavior in your environment. Test detection rules against signature move sequences.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest">Common Frameworks</h4>
            <div className="flex flex-wrap gap-2">
              {['Cobalt Strike', 'Sliver', 'Brute Ratel', 'Empire', 'Metasploit'].map(tool => (
                <Badge key={tool} variant="outline" className="text-[9px] border-terminal-border text-terminal-text/40">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
