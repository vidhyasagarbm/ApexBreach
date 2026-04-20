import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Eye, 
  EyeOff, 
  Lock, 
  Terminal,
  Code,
  Search,
  AlertTriangle,
  Layers,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { obfuscatePayload } from '@/src/services/gemini';

const EVASION_TECHNIQUES = [
  { id: 'poly', name: 'Polymorphic Encoding', description: 'Mutates code structure while preserving logic' },
  { id: 'shell', name: 'Shellcode Injection', description: 'Encodes payload into memory-resident shellcode' },
  { id: 'lolbin', name: 'LOLBin Substitution', description: 'Uses legitimate system binaries for execution' },
  { id: 'anti-vm', name: 'Anti-VM/Sandbox', description: 'Detects and stalls in virtualized environments' },
  { id: 'process', name: 'Process Hollowing', description: 'Injects code into a suspended legitimate process' },
];

interface StealthLabProps {
  onWeaponize?: (finding: string) => void;
}

export const StealthLab: React.FC<StealthLabProps> = ({ onWeaponize }) => {
  const [payload, setPayload] = useState('');
  const [selectedTech, setSelectedTech] = useState(EVASION_TECHNIQUES[0]);
  const [result, setResult] = useState<string | null>(null);
  const [isObfuscating, setIsObfuscating] = useState(false);

  const handleObfuscate = async () => {
    if (!payload) return;
    setIsObfuscating(true);
    const output = await obfuscatePayload(payload, selectedTech.name);
    setResult(output);
    setIsObfuscating(false);
  };

  return (
    <div className="flex flex-col h-full bg-black/40">
      <div className="p-6 border-b border-terminal-border bg-black/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-terminal-text flex items-center gap-2">
              <EyeOff className="w-6 h-6 text-purple-500" />
              STEALTH & EVASION LAB
            </h2>
            <p className="text-xs font-mono text-terminal-text/40 mt-1 uppercase tracking-widest">Advanced Payload Obfuscation & Detection Bypass</p>
          </div>
          <Badge variant="outline" className="border-purple-500/20 text-purple-500 font-mono">
            STATUS: UNDETECTABLE
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          {EVASION_TECHNIQUES.map((tech) => (
            <button
              key={tech.id}
              onClick={() => setSelectedTech(tech)}
              className={cn(
                "p-4 rounded-xl border transition-all text-left group relative overflow-hidden",
                selectedTech.id === tech.id 
                  ? "bg-purple-500/10 border-purple-500/50" 
                  : "bg-black/40 border-terminal-border hover:border-purple-500/30"
              )}
            >
              <div className="relative z-10">
                <div className="text-sm font-bold text-terminal-text group-hover:text-purple-400 transition-colors">{tech.name}</div>
                <div className="text-[9px] font-mono text-terminal-text/30 mt-2 uppercase leading-tight">{tech.description}</div>
              </div>
              {selectedTech.id === tech.id && (
                <motion.div 
                  layoutId="tech-glow"
                  className="absolute inset-0 bg-purple-500/5 blur-xl" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Input/Output Area */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-terminal-border min-h-0">
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6 min-h-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest">Raw Payload / Script</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[8px] border-purple-500/20 text-purple-500">FORMAT: AUTO</Badge>
                </div>
              </div>
              <textarea 
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                placeholder="// Paste your payload, shellcode, or script here...&#10;// Example: powershell.exe -ExecutionPolicy Bypass -File exploit.ps1"
                className="w-full h-48 bg-black/60 border border-terminal-border rounded-xl p-4 font-mono text-sm text-terminal-text placeholder:text-terminal-text/20 focus:outline-none focus:border-purple-500/50 transition-colors resize-none custom-scrollbar"
              />
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleObfuscate}
                disabled={isObfuscating || !payload}
                className="bg-purple-500 hover:bg-purple-600 text-black font-bold px-12 h-12 gap-2"
              >
                {isObfuscating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isObfuscating ? 'APPLYING EVASION...' : 'OBFUSCATE PAYLOAD'}
              </Button>
            </div>

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-mono text-purple-500 uppercase tracking-widest">Transformation Result</h4>
                    <div className="flex items-center gap-2">
                      {onWeaponize && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onWeaponize(`Obfuscated Payload (${selectedTech.name})`)}
                          className="text-[10px] border-purple-500/30 text-purple-500 hover:bg-purple-500/10 gap-2"
                        >
                          <Zap className="w-3 h-3" />
                          SEND TO ARMORY
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="text-[10px] text-terminal-text/30 hover:text-terminal-text">
                        CLEAR
                      </Button>
                    </div>
                  </div>
                  <div className="prose prose-invert prose-purple max-w-none font-mono text-sm bg-black/40 p-6 rounded-xl border border-purple-500/20">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div className="w-full lg:w-80 bg-black/20 p-6 space-y-6 overflow-y-auto custom-scrollbar min-h-0">
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest flex items-center gap-2">
              <Search className="w-3 h-3" />
              Detection Simulation
            </h4>
            <div className="space-y-4">
              {[
                { vendor: 'CrowdStrike', risk: 'LOW', color: 'text-green-500' },
                { vendor: 'SentinelOne', risk: 'MEDIUM', color: 'text-yellow-500' },
                { vendor: 'Defender for Endpoint', risk: 'LOW', color: 'text-green-500' },
                { vendor: 'Palo Alto Cortex', risk: 'HIGH', color: 'text-red-500' },
              ].map((sim, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-terminal-text/60">{sim.vendor}</span>
                  <Badge variant="outline" className={cn("text-[8px] font-mono border-white/10", sim.color)}>
                    {sim.risk} RISK
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 space-y-3">
            <div className="flex items-center gap-2 text-purple-500">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Operational Security</span>
            </div>
            <p className="text-[10px] font-mono text-terminal-text/60 leading-relaxed">
              Obfuscation is not a silver bullet. Behavioral analysis and ML-based detection can still flag suspicious execution patterns. Always test in a lab environment first.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest">Entropy Level</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-mono text-terminal-text/40">
                <span>SIGNAL_TO_NOISE</span>
                <span>84%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[84%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
