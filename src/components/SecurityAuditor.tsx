import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCode, 
  ShieldCheck, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Code, 
  Globe, 
  Zap,
  Activity,
  Lock,
  Eye,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { auditCode, auditUrl } from '@/src/services/gemini';
import { db, auth, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType, query, where, orderBy, onSnapshot } from '@/src/firebase';

interface ScanFinding {
  id: string;
  type: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  title: string;
  description: string;
  location?: string;
  remediation: string;
}

interface SecurityAuditorProps {
  onWeaponize?: (findingTitle: string) => void;
}

export const SecurityAuditor: React.FC<SecurityAuditorProps> = ({ onWeaponize }) => {
  const [activeMode, setActiveMode] = useState<'SAST' | 'DAST' | 'HISTORY'>('SAST');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [findings, setFindings] = useState<ScanFinding[]>([]);
  const [sastCode, setSastCode] = useState('');
  const [dastUrl, setDastUrl] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  React.useEffect(() => {
    if (activeMode === 'HISTORY' && auth.currentUser) {
      const q = query(
        collection(db, 'security_audits'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(docs);
      }, (err) => handleFirestoreError(err, OperationType.GET, 'security_audits'));
      return () => unsubscribe();
    }
  }, [activeMode]);

  const runSAST = async () => {
    if (!sastCode) return;
    setIsScanning(true);
    setScanProgress(0);
    setFindings([]);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => (prev < 90 ? prev + 5 : prev));
    }, 200);

    try {
      const result = await auditCode(sastCode);
      setScanProgress(100);
      setFindings(result);

      // Persist to Firestore
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, 'security_audits'), {
            userId: auth.currentUser.uid,
            mode: 'SAST',
            target: sastCode,
            findings: result,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'security_audits');
        }
      }
    } catch (error) {
      console.error("SAST Error:", error);
      setFindings([{
        id: 'err',
        type: 'CRITICAL',
        title: 'Analysis Failed',
        description: 'The security audit engine encountered an error while analyzing the code.',
        remediation: 'Check your API configuration or try a smaller code snippet.'
      }]);
    } finally {
      clearInterval(progressInterval);
      setIsScanning(false);
    }
  };

  const runDAST = async () => {
    if (!dastUrl) return;
    setIsScanning(true);
    setScanProgress(0);
    setFindings([]);

    const progressInterval = setInterval(() => {
      setScanProgress(prev => (prev < 90 ? prev + 2 : prev));
    }, 300);

    try {
      const result = await auditUrl(dastUrl);
      setScanProgress(100);
      setFindings(result);

      // Persist to Firestore
      if (auth.currentUser) {
        try {
          await addDoc(collection(db, 'security_audits'), {
            userId: auth.currentUser.uid,
            mode: 'DAST',
            target: dastUrl,
            findings: result,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'security_audits');
        }
      }
    } catch (error) {
      console.error("DAST Error:", error);
      setFindings([{
        id: 'err-d',
        type: 'HIGH',
        title: 'Scan Interrupted',
        description: 'The dynamic scan engine could not reach the target or encountered a protocol error.',
        remediation: 'Verify the URL is accessible and try again.'
      }]);
    } finally {
      clearInterval(progressInterval);
      setIsScanning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-8 border-b border-terminal-border bg-obsidian-bg/80 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-500" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-terminal-text uppercase tracking-tight">Security Auditor</h2>
              <p className="text-[10px] lg:text-sm font-mono text-terminal-text/50">Static & Dynamic Application Security Testing</p>
            </div>
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-lg border border-terminal-border">
            <button 
              onClick={() => { setActiveMode('SAST'); setFindings([]); }}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-mono font-bold transition-all flex items-center gap-2",
                activeMode === 'SAST' ? "bg-cyan-500 text-black" : "text-terminal-text/40 hover:text-terminal-text"
              )}
            >
              <FileCode className="w-3 h-3" />
              SAST
            </button>
            <button 
              onClick={() => { setActiveMode('DAST'); setFindings([]); }}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-mono font-bold transition-all flex items-center gap-2",
                activeMode === 'DAST' ? "bg-cyan-500 text-black" : "text-terminal-text/40 hover:text-terminal-text"
              )}
            >
              <Globe className="w-3 h-3" />
              DAST
            </button>
            <button 
              onClick={() => { setActiveMode('HISTORY'); setFindings([]); }}
              className={cn(
                "px-4 py-1.5 rounded-md text-[10px] font-mono font-bold transition-all flex items-center gap-2",
                activeMode === 'HISTORY' ? "bg-cyan-500 text-black" : "text-terminal-text/40 hover:text-terminal-text"
              )}
            >
              <Activity className="w-3 h-3" />
              HISTORY
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Input Area */}
        <div className="flex-1 flex flex-col border-r border-terminal-border bg-black/40 overflow-hidden">
          <div className="p-4 border-b border-terminal-border bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">
              {activeMode === 'SAST' ? <FileCode className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              <span>{activeMode === 'SAST' ? 'Source Code Analysis' : 'Dynamic Target Scan'}</span>
            </div>
            {isScanning && (
              <div className="flex items-center gap-2 text-cyan-500 font-mono text-[10px]">
                <Activity className="w-3 h-3 animate-pulse" />
                <span>SCANNING_IN_PROGRESS...</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-4 lg:p-6 flex flex-col gap-4 overflow-hidden">
            {activeMode === 'SAST' ? (
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex-1 relative">
                  <textarea 
                    value={sastCode}
                    onChange={(e) => setSastCode(e.target.value)}
                    placeholder="// Paste source code here for static analysis...&#10;// Example: const API_KEY = 'sk_test_12345';"
                    className="w-full h-full bg-black/60 border border-terminal-border rounded-xl p-4 font-mono text-sm text-terminal-text placeholder:text-terminal-text/20 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none no-scrollbar"
                  />
                  <div className="absolute bottom-4 right-4">
                    <Button 
                      onClick={runSAST}
                      disabled={isScanning || !sastCode}
                      className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold h-10 px-6 gap-2"
                    >
                      {isScanning ? <Zap className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      {isScanning ? 'ANALYZING...' : 'RUN SAST SCAN'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : activeMode === 'DAST' ? (
              <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-8">
                <div className="text-center space-y-2">
                  <Globe className="w-12 h-12 text-cyan-500 mx-auto opacity-50" />
                  <h3 className="text-xl font-bold text-terminal-text">Target URL Configuration</h3>
                  <p className="text-sm text-terminal-text/40 font-mono">Enter the endpoint for dynamic vulnerability assessment</p>
                </div>
                
                <div className="w-full space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center text-terminal-text/30 font-mono text-sm">
                      https://
                    </div>
                    <input 
                      value={dastUrl}
                      onChange={(e) => setDastUrl(e.target.value)}
                      placeholder="example.com/api/v1"
                      className="w-full bg-black/60 border border-terminal-border rounded-xl py-4 pl-20 pr-4 font-mono text-sm text-terminal-text focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <span className="text-[10px] font-mono text-terminal-text/30 uppercase">Scan Depth</span>
                      <div className="flex gap-2">
                        {['QUICK', 'FULL'].map(depth => (
                          <button key={depth} className="flex-1 py-1 rounded bg-black/40 border border-terminal-border text-[10px] font-mono text-terminal-text/60 hover:border-cyan-500/30 transition-all">
                            {depth}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <span className="text-[10px] font-mono text-terminal-text/30 uppercase">Auth Mode</span>
                      <div className="flex gap-2">
                        {['ANON', 'BEARER'].map(auth => (
                          <button key={auth} className="flex-1 py-1 rounded bg-black/40 border border-terminal-border text-[10px] font-mono text-terminal-text/60 hover:border-cyan-500/30 transition-all">
                            {auth}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={runDAST}
                    disabled={isScanning || !dastUrl}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold h-12 gap-2"
                  >
                    {isScanning ? <Zap className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    {isScanning ? 'SCANNING TARGET...' : 'START DAST SESSION'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                    <Activity className="w-12 h-12" />
                    <p className="font-mono text-sm">No historical audit data found.</p>
                  </div>
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setFindings(item.findings)}
                      className="p-4 rounded-xl bg-black/40 border border-terminal-border hover:border-cyan-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[8px] font-mono border-cyan-500/20 text-cyan-500">
                            {item.mode}
                          </Badge>
                          <span className="text-[10px] font-mono text-terminal-text/40">
                            {item.createdAt?.toDate().toLocaleString()}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[8px] font-mono border-white/10 text-terminal-text/20">
                          {item.findings.length} FINDINGS
                        </Badge>
                      </div>
                      <p className="text-xs font-mono text-terminal-text/60 truncate">
                        {item.target}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {isScanning && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-[10px] font-mono text-cyan-500">
                  <span>{activeMode === 'SAST' ? 'PARSING_AST_NODES...' : 'CRAWLING_ENDPOINTS...'}</span>
                  <span>{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-1 bg-cyan-500/10" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: Findings Panel */}
        <div className="w-full lg:w-96 flex flex-col bg-black/20">
          <div className="p-4 border-b border-terminal-border bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">
              <AlertTriangle className="w-3 h-3" />
              <span>Audit Findings</span>
            </div>
            <Badge variant="outline" className="text-[10px] border-cyan-500/20 text-cyan-500">
              {findings.length} ISSUES
            </Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {findings.length === 0 && !isScanning ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-20">
                <ShieldCheck className="w-12 h-12" />
                <div className="space-y-1">
                  <p className="text-sm font-bold">No Active Scan</p>
                  <p className="text-xs font-mono">Run a {activeMode} scan to populate findings</p>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                {findings.map((finding, i) => (
                  <motion.div
                    key={finding.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-black/40 border border-terminal-border hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={cn(
                        "text-[8px] font-mono font-bold",
                        finding.type === 'CRITICAL' ? "bg-red-500 text-white" :
                        finding.type === 'HIGH' ? "bg-orange-500 text-white" :
                        finding.type === 'MEDIUM' ? "bg-blue-500 text-white" :
                        "bg-terminal-green text-black"
                      )}>
                        {finding.type}
                      </Badge>
                      <span className="text-[10px] font-mono text-terminal-text/20">#{finding.id}</span>
                    </div>
                    
                    <h4 className="text-sm font-bold text-terminal-text group-hover:text-cyan-400 transition-colors mb-2">
                      {finding.title}
                    </h4>
                    
                    <p className="text-xs text-terminal-text/60 leading-relaxed mb-3">
                      {finding.description}
                    </p>
                    
                    {finding.location && (
                      <div className="mb-3 p-2 rounded bg-black/60 border border-white/5 font-mono text-[10px] text-terminal-green/70 break-all">
                        {finding.location}
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-cyan-500/60 mb-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Remediation</span>
                        </div>
                        <p className="text-[10px] text-terminal-text/40 italic leading-relaxed">
                          {finding.remediation}
                        </p>
                      </div>
                      {onWeaponize && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => onWeaponize(finding.title)}
                          className="text-terminal-text/20 hover:text-red-500 hover:bg-red-500/10 shrink-0"
                          title="Weaponize Finding"
                        >
                          <Zap className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
