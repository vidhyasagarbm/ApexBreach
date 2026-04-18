import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ghost, ShieldAlert, Lock, Database, MessageSquare, AlertTriangle, Eye, Terminal, Activity, Globe, Cpu, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, PieChart, Pie, Cell } from 'recharts';

interface LeakEntry {
  id: string;
  type: 'CREDENTIALS' | 'DATABASE' | 'FORUM_POST' | 'SOURCE_CODE';
  title: string;
  source: string;
  region: 'NORTH_AMERICA' | 'EUROPE' | 'ASIA' | 'LATAM' | 'RUSSIA' | 'UNKNOWN';
  timestamp: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  content: string;
  redacted: boolean;
}

const REGIONS = ['NORTH_AMERICA', 'EUROPE', 'ASIA', 'LATAM', 'RUSSIA', 'UNKNOWN'] as const;

const MOCK_LEAKS: LeakEntry[] = [
  {
    id: 'leak-1',
    type: 'CREDENTIALS',
    title: 'Fortune 500 Employee Credentials',
    source: 'RaidForums (Mirror)',
    region: 'NORTH_AMERICA',
    timestamp: '2 mins ago',
    severity: 'CRITICAL',
    content: 'admin:p@ssw0rd123\njdoe:********\nmsmith:********\nroot:T0pS3cr3t!',
    redacted: true
  },
  {
    id: 'leak-2',
    type: 'DATABASE',
    title: 'E-commerce User Database Snippet',
    source: 'BreachForums',
    region: 'EUROPE',
    timestamp: '15 mins ago',
    severity: 'HIGH',
    content: 'INSERT INTO users (id, email, password_hash) VALUES (1024, "v***@gmail.com", "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi");',
    redacted: true
  },
  {
    id: 'leak-3',
    type: 'FORUM_POST',
    title: 'Zero-Day Discussion: Windows Kernel',
    source: 'Exploit.in',
    region: 'RUSSIA',
    timestamp: '45 mins ago',
    severity: 'MEDIUM',
    content: 'User "L33tHax" is offering a new LPE for Windows 11 23H2. Asking price: 2.5 BTC. Verified by moderator "Ghost".',
    redacted: false
  },
  {
    id: 'leak-4',
    type: 'SOURCE_CODE',
    title: 'Proprietary Trading Algorithm Leak',
    source: 'GitHub Gist (Deleted)',
    region: 'ASIA',
    timestamp: '1 hour ago',
    severity: 'HIGH',
    content: 'def calculate_alpha(data):\n    # REDACTED TRADING LOGIC\n    return alpha * 1.05',
    redacted: true
  },
  {
    id: 'leak-5',
    type: 'CREDENTIALS',
    title: 'Government Portal VPN Access',
    source: 'DarkNet Market',
    region: 'LATAM',
    timestamp: '2 hours ago',
    severity: 'CRITICAL',
    content: 'VPN_IP: 164.100.**.**\nUser: sysadmin\nKey: -----BEGIN RSA PRIVATE KEY-----\n...',
    redacted: true
  }
];

interface DarkWebMonitorProps {
  onInvestigate?: (leak: LeakEntry) => void;
  onArchive?: (leakId: string) => void;
}

