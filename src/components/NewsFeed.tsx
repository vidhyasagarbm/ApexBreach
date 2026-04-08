import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, ExternalLink, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Critical Zero-Day in Linux Kernel (CVE-2024-XXXX) Disclosed",
    summary: "A new privilege escalation vulnerability has been discovered in the Linux kernel affecting versions 5.10 through 6.8. Patching is highly recommended.",
    source: "CyberSecurity News",
    time: "2h ago",
    severity: "CRITICAL",
    category: "Vulnerability"
  },
  {
    id: 2,
    title: "Major Ransomware Group 'DarkVoid' Claims Attack on Global Bank",
    summary: "The DarkVoid ransomware collective has listed a major international financial institution on their leak site, claiming to have exfiltrated 2TB of sensitive data.",
    source: "The Hacker News",
    time: "5h ago",
    severity: "HIGH",
    category: "Ransomware"
  },
  {
    id: 3,
    title: "New AI-Powered Phishing Campaign Targeting Remote Workers",
    summary: "Security researchers have identified a sophisticated phishing campaign using LLMs to generate highly personalized and convincing emails at scale.",
    source: "Infosec Magazine",
    time: "8h ago",
    severity: "MEDIUM",
    category: "Social Engineering"
  },
  {
    id: 4,
    title: "Cloud Misconfiguration Leads to Exposure of 500M Records",
    summary: "A misconfigured S3 bucket belonging to a large retail chain was found exposed to the public internet, containing customer PII and transaction history.",
    source: "BleepingComputer",
    time: "12h ago",
    severity: "HIGH",
    category: "Cloud Security"
  },
  {
    id: 5,
    title: "Quantum-Resistant Encryption Standards Finalized by NIST",
    summary: "NIST has officially released the first set of post-quantum cryptographic standards to protect data against future quantum computing threats.",
    source: "TechCrunch Security",
    time: "1d ago",
    severity: "INFO",
    category: "Cryptography"
  }
];

export const NewsFeed: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-terminal-border pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-terminal-cyan/10 flex items-center justify-center border border-terminal-cyan/20">
              <Newspaper className="w-6 h-6 text-terminal-cyan" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-tight">Cyber Intelligence Feed</h2>
              <p className="text-sm text-terminal-text/50 font-mono">Latest security disclosures and global threat reports</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-terminal-cyan/5 border border-terminal-cyan/20">
            <TrendingUp className="w-3 h-3 text-terminal-cyan" />
            <span className="text-[10px] font-mono text-terminal-cyan font-bold uppercase">Live Updates</span>
          </div>
        </div>

        <div className="grid gap-6">
          {NEWS_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative p-6 rounded-xl bg-black/40 border border-terminal-border hover:border-terminal-cyan/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-[9px] font-mono font-bold px-2 py-0.5 rounded border",
                    item.severity === 'CRITICAL' && "bg-red-500/10 text-red-500 border-red-500/20",
                    item.severity === 'HIGH' && "bg-orange-500/10 text-orange-500 border-orange-500/20",
                    item.severity === 'MEDIUM' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    item.severity === 'INFO' && "bg-terminal-green/10 text-terminal-green border-terminal-green/20"
                  )}>
                    {item.severity}
                  </span>
                  <span className="text-[10px] font-mono text-terminal-text/30 uppercase tracking-widest">{item.category}</span>
                </div>
                <div className="flex items-center gap-2 text-terminal-text/30 group-hover:text-terminal-cyan transition-colors">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-mono">{item.time}</span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-terminal-text group-hover:text-terminal-cyan transition-colors mb-3 leading-tight">
                {item.title}
              </h3>
              
              <p className="text-sm text-terminal-text/60 leading-relaxed mb-6">
                {item.summary}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
                    <AlertCircle className="w-3 h-3 text-terminal-text/40" />
                  </div>
                  <span className="text-[10px] font-mono text-terminal-text/40 uppercase">{item.source}</span>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-mono font-bold text-terminal-cyan/60 group-hover:text-terminal-cyan transition-colors">
                  READ FULL REPORT
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
