import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, ChevronRight, X, Maximize2 } from 'lucide-react';

interface HistoryItem {
  type: 'cmd' | 'out' | 'err';
  content: string;
}

export const TerminalEmulator: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'out', content: 'ShadowOps Tactical Terminal v1.0.0' },
    { type: 'out', content: 'Type "help" for available commands.' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory: HistoryItem[] = [...history, { type: 'cmd', content: input }];

    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'out', content: 'Available commands: help, clear, whoami, status, scan, forge' });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'whoami':
        newHistory.push({ type: 'out', content: 'operator@shadowops-intel' });
        break;
      case 'status':
        newHistory.push({ type: 'out', content: 'System: ONLINE\nUptime: 14h 22m\nEncrypted: YES' });
        break;
      case 'scan':
        newHistory.push({ type: 'out', content: 'Scanning local subnet... Found 3 active nodes.' });
        break;
      case 'forge':
        newHistory.push({ type: 'out', content: 'Accessing Payload Forge... Redirecting to Armory.' });
        break;
      default:
        newHistory.push({ type: 'err', content: `Command not found: ${cmd}` });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black border border-terminal-border rounded-xl overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-terminal-border bg-black/80">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-terminal-green" />
          <span className="text-[10px] font-mono font-bold text-terminal-green uppercase tracking-widest">Tactical Terminal</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-text/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-text/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-terminal-green/50" />
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-xs overflow-y-auto custom-scrollbar space-y-1"
      >
        {history.map((item, i) => (
          <div key={i} className={
            item.type === 'cmd' ? 'text-terminal-text' : 
            item.type === 'err' ? 'text-red-500' : 
            'text-terminal-green/80'
          }>
            {item.type === 'cmd' && <span className="text-terminal-green mr-2">$</span>}
            <span className="whitespace-pre-wrap">{item.content}</span>
          </div>
        ))}
        <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
          <span className="text-terminal-green">$</span>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-terminal-text placeholder:text-terminal-text/20"
            placeholder="Enter command..."
          />
        </form>
      </div>
    </div>
  );
};
