import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity, AlertCircle, Shield, Globe, Zap, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'intercept' | 'system' | 'alarm' | 'ai';
  message: string;
  origin?: string;
}

const LOG_MESSAGES: { type: 'intercept' | 'system' | 'alarm' | 'ai'; message: string; origin: string; }[] = [
  { type: 'intercept', message: 'SMTP traffic intercepted from node 88.23.11.45', origin: 'Frankfurt-DE' },
  { type: 'system', message: 'Neural mapping of attack surface completed for target_01', origin: 'System' },
  { type: 'alarm', message: 'High-frequency brute force detected on Azure SQL gateway', origin: 'Dublin-IE' },
  { type: 'ai', message: 'Tactical Engine suggests credential stuffing for pivot point 4', origin: 'Gemini-AI' },
  { type: 'intercept', message: 'Encrypted packet fragment captured via secondary proxy', origin: 'Unknown' },
  { type: 'system', message: 'Briefing report compiled and hashed for extraction', origin: 'User-Init' },
  { type: 'alarm', message: 'Intrusion detection tripped: Sandbox VM #543', origin: 'Silicon Valley-US' },
  { type: 'intercept', message: 'Cleartext credentials detected in HTTP/1.1 header', origin: 'London-UK' },
  { type: 'ai', message: 'Analysis: Target has 85% probability of CVE-2024-XXXX vulnerability', origin: 'Gemini-AI' }
];

export const LiveOpsFeed: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial logs
    const initialLogs: LogEntry[] = Array.from({ length: 5 }).map((_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(Date.now() - (5 - i) * 2000).toLocaleTimeString([], { hour12: false }),
      ...LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]
    }));
    setLogs(initialLogs);

    // Dynamic updates
    const interval = setInterval(() => {
      const newEntry: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour12: false }),
        ...LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)]
      };
      setLogs(prev => [...prev.slice(-19), newEntry]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'intercept': return <Radio className="w-3 h-3 text-emerald-500" />;
      case 'system': return <Terminal className="w-3 h-3 text-terminal-text/50" />;
      case 'alarm': return <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />;
      case 'ai': return <Cpu className="w-3 h-3 text-accent" />;
      default: return <Shield className="w-3 h-3" />;
    }
  };

  const Radio = ({ className }: { className: string }) => (
    <Activity className={className} />
  );

  return (
    <div className="h-full flex flex-col bg-obsidian-bg border-t border-terminal-border">
      <div className="px-4 py-1.5 bg-black border-b border-terminal-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">Global Intelligence Pulse</span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono text-terminal-text/30">
          <span>LATENCY: 12ms</span>
          <span>UPTIME: 442:21:05</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-2 font-mono text-[10px] custom-scrollbar bg-black/60"
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 py-1 border-b border-white/[0.02] last:border-0 group"
            >
              <span className="text-terminal-text/20 shrink-0">[{log.timestamp}]</span>
              <div className="shrink-0 mt-0.5">{getTypeIcon(log.type)}</div>
              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "uppercase font-bold tracking-tighter",
                    log.type === 'intercept' ? "text-emerald-500" :
                    log.type === 'alarm' ? "text-red-500" :
                    log.type === 'ai' ? "text-accent" :
                    "text-terminal-text/40"
                  )}>
                    {log.type}
                  </span>
                  <span className="text-[8px] text-terminal-text/10 group-hover:text-terminal-text/20 transition-colors uppercase">
                    NODE: {log.origin}
                  </span>
                </div>
                <p className="text-terminal-text/70 break-all">{log.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
