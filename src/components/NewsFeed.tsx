import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Newspaper, ExternalLink, Clock, AlertCircle, TrendingUp, X, ArrowLeft, Shield, Share2, Bookmark, Users, Activity, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { jsPDF } from 'jspdf';

const NEWS_ITEMS = [
  {
    id: 1,
    title: "Critical Zero-Day in Linux Kernel (CVE-2024-XXXX) Disclosed",
    summary: "A new privilege escalation vulnerability has been discovered in the Linux kernel affecting versions 5.10 through 6.8. Patching is highly recommended.",
    content: `### Vulnerability Overview
A critical zero-day vulnerability (CVE-2024-XXXX) has been identified in the Linux kernel's memory management subsystem. The flaw allows a local unprivileged user to gain root privileges on affected systems.

### Technical Details
The vulnerability stems from a race condition in the \`mmap\` system call implementation. By carefully timing memory allocations and deallocations, an attacker can trigger a use-after-free condition, leading to arbitrary code execution in kernel mode.

### Affected Versions
- Linux Kernel 5.10.x
- Linux Kernel 5.15.x
- Linux Kernel 6.1.x
- Linux Kernel 6.6.x
- Linux Kernel 6.8.x

### Mitigation & Remediation
- **Patching**: Update to the latest stable kernel versions (6.8.5+, 6.6.26+, 6.1.85+).
- **Workaround**: Disable unprivileged user namespaces if possible (\`sysctl -w kernel.unprivileged_userns_clone=0\`).
- **Monitoring**: Audit system calls for unusual \`mmap\` patterns.`,
    source: "CyberSecurity News",
    time: "2h ago",
    severity: "CRITICAL",
    category: "Vulnerability",
    author: "Sarah Chen",
    readTime: "4 min read"
  },
  {
    id: 2,
    title: "Major Ransomware Group 'DarkVoid' Claims Attack on Global Bank",
    summary: "The DarkVoid ransomware collective has listed a major international financial institution on their leak site, claiming to have exfiltrated 2TB of sensitive data.",
    content: `### Incident Report: DarkVoid vs. Global Finance Corp
The DarkVoid ransomware group has officially added "Global Finance Corp" to its public leak portal. The group claims to have maintained persistence in the bank's network for over 45 days.

### Exfiltrated Data
DarkVoid asserts they have stolen 2TB of data, including:
- Customer PII (Names, Addresses, SSNs)
- Internal financial audits
- SWIFT transaction logs
- Executive email correspondence

### Ransom Demand
The group is reportedly demanding $15 million in Monero (XMR) to prevent the public release of the data and provide a decryptor for the 4,000+ encrypted servers.

### Current Status
Global Finance Corp has confirmed a "cybersecurity incident" but has not yet commented on the ransom demand or the extent of the data theft. Law enforcement agencies are currently investigating.`,
    source: "The Hacker News",
    time: "5h ago",
    severity: "HIGH",
    category: "Ransomware",
    author: "Marcus Thorne",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "New AI-Powered Phishing Campaign Targeting Remote Workers",
    summary: "Security researchers have identified a sophisticated phishing campaign using LLMs to generate highly personalized and convincing emails at scale.",
    content: `### AI-Driven Social Engineering
A new wave of phishing attacks is leveraging Large Language Models (LLMs) to automate the creation of hyper-personalized lures. This campaign specifically targets remote employees in the tech and finance sectors.

### Methodology
1. **Reconnaissance**: Attackers scrape LinkedIn and company websites for employee names, roles, and recent projects.
2. **Generation**: An LLM is fed this data to generate emails that reference specific colleagues or ongoing company initiatives.
3. **Delivery**: Emails are sent from spoofed domains that closely mimic internal company addresses.
4. **Payload**: The emails contain links to fake SSO login pages designed to harvest credentials and MFA tokens.

### Key Indicators
- Unusual urgency in requests for "quick reviews" or "account verification."
- Slight discrepancies in sender email addresses (e.g., @company-it.com instead of @company.com).
- High-quality, error-free prose that lacks the typical "tells" of automated phishing.`,
    source: "Infosec Magazine",
    time: "8h ago",
    severity: "MEDIUM",
    category: "Social Engineering",
    author: "Elena Rodriguez",
    readTime: "3 min read"
  },
  {
    id: 4,
    title: "Cloud Misconfiguration Leads to Exposure of 500M Records",
    summary: "A misconfigured S3 bucket belonging to a large retail chain was found exposed to the public internet, containing customer PII and transaction history.",
    content: `### Data Exposure Alert
A security researcher has discovered an open Amazon S3 bucket containing over 500 million records belonging to "MegaRetail Inc." The bucket was accessible without any authentication.

### Data Breakdown
The exposed data includes:
- 120 million customer profiles (Email, Phone, Encrypted Passwords)
- 380 million transaction records (Last 4 digits of cards, purchase history)
- Internal API keys and configuration files

### Root Cause
The exposure was traced back to an automated deployment script that inadvertently set the bucket policy to "Public Read" during a routine infrastructure update.

### Response
MegaRetail Inc. has secured the bucket and notified the relevant data protection authorities. They are currently in the process of notifying affected customers.`,
    source: "BleepingComputer",
    time: "12h ago",
    severity: "HIGH",
    category: "Cloud Security",
    author: "David Wu",
    readTime: "5 min read"
  },
  {
    id: 5,
    title: "Quantum-Resistant Encryption Standards Finalized by NIST",
    summary: "NIST has officially released the first set of post-quantum cryptographic standards to protect data against future quantum computing threats.",
    content: `### The Post-Quantum Era Begins
NIST has reached a major milestone in the transition to quantum-resistant cryptography. After years of evaluation, the first four algorithms have been selected for standardization.

### Selected Algorithms
1. **CRYSTALS-Kyber**: For general encryption (e.g., securing websites).
2. **CRYSTALS-Dilithium**: For digital signatures.
3. **FALCON**: For digital signatures (smaller signatures).
4. **SPHINCS+**: For digital signatures (stateless hash-based).

### Why It Matters
Current encryption standards (RSA, ECC) are vulnerable to being broken by a sufficiently powerful quantum computer. While such computers don't yet exist, data encrypted today could be harvested and decrypted in the future ("Harvest Now, Decrypt Later").

### Implementation Timeline
NIST encourages organizations to begin inventorying their current cryptographic usage and planning for the migration to these new standards over the next 3-5 years.`,
    source: "TechCrunch Security",
    time: "1d ago",
    severity: "INFO",
    category: "Cryptography",
    author: "Dr. Aris Thorne",
    readTime: "8 min read"
  }
];

