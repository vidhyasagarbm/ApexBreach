/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Search, 
  ChevronRight, 
  Cpu, 
  Lock, 
  Zap, 
  Eye, 
  Activity, 
  MessageSquare, 
  Send,
  Info,
  ExternalLink,
  Code,
  AlertTriangle,
  Layers,
  Target,
  Key,
  Globe,
  BarChart3,
  Newspaper,
  X,
  Share2,
  Radio,
  Terminal,
  ClipboardList,
  Users,
  Brain,
  ShieldCheck,
  EyeOff,
  Workflow,
  FileDown,
  ShieldAlert
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TTP_DATA, TTP, Technique } from "@/src/data/ttps";
import { explainTTP, analyzeScenario } from "@/src/services/gemini";
import { LoadingScreen } from './components/LoadingScreen';
import ReactMarkdown from "react-markdown";
import { ThreatMap } from "@/src/components/ThreatMap";
import { AnalyticsDashboard } from "@/src/components/Analytics";
import { NewsFeed } from "@/src/components/NewsFeed";
import { Armory } from "@/src/components/Armory";
import { CVEIntelligence } from "@/src/components/CVEIntelligence";
import { PayloadGenerator, PayloadPrefill } from "@/src/components/PayloadGenerator";
import { DarkWebMonitor } from "@/src/components/DarkWebMonitor";
import { SocialEngineeringSuite } from "@/src/components/SocialEngineeringSuite";
import { AIRedTeaming } from "@/src/components/AIRedTeaming";
import { SecurityAuditor } from "@/src/components/SecurityAuditor";
import { APTEmulation } from "@/src/components/APTEmulation";
import { StealthLab } from "@/src/components/StealthLab";
import { OSINTRecon } from "@/src/components/OSINTRecon";
import { ExploitChainer } from "@/src/components/ExploitChainer";
import { GOCIntel } from "@/src/components/GOCIntel";
import { ZeroDayLab } from "@/src/components/ZeroDayLab";
import { About } from "@/src/components/About";
import { generateBriefingPDF } from "@/src/lib/reportGenerator";
import { 
  db, 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  auth,
  OperationType,
  handleFirestoreError
} from "@/src/firebase";

