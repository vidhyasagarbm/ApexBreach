import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Terminal, Cpu, Database, Globe, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const LOADING_STEPS = [
  "Initializing Obsidian Core...",
  "Establishing secure tunnel...",
  "Bypassing perimeter firewall...",
  "Injecting neural payload...",
  "Decrypting tactical database...",
  "Synchronizing with APT nodes...",
  "Access granted. Welcome to ApexBreach."
];

const HEX_CHARS = "0123456789ABCDEF";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [glitchText, setGlitchText] = useState("APEXBREACH");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + Math.random() * 8;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const stepIndex = Math.min(
      Math.floor((progress / 100) * LOADING_STEPS.length),
      LOADING_STEPS.length - 1
    );
    if (stepIndex !== currentStep) {
      setCurrentStep(stepIndex);
      setLogs(prev => [...prev, LOADING_STEPS[stepIndex]].slice(-6));
    }
  }, [progress, currentStep]);

  // Glitch effect for the title
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        const chars = "APEXBREACH!@#$%^&*()_+";
        const newText = "APEXBREACH".split('').map(c => 
          Math.random() > 0.8 ? chars[Math.floor(Math.random() * chars.length)] : c
        ).join('');
        setGlitchText(newText);
        setTimeout(() => setGlitchText("APEXBREACH"), 100);
      }
    }, 200);
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-obsidian-bg flex flex-col items-center justify-center font-mono overflow-hidden">
      {/* Matrix Rain Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="flex justify-around w-full h-full">
          {Array.from({ length: window.innerWidth < 768 ? 10 : 20 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-matrix-fall" style={{ animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 10}s` }}>
              {Array.from({ length: window.innerWidth < 768 ? 25 : 50 }).map((_, j) => (
                <span key={j} className="text-[10px] text-accent font-bold">
                  {HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hex Data Streams (Sides) */}
      <div className="absolute left-4 top-0 bottom-0 w-12 opacity-20 hidden lg:flex flex-col gap-1 overflow-hidden py-4">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="text-[8px] text-accent/50 whitespace-nowrap">
            {Array.from({ length: 8 }).map(() => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]).join('')}
          </div>
        ))}
      </div>
      <div className="absolute right-4 top-0 bottom-0 w-12 opacity-20 hidden lg:flex flex-col gap-1 overflow-hidden py-4">
        {Array.from({ length: 100 }).map((_, i) => (
          <div key={i} className="text-[8px] text-accent/50 whitespace-nowrap">
            {Array.from({ length: 8 }).map(() => HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)]).join('')}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-xl px-6 flex flex-col items-center gap-12">
        {/* Logo & Scanning Animation */}
        <div className="relative">
          {/* Scanning Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-12 border border-accent/20 rounded-full border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border border-accent/10 rounded-full"
          />
          <div className="absolute -inset-4 bg-accent/5 rounded-full animate-pulse" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative flex flex-col items-center gap-6"
          >
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-accent/10 flex items-center justify-center border border-accent/20 relative z-10 overflow-hidden">
                <Shield className="w-12 h-12 text-accent animate-pulse" />
                <motion.div 
                  animate={{ y: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-x-0 h-1 bg-accent/40 blur-sm"
                />
              </div>
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-5xl font-black tracking-tighter text-terminal-text relative">
                <span className="relative z-10">{glitchText.slice(0, 4)}</span>
                <span className="text-accent relative z-10">{glitchText.slice(4)}</span>
                {/* Glitch layers */}
                <span className="absolute inset-0 text-red-500/30 translate-x-1 translate-y-0.5 blur-sm animate-pulse">{glitchText}</span>
                <span className="absolute inset-0 text-blue-500/30 -translate-x-1 -translate-y-0.5 blur-sm animate-pulse">{glitchText}</span>
              </h1>
              <div className="flex items-center justify-center gap-4 text-[10px] text-accent/50 uppercase tracking-[0.4em]">
                <span className="h-[1px] w-8 bg-accent/20" />
                Neural Link Active
                <span className="h-[1px] w-8 bg-accent/20" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tactical Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-lg">
          {[
            { icon: Cpu, label: 'Core', status: progress > 20 ? 'READY' : 'INIT' },
            { icon: Globe, label: 'Network', status: progress > 40 ? 'SECURE' : 'LINKING' },
            { icon: Database, label: 'Vault', status: progress > 60 ? 'MOUNTED' : 'LOCKED' },
            { icon: Lock, label: 'Auth', status: progress > 80 ? 'GRANTED' : 'VERIFY' },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-2">
              <item.icon className={cn("w-4 h-4", (item.status === 'READY' || item.status === 'SECURE' || item.status === 'MOUNTED' || item.status === 'GRANTED') ? "text-accent" : "text-terminal-text/20")} />
              <div className="text-[8px] text-terminal-text/40 uppercase font-bold">{item.label}</div>
              <div className={cn("text-[9px] font-mono", (item.status === 'READY' || item.status === 'SECURE' || item.status === 'MOUNTED' || item.status === 'GRANTED') ? "text-accent" : "text-terminal-text/20")}>
                {item.status}
              </div>
            </div>
          ))}
        </div>

        {/* Progress & Terminal Container */}
        <div className="w-full max-w-lg space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] text-terminal-text/40 font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {LOADING_STEPS[currentStep]}
              </span>
              <span className="text-accent">{Math.floor(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
              <motion.div 
                className="h-full bg-accent relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-shimmer" />
              </motion.div>
            </div>
          </div>

          <div className="bg-black/60 border border-terminal-border rounded-xl p-5 h-40 flex flex-col gap-1.5 overflow-hidden backdrop-blur-md relative">
            {/* Terminal Header */}
            <div className="flex items-center justify-between text-accent/40 mb-3 border-b border-terminal-border/50 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                <span className="text-[9px] uppercase tracking-widest font-bold">Tactical_Boot_Sequence.log</span>
              </div>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/20" />
              </div>
            </div>
            
            <AnimatePresence mode="popLayout">
              {logs.map((log, i) => (
                <motion.div
                  key={log}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-[10px] text-terminal-text/60 font-mono flex items-center gap-3"
                >
                  <span className="text-accent/30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span className={i === logs.length - 1 ? "text-terminal-text" : ""}>
                    {i === logs.length - 1 ? ">> " : "   "}{log}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Terminal Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,51,51,0.05),transparent_70%)] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Advanced Scanline & Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes matrix-fall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-matrix-fall {
          animation: matrix-fall linear infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}} />
    </div>
  );
};
