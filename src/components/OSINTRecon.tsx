import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Search, 
  Target, 
  Activity, 
  Layers, 
  Cpu, 
  Shield, 
  Zap, 
  Database,
  Users,
  Network,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { analyzeReconSurface } from '@/src/services/gemini';

interface OSINTReconProps {
  onWeaponize?: (finding: string) => void;
}

export const OSINTRecon: React.FC<OSINTReconProps> = ({ onWeaponize }) => {
  const [target, setTarget] = useState('');
  const [reconData, setReconData] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!target) return;
    setIsAnalyzing(true);
    const result = await analyzeReconSurface(target);
    setReconData(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full bg-black/40">
      <div className="p-6 border-b border-terminal-border bg-black/20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-terminal-text flex items-center gap-2">
              <Globe className="w-6 h-6 text-emerald-500" />
              OSINT RECON ENGINE
            </h2>
            <p className="text-xs font-mono text-terminal-text/40 mt-1 uppercase tracking-widest">Automated Attack Surface Mapping & Reconnaissance</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono text-terminal-text/30 uppercase">Active Scans</div>
              <div className="text-lg font-bold text-terminal-text">1,248</div>
            </div>
            <Separator orientation="vertical" className="h-8 bg-terminal-border" />
            <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 font-mono">
              MODE: PASSIVE_RECON
            </Badge>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-6">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <Shield className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Intelligence Note</span>
            </div>
            <p className="text-[11px] font-mono text-terminal-text/70 leading-relaxed">
              This engine uses <span className="text-emerald-500 font-bold">AI-driven Predictive Intelligence</span>. It synthesizes known infrastructure patterns, historical data, and OSINT footprints to map the attack surface without active network scanning.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/40" />
                <Input 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Enter target domain, IP, or organization (e.g. example.com)"
                  className="h-14 pl-12 bg-black/60 border-terminal-border focus:border-emerald-500/50 text-lg font-mono"
                />
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !target}
                className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-black font-bold gap-2"
              >
                {isAnalyzing ? <Activity className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {isAnalyzing ? 'MAPPING...' : 'START RECON'}
              </Button>
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {['Subdomains', 'Endpoints', 'Tech Stack', 'Employee Profiles', 'Leaked Credentials'].map(tag => (
              <div key={tag} className="flex items-center gap-2 text-[10px] font-mono text-terminal-text/30">
                <div className="w-1 h-1 rounded-full bg-emerald-500/40" />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Recon Output */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar border-r border-terminal-border">
          <AnimatePresence mode="wait">
            {!reconData && !isAnalyzing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center opacity-20 gap-4"
              >
                <Network className="w-16 h-16" />
                <p className="font-mono text-sm uppercase tracking-widest">Awaiting Target Input</p>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-8"
              >
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border border-emerald-500/20 flex items-center justify-center">
                    <Globe className="w-10 h-10 text-emerald-500 animate-pulse" />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-2 border-emerald-500 rounded-full"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-sm font-mono text-emerald-500 uppercase tracking-widest">Scanning Digital Footprint</p>
                  <div className="flex justify-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-invert prose-emerald max-w-none font-mono text-sm"
              >
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-terminal-border">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-500 text-black font-bold uppercase">Recon_Report</Badge>
                    <span className="text-terminal-text/40 text-[10px] uppercase tracking-widest">Target: {target}</span>
                  </div>
                  <div className="flex gap-2">
                    {onWeaponize && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onWeaponize(`OSINT Finding for ${target}`)}
                        className="text-[10px] border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 gap-2"
                      >
                        <Zap className="w-3 h-3" />
                        WEAPONIZE
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-[10px] border-terminal-border gap-2">
                      <ExternalLink className="w-3 h-3" />
                      EXPORT
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setReconData(null)} className="text-[10px] border-terminal-border">
                      RESET
                    </Button>
                  </div>
                </div>
                <ReactMarkdown>{reconData!}</ReactMarkdown>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Intel */}
        <div className="w-full lg:w-80 bg-black/20 p-6 space-y-8 overflow-y-auto no-scrollbar">
          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3 h-3" />
              Geographic Distribution
            </h4>
            <div className="space-y-3">
              {[
                { region: 'North America', load: 64 },
                { region: 'Europe', load: 28 },
                { region: 'Asia Pacific', load: 8 },
              ].map((reg, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-[9px] font-mono text-terminal-text/40">
                    <span>{reg.region}</span>
                    <span>{reg.load}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500/40" style={{ width: `${reg.load}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest flex items-center gap-2">
              <Database className="w-3 h-3" />
              Data Sources
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {['Shodan', 'Censys', 'VirusTotal', 'SecurityTrails', 'Whois', 'DNSDumpster'].map(source => (
                <div key={source} className="p-2 rounded bg-black/40 border border-terminal-border text-[9px] font-mono text-terminal-text/40 text-center">
                  {source}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Separator = ({ orientation = 'horizontal', className }: { orientation?: 'horizontal' | 'vertical', className?: string }) => (
  <div className={cn(
    "bg-terminal-border",
    orientation === 'horizontal' ? "h-[1px] w-full" : "w-[1px] h-full",
    className
  )} />
);