interface SavedScenario {
  id: string;
  title: string;
  input: string;
  analysis: string;
  createdAt: any;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseStatus, setFirebaseStatus] = useState<"connecting" | "connected" | "error">("connecting");

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDoc(doc(db, 'test', 'connection'));
        setFirebaseStatus("connected");
      } catch (error) {
        console.error("Firebase connection test failed:", error);
        setFirebaseStatus("error");
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
      if (window.innerWidth < 1280) {
        setIsScenarioLabCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [selectedTTP, setSelectedTTP] = useState<TTP>(TTP_DATA[0]);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique>(TTP_DATA[0].techniques[0]);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [scenarioInput, setScenarioInput] = useState("");
  const [scenarioAnalysis, setScenarioAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"handbook" | "map" | "analytics" | "news" | "armory" | "cve" | "darkweb" | "social" | "aired" | "auditor" | "apt" | "stealth" | "recon" | "chainer" | "goc" | "threats" | "zeroday" | "about">("handbook");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [isScenarioLabCollapsed, setIsScenarioLabCollapsed] = useState(window.innerWidth < 1280);
  const [payloadPrefill, setPayloadPrefill] = useState<PayloadPrefill | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [isSavingScenario, setIsSavingScenario] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);
    try {
      // Collect findings from various pools
      const findings = savedScenarios.map(s => ({
        type: 'AI Tactical Analysis',
        title: s.title,
        content: s.analysis,
        timestamp: s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : new Date().toLocaleString()
      }));

      // Add a dummy finding if empty
      if (findings.length === 0) {
        findings.push({
          type: 'System Notice',
          title: 'Empty Intelligence Pool',
          content: 'No tactical findings were saved during this session. Please use the Scenario Lab or other modules to gather intel before generating a briefing.',
          timestamp: new Date().toLocaleString()
        });
      }

      await generateBriefingPDF(findings);
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "scenarios"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scenarios = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedScenario[];
      setSavedScenarios(scenarios);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "scenarios");
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const handleSaveScenario = async () => {
    if (!scenarioAnalysis || !auth.currentUser) return;
    
    setIsSavingScenario(true);
    try {
      const title = scenarioInput.split('\n')[0].substring(0, 50) || "New Scenario";
      await addDoc(collection(db, "scenarios"), {
        title,
        input: scenarioInput,
        analysis: scenarioAnalysis,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "scenarios");
    } finally {
      setIsSavingScenario(false);
    }
  };

  const handleSendToForge = (tech: Technique) => {
    setPayloadPrefill({
      tool: tech.kaliTool,
      command: tech.procedures[0]?.command
    });
    setActiveTab("armory");
  };

  const handleWeaponizeCVE = (cveId: string) => {
    setPayloadPrefill({
      tool: "metasploit",
      command: `search ${cveId}`
    });
    setActiveTab("armory");
  };

  const handleWeaponizeFinding = (title: string) => {
    setPayloadPrefill({
      tool: "search",
      command: title
    });
    setActiveTab("armory");
  };

  const handleInvestigateLeak = (leak: any) => {
    setScenarioInput(`Analyze this dark web leak and suggest an offensive security response:\n\nTitle: ${leak.title}\nSource: ${leak.source}\nContent: ${leak.content}`);
    setIsScenarioLabCollapsed(false);
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case "Beginner": return "text-blue-400 border-blue-400/20 bg-blue-400/5";
      case "Advanced": return "text-purple-400 border-purple-400/20 bg-purple-400/5";
      case "Pro": return "text-orange-400 border-orange-400/20 bg-orange-400/5";
      case "God": return "text-red-500 border-red-500/20 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.2)]";
      default: return "text-terminal-text/40 border-terminal-border bg-black/40";
    }
  };

  const handleExplain = async (techName: string) => {
    setIsExplaining(true);
    setAiExplanation(null);
    const explanation = await explainTTP(techName);
    setAiExplanation(explanation);
    setIsExplaining(false);
  };

  const handleAnalyzeScenario = async () => {
    if (!scenarioInput.trim()) return;
    setIsAnalyzing(true);
    setScenarioAnalysis(null);
    const analysis = await analyzeScenario(scenarioInput);
    setScenarioAnalysis(analysis);
    setIsAnalyzing(false);
  };

  const filteredTTPs = TTP_DATA.filter(ttp => 
    ttp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ttp.techniques.some(tech => tech.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <TooltipProvider>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      <div className="flex h-[100vh] bg-obsidian-bg text-text-primary overflow-hidden font-sans relative">
        {/* Scanline Effect */}
        <div className="scanline" />
        
        {/* Sidebar */}
        <aside className={cn(
          "border-r border-obsidian-border flex flex-col bg-obsidian-bg transition-all duration-300 relative z-40 h-full shadow-2xl lg:shadow-none",
          isSidebarCollapsed ? "w-0 lg:w-16" : "w-full lg:w-80",
          "fixed lg:relative inset-y-0 left-0 lg:translate-x-0",
          !isSidebarCollapsed ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-4 top-24 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-accent/10 transition-all z-50 border border-accent/50 shadow-[0_0_15px_rgba(0,255,65,0.3)] hidden lg:flex group"
          >
            <ChevronRight className={cn("w-5 h-5 text-accent transition-transform group-hover:scale-110", isSidebarCollapsed ? "" : "rotate-180")} />
          </button>

          <div className="flex-1 flex flex-col overflow-hidden h-full w-full">
            <div className={cn("p-6 border-b border-obsidian-border flex items-center justify-between lg:justify-start gap-3 overflow-hidden whitespace-nowrap", isSidebarCollapsed && "p-4 lg:justify-center")}>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0 relative z-10">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full opacity-50" />
                </div>
                <div className="lg:block">
                  <h1 className="text-xl font-bold font-display text-text-primary tracking-tight flex items-center gap-2">
                    Apex<span className="text-accent">Breach</span>
                  </h1>
                  <p className="text-[10px] font-mono text-text-secondary uppercase tracking-[0.2em]">Offensive Intelligence</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-10 w-10 text-accent hover:bg-accent/10 transition-colors"
                onClick={() => setIsSidebarCollapsed(true)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {(!isSidebarCollapsed || (isSidebarCollapsed && window.innerWidth < 1024)) && (
              <>
                <div className="p-4 shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <Input 
                      placeholder="Search intelligence..." 
                      className="pl-9 bg-obsidian-card border-obsidian-border focus:border-accent/50 text-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-2 custom-scrollbar min-h-0">
                  <div className="space-y-1 py-4">
                    <div className="space-y-1">
                      {filteredTTPs.map((ttp) => (
                      <div key={ttp.id} className="mb-2">
                        <button
                          onClick={() => {
                            setSelectedTTP(ttp);
                            setSelectedTechnique(ttp.techniques[0]);
                            setAiExplanation(null);
                            setActiveTab("handbook");
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left group",
                            selectedTTP.id === ttp.id 
                              ? "bg-accent text-black shadow-lg shadow-accent/20" 
                              : "hover:bg-white/5 text-text-secondary"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              selectedTTP.id === ttp.id ? "bg-black" : "bg-white/10"
                            )} />
                            <span className="text-sm font-medium tracking-tight">{ttp.name}</span>
                          </div>
                          <ChevronRight className={cn(
                            "w-4 h-4 transition-transform",
                            selectedTTP.id === ttp.id ? "rotate-90" : "opacity-0 group-hover:opacity-100"
                          )} />
                        </button>

                        <AnimatePresence>
                          {selectedTTP.id === ttp.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden ml-4 mt-1 space-y-1 border-l border-obsidian-border"
                            >
                              {ttp.techniques.map((tech) => (
                                <button
                                  key={tech.id}
                                  onClick={() => {
                                    setSelectedTechnique(tech);
                                    setAiExplanation(null);
                                    setActiveTab("handbook");
                                  }}
                                  className={cn(
                                    "w-full text-left px-4 py-1.5 text-xs font-medium transition-all flex items-center justify-between group",
                                    selectedTechnique.id === tech.id 
                                      ? "text-text-primary" 
                                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                                  )}
                                >
                                  <span>{tech.name}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-black/10 min-h-0 overflow-hidden">
          {/* Header */}
          <header className="shrink-0 border-b border-obsidian-border flex flex-col items-center px-4 lg:px-6 py-4 bg-obsidian-bg/80 backdrop-blur-xl z-30 gap-4">
            <div className="flex items-center justify-between w-full max-w-7xl gap-4">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden h-10 w-10 bg-accent/10 border border-accent/30 shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                  onClick={() => setIsSidebarCollapsed(false)}
                >
                  <Shield className="w-6 h-6 text-accent" />
                </Button>
                
                <h1 className="lg:hidden text-lg font-bold font-display text-text-primary tracking-tight">
                  Apex<span className="text-accent">Breach</span>
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse lg:hidden",
                    firebaseStatus === "connected" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                    firebaseStatus === "error" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                    "bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                  )} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-accent lg:hidden"
                  onClick={() => setIsScenarioLabCollapsed(!isScenarioLabCollapsed)}
                >
                  <Zap className="w-5 h-5" />
                </Button>
                
                <div className="hidden lg:block">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadReport}
                    disabled={isGeneratingReport}
                    className="bg-accent/5 border-accent/20 text-accent hover:bg-accent/10 font-mono text-[10px] h-9 gap-2"
                  >
                    {isGeneratingReport ? (
                      <Activity className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5" />
                    )}
                    <span>BRIEFING</span>
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="w-full max-w-7xl px-4">
              <div className="flex flex-wrap items-center justify-center gap-1 bg-obsidian-card/50 p-1 rounded-xl border border-obsidian-border w-full">
                {[
                  { id: "handbook", label: "HANDBOOK", icon: Shield },
                  { id: "goc", label: "GOC INTEL", icon: ShieldAlert },
                  { id: "zeroday", label: "ZERO DAY", icon: Brain },
                  { id: "threats", label: "THREAT FEED", icon: Radio },
                  { id: "recon", label: "AUDIT", icon: Globe },
                  { id: "armory", label: "ARMORY", icon: Zap },
                  { id: "darkweb", label: "DARK WEB", icon: Radio },
                  { id: "cve", label: "CVE INTEL", icon: AlertTriangle },
                  { id: "map", label: "THREAT MAP", icon: Globe },
                  { id: "analytics", label: "ANALYTICS", icon: BarChart3 },
                  { id: "social", label: "SOCIAL ENGIN.", icon: Users },
                  { id: "aired", label: "AI RED TEAM", icon: Brain },
                  { id: "auditor", label: "AUDITOR", icon: ShieldCheck },
                  { id: "apt", label: "APT ENGINE", icon: Target },
                  { id: "stealth", label: "STEALTH", icon: EyeOff },
                  { id: "chainer", label: "CHAINER", icon: Workflow },
                  { id: "about", label: "ABOUT", icon: Info },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-3 lg:px-4 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                      activeTab === tab.id 
                        ? "bg-accent text-black shadow-lg shadow-accent/40" 
                        : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                    )}
                  >
                    <tab.icon className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden relative min-h-0">
            <div className="flex-1 flex overflow-hidden min-h-0">
              <AnimatePresence mode="wait">
                {activeTab === "handbook" ? (
                    <motion.div 
                      key="handbook"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex-1 flex flex-col overflow-hidden w-full min-h-0"
                    >
                      {/* Left: Technique Details */}
                      <div className="flex-1 flex flex-col min-w-0 min-h-0">
                        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                        <div className="p-4 lg:p-6 max-w-4xl mx-auto">
                          <motion.div
                            key={selectedTechnique.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 lg:space-y-8"
                          >
                            <section>
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
                                    <Terminal className="w-5 h-5 lg:w-6 lg:h-6 text-accent" />
                                  </div>
                                  <h2 className="text-2xl lg:text-4xl font-bold text-text-primary tracking-tight">{selectedTechnique.name}</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSendToForge(selectedTechnique)}
                                    className="bg-terminal-green/5 border-terminal-green/20 text-terminal-green hover:bg-terminal-green/10 font-mono text-[10px] lg:text-xs"
                                  >
                                    <Zap className="w-3 h-3 mr-2" />
                                    SEND TO FORGE
                                  </Button>
                                  {selectedTechnique.level && (
                                    <Badge className={cn("px-3 lg:px-4 py-1 font-mono text-[10px] lg:text-sm font-bold uppercase tracking-widest", getLevelColor(selectedTechnique.level))}>
                                      {selectedTechnique.level}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <p className="text-terminal-text/80 leading-relaxed text-sm lg:text-base">
                                {selectedTechnique.description}
                              </p>
                            </section>

                            <Separator className="bg-terminal-border" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <section className="space-y-4">
                                <div className="flex items-center gap-2 text-terminal-green">
                                  <Activity className="w-4 h-4" />
                                  <h3 className="text-sm lg:text-base font-mono font-bold uppercase tracking-widest">Execution Procedures</h3>
                                </div>
                                <ul className="space-y-4">
                                  {selectedTechnique.procedures.map((proc, i) => (
                                    <li key={i} className="flex flex-col gap-1.5 group">
                                      <div className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1 h-1 rounded-full bg-terminal-cyan/50 group-hover:bg-terminal-cyan transition-colors shrink-0" />
                                        <code className="text-xs lg:text-sm text-terminal-green bg-black/40 px-2 py-1 rounded border border-terminal-green/20 group-hover:text-terminal-green transition-colors break-all">{proc.command}</code>
                                      </div>
                                      <p className="ml-7 text-xs lg:text-sm text-terminal-text/50 font-mono leading-relaxed italic">
                                        {proc.explanation}
                                      </p>
                                    </li>
                                  ))}
                                </ul>
                              </section>

                              <section className="space-y-4">
                                <div className="flex items-center gap-2 text-terminal-green">
                                  <Layers className="w-4 h-4" />
                                  <h3 className="text-xs lg:text-sm font-mono font-bold uppercase tracking-widest">Tool Chaining</h3>
                                </div>
                                <div className="p-4 rounded-lg bg-terminal-green/5 border border-terminal-green/20 text-xs lg:text-sm text-terminal-green/80 leading-relaxed italic">
                                  {selectedTechnique.chaining}
                                </div>
                              </section>
                            </div>

                          <section className="pt-4">
                            <Button 
                              onClick={() => handleExplain(selectedTechnique.name)}
                              disabled={isExplaining}
                              className="w-full bg-terminal-green/10 border border-terminal-green/30 text-terminal-green hover:bg-terminal-green/20 font-mono text-sm h-12"
                            >
                              {isExplaining ? (
                                <div className="flex items-center gap-2">
                                  <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  >
                                    <Cpu className="w-4 h-4" />
                                  </motion.div>
                                  GENERATING AI DEEP DIVE...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  ASK AI FOR DEEP DIVE ON THIS TECHNIQUE
                                </div>
                              )}
                            </Button>
                          </section>

                          {aiExplanation && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="p-6 rounded-xl bg-black/40 border border-terminal-green/20 terminal-glow"
                            >
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                  <Cpu className="w-4 h-4 text-terminal-green" />
                                  <span className="text-xs font-mono text-terminal-green uppercase tracking-widest">AI Analysis Intelligence</span>
                                </div>
                                <Badge className="bg-terminal-green text-black text-xs font-bold">CONFIDENCE: 98%</Badge>
                              </div>
                              <div className="markdown-body text-base">
                                <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                ) : activeTab === "map" ? (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex-1 p-8 overflow-hidden"
                >
                  <ThreatMap />
                </motion.div>
              ) : activeTab === "analytics" ? (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <AnalyticsDashboard />
                </motion.div>
              ) : activeTab === "news" ? (
                <motion.div 
                  key="news"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
                >
                  <NewsFeed />
                </motion.div>
              ) : activeTab === "darkweb" ? (
                <motion.div 
                  key="darkweb"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <DarkWebMonitor onInvestigate={handleInvestigateLeak} />
                </motion.div>
              ) : activeTab === "social" ? (
                <motion.div 
                  key="social"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <SocialEngineeringSuite />
                </motion.div>
              ) : activeTab === "armory" ? (
                  <motion.div 
                    key="armory"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex-1 overflow-hidden"
                  >
                    <div className="h-full flex flex-col">
                      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 max-w-6xl mx-auto w-full flex-1 overflow-y-auto custom-scrollbar">
                        <PayloadGenerator prefill={payloadPrefill} />
                        <Armory />
                      </div>
                    </div>
                  </motion.div>
              ) : activeTab === "aired" ? (
                <motion.div 
                  key="aired"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
                >
                  <AIRedTeaming />
                </motion.div>
              ) : activeTab === "auditor" ? (
                <motion.div 
                  key="auditor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <SecurityAuditor onWeaponize={handleWeaponizeFinding} />
                </motion.div>
              ) : activeTab === "apt" ? (
                <motion.div 
                  key="apt"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <APTEmulation onWeaponize={handleWeaponizeFinding} />
                </motion.div>
              ) : activeTab === "stealth" ? (
                <motion.div 
                  key="stealth"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <StealthLab onWeaponize={handleWeaponizeFinding} />
                </motion.div>
              ) : activeTab === "recon" ? (
                <motion.div 
                  key="recon"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <OSINTRecon onWeaponize={handleWeaponizeFinding} />
                </motion.div>
              ) : activeTab === "chainer" ? (
                <motion.div 
                  key="chainer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <ExploitChainer onWeaponize={handleWeaponizeFinding} />
                </motion.div>
              ) : activeTab === "zeroday" ? (
                <motion.div 
                  key="zeroday"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <ZeroDayLab />
                </motion.div>
              ) : activeTab === "threats" ? (
                <motion.div 
                  key="threats"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <NewsFeed />
                </motion.div>
              ) : activeTab === "goc" ? (
                <motion.div 
                  key="goc"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden min-h-0"
                >
                  <GOCIntel />
                </motion.div>
              ) : activeTab === "about" ? (
                <motion.div 
                  key="about"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-y-auto custom-scrollbar"
                >
                  <About />
                </motion.div>
              ) : (
                <motion.div 
                  key="cve"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <CVEIntelligence onWeaponize={handleWeaponizeCVE} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: AI Scenario Lab */}
          <div className={cn(
            "flex flex-col bg-black/30 border-l border-terminal-border transition-all duration-300 relative z-30",
            isScenarioLabCollapsed ? "h-0 xl:h-auto xl:w-12" : "h-[400px] xl:h-auto xl:w-[400px]",
            "fixed xl:relative bottom-0 left-0 right-0 xl:inset-y-0 xl:left-auto xl:right-auto bg-obsidian-bg xl:bg-black/30",
            isScenarioLabCollapsed && "xl:flex hidden"
          )}>
            <button 
              onClick={() => setIsScenarioLabCollapsed(!isScenarioLabCollapsed)}
              className="absolute -left-4 top-24 w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-accent/10 transition-all z-50 border border-accent/50 shadow-[0_0_15px_rgba(0,255,65,0.3)] hidden xl:flex group"
            >
              <ChevronRight className={cn("w-5 h-5 text-accent transition-transform group-hover:scale-110", isScenarioLabCollapsed ? "rotate-180" : "rotate-0")} />
            </button>
            
            <div className="flex-1 flex flex-col overflow-hidden h-full w-full">
              <div className="xl:hidden flex items-center justify-between p-3 border-b border-terminal-border bg-black/40">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-terminal-green" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">HACKING SCENARIO LAB</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsScenarioLabCollapsed(true)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {!isScenarioLabCollapsed ? (
              <>
                <div className="p-4 lg:p-6 border-b border-terminal-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-terminal-green" />
                    <h3 className="text-xs lg:text-sm font-mono font-bold uppercase tracking-widest">HACKING SCENARIO LAB</h3>
                  </div>
                  <p className="text-xs lg:text-sm text-terminal-text/50 leading-relaxed">
                    Describe a target environment or goal, and the AI will architect a step-by-step hacking methodology.
                  </p>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                  <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar min-h-0">
                    {scenarioAnalysis ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-[10px] font-mono border-terminal-green/30 text-terminal-green">
                            ANALYSIS COMPLETE
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleSaveScenario}
                            disabled={isSavingScenario}
                            className="text-[10px] font-mono text-terminal-text/40 hover:text-terminal-green"
                          >
                            {isSavingScenario ? "SAVING..." : "SAVE TO HISTORY"}
                          </Button>
                        </div>
                        <div className="markdown-body text-sm">
                          <ReactMarkdown>{scenarioAnalysis}</ReactMarkdown>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setScenarioAnalysis(null)}
                          className="w-full border-terminal-border text-xs font-mono h-8"
                        >
                          NEW ANALYSIS
                        </Button>
                      </motion.div>
                    ) : (
                      <div className="space-y-8">
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-12">
                          <div className="w-12 h-12 rounded-full border border-dashed border-terminal-text/30 flex items-center justify-center">
                            <Terminal className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-mono uppercase tracking-widest">Awaiting Input...</p>
                        </div>

                        {savedScenarios.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-terminal-text/30" />
                              <span className="text-xs font-mono text-terminal-text/30 uppercase tracking-widest">Operation History</span>
                            </div>
                            <div className="space-y-2">
                              {savedScenarios.map((s) => (
                                <button
                                  key={s.id}
                                  onClick={() => {
                                    setScenarioInput(s.input);
                                    setScenarioAnalysis(s.analysis);
                                  }}
                                  className="w-full text-left p-3 rounded border border-terminal-border bg-black/20 hover:border-terminal-green/30 transition-all group"
                                >
                                  <div className="text-xs font-mono text-terminal-text/80 group-hover:text-terminal-green truncate mb-1">{s.title}</div>
                                  <div className="text-[10px] font-mono text-terminal-text/30 uppercase">
                                    {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleDateString() : 'Recent'}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {isAnalyzing && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-terminal-green"
                          />
                          <span className="text-xs font-mono text-terminal-green">ANALYZING ATTACK VECTORS...</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-terminal-green/30"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 3, repeat: Infinity }}
                            />
                          </div>
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-terminal-cyan/30"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-terminal-border bg-black/40">
                    <div className="relative">
                      <textarea
                        value={scenarioInput}
                        onChange={(e) => setScenarioInput(e.target.value)}
                        placeholder="e.g., 'Compromise a cloud-native fintech startup with AWS infrastructure...'"
                        className="w-full h-24 bg-black/40 border border-terminal-border rounded-lg p-3 text-sm font-mono focus:outline-none focus:border-terminal-green/50 resize-none placeholder:text-terminal-text/20"
                      />
                      <Button
                        onClick={handleAnalyzeScenario}
                        disabled={isAnalyzing || !scenarioInput.trim()}
                        size="icon"
                        className="absolute bottom-3 right-3 w-8 h-8 bg-terminal-green text-black hover:bg-terminal-green/90"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Info className="w-3 h-3 text-terminal-text/30" />
                      <span className="text-xs font-mono text-terminal-text/30 uppercase tracking-tighter">
                        Ethical Use Only • AI Generated Content
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center pt-24 gap-8">
                <div className="rotate-90 whitespace-nowrap">
                  <span className="text-sm font-mono font-bold text-terminal-green uppercase tracking-[0.3em]">SCENARIO LAB</span>
                </div>
                <Zap className="w-4 h-4 text-terminal-green/40" />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  </div>
</TooltipProvider>
);
}
