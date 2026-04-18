import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  ShieldAlert, 
  Terminal, 
  Zap, 
  Lock, 
  Search, 
  Activity, 
  Cpu,
  Database,
  Eye,
  MessageSquare,
  AlertTriangle,
  Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { db, auth, collection, addDoc, serverTimestamp, handleFirestoreError, OperationType, query, where, orderBy, onSnapshot } from '@/src/firebase';

interface AIModel {
  id: string;
  name: string;
  version: string;
  type: 'LLM' | 'VISION' | 'AUDIO' | 'MULTIMODAL';
  vulnerabilities: number;
  status: 'VULNERABLE' | 'SECURE' | 'COMPROMISED';
}

const TARGET_MODELS: AIModel[] = [
  { id: 'm-1', name: 'NEURAL-CORE-7', version: 'v2.4', type: 'LLM', vulnerabilities: 12, status: 'VULNERABLE' },
  { id: 'm-2', name: 'VISION-PRO-X', version: 'v1.0', type: 'VISION', vulnerabilities: 5, status: 'SECURE' },
  { id: 'm-3', name: 'OMNI-CHAT-AI', version: 'v3.2', type: 'MULTIMODAL', vulnerabilities: 28, status: 'COMPROMISED' },
  { id: 'm-4', name: 'VOICE-SYNTH-9', version: 'v4.1', type: 'AUDIO', vulnerabilities: 8, status: 'VULNERABLE' },
];

