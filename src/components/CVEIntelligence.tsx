import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ShieldAlert, Activity, ExternalLink, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { searchCVE } from '@/src/services/gemini';
import ReactMarkdown from 'react-markdown';

interface CVEIntelligenceProps {
  onWeaponize?: (cveId: string) => void;
}

export const CVEIntelligence: React.FC<CVEIntelligenceProps> = ({ onWeaponize }) => {
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

  const isCVEQuery = query.toUpperCase().startsWith('CVE-');

  return (
    <div className="h-full flex flex-col bg-black/10 overflow-hidden">
      <div className="p-4 lg:p-10 border-b border-obsidian-border bg-obsidian-bg/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <ShieldAlert className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold font-display text-text-primary tracking-tight">CVE Intelligence Center</h2>
            <p className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">Real-time Vulnerability Research</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <Input 
              placeholder="Search software or CVE ID..." 
              className="pl-12 bg-obsidian-card border-obsidian-border focus:border-accent/50 text-sm h-12 lg:h-14 rounded-xl"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !query.trim()}
            className="bg-accent text-white hover:bg-accent/90 font-bold px-6 lg:px-10 h-12 lg:h-14 rounded-xl shadow-lg shadow-accent/20 transition-all w-full sm:w-auto"
          >
            {isLoading ? "RESEARCHING..." : "SEARCH INTEL"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar min-h-0">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center border border-accent/20"
            >
              <Cpu className="w-10 h-10 text-accent" />
            </motion.div>
            <p className="text-xs font-medium text-accent uppercase tracking-[0.2em] animate-pulse">Querying Global Databases...</p>
          </div>
        ) : results ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="p-5 lg:p-10 pro-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-obsidian-border gap-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-accent" />
                  <span className="text-xs font-bold text-text-primary uppercase tracking-widest">Intelligence Report</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                  {isCVEQuery && onWeaponize && (
                    <Button 
                      size="sm" 
                      onClick={() => onWeaponize(query)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] h-8 px-4 rounded-lg shadow-lg shadow-red-500/20 w-full sm:w-auto"
                    >
                      <Cpu className="w-3.5 h-3.5 mr-2" />
                      WEAPONIZE
                    </Button>
                  )}
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-secondary/40">
                    <span>SOURCE: GEMINI-INTEL-V3</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
              <div className="markdown-body text-base leading-relaxed">
                <ReactMarkdown>{results}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-10">
            <ShieldAlert className="w-24 h-24" />
            <div className="space-y-3">
              <p className="text-lg font-bold uppercase tracking-widest">Awaiting Intelligence Query</p>
              <p className="text-sm font-medium max-w-sm mx-auto">
                Enter a search term above to retrieve the latest vulnerability data and exploit intelligence.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
