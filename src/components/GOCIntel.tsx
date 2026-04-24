import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Activity, 
  Calendar, 
  Download, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Building2,
  RefreshCw,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface KEVItem {
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate: string;
  notes: string;
}

export const GOCIntel: React.FC = () => {
  const [vulnerabilities, setVulnerabilities] = useState<KEVItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/cisa-kev");
      if (!response.ok) throw new Error("CISA catalog unavailable");
      const data = await response.json();
      setVulnerabilities(data.vulnerabilities);
      setTotalCount(data.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredVulnerabilities = vulnerabilities.filter(v => 
    v.cveID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.vendorProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-black/40">
      <div className="p-4 lg:p-6 border-b border-terminal-border bg-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-terminal-text flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
              GLOBAL OPS CENTER: CISA KEV
            </h2>
            <p className="text-[10px] font-mono text-terminal-text/60 mt-1 uppercase tracking-widest">Live Threat Intelligence Feed</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[9px] font-mono text-terminal-text/50 uppercase">Catalog Size</div>
              <div className="text-sm lg:text-lg font-bold text-terminal-text font-mono">
                {loading ? "---" : totalCount.toLocaleString()}
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData}
              disabled={loading}
              className="border-red-500/20 text-red-500 hover:bg-red-500/10"
            >
              <RefreshCw className={cn("w-3 h-3 mr-2", loading && "animate-spin")} />
              REFRESH
            </Button>
          </div>
        </div>

        <div className="max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-text/30" />
            <Input 
              placeholder="Search CVE, Vendor, or Product..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-terminal-border text-sm font-mono"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center space-y-4"
            >
              <Activity className="w-12 h-12 text-red-500/40 animate-pulse" />
              <p className="font-mono text-xs text-terminal-text/30 uppercase tracking-widest text-center">
                Establishing uplink to CISA Intelligence data...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              className="h-full flex flex-col items-center justify-center p-8 text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-bold text-terminal-text mb-2 uppercase">Uplink Interrupted</h3>
              <p className="text-sm font-mono text-terminal-text/40 mb-6 max-w-md">
                Failed to synchronize with the Known Exploited Vulnerabilities catalog. This could be due to network security constraints.
              </p>
              <Button onClick={fetchData} variant="outline" className="border-red-500/30 text-red-500">
                RETRY CONNECTION
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-4"
            >
              {filteredVulnerabilities.map((v) => (
                <div 
                  key={v.cveID}
                  className={cn(
                    "rounded-xl border transition-all cursor-pointer overflow-hidden",
                    expandedId === v.cveID 
                      ? "bg-red-500/10 border-red-500/40 shadow-lg shadow-red-500/10" 
                      : "bg-black/40 border-terminal-border hover:border-red-500/30"
                  )}
                  onClick={() => setExpandedId(expandedId === v.cveID ? null : v.cveID)}
                >
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg font-bold text-terminal-text font-mono">{v.cveID}</span>
                          <Badge variant="outline" className="text-[9px] font-mono border-red-500/50 bg-red-500/10 text-red-400 uppercase">
                            High Priority
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-terminal-text/60 uppercase">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {v.vendorProject}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-terminal-text/40" />
                          <span>{v.product}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-terminal-border pt-4 md:pt-0">
                      <div className="text-right">
                        <div className="text-[9px] font-mono text-terminal-text/50 uppercase">Due Date</div>
                        <div className="text-sm font-bold text-red-500 font-mono italic">{v.dueDate}</div>
                      </div>
                      {expandedId === v.cveID ? <ChevronUp className="w-5 h-5 text-red-500" /> : <ChevronDown className="w-5 h-5 text-terminal-text/20" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === v.cveID && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-red-500/20 bg-red-500/5 p-6 space-y-6"
                      >
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-mono text-red-500 uppercase tracking-widest">In-The-Wild Description</h4>
                          <p className="text-sm text-terminal-text font-mono leading-relaxed">
                            {v.shortDescription}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Required Agent Action</h4>
                            <div className="p-4 rounded-lg bg-black/60 border border-red-500/30 text-xs font-mono text-red-400">
                              {v.requiredAction}
                            </div>
                          </div>
                          <div className="space-y-4">
                             <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                                <span className="text-terminal-text/50">CISA Entry Created</span>
                                <span className="text-terminal-text/80">{v.dateAdded}</span>
                             </div>
                             <div className="h-[1px] bg-red-500/40 w-full" />
                             <div className="flex gap-2">
                               <Button variant="outline" className="flex-1 text-[10px] border-red-500/30 text-red-500 hover:bg-red-500/10 h-8">
                                 <Download className="w-3 h-3 mr-2" />
                                 EXPORT INTEL
                               </Button>
                               <a 
                                 href={`https://nvd.nist.gov/vuln/detail/${v.cveID}`} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="flex-1"
                               >
                                 <Button variant="outline" className="w-full text-[10px] border-terminal-border text-terminal-text/50 hover:text-terminal-text h-8">
                                   <ExternalLink className="w-3 h-3 mr-2" />
                                   NVD SOURCE
                                 </Button>
                               </a>
                             </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-terminal-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[9px] font-mono text-terminal-text/30 uppercase">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            Last Sync: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Uplink Active
          </div>
        </div>
        <p className="text-[9px] font-mono text-terminal-text/20 italic">
          Data source: cybersecurity & infrastructure security agency (CISA)
        </p>
      </div>
    </div>
  );
};