export const NewsFeed: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<typeof NEWS_ITEMS[0] | null>(null);

  const handleExportPDF = (item: typeof NEWS_ITEMS[0]) => {
    const doc = new jsPDF();
    
    // Header background (dark theme simulation)
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 255, 65); // Terminal Green
    doc.text("APEXBREACH INTEL REPORT", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`ID: ${item.id} | CONFIDENTIAL`, 20, 30);
    
    // Report Title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(item.title, 20, 55, { maxWidth: 170 });
    
    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Severity: ${item.severity} | Category: ${item.category}`, 20, 70);
    doc.text(`Author: ${item.author} | Source: ${item.source} | Date: ${item.time}`, 20, 75);
    
    doc.setDrawColor(0, 255, 65);
    doc.line(20, 80, 190, 80);
    
    // Content
    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);
    
    // Clean up content for PDF
    const cleanContent = item.content
      .replace(/### /g, '\n\n')
      .replace(/- /g, '• ')
      .trim();
      
    const splitText = doc.splitTextToSize(cleanContent, 170);
    doc.text(splitText, 20, 95);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by ApexBreach Intelligence Platform", 20, 285);
    
    doc.save(`ApexBreach_Intel_${item.id}.pdf`);
  };

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-terminal-border pb-6 gap-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-terminal-green/10 flex items-center justify-center border border-terminal-green/20 shrink-0">
              <Newspaper className="w-5 h-5 lg:w-6 lg:h-6 text-terminal-green" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-terminal-text uppercase tracking-tight">Cyber Intel Feed</h2>
              <p className="text-[10px] lg:text-base text-terminal-text/50 font-mono">Latest security disclosures</p>
            </div>
          </div>
          <div className="flex items-center self-start sm:self-auto gap-2 px-3 py-1.5 rounded-full bg-terminal-green/5 border border-terminal-green/20">
            <TrendingUp className="w-3 h-3 text-terminal-green" />
            <span className="text-[10px] lg:text-xs font-mono text-terminal-green font-bold uppercase">Live Updates</span>
          </div>
        </div>

        <div className="grid gap-4 lg:gap-6">
          {NEWS_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedItem(item)}
              className="group relative p-4 lg:p-6 rounded-xl bg-black/40 border border-terminal-border hover:border-terminal-green/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3 lg:mb-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <span className={cn(
                    "text-[8px] lg:text-[10px] font-mono font-bold px-1.5 lg:px-2 py-0.5 rounded border",
                    item.severity === 'CRITICAL' && "bg-red-500/10 text-red-500 border-red-500/20",
                    item.severity === 'HIGH' && "bg-orange-500/10 text-orange-500 border-orange-500/20",
                    item.severity === 'MEDIUM' && "bg-blue-500/10 text-blue-500 border-blue-500/20",
                    item.severity === 'INFO' && "bg-terminal-green/10 text-terminal-green border-terminal-green/20"
                  )}>
                    {item.severity}
                  </span>
                  <span className="text-[9px] lg:text-xs font-mono text-terminal-text/30 uppercase tracking-widest">{item.category}</span>
                </div>
                <div className="flex items-center gap-1.5 lg:gap-2 text-terminal-text/30 group-hover:text-terminal-green transition-colors">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] lg:text-xs font-mono">{item.time}</span>
                </div>
              </div>

              <h3 className="text-base lg:text-xl font-bold text-terminal-text group-hover:text-terminal-green transition-colors mb-2 lg:mb-3 leading-tight">
                {item.title}
              </h3>
              
              <p className="text-xs lg:text-base text-terminal-text/60 leading-relaxed mb-4 lg:mb-6">
                {item.summary}
              </p>

              <div className="flex items-center justify-between pt-3 lg:pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-white/5 flex items-center justify-center">
                    <AlertCircle className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-terminal-text/40" />
                  </div>
                  <span className="text-[9px] lg:text-xs font-mono text-terminal-text/40 uppercase">{item.source}</span>
                </div>
                <button className="flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-xs font-mono font-bold text-terminal-green/60 group-hover:text-terminal-green transition-colors">
                  <span className="hidden xs:inline">READ FULL REPORT</span>
                  <span className="xs:hidden">READ</span>
                  <ExternalLink className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 lg:p-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-4xl h-full max-h-[90vh] bg-obsidian-bg border border-terminal-border rounded-2xl flex flex-col overflow-hidden shadow-2xl shadow-terminal-green/10"
            >
              {/* Modal Header */}
              <div className="p-4 lg:p-6 border-b border-terminal-border flex items-center justify-between bg-black/40">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedItem(null)}
                  className="text-terminal-text/60 hover:text-terminal-green gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-mono text-xs uppercase tracking-widest">Back to Feed</span>
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-terminal-text/40 hover:text-terminal-green">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-terminal-text/40 hover:text-terminal-green">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-4 bg-terminal-border mx-2" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setSelectedItem(null)}
                    className="h-8 w-8 text-terminal-text/40 hover:text-red-500"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-12">
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge className={cn(
                        "font-mono text-[10px] font-bold",
                        selectedItem.severity === 'CRITICAL' && "bg-red-500 text-white",
                        selectedItem.severity === 'HIGH' && "bg-orange-500 text-white",
                        selectedItem.severity === 'MEDIUM' && "bg-blue-500 text-white",
                        selectedItem.severity === 'INFO' && "bg-terminal-green text-black"
                      )}>
                        {selectedItem.severity}
                      </Badge>
                      <span className="text-xs font-mono text-terminal-green uppercase tracking-widest">{selectedItem.category}</span>
                    </div>
                    <h1 className="text-2xl lg:text-4xl font-bold text-terminal-text leading-tight tracking-tight">
                      {selectedItem.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-terminal-text/40 font-mono text-xs pt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{selectedItem.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        <span>By {selectedItem.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        <span>{selectedItem.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5" />
                        <span>{selectedItem.readTime}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-terminal-border" />

                  <div className="prose prose-invert prose-terminal max-w-none">
                    <div className="text-terminal-text/80 leading-relaxed space-y-6 text-lg">
                      {selectedItem.content.split('\n\n').map((paragraph, i) => {
                        if (paragraph.startsWith('###')) {
                          return <h3 key={i} className="text-xl font-bold text-terminal-green pt-4 uppercase tracking-wider">{paragraph.replace('### ', '')}</h3>;
                        }
                        if (paragraph.startsWith('- ')) {
                          return (
                            <ul key={i} className="space-y-2 list-disc pl-5">
                              {paragraph.split('\n').map((item, j) => (
                                <li key={j} className="text-terminal-text/70">{item.replace('- ', '')}</li>
                              ))}
                            </ul>
                          );
                        }
                        if (paragraph.match(/^\d+\./)) {
                          return (
                            <div key={i} className="space-y-4">
                              {paragraph.split('\n').map((item, j) => (
                                <div key={j} className="flex gap-4">
                                  <span className="text-terminal-green font-bold font-mono">{item.split('.')[0]}.</span>
                                  <p className="text-terminal-text/70">{item.split('. ')[1]}</p>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return <p key={i}>{paragraph}</p>;
                      })}
                    </div>
                  </div>

                  <div className="pt-12 pb-6">
                    <div className="p-6 rounded-xl bg-terminal-green/5 border border-terminal-green/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-1 text-center sm:text-left">
                        <h4 className="text-sm font-bold text-terminal-green uppercase tracking-widest">Share Intelligence</h4>
                        <p className="text-xs text-terminal-text/40 font-mono">Distribute this report to your security team.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleExportPDF(selectedItem)}
                          className="border-terminal-border hover:bg-terminal-green/10 hover:text-terminal-green"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          EXPORT PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
