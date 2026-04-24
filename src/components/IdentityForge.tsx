import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, UserPlus, Fingerprint, Shield, Globe, Cpu, RefreshCw, Copy, Check, MessageSquare, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Identity {
  id: string;
  name: string;
  role: string;
  bio: string;
  history: string[];
  trustScore: number;
  handles: { platform: string; username: string }[];
}

const ROLES = [
  'Senior DevOps Engineer',
  'Compliance Specialist',
  'Security Architect',
  'Network Administrator',
  'Project Manager (Fintech)',
  'HR Operations Lead'
];

const PLATFORMS = ['LinkedIn', 'GitHub', 'Twitter', 'Xing', 'Mastodon'];

export const IdentityForge: React.FC = () => {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateIdentity = () => {
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const names = ['Elias Thorne', 'Sarah Vance', 'Marcus Chen', 'Leila Rostova', 'David Kessler', 'Aria Sterling'];
      const name = names[Math.floor(Math.random() * names.length)];
      const role = ROLES[Math.floor(Math.random() * ROLES.length)];
      
      const newIdentity: Identity = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        role,
        bio: `Strategic ${role} with over 10 years of experience in high-security environments. Known for ${['infrastructure resilience', 'automated compliance', 'zero-trust networking', 'scaled operations'][Math.floor(Math.random() * 4)]}.`,
        history: [
          `Worked at ${['Citadel Tech', 'Innova Systems', 'Alpha Cloud', 'Prime Logistics'][Math.floor(Math.random() * 4)]} for 5 years.`,
          `Spearheaded the ${['Q3 Migration', 'Security Hardening', 'Global Scale-out'][Math.floor(Math.random() * 3)]} initiative.`
        ],
        trustScore: 85 + Math.floor(Math.random() * 15),
        handles: Array.from({ length: 3 }).map(() => ({
          platform: PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)],
          username: name.toLowerCase().replace(' ', '.') + Math.floor(Math.random() * 99)
        }))
      };

      setIdentities(prev => [newIdentity, ...prev].slice(0, 5));
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-black/20 font-mono">
      <div className="p-4 lg:p-6 border-b border-terminal-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-terminal-text flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-accent" />
            SYNTHETIC IDENTITY FORGE
          </h2>
          <p className="text-[10px] text-terminal-text/40 uppercase tracking-[0.2em] mt-1">Personnel Pattern Synthesis v2.4</p>
        </div>
        <Button 
          onClick={generateIdentity} 
          disabled={isGenerating}
          className="bg-accent text-black hover:bg-accent/90 font-bold tracking-widest text-xs"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Cpu className="w-4 h-4 mr-2" />
          )}
          FORGE NEW PERSONA
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {identities.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-64 flex flex-col items-center justify-center text-center space-y-4 text-terminal-text/20"
            >
              <Fingerprint className="w-12 h-12" />
              <p className="text-xs uppercase tracking-widest">No Activepersonae In Forge</p>
            </motion.div>
          ) : (
            identities.map((id) => (
              <motion.div
                key={id.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black/60 border border-terminal-border rounded-xl overflow-hidden group hover:border-accent/30 transition-colors"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                          <Users className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-terminal-text">{id.name}</h3>
                          <Badge variant="outline" className="text-[9px] border-accent/30 text-accent uppercase">{id.role}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-terminal-text/60 max-w-xl italic">"{id.bio}"</p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end gap-6 shrink-0">
                      <div className="text-right">
                        <div className="text-[9px] text-terminal-text/30 uppercase mb-1">Trust Score</div>
                        <div className="text-xl font-bold text-accent">{id.trustScore}%</div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyToClipboard(JSON.stringify(id, null, 2), id.id)}
                        className="border-terminal-border text-[10px] h-8"
                      >
                        {copiedId === id.id ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                        {copiedId === id.id ? 'COPIED' : 'EXTRACT DATA'}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-terminal-border/30">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-terminal-text/40">
                        <History className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Background History</span>
                      </div>
                      <ul className="space-y-3">
                        {id.history.map((h, i) => (
                          <li key={i} className="text-xs text-terminal-text/60 flex gap-3">
                            <span className="w-1 h-1 rounded-full bg-accent/40 mt-1.5 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-terminal-text/40">
                        <Globe className="w-3 h-3" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Digital Footprint</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {id.handles.map((h, i) => (
                          <div key={i} className="p-2 rounded bg-white/5 border border-white/5 flex items-center justify-between group/handle hover:bg-accent/5 transition-colors">
                            <div className="flex flex-col">
                              <span className="text-[8px] text-terminal-text/30 uppercase">{h.platform}</span>
                              <span className="text-[10px] text-terminal-text/80">@{h.username}</span>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover/handle:opacity-100 transition-opacity">
                              <MessageSquare className="w-3 h-3 text-accent" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-terminal-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge className="bg-emerald-500/20 text-emerald-500 border-none text-[9px]">ENGINE: NEURAL-GEN-4</Badge>
          <span className="text-[9px] text-terminal-text/20 uppercase">Persona entropy optimized</span>
        </div>
        <Shield className="w-4 h-4 text-terminal-text/10" />
      </div>
    </div>
  );
};
