/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, 
  Terminal, 
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
  Users,
  X,
  Share2,
  ClipboardList,
  Radio
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
import ReactMarkdown from "react-markdown";
import { ThreatMap } from "@/src/components/ThreatMap";
import { AnalyticsDashboard } from "@/src/components/Analytics";
import { NewsFeed } from "@/src/components/NewsFeed";
import { WarRoom } from "@/src/components/WarRoom";
import { Armory } from "@/src/components/Armory";
import { CVEIntelligence } from "@/src/components/CVEIntelligence";
import { PayloadGenerator } from "@/src/components/PayloadGenerator";
import { AttackPathVisualizer } from "@/src/components/AttackPathVisualizer";
import { MissionChecklist } from "@/src/components/MissionChecklist";
import { TerminalEmulator } from "@/src/components/TerminalEmulator";
import { db, doc, getDoc } from "@/src/firebase";

export default function App() {
  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDoc(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();
  }, []);

  const [selectedTTP, setSelectedTTP] = useState<TTP>(TTP_DATA[0]);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique>(TTP_DATA[0].techniques[0]);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [scenarioInput, setScenarioInput] = useState("");
  const [scenarioAnalysis, setScenarioAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"handbook" | "map" | "analytics" | "news" | "warroom" | "armory" | "cve" | "missions" | "terminal">("handbook");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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
      <div className="flex h-screen bg-terminal-bg text-terminal-text overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className={cn(
          "border-r border-terminal-border flex flex-col bg-black/20 transition-all duration-300 relative",
          isSidebarCollapsed ? "w-16" : "w-80"
        )}>
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-terminal-border rounded-full flex items-center justify-center hover:bg-terminal-green/20 transition-colors z-50 border border-terminal-border"
          >
            <ChevronRight className={cn("w-4 h-4 transition-transform", isSidebarCollapsed ? "" : "rotate-180")} />
          </button>

          <div className={cn("p-6 border-b border-terminal-border flex items-center gap-3 overflow-hidden whitespace-nowrap", isSidebarCollapsed && "p-4 justify-center")}>
            <div className="w-10 h-10 rounded-lg bg-terminal-green/10 flex items-center justify-center border border-terminal-green/30 shrink-0">
              <Shield className="w-6 h-6 text-terminal-green" />
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-lg font-bold font-mono text-terminal-green tracking-tighter">SHADOWOPS</h1>
                <p className="text-[10px] font-mono text-terminal-text/50 uppercase tracking-widest">Tactical Knowledge Base v1.0</p>
              </div>
            )}
          </div>

          {!isSidebarCollapsed && (
            <>
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-text/40" />
                  <Input 
                    placeholder="Search TTPs..." 
                    className="pl-9 bg-black/40 border-terminal-border focus:border-terminal-green/50 text-xs font-mono"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
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
                          "w-full flex items-center justify-between px-3 py-2 rounded-md transition-all text-left group",
                          selectedTTP.id === ttp.id 
                            ? "bg-terminal-green/10 text-terminal-green border border-terminal-green/20" 
                            : "hover:bg-white/5 text-terminal-text/70"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            selectedTTP.id === ttp.id ? "bg-terminal-green animate-pulse" : "bg-terminal-text/20"
                          )} />
                          <span className="text-[11px] font-mono font-medium uppercase tracking-wider">{ttp.name}</span>
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
                            className="overflow-hidden ml-6 mt-1 space-y-1 border-l border-terminal-border/50"
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
                                  "w-full text-left px-3 py-1.5 text-[11px] font-mono transition-all flex items-center justify-between group",
                                  selectedTechnique.id === tech.id 
                                    ? "bg-terminal-cyan/10 text-terminal-cyan" 
                                    : "text-terminal-text/50 hover:text-terminal-text/80 hover:bg-white/5"
                                )}
                              >
                                <span>{tech.name}</span>
                                {tech.level && (
                                  <span className={cn(
                                    "text-[8px] px-1 rounded border opacity-0 group-hover:opacity-100 transition-opacity",
                                    getLevelColor(tech.level)
                                  )}>
                                    {tech.level.charAt(0)}
                                  </span>
                                )}
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
      </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-black/10">
          {/* Header */}
          <header className="h-auto min-h-16 border-b border-terminal-border flex flex-col xl:flex-row items-center justify-between px-4 lg:px-8 py-4 xl:py-0 bg-black/20 gap-4">
            <div className="flex flex-wrap items-center gap-3 lg:gap-6">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-terminal-green/60" />
                <span className="text-[9px] font-mono text-terminal-text/40 uppercase tracking-widest hidden sm:inline">Level:</span>
                <Badge variant="outline" className="bg-terminal-green/5 border-terminal-green/20 text-terminal-green font-mono text-[9px] px-2 py-0">
                  {selectedTTP.level}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-4 bg-terminal-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-terminal-cyan/60" />
                <span className="text-[9px] font-mono text-terminal-text/40 uppercase tracking-widest hidden sm:inline">Primary Tool:</span>
                <Badge variant="outline" className="bg-terminal-cyan/5 border-terminal-cyan/20 text-terminal-cyan font-mono text-[9px] px-2 py-0">
                  {selectedTechnique.kaliTool}
                </Badge>
              </div>
              <Separator orientation="vertical" className="h-4 bg-terminal-border hidden sm:block" />
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-terminal-text/40" />
                <span className="text-[9px] font-mono text-terminal-text/40 uppercase tracking-widest hidden sm:inline">Mastery:</span>
                <Badge variant="outline" className={cn("font-mono text-[9px] px-2 py-0", getLevelColor(selectedTechnique.level))}>
                  {selectedTechnique.level || "N/A"}
                </Badge>
              </div>
            </div>
            
            <div className="w-full xl:w-auto flex items-center justify-center xl:justify-end overflow-hidden">
              <div className="flex bg-black/40 p-1 rounded-lg border border-terminal-border overflow-x-auto max-w-full custom-scrollbar no-scrollbar">
                {[
                  { id: "handbook", label: "HANDBOOK", icon: Shield },
                  { id: "armory", label: "ARMORY", icon: Zap },
                  { id: "missions", label: "MISSIONS", icon: ClipboardList },
                  { id: "terminal", label: "TERMINAL", icon: Terminal },
                  { id: "cve", label: "CVE INTEL", icon: AlertTriangle },
                  { id: "map", label: "THREAT MAP", icon: Globe },
                  { id: "analytics", label: "ANALYTICS", icon: BarChart3 },
                  { id: "news", label: "NEWS", icon: Newspaper },
                  { id: "warroom", label: "WAR ROOM", icon: Users },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-[9px] font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0",
                      activeTab === tab.id ? "bg-terminal-green text-black" : "text-terminal-text/40 hover:text-terminal-text/60"
                    )}
                  >
                    <tab.icon className="w-3 h-3" />
                    <span className="hidden 2xl:inline">{tab.label}</span>
                    <span className="2xl:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === "handbook" ? (
                <motion.div 
                  key="handbook"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 flex overflow-hidden w-full"
                >
                  {/* Left: Technique Details */}
                  <div className="flex-1 flex flex-col border-r border-terminal-border min-w-0">
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                      <div className="p-8 max-w-4xl mx-auto">
                        <motion.div
                          key={selectedTechnique.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-8"
                        >
                          <section>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Terminal className="w-5 h-5 text-terminal-green" />
                                <h2 className="text-2xl font-bold text-terminal-green uppercase tracking-tight">{selectedTechnique.name}</h2>
                              </div>
                              {selectedTechnique.level && (
                                <Badge className={cn("px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest", getLevelColor(selectedTechnique.level))}>
                                  {selectedTechnique.level} Level
                                </Badge>
                              )}
                            </div>
                            <p className="text-terminal-text/80 leading-relaxed text-sm">
                              {selectedTechnique.description}
                            </p>
                          </section>

                          <section className="space-y-4">
                            <div className="flex items-center gap-2 text-terminal-cyan">
                              <Share2 className="w-4 h-4" />
                              <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Attack Path Visualization</h3>
                            </div>
                            <AttackPathVisualizer />
                          </section>

                          <Separator className="bg-terminal-border" />

                          <div className="grid grid-cols-2 gap-8">
                            <section className="space-y-4">
                              <div className="flex items-center gap-2 text-terminal-cyan">
                                <Activity className="w-4 h-4" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Execution Procedures</h3>
                              </div>
                              <ul className="space-y-4">
                                {selectedTechnique.procedures.map((proc, i) => (
                                  <li key={i} className="flex flex-col gap-1.5 group">
                                    <div className="flex items-start gap-3">
                                      <div className="mt-1.5 w-1 h-1 rounded-full bg-terminal-cyan/50 group-hover:bg-terminal-cyan transition-colors shrink-0" />
                                      <code className="text-xs text-terminal-green/80 bg-black/40 px-2 py-1 rounded border border-terminal-green/10 group-hover:text-terminal-green transition-colors break-all">{proc.command}</code>
                                    </div>
                                    <p className="ml-7 text-[10px] text-terminal-text/50 font-mono leading-relaxed italic">
                                      {proc.explanation}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </section>

                            <section className="space-y-4">
                              <div className="flex items-center gap-2 text-terminal-cyan">
                                <Layers className="w-4 h-4" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Tool Chaining / Next Steps</h3>
                              </div>
                              <div className="p-4 rounded-lg bg-terminal-cyan/5 border border-terminal-cyan/20 text-xs text-terminal-cyan/80 leading-relaxed italic">
                                {selectedTechnique.chaining}
                              </div>
                            </section>
                          </div>

                          <section className="pt-4">
                            <Button 
                              onClick={() => handleExplain(selectedTechnique.name)}
                              disabled={isExplaining}
                              className="w-full bg-terminal-cyan/10 border border-terminal-cyan/30 text-terminal-cyan hover:bg-terminal-cyan/20 font-mono text-xs h-12"
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
                              className="p-6 rounded-xl bg-black/40 border border-terminal-cyan/20 terminal-glow"
                            >
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                  <Cpu className="w-4 h-4 text-terminal-cyan" />
                                  <span className="text-[10px] font-mono text-terminal-cyan uppercase tracking-widest">AI Analysis Intelligence</span>
                                </div>
                                <Badge className="bg-terminal-cyan text-black text-[9px] font-bold">CONFIDENCE: 98%</Badge>
                              </div>
                              <div className="markdown-body text-sm">
                                <ReactMarkdown>{aiExplanation}</ReactMarkdown>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Right: AI Scenario Lab */}
                  <div className="w-[400px] flex flex-col bg-black/30">
                    <div className="p-6 border-b border-terminal-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-terminal-green" />
                        <h3 className="text-xs font-mono font-bold uppercase tracking-widest">HACKING SCENARIO LAB</h3>
                      </div>
                      <p className="text-[11px] text-terminal-text/50 leading-relaxed">
                        Describe a target environment or goal, and the AI will architect a step-by-step hacking methodology using tactical security tools.
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {scenarioAnalysis ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                          >
                            <div className="markdown-body text-xs">
                              <ReactMarkdown>{scenarioAnalysis}</ReactMarkdown>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => setScenarioAnalysis(null)}
                              className="w-full border-terminal-border text-[10px] font-mono h-8"
                            >
                              NEW ANALYSIS
                            </Button>
                          </motion.div>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                            <div className="w-12 h-12 rounded-full border border-dashed border-terminal-text/30 flex items-center justify-center">
                              <Terminal className="w-6 h-6" />
                            </div>
                            <p className="text-[11px] font-mono uppercase tracking-widest">Awaiting Input...</p>
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
                              <span className="text-[10px] font-mono text-terminal-green">ANALYZING ATTACK VECTORS...</span>
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
                            className="w-full h-24 bg-black/40 border border-terminal-border rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-terminal-green/50 resize-none placeholder:text-terminal-text/20"
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
                          <span className="text-[9px] font-mono text-terminal-text/30 uppercase tracking-tighter">
                            Ethical Use Only • AI Generated Content
                          </span>
                        </div>
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
                  className="flex-1 overflow-hidden"
                >
                  <AnalyticsDashboard />
                </motion.div>
              ) : activeTab === "news" ? (
                <motion.div 
                  key="news"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 overflow-hidden"
                >
                  <NewsFeed />
                </motion.div>
              ) : activeTab === "warroom" ? (
                <motion.div 
                  key="warroom"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-hidden"
                >
                  <WarRoom />
                </motion.div>
              ) : activeTab === "missions" ? (
                <motion.div 
                  key="missions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 p-8 overflow-y-auto custom-scrollbar"
                >
                  <div className="max-w-4xl mx-auto">
                    <MissionChecklist />
                  </div>
                </motion.div>
              ) : activeTab === "terminal" ? (
                <motion.div 
                  key="terminal"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 p-8 overflow-hidden"
                >
                  <TerminalEmulator />
                </motion.div>
              ) : activeTab === "armory" ? (
                <motion.div 
                  key="armory"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 overflow-y-auto custom-scrollbar"
                >
                  <div className="p-8 space-y-8 max-w-6xl mx-auto">
                    <PayloadGenerator />
                    <Armory />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="cve"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex-1 overflow-hidden"
                >
                  <CVEIntelligence />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