export const DarkWebMonitor: React.FC<DarkWebMonitorProps> = ({ onInvestigate, onArchive }) => {
  const [leaks, setLeaks] = useState<LeakEntry[]>(MOCK_LEAKS);
  const [selectedLeak, setSelectedLeak] = useState<LeakEntry | null>(null);
  const [viewMode, setViewMode] = useState<'TEXT' | 'HEX'>('TEXT');
  const [activityData, setActivityData] = useState<{ time: string, count: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<LeakEntry['severity'] | 'ALL'>('ALL');
  const [riskScore, setRiskScore] = useState(74);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const watchlist = ['VPN', 'ADMIN', 'ROOT', 'KERNEL', 'GOVERNMENT'];

  // Calculate risk score based on leaks
  useEffect(() => {
    const criticalCount = leaks.filter(l => l.severity === 'CRITICAL').length;
    const highCount = leaks.filter(l => l.severity === 'HIGH').length;
    const newScore = Math.min(100, (criticalCount * 15) + (highCount * 8) + 30);
    setRiskScore(newScore);
  }, [leaks]);

  // Generate mock activity data
  useEffect(() => {
    const data = Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      count: Math.floor(Math.random() * 50) + 10
    }));
    setActivityData(data);
  }, []);

  const handleArchive = (id: string) => {
    setLeaks(prev => prev.filter(l => l.id !== id));
    if (selectedLeak?.id === id) setSelectedLeak(null);
    if (onArchive) onArchive(id);
  };

  const handleInvestigate = (leak: LeakEntry) => {
    if (onInvestigate) onInvestigate(leak);
  };

  const handleDecrypt = () => {
    if (!selectedLeak) return;
    setIsDecrypting(true);
    setDecryptedContent(null);
    
    setTimeout(() => {
      setIsDecrypting(false);
      setDecryptedContent(selectedLeak.content.replace(/\*/g, () => Math.floor(Math.random() * 10).toString()));
    }, 3000);
  };

  const toHex = (str: string) => {
    return str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
  };

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      const types: LeakEntry['type'][] = ['CREDENTIALS', 'DATABASE', 'FORUM_POST', 'SOURCE_CODE'];
      const severities: LeakEntry['severity'][] = ['CRITICAL', 'HIGH', 'MEDIUM'];
      
      const newLeak: LeakEntry = {
        id: `leak-${Date.now()}`,
        type: types[Math.floor(Math.random() * types.length)],
        title: 'Intercepted Data Fragment',
        source: 'Onion Router Node 0x' + Math.random().toString(16).slice(2, 6),
        region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
        timestamp: 'Just now',
        severity: severities[Math.floor(Math.random() * severities.length)],
        content: 'FRAGMENT_' + Math.random().toString(36).slice(2, 10).toUpperCase() + ': [DATA CORRUPTED OR REDACTED]',
        redacted: true
      };

      setLeaks(prev => [newLeak, ...prev].slice(0, 15));
      setActivityData(prev => [...prev.slice(1), { time: new Date().toLocaleTimeString(), count: Math.floor(Math.random() * 50) + 10 }]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const filteredLeaks = leaks.filter(leak => {
    const matchesSearch = leak.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         leak.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         leak.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === 'ALL' || leak.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="h-full flex flex-col bg-black/20 overflow-hidden">
      {/* Header */}
      <div className="p-6 lg:p-8 border-b border-terminal-border bg-obsidian-bg/80 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <Ghost className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-tight">Dark Web Leak Monitor</h2>
              <p className="text-sm font-mono text-terminal-text/50">Monitoring underground forums and data dumps for critical exposures</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Global Risk Index */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-[0.2em] mb-1">Global Risk Index</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${riskScore}%` }}
                    className={cn(
                      "h-full transition-all duration-1000",
                      riskScore > 80 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" :
                      riskScore > 50 ? "bg-orange-500" : "bg-terminal-green"
                    )}
                  />
                </div>
                <span className={cn(
                  "text-xl font-mono font-bold",
                  riskScore > 80 ? "text-red-500" : riskScore > 50 ? "text-orange-500" : "text-terminal-green"
                )}>
                  {riskScore}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-red-500/5 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-mono text-red-500 font-bold uppercase tracking-widest">Threat Level: Critical</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-terminal-text/30" />
            <input 
              type="text"
              placeholder="SEARCH INTELLIGENCE DATABASE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 bg-black/40 border border-terminal-border rounded-lg pl-10 pr-4 text-xs font-mono text-terminal-text placeholder:text-terminal-text/20 focus:outline-none focus:border-terminal-green/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={cn(
                  "px-3 py-2 rounded-lg border text-[10px] font-mono font-bold uppercase transition-all",
                  filterSeverity === sev 
                    ? "bg-terminal-green border-terminal-green text-black" 
                    : "bg-black/40 border-terminal-border text-terminal-text/50 hover:border-terminal-green/30"
                )}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Stats & Visuals */}
        <div className="hidden xl:flex w-72 border-r border-terminal-border flex-col bg-black/40">
          <div className="p-6 space-y-8 overflow-y-auto no-scrollbar">
            {/* Activity Chart */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-terminal-green" />
                <span className="text-[10px] font-mono text-terminal-text/50 uppercase tracking-widest">Traffic Volume</span>
              </div>
              <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="count" stroke="#00ff41" fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Severity Distribution */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="w-4 h-4 text-terminal-green" />
                <span className="text-[10px] font-mono text-terminal-text/50 uppercase tracking-widest">Severity Mix</span>
              </div>
              <div className="h-32 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Critical', value: leaks.filter(l => l.severity === 'CRITICAL').length },
                        { name: 'High', value: leaks.filter(l => l.severity === 'HIGH').length },
                        { name: 'Medium', value: leaks.filter(l => l.severity === 'MEDIUM').length },
                      ]}
                      innerRadius={30}
                      outerRadius={50}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#f97316" />
                      <Cell fill="#00ff41" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Node Network */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-terminal-green" />
                <span className="text-[10px] font-mono text-terminal-text/50 uppercase tracking-widest">Node Network</span>
              </div>
              
              {/* Dynamic Node Map */}
              <div className="h-48 w-full bg-black/40 rounded-xl border border-white/5 relative overflow-hidden group">
                <svg className="absolute inset-0 w-full h-full">
                  {/* Connections */}
                  {[
                    { x1: "20%", y1: "20%", x2: "80%", y2: "80%", d: 2 },
                    { x1: "80%", y1: "20%", x2: "20%", y2: "80%", d: 3 },
                    { x1: "50%", y1: "10%", x2: "50%", y2: "90%", d: 4 },
                    { x1: "10%", y1: "50%", x2: "90%", y2: "50%", d: 2.5 },
                    { x1: "20%", y1: "20%", x2: "80%", y2: "20%", d: 5 },
                    { x1: "20%", y1: "80%", x2: "80%", y2: "80%", d: 3.5 },
                  ].map((line, i) => (
                    <React.Fragment key={i}>
                      <motion.line 
                        x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} 
                        stroke="#00ff41" strokeWidth="0.5" strokeOpacity="0.2"
                      />
                      {/* Data Packet Animation */}
                      <motion.circle
                        r="1.5"
                        fill="#00ff41"
                        initial={{ cx: line.x1, cy: line.y1 }}
                        animate={{ 
                          cx: [line.x1, line.x2],
                          cy: [line.y1, line.y2],
                          opacity: [0, 1, 0]
                        }}
                        transition={{ 
                          duration: line.d, 
                          repeat: Infinity, 
                          ease: "linear",
                          delay: i * 0.5
                        }}
                      />
                    </React.Fragment>
                  ))}
                  
                  {/* Nodes */}
                  {[
                    { x: "20%", y: "20%", id: "01" }, { x: "80%", y: "20%", id: "02" },
                    { x: "50%", y: "50%", id: "CX" },
                    { x: "20%", y: "80%", id: "03" }, { x: "80%", y: "80%", id: "04" },
                    { x: "10%", y: "50%", id: "E1" }, { x: "90%", y: "50%", id: "E2" },
                    { x: "50%", y: "10%", id: "S1" }, { x: "50%", y: "90%", id: "S2" }
                  ].map((node, i) => (
                    <g key={i}>
                      <motion.circle
                        cx={node.x} cy={node.y} r="6"
                        fill="#000000"
                        stroke="#00ff41"
                        strokeWidth="0.5"
                        animate={{ 
                          strokeOpacity: [0.2, 0.8, 0.2],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
                      />
                      <text
                        x={node.x}
                        y={node.y}
                        dy="2"
                        textAnchor="middle"
                        fill="#00ff41"
                        fontSize="5"
                        fontFamily="monospace"
                        className="pointer-events-none"
                      >
                        {node.id}
                      </text>
                    </g>
                  ))}
                </svg>
                
                {/* Scanning Radar Effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-terminal-green/10 to-transparent h-1/2 w-full pointer-events-none"
                  animate={{ top: ["-50%", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-terminal-green animate-ping" />
                    <span className="text-[8px] font-mono text-terminal-green/50 uppercase">Mesh_Active</span>
                  </div>
                  <span className="text-[8px] font-mono text-terminal-green/50">NODES: 128_ONLINE</span>
                </div>
              </div>

              <div className="space-y-2">
                {['TOR-EXIT-01', 'I2P-NODE-ALPHA', 'ONION-RELAY-99'].map(node => (
                  <div key={node} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                    <span className="text-[10px] font-mono text-terminal-text/70">{node}</span>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                          className="w-1 h-3 bg-terminal-green rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leak List */}
        <div className="w-full lg:w-1/2 xl:w-1/3 border-r border-terminal-border flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            <AnimatePresence initial={false}>
              {filteredLeaks.map((leak) => {
                const isWatchlistMatch = watchlist.some(word => 
                  leak.title.toUpperCase().includes(word) || 
                  leak.content.toUpperCase().includes(word)
                );

                return (
                  <motion.div
                    key={leak.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => {
                      setSelectedLeak(leak);
                      setDecryptedContent(null);
                    }}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden",
                      selectedLeak?.id === leak.id 
                        ? "bg-terminal-green/10 border-terminal-green/40" 
                        : isWatchlistMatch
                          ? "bg-red-500/5 border-red-500/30"
                          : "bg-black/40 border-terminal-border hover:border-terminal-green/30"
                    )}
                  >
                    {isWatchlistMatch && (
                      <div className="absolute top-0 right-0 px-2 py-0.5 bg-red-500 text-black text-[8px] font-bold uppercase tracking-tighter rounded-bl">
                        Watchlist Match
                      </div>
                    )}

                    {/* Glitch Effect on Hover */}
                    <div className="absolute inset-0 bg-terminal-green/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="flex items-start justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          leak.severity === 'CRITICAL' ? "bg-red-500/20 text-red-500" :
                          leak.severity === 'HIGH' ? "bg-orange-500/20 text-orange-500" :
                          "bg-terminal-green/20 text-terminal-green"
                        )}>
                          {leak.type === 'CREDENTIALS' && <Lock className="w-4 h-4" />}
                          {leak.type === 'DATABASE' && <Database className="w-4 h-4" />}
                          {leak.type === 'FORUM_POST' && <MessageSquare className="w-4 h-4" />}
                          {leak.type === 'SOURCE_CODE' && <Terminal className="w-4 h-4" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-terminal-text group-hover:text-terminal-green transition-colors">{leak.title}</h3>
                          <div className="flex items-center gap-2">
                            <div className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">{leak.source}</div>
                            <span className="text-[10px] text-terminal-text/20">•</span>
                            <div className="text-[10px] font-mono text-terminal-green/60 uppercase tracking-tighter">[{leak.region}]</div>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-terminal-text/30">{leak.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2 relative z-10">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-mono uppercase px-1.5 py-0",
                        leak.severity === 'CRITICAL' ? "border-red-500/30 text-red-500" :
                        leak.severity === 'HIGH' ? "border-orange-500/30 text-orange-500" :
                        "border-terminal-green/30 text-terminal-green"
                      )}>
                        {leak.severity}
                      </Badge>
                      <div className="h-px flex-1 bg-terminal-border" />
                      <Eye className="w-3 h-3 text-terminal-text/20 group-hover:text-terminal-green transition-colors" />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Leak Detail View */}
        <div className="hidden lg:flex flex-1 flex-col bg-black/40 overflow-hidden">
          {selectedLeak ? (
            <div className="flex-1 flex flex-col p-8 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-terminal-green/10 flex items-center justify-center border border-terminal-green/20">
                    <ShieldAlert className="w-5 h-5 text-terminal-green" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-terminal-text">{selectedLeak.title}</h3>
                    <p className="text-xs font-mono text-terminal-text/50 uppercase tracking-widest">Intelligence Report: {selectedLeak.id}</p>
                  </div>
                </div>
                <Badge className={cn(
                  "px-4 py-1 text-xs font-bold",
                  selectedLeak.severity === 'CRITICAL' ? "bg-red-500 text-black" :
                  selectedLeak.severity === 'HIGH' ? "bg-orange-500 text-black" :
                  "bg-terminal-green text-black"
                )}>
                  {selectedLeak.severity} SEVERITY
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-mono text-terminal-text/30 uppercase mb-1">Source Origin</div>
                  <div className="text-sm font-mono text-terminal-green">{selectedLeak.source}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-[10px] font-mono text-terminal-text/30 uppercase mb-1">Discovery Time</div>
                  <div className="text-sm font-mono text-terminal-green">{selectedLeak.timestamp}</div>
                </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <div className="text-[10px] font-mono text-terminal-text/30 uppercase">Intercepted Payload</div>
                    {selectedLeak.redacted && (
                      <button 
                        onClick={handleDecrypt}
                        disabled={isDecrypting}
                        className="flex items-center gap-1.5 text-[9px] font-mono text-terminal-green hover:text-white transition-colors disabled:opacity-50"
                      >
                        <Zap className={cn("w-3 h-3", isDecrypting && "animate-spin")} />
                        {isDecrypting ? "BRUTE-FORCING..." : "RUN DECRYPT SIM"}
                      </button>
                    )}
                  </div>
                  <div className="flex bg-black/40 rounded border border-terminal-border p-0.5">
                    <button 
                      onClick={() => setViewMode('TEXT')}
                      className={cn(
                        "px-2 py-0.5 text-[9px] font-mono rounded transition-all",
                        viewMode === 'TEXT' ? "bg-terminal-green text-black" : "text-terminal-text/50 hover:text-terminal-text"
                      )}
                    >
                      TEXT
                    </button>
                    <button 
                      onClick={() => setViewMode('HEX')}
                      className={cn(
                        "px-2 py-0.5 text-[9px] font-mono rounded transition-all",
                        viewMode === 'HEX' ? "bg-terminal-green text-black" : "text-terminal-text/50 hover:text-terminal-text"
                      )}
                    >
                      HEX
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-black/60 rounded-xl border border-terminal-border p-6 font-mono text-sm relative overflow-hidden group">
                  {/* Matrix-like background effect */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(0,255,65,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  
                  <div className="relative z-10 text-terminal-green/90 leading-relaxed whitespace-pre-wrap break-all">
                    {isDecrypting ? (
                      <div className="animate-pulse">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="opacity-50">
                            {Math.random().toString(36).substring(2, 15)}
                            {Math.random().toString(36).substring(2, 15)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      decryptedContent || (viewMode === 'TEXT' ? selectedLeak.content : toHex(selectedLeak.content))
                    )}
                  </div>
                  
                  {selectedLeak.redacted && !decryptedContent && !isDecrypting && (
                    <div className="mt-6 p-3 rounded bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                      <Lock className="w-4 h-4 text-red-500" />
                      <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Data Redacted for Security Compliance</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  onClick={() => handleInvestigate(selectedLeak)}
                  className="flex-1 h-12 rounded-xl bg-terminal-green text-black font-bold text-sm hover:bg-terminal-green/90 transition-all flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4" />
                  LAUNCH INVESTIGATION
                </button>
                <button 
                  onClick={() => handleArchive(selectedLeak.id)}
                  className="flex-1 h-12 rounded-xl bg-white/5 border border-white/10 text-terminal-text font-bold text-sm hover:bg-white/10 transition-all"
                >
                  ARCHIVE REPORT
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 rounded-full border border-dashed border-terminal-text/20 flex items-center justify-center mb-6">
                <Ghost className="w-10 h-10 text-terminal-text/20" />
              </div>
              <h3 className="text-lg font-bold text-terminal-text/40 uppercase tracking-widest mb-2">No Intelligence Selected</h3>
              <p className="text-sm text-terminal-text/20 max-w-xs font-mono">
                Select a leak entry from the monitor feed to view intercepted data fragments and analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
