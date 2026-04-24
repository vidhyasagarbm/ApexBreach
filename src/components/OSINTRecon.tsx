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
  ExternalLink,
  AlertTriangle,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { NeuralTargetGraph } from './NeuralTargetGraph';

interface OSINTReconProps {
  onWeaponize?: (finding: string) => void;
}

export const OSINTRecon: React.FC<OSINTReconProps> = ({ onWeaponize }) => {
  const [target, setTarget] = useState('');
  const [reconData, setReconData] = useState<any | null>(null);
  const [geoData, setGeoData] = useState<any | null>(null);
  const [shodanData, setShodanData] = useState<any | null>(null);
  const [vtData, setVtData] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!target) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const cleanTarget = target.replace(/^(https?:\/\/)/, "").split("/")[0];
      
      const [auditRes, geoRes, vtRes] = await Promise.all([
        fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: target })
        }),
        fetch(`/api/geo/${cleanTarget}`),
        fetch(`/api/virustotal/${cleanTarget}`)
      ]);
      
      const checkJson = (res: Response) => res.headers.get("content-type")?.includes("application/json");

      if (!checkJson(auditRes)) throw new Error("API Route /api/audit failed. Server may be restarting.");
      const auditData = await auditRes.json();
      if (!auditRes.ok) throw new Error(auditData.error || "Audit failed");
      
      const geoRespData = checkJson(geoRes) ? await geoRes.json() : null;
      setGeoData(geoRes.ok ? geoRespData : null);
      
      const vtRespData = checkJson(vtRes) ? await vtRes.json() : null;
      if (vtRes.status === 429) {
        setVtData({ error: "API limit hit (4 lookups/min). Cache miss." });
      } else {
        setVtData(vtRes.ok ? vtRespData : null);
      }

      if (geoRes.ok && geoRespData?.ipAddress) {
        const shodanRes = await fetch(`/api/shodan/${geoRespData.ipAddress}`);
        const shodanRespData = await shodanRes.json();
        setShodanData(shodanRes.ok ? shodanRespData : null);
      } else {
        setShodanData(null);
      }
      
      setReconData(auditData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/40">
      <div className="p-2 border-b border-terminal-border bg-black/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex w-8 h-8 rounded bg-emerald-500/10 items-center justify-center border border-emerald-500/20">
              <Globe className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-terminal-text uppercase tracking-widest leading-none">TARGET AUDIT ENGINE</h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-2.5 h-2.5 text-emerald-500/50" />
                <span className="text-[8px] font-mono text-terminal-text/40 uppercase">AI-Driven Predictive Intelligence Mapping</span>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500/40" />
                <Input 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Enter Target URL/IP..."
                  className="h-9 pl-9 bg-black/40 border-terminal-border focus:border-emerald-500/40 text-xs font-mono"
                />
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !target}
                className="h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold gap-2 text-[10px] uppercase tracking-tighter"
              >
                {isAnalyzing ? <Activity className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                {isAnalyzing ? 'MAPPING' : 'AUDIT'}
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-right">
            <div className="border-l border-terminal-border pl-4">
              <div className="text-[8px] font-mono text-terminal-text/30 uppercase">Uplink Status</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 font-mono">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Recon Output */}
        <div className="flex-[2] overflow-y-auto p-6 lg:p-10 custom-scrollbar lg:border-r border-terminal-border bg-black/10">
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
                className="space-y-10 font-mono text-sm max-w-5xl mx-auto pb-20"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 pb-6 border-b border-terminal-border gap-6">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-emerald-500 text-black font-bold uppercase py-1 px-3 text-xs tracking-tighter">Target_Audit_Report</Badge>
                    <span className="text-terminal-text/70 text-xs lg:text-sm uppercase tracking-widest truncate font-bold">Target: {reconData.url}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" onClick={() => setReconData(null)} className="text-xs border-terminal-border px-6 hover:bg-white/5">
                      NEW AUDIT
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 rounded-2xl bg-black/60 border border-terminal-border shadow-xl transition-all hover:border-white/5">
                    <div className="text-xs text-terminal-text/50 uppercase mb-3 tracking-tight">Server Signature</div>
                    <div className="text-emerald-500 font-bold text-xl truncate">{reconData.server}</div>
                  </div>
                  <div className="p-8 rounded-2xl bg-black/60 border border-terminal-border shadow-xl transition-all hover:border-white/5">
                    <div className="text-xs text-terminal-text/50 uppercase mb-3 tracking-tight">Latency</div>
                    <div className="text-terminal-text font-bold text-xl">{reconData.duration}</div>
                   </div>
                  <div className="p-8 rounded-2xl bg-red-500/10 border border-red-500/30 shadow-xl transition-all hover:bg-red-500/20">
                    <div className="text-xs text-red-500/70 uppercase mb-3 tracking-tight">Security Gaps</div>
                    <div className="text-red-500 font-bold text-xl">{reconData.findings} Critical Deficiencies</div>
                  </div>
                </div>

                {geoData && geoData.ipAddress && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-terminal-text/60 uppercase tracking-[0.2em]">Target IP Location</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-black/50 border border-terminal-border">
                         <div className="text-[10px] text-terminal-text/40 mb-1">IP ADDRESS</div>
                         <div className="text-sm font-bold text-emerald-500">{geoData.ipAddress}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-black/50 border border-terminal-border">
                         <div className="text-[10px] text-terminal-text/40 mb-1">COUNTRY</div>
                         <div className="text-sm font-bold text-emerald-500">{geoData.countryName || 'Unknown'}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-black/50 border border-terminal-border">
                         <div className="text-[10px] text-terminal-text/40 mb-1">REGION</div>
                         <div className="text-sm font-bold text-emerald-500">{geoData.regionName || 'Unknown'}</div>
                      </div>
                      <div className="p-4 rounded-xl bg-black/50 border border-terminal-border">
                         <div className="text-[10px] text-terminal-text/40 mb-1">TIMEZONE</div>
                         <div className="text-sm font-bold text-emerald-500">{geoData.timeZone || 'Unknown'}</div>
                      </div>
                    </div>
                  </div>
                )}

                {shodanData && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-terminal-text/60 uppercase tracking-[0.2em]">Shodan Intelligence</h3>
                      {shodanData.simulation && <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500/70">SIMULATION MODE</Badge>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 rounded-xl bg-black/50 border border-terminal-border flex flex-col justify-between">
                         <div className="text-[10px] text-terminal-text/40 mb-2 uppercase tracking-widest flex items-center gap-2">
                           <Network className="w-3 h-3" /> Open Ports
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {shodanData.ports?.length ? shodanData.ports.map((p: number) => (
                             <Badge key={p} className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{p}</Badge>
                           )) : <span className="text-xs text-terminal-text/50">None detected</span>}
                         </div>
                      </div>
                      <div className="p-6 rounded-xl bg-black/50 border border-terminal-border flex flex-col justify-between">
                         <div className="text-[10px] text-terminal-text/40 mb-2 uppercase tracking-widest flex items-center gap-2">
                           <AlertTriangle className="w-3 h-3 text-red-500/70" /> Known Vulnerabilities
                         </div>
                         <div className="flex flex-wrap gap-2">
                           {shodanData.vulns?.length ? shodanData.vulns.map((v: string) => (
                             <Badge key={v} className="bg-red-500/10 text-red-500 border border-red-500/20">{v}</Badge>
                           )) : <span className="text-xs text-emerald-500/50">System appears clean</span>}
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {vtData && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-terminal-text/60 uppercase tracking-[0.2em]">VirusTotal Analysis</h3>
                      {vtData.simulation && <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500/70">SIMULATION MODE</Badge>}
                      {vtData.cached && <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-500/70">CACHED RESULTS</Badge>}
                    </div>
                    {vtData.error ? (
                      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-center">
                         <div className="text-xs font-mono text-orange-500 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {vtData.error}</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col items-center justify-center text-center">
                           <div className="text-2xl font-bold text-red-500">{vtData.malicious}</div>
                           <div className="text-[9px] text-red-500/70 uppercase tracking-widest mt-1">Malicious</div>
                        </div>
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex flex-col items-center justify-center text-center">
                           <div className="text-2xl font-bold text-orange-500">{vtData.suspicious}</div>
                           <div className="text-[9px] text-orange-500/70 uppercase tracking-widest mt-1">Suspicious</div>
                        </div>
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                           <div className="text-2xl font-bold text-emerald-500">{vtData.harmless + vtData.undetected}</div>
                           <div className="text-[9px] text-emerald-500/70 uppercase tracking-widest mt-1">Clean</div>
                        </div>
                        <div className="p-4 rounded-xl bg-black/50 border border-terminal-border flex flex-col items-center justify-center text-center">
                           <div className={cn("text-2xl font-bold", vtData.reputation < 0 ? "text-red-500" : "text-emerald-500")}>{vtData.reputation}</div>
                           <div className="text-[9px] text-terminal-text/50 uppercase tracking-widest mt-1">Reputation Score</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-terminal-text/60 uppercase tracking-[0.2em]">Neural Infrastructure Map</h3>
                    <Badge variant="outline" className="text-[10px] border-terminal-border text-terminal-text/40">INTERACTIVE TOPOLOGY</Badge>
                  </div>
                  <NeuralTargetGraph target={reconData.url} />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-terminal-text/60 uppercase tracking-[0.2em]">HTTP Security Headers</h3>
                    <Badge variant="outline" className="text-[10px] border-terminal-border text-terminal-text/40">{reconData.audit.length} HEADERS SCANNED</Badge>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {reconData.audit.map((h: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-black/50 border border-terminal-border gap-4 transition-colors hover:bg-black/70">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            h.present ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"
                          )}>
                            {h.present ? (
                              <Shield className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                          <div>
                            <span className={cn("text-sm font-bold tracking-tight", h.present ? "text-emerald-500" : "text-red-500")}>
                              {h.header.toUpperCase()}
                            </span>
                            {!h.present && <div className="text-[10px] text-red-500/50 uppercase font-bold mt-0.5">High Risk Exposure</div>}
                          </div>
                        </div>
                        <div className="text-xs text-terminal-text/70 truncate sm:max-w-[400px] font-mono bg-black/40 px-4 py-2 rounded-lg border border-white/5">
                          {h.present ? h.value : "MISSING FROM SERVER RESPONSE"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {reconData.sslInfo && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-terminal-text/60 uppercase tracking-[0.2em]">SSL/TLS Certificate Intelligence</h3>
                      <Badge variant="outline" className="text-[10px] border-terminal-border text-emerald-500/50">SECURE CHANNEL VERIFIED</Badge>
                    </div>
                    <div className="p-8 rounded-3xl bg-black/60 border border-terminal-border shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Lock className="w-32 h-32 text-emerald-500" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                        <div className="space-y-6">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                               <ShieldCheck className="w-6 h-6 text-emerald-500" />
                             </div>
                             <div>
                               <div className="text-[10px] uppercase font-mono text-terminal-text/40 tracking-wider">Issuer Authority</div>
                               <div className="text-lg font-black text-terminal-text uppercase">{reconData.sslInfo.issuer}</div>
                             </div>
                           </div>
                           <div className="space-y-4">
                              <div className="flex justify-between py-2 border-b border-terminal-border/30">
                                <span className="text-[10px] uppercase font-mono text-terminal-text/40">Subject</span>
                                <span className="text-xs font-bold text-terminal-text truncate max-w-[200px]">{reconData.sslInfo.subject}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b border-terminal-border/30">
                                <span className="text-[10px] uppercase font-mono text-terminal-text/40">Validity</span>
                                <span className="text-xs font-bold text-terminal-text">{new Date(reconData.sslInfo.validTo).toLocaleDateString()}</span>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-col justify-end">
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                             <div className="text-[9px] uppercase font-mono text-terminal-text/30">Certificate Fingerprint</div>
                             <div className="text-[10px] font-mono text-emerald-500 break-all leading-tight">
                               {reconData.sslInfo.fingerprint}
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mt-12 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-20 h-20 text-emerald-500" />
                  </div>
                  <h4 className="text-xs font-bold text-emerald-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Strategic Assessment
                  </h4>
                  <p className="text-sm text-emerald-500/80 leading-relaxed font-mono relative z-10">
                    Audit phase concluded. The target infrastructure {reconData.findings > 3 ? 'displays critical hardening deficiencies' : 'exhibits acceptable security posturing'}. Immediate focus should be placed on {reconData.audit.find((a:any) => !a.present)?.header || 'further deep-scan enumeration'}.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Intel */}
        <div className="w-full lg:w-80 bg-black/20 p-6 space-y-8 overflow-y-auto custom-scrollbar">
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