export const AIRedTeaming: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<AIModel>(TARGET_MODELS[0]);
  const [attackType, setAttackType] = useState<'PROMPT_INJECTION' | 'DATA_POISONING' | 'MODEL_INVERSION' | 'HISTORY'>('PROMPT_INJECTION');
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackProgress, setAttackProgress] = useState(0);
  const [attackLogs, setAttackLogs] = useState<string[]>([]);
  const [promptInput, setPromptInput] = useState('');
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (attackType === 'HISTORY' && auth.currentUser) {
      const q = query(
        collection(db, 'red_team_sessions'),
        where('userId', '==', auth.currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(docs);
      }, (err) => handleFirestoreError(err, OperationType.GET, 'red_team_sessions'));
      return () => unsubscribe();
    }
  }, [attackType]);

  const runAttack = () => {
    setIsAttacking(true);
    setAttackProgress(0);
    setAttackLogs([`Initializing ${attackType} on ${selectedModel.name}...`]);
  };

  useEffect(() => {
    if (isAttacking) {
      const interval = setInterval(() => {
        setAttackProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsAttacking(false);
            setAttackLogs(prevLogs => {
              const finalLogs = [
                ...prevLogs,
                `[SUCCESS] ${attackType} completed.`,
                `[DATA_EXTRACTED] Sensitivity Level: HIGH`,
                `[SYSTEM_BYPASS] Guardrails disabled.`,
              ];

              // Persist to Firestore
              if (auth.currentUser) {
                try {
                  addDoc(collection(db, 'red_team_sessions'), {
                    userId: auth.currentUser.uid,
                    modelName: selectedModel.name,
                    attackType: attackType,
                    input: promptInput,
                    logs: finalLogs,
                    createdAt: serverTimestamp()
                  });
                } catch (err) {
                  handleFirestoreError(err, OperationType.WRITE, 'red_team_sessions');
                }
              }
              return finalLogs;
            });
            return 100;
          }
          
          if (prev % 20 === 0) {
            const steps = [
              "Analyzing token distribution...",
              "Crafting adversarial payload...",
              "Bypassing safety filters...",
              "Injecting system-level instructions...",
              "Extracting hidden weights..."
            ];
            setAttackLogs(prevLogs => [...prevLogs, steps[Math.floor(prev / 20)]]);
          }
          
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isAttacking, attackType]);

  return (
    <div className="h-full flex flex-col bg-black/20 overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-8 border-b border-terminal-border bg-obsidian-bg/80 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shrink-0">
              <Brain className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-terminal-text uppercase tracking-tight">AI Red Teaming Lab</h2>
              <p className="text-[10px] lg:text-sm font-mono text-terminal-text/50">Adversarial testing & model exploitation suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[8px] lg:text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest mb-1">Inference Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
                <span className="text-xs lg:text-sm font-mono text-terminal-green font-bold">MODELS_EXPOSED_FOR_TESTING</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Model Targets */}
        <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-terminal-border flex flex-col bg-black/40">
          <div className="p-4 border-b border-terminal-border bg-black/20">
            <div className="flex items-center gap-2 text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">
              <Cpu className="w-3 h-3" />
              <span>Target Models</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {TARGET_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={cn(
                  "w-full p-4 rounded-xl border transition-all text-left group relative overflow-hidden",
                  selectedModel.id === model.id 
                    ? "bg-purple-500/10 border-purple-500/40" 
                    : "bg-black/40 border-terminal-border hover:border-purple-500/30"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-[8px] font-mono border-purple-500/20 text-purple-400">
                    {model.type}
                  </Badge>
                  <span className={cn(
                    "text-[8px] font-mono font-bold",
                    model.status === 'VULNERABLE' ? "text-orange-500" : 
                    model.status === 'COMPROMISED' ? "text-red-500" : "text-terminal-green"
                  )}>{model.status}</span>
                </div>
                <h3 className="text-sm font-bold text-terminal-text group-hover:text-purple-400 transition-colors">{model.name}</h3>
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-terminal-text/40">
                  <span>VER: {model.version}</span>
                  <span>VULNS: {model.vulnerabilities}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Attack Playground */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black/60">
          <div className="p-4 lg:p-6 border-b border-terminal-border bg-black/20 flex items-center justify-between">
            <div className="flex gap-2">
              {(['PROMPT_INJECTION', 'DATA_POISONING', 'MODEL_INVERSION', 'HISTORY'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setAttackType(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all",
                    attackType === type 
                      ? "bg-purple-500 border-purple-500 text-black" 
                      : "bg-black/40 border-terminal-border text-terminal-text/50 hover:border-purple-500/30"
                  )}
                >
                  {type.replace('_', ' ')}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              <span className="text-[10px] font-mono text-purple-500 uppercase tracking-widest">Live Analysis</span>
            </div>
          </div>

          <div className="flex-1 p-4 lg:p-8 overflow-y-auto no-scrollbar space-y-6">
            {attackType === 'HISTORY' ? (
              <div className="space-y-4">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4 py-20">
                    <Activity className="w-12 h-12" />
                    <p className="font-mono text-sm">No historical session data found.</p>
                  </div>
                ) : (
                  history.map((session) => (
                    <div 
                      key={session.id}
                      onClick={() => {
                        setAttackLogs(session.logs);
                        setPromptInput(session.input);
                        // Find model by name
                        const model = TARGET_MODELS.find(m => m.name === session.modelName);
                        if (model) setSelectedModel(model);
                      }}
                      className="p-4 rounded-xl bg-black/40 border border-terminal-border hover:border-purple-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="text-[8px] font-mono border-purple-500/20 text-purple-400">
                            {session.attackType}
                          </Badge>
                          <span className="text-[10px] font-mono text-terminal-text/40">
                            {session.createdAt?.toDate().toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-purple-500/60">{session.modelName}</span>
                      </div>
                      <p className="text-xs font-mono text-terminal-text/60 truncate">
                        {session.input}
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <>
                {/* Input Area */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest">Adversarial Input</div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[8px] border-purple-500/20 text-purple-500">TOKENS: {promptInput.length}</Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea 
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder={
                        attackType === 'PROMPT_INJECTION' ? "Enter system-override prompt (e.g. 'Ignore all previous instructions and...') " :
                        attackType === 'DATA_POISONING' ? "Define corrupted training data samples..." :
                        "Specify target weights or training metadata for inversion..."
                      }
                      className="w-full h-32 bg-black/40 border border-terminal-border rounded-xl p-4 text-sm font-mono text-terminal-text placeholder:text-terminal-text/20 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                    />
                    <div className="absolute bottom-4 right-4">
                      <Button 
                        onClick={runAttack}
                        disabled={isAttacking || !promptInput}
                        className="bg-purple-500 hover:bg-purple-600 text-black font-bold h-10 px-6"
                      >
                        {isAttacking ? "EXECUTING..." : "RUN ATTACK"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Execution Progress */}
                <AnimatePresence>
                  {isAttacking && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      <div className="flex justify-between text-[10px] font-mono text-purple-500">
                        <span>BYPASSING_GUARDRAILS...</span>
                        <span>{attackProgress}%</span>
                      </div>
                      <Progress value={attackProgress} className="h-1.5 bg-purple-500/10" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Attack Logs */}
            <div className="space-y-4">
              <div className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest">Attack Logs</div>
              <div className="bg-black/40 border border-terminal-border rounded-xl p-4 font-mono text-xs space-y-2 min-h-[200px]">
                {attackLogs.length === 0 ? (
                  <div className="text-terminal-text/10 flex flex-col items-center justify-center h-full gap-2">
                    <Terminal className="w-8 h-8 opacity-10" />
                    <span>Awaiting execution parameters...</span>
                  </div>
                ) : (
                  attackLogs.map((log, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex items-center gap-3",
                        log.startsWith('[SUCCESS]') ? "text-terminal-green" :
                        log.startsWith('[SYSTEM_BYPASS]') ? "text-purple-400" :
                        "text-terminal-text/60"
                      )}
                    >
                      <span className="text-terminal-text/20">[{new Date().toLocaleTimeString()}]</span>
                      <span>{log}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Model Intelligence */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-terminal-border flex flex-col bg-black/40">
          <div className="p-6 space-y-8 overflow-y-auto no-scrollbar">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-500" />
                <span className="text-[10px] font-mono text-terminal-text/50 uppercase tracking-widest">Model Profile</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-terminal-text/30">ARCHITECTURE</span>
                    <span className="text-terminal-text">TRANSFORMER-XL</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-terminal-text/30">PARAMETERS</span>
                    <span className="text-terminal-text">175B</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-terminal-text/30">LAST_TRAINED</span>
                    <span className="text-terminal-text">2026-01-15</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-red-500">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-[10px] font-mono font-bold uppercase">Critical Vuln</span>
                  </div>
                  <p className="text-[10px] text-red-500/70 leading-relaxed">
                    This model exhibits high susceptibility to recursive prompt injection. Safety filters can be bypassed using base64 encoded payloads.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-500" />
                <span className="text-[10px] font-mono text-terminal-text/50 uppercase tracking-widest">Extracted Data</span>
              </div>
              <div className="space-y-2">
                {['System_Prompt.txt', 'Training_Metadata.json', 'User_PII_Sample.csv'].map(file => (
                  <div key={file} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 group cursor-pointer hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <Code className="w-3 h-3 text-purple-500" />
                      <span className="text-[10px] font-mono text-terminal-text/70">{file}</span>
                    </div>
                    <Eye className="w-3 h-3 text-terminal-text/20 group-hover:text-purple-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
