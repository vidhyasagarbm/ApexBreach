import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ShieldAlert, Activity, ExternalLink, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchCVE } from '@/src/services/gemini';
import ReactMarkdown from 'react-markdown';

export const CVEIntelligence: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    const intel = await searchCVE(query);
    setResults(intel);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-black/20 overflow-hidden">
      <div className="p-8 border-b border-terminal-border bg-black/40">
        <div className="flex items-center gap-3 mb-6">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          <div>
            <h2 className="text-xl font-bold font-mono text-terminal-text uppercase tracking-tight">CVE Intelligence Center</h2>
            <p className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">Real-time Vulnerability Research</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-text/40" />
            <Input 
              placeholder="Search by software, vendor, or CVE ID (e.g., 'Log4j', 'Microsoft', 'CVE-2021-44228')..." 
              className="pl-10 bg-black/40 border-terminal-border focus:border-terminal-green/50 text-xs font-mono h-12"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="bg-terminal-green text-black hover:bg-terminal-green/90 font-mono font-bold px-8 h-12"
          >
            {isLoading ? "RESEARCHING..." : "SEARCH INTEL"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full border-2 border-terminal-green/20 flex items-center justify-center"
            >
              <Cpu className="w-8 h-8 text-terminal-green" />
            </motion.div>
            <p className="text-[10px] font-mono text-terminal-green uppercase tracking-widest animate-pulse">Querying Global Vulnerability Databases...</p>
          </div>
        ) : results ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 terminal-glow">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-terminal-cyan" />
                  <span className="text-[10px] font-mono text-terminal-cyan uppercase tracking-widest">Intelligence Report</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono text-terminal-text/30">
                  <span>SOURCE: GEMINI-INTEL-V3</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
              <div className="markdown-body text-sm leading-relaxed">
                <ReactMarkdown>{results}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-20">
            <ShieldAlert className="w-16 h-16" />
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest">Awaiting Intelligence Query</p>
              <p className="text-[10px] font-mono max-w-xs mx-auto">
                Enter a search term above to retrieve the latest vulnerability data and exploit intelligence.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
