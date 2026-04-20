import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Zap, 
  Target, 
  Globe, 
  Workflow, 
  Brain, 
  ShieldCheck, 
  EyeOff, 
  Search, 
  Users, 
  Radio, 
  AlertTriangle, 
  BarChart3, 
  Newspaper,
  Terminal,
  Cpu,
  Info,
  ClipboardList,
  Activity
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    title: 'Offensive Handbook',
    description: 'Comprehensive database of TTPs (Tactics, Techniques, and Procedures) mapped to the MITRE ATT&CK framework.',
    icon: Shield,
    color: 'text-blue-500',
    category: 'Intelligence'
  },
  {
    title: 'APT Emulation Engine',
    description: 'Simulate specific threat actor behaviors and generate tactical playbooks for elite groups like APT28 and Lazarus.',
    icon: Target,
    color: 'text-cyan-500',
    category: 'Offensive'
  },
  {
    title: 'Stealth & Evasion Lab',
    description: 'Advanced payload obfuscation suite using polymorphic encoding and process hollowing to bypass modern EDR/AV.',
    icon: EyeOff,
    color: 'text-purple-500',
    category: 'Offensive'
  },
  {
    title: 'OSINT Recon Engine',
    description: 'AI-driven predictive intelligence for attack surface mapping, subdomain discovery, and tech-stack profiling.',
    icon: Globe,
    color: 'text-emerald-500',
    category: 'Intelligence'
  },
  {
    title: 'Automated Exploit Chainer',
    description: 'Correlate security findings into logical attack paths, identifying the path of least resistance to critical assets.',
    icon: Workflow,
    color: 'text-orange-500',
    category: 'Offensive'
  },
  {
    title: 'AI Red Team',
    description: 'Interactive AI agent designed for scenario-based offensive security testing and tactical advice.',
    icon: Brain,
    color: 'text-pink-500',
    category: 'AI'
  },
  {
    title: 'Security Auditor',
    description: 'Automated SAST/DAST analysis engine for identifying vulnerabilities in source code and live endpoints.',
    icon: ShieldCheck,
    color: 'text-yellow-500',
    category: 'Audit'
  },
  {
    title: 'Weaponization Armory',
    description: 'Unified pipeline for generating, encoding, and managing offensive payloads and weaponized findings.',
    icon: Zap,
    color: 'text-red-500',
    category: 'Offensive'
  },
  {
    title: 'Social Engineering Suite',
    description: 'Tools for crafting sophisticated phishing campaigns and social engineering scenarios.',
    icon: Users,
    color: 'text-indigo-500',
    category: 'Offensive'
  },
  {
    title: 'Dark Web Monitor',
    description: 'Real-time monitoring of underground forums and leak sites for compromised credentials and data breaches.',
    icon: Radio,
    color: 'text-slate-500',
    category: 'Intelligence'
  },
  {
    title: 'CVE Intelligence',
    description: 'Live feed and analysis of the latest Common Vulnerabilities and Exposures with exploitation insights.',
    icon: AlertTriangle,
    color: 'text-orange-400',
    category: 'Intelligence'
  },
  {
    title: 'Global Threat Map',
    description: 'Real-time visualization of global cyber attacks and incident telemetry.',
    icon: Globe,
    color: 'text-accent',
    category: 'Intelligence'
  }
];

export const About: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-black/40 p-6 lg:p-12 overflow-y-auto custom-scrollbar min-h-0">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono font-bold uppercase tracking-widest"
          >
            <Info className="w-4 h-4" />
            Platform Documentation
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-bold text-terminal-text tracking-tighter"
          >
            APEX<span className="text-accent">BREACH</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-terminal-text/60 max-w-2xl mx-auto leading-relaxed"
          >
            The next-generation offensive security platform designed for elite red teams and security researchers. ApexBreach combines AI-driven intelligence with tactical execution tools.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="h-full bg-black/40 border-terminal-border p-6 hover:border-accent/30 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-3 rounded-xl bg-white/5", feature.color)}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-terminal-border uppercase">
                    {feature.category}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-terminal-text mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-terminal-text/40 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Methodology Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-terminal-border" />
            <h2 className="text-xl font-bold text-terminal-text uppercase tracking-widest shrink-0">Offensive Methodology</h2>
            <div className="h-[1px] flex-1 bg-terminal-border" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '01', title: 'Reconnaissance', desc: 'Passive intelligence gathering and attack surface mapping using AI-driven OSINT.', icon: Search },
              { step: '02', title: 'Weaponization', desc: 'Crafting custom payloads and obfuscating code in the Stealth Lab to evade detection.', icon: Zap },
              { step: '03', title: 'Exploitation', desc: 'Executing tactical playbooks and chaining vulnerabilities to achieve objectives.', icon: Target },
              { step: '04', title: 'Analysis', desc: 'Post-operation review and automated reporting of security posture improvements.', icon: BarChart3 },
            ].map((m, i) => (
              <Card key={i} className="bg-black/40 border-terminal-border p-6 space-y-4">
                <div className="text-2xl font-black text-accent/20 font-mono">{m.step}</div>
                <div className="flex items-center gap-2 text-terminal-text">
                  <m.icon className="w-4 h-4 text-accent" />
                  <h3 className="font-bold uppercase text-xs">{m.title}</h3>
                </div>
                <p className="text-xs text-terminal-text/40 leading-relaxed">{m.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* AI Integration Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Badge className="bg-pink-500/10 text-pink-500 border-pink-500/20 uppercase font-mono text-[10px]">Neural Core</Badge>
            <h2 className="text-3xl font-bold text-terminal-text tracking-tight">AI-Augmented Cyber Operations</h2>
            <p className="text-terminal-text/60 leading-relaxed">
              ApexBreach leverages the **Gemini 1.5 Pro** engine to provide real-time tactical advice, automated code analysis, and predictive threat modeling. Unlike static tools, our AI core understands the context of an engagement, suggesting the most effective TTPs based on the target's specific technology stack and defensive posture.
            </p>
            <ul className="space-y-3">
              {[
                'Automated payload obfuscation logic generation',
                'Real-time TTP explanation and deep-dives',
                'Predictive attack surface mapping',
                'Natural language scenario analysis'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-terminal-text/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-video rounded-3xl bg-gradient-to-br from-pink-500/10 to-accent/10 border border-white/5 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/ai-tech/800/600')] opacity-20 grayscale" />
            <Cpu className="w-24 h-24 text-accent animate-pulse relative z-10" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl">
              <div className="flex items-center justify-between text-[10px] font-mono text-terminal-text/40 uppercase">
                <span>Neural Processing Unit</span>
                <span className="text-emerald-500">Active</span>
              </div>
              <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-accent"
                  animate={{ width: ['20%', '80%', '40%', '90%', '60%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Guidelines */}
        <div className="p-8 lg:p-12 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-widest">Responsible Use & Ethics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-sm text-terminal-text/60 leading-relaxed">
              ApexBreach is strictly intended for **authorized security testing, educational purposes, and defensive research**. The tools and techniques provided within this platform can cause significant damage if used improperly or without explicit permission from the target system owners.
            </p>
            <div className="space-y-4">
              <div className="text-xs font-bold text-terminal-text uppercase">The ApexBreach Code:</div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Always obtain written authorization before testing.',
                  'Never use these tools for illegal or malicious activities.',
                  'Prioritize the stability and integrity of target systems.',
                  'Report vulnerabilities responsibly to the affected parties.'
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-terminal-text/40">
                    <Shield className="w-3 h-3 text-red-500/50" />
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest text-center">Deployment Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Select TTP', desc: 'Browse the Offensive Handbook to select a tactic or technique based on your mission objectives.', icon: ClipboardList },
              { title: 'Analyze & Weaponize', desc: 'Use the AI Red Team to analyze the technique, then send it to the Armory for payload generation.', icon: Zap },
              { title: 'Execute & Monitor', desc: 'Deploy your weaponized findings and monitor global threat telemetry via the Threat Map.', icon: Activity },
            ].map((step, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-black flex items-center justify-center font-bold font-mono text-sm shadow-lg shadow-accent/20">
                  {i + 1}
                </div>
                <div className="flex items-center gap-3 text-accent">
                  <step.icon className="w-5 h-5" />
                  <h3 className="font-bold uppercase text-xs tracking-wider">{step.title}</h3>
                </div>
                <p className="text-xs text-terminal-text/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest">Obsidian Core Architecture</h2>
            <p className="text-terminal-text/60 leading-relaxed">
              ApexBreach is built on the **Obsidian Core** framework—a high-performance, low-latency architecture designed for real-time data processing and AI orchestration. Our stack is optimized for stealth, speed, and reliability.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Frontend', value: 'React 19 + Vite' },
                { label: 'Styling', value: 'Tailwind CSS 4.0' },
                { label: 'Intelligence', value: 'Gemini 1.5 Pro' },
                { label: 'Database', value: 'Firestore Real-time' },
                { label: 'Animations', value: 'Motion 12' },
                { label: 'Icons', value: 'Lucide React' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-terminal-text/40 uppercase">{item.label}</span>
                  <span className="text-[10px] font-mono text-accent font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <Card className="bg-accent/5 border-accent/20 p-6 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <Shield className="w-5 h-5" />
              <h3 className="font-bold uppercase text-xs">Security Posture</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-terminal-text/40">
                <span>Encryption</span>
                <span>AES-256</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-terminal-text/40">
                <span>Anonymization</span>
                <span>Active</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[85%]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Technical Glossary */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest">Tactical Glossary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { term: 'TTP', def: 'Tactics, Techniques, and Procedures. The "how-to" of threat actor behavior.' },
              { term: 'OSINT', def: 'Open Source Intelligence. Data collected from publicly available sources.' },
              { term: 'APT', def: 'Advanced Persistent Threat. A stealthy threat actor, typically a state-sponsored group.' },
              { term: 'Weaponization', def: 'The process of coupling an exploit with a delivery mechanism.' },
              { term: 'Payload', def: 'The part of the malware which performs the malicious action.' },
              { term: 'Obfuscation', def: 'The practice of making code difficult for humans and scanners to understand.' },
            ].map((g, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b border-white/5 pb-4">
                <span className="text-accent font-mono font-bold text-xs shrink-0 w-24">[{g.term}]</span>
                <p className="text-xs text-terminal-text/60 leading-relaxed">{g.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Guide Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest text-center">Operational User Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-accent font-bold uppercase text-sm">1. Intelligence Gathering</h3>
              <p className="text-xs text-terminal-text/60 leading-relaxed">
                Start by using the **OSINT Recon Engine** to map the target's attack surface. Combine this with the **Dark Web Monitor** to identify potential credential leaks or previous breaches associated with the target domain.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-accent font-bold uppercase text-sm">2. Vulnerability Analysis</h3>
              <p className="text-xs text-terminal-text/60 leading-relaxed">
                Cross-reference your findings with the **CVE Intelligence** feed. Use the **Security Auditor** to perform deep scans on identified endpoints or source code repositories to find exploitable weaknesses.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-accent font-bold uppercase text-sm">3. Tactical Planning</h3>
              <p className="text-xs text-terminal-text/60 leading-relaxed">
                Consult the **Offensive Handbook** for MITRE-mapped TTPs. Use the **AI Red Team** to simulate various attack scenarios and get tactical advice on the most effective path forward.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-accent font-bold uppercase text-sm">4. Execution & Evasion</h3>
              <p className="text-xs text-terminal-text/60 leading-relaxed">
                Generate custom payloads in the **Weaponization Armory**. If the target has advanced defenses, use the **Stealth & Evasion Lab** to apply polymorphic obfuscation to your payloads before deployment.
              </p>
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest">Platform Roadmap</h2>
          <div className="space-y-4">
            {[
              { phase: 'Phase 3 (Q3 2026)', title: 'Multi-Agent Orchestration', desc: 'Deploy multiple AI agents to coordinate complex, multi-stage attack chains autonomously.' },
              { phase: 'Phase 4 (Q4 2026)', title: 'Hardware Integration', desc: 'Direct support for tactical hardware interfaces (SDR, WiFi Pineapple, Rubber Ducky) via WebUSB.' },
              { phase: 'Phase 5 (2027)', title: 'Quantum-Resistant Lab', desc: 'Research and development of post-quantum cryptographic evasion and exploitation techniques.' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="shrink-0 w-32">
                  <div className="text-[10px] font-mono text-accent font-bold uppercase">{item.phase}</div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-terminal-text">{item.title}</h4>
                  <p className="text-xs text-terminal-text/40">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'Is ApexBreach a replacement for Metasploit?', a: 'No. ApexBreach is a high-level orchestration and intelligence platform that can work alongside traditional tools like Metasploit or Cobalt Strike.' },
              { q: 'How does the AI handle sensitive data?', a: 'All AI processing is done via secure, encrypted channels. We do not store or train on your tactical engagement data.' },
              { q: 'Can I use this for bug bounty hunting?', a: 'Yes, but ensure you are strictly following the program\'s rules of engagement and ethical guidelines.' },
              { q: 'What is the "Obsidian Core"?', a: 'It is our proprietary underlying engine that handles real-time synchronization, AI state management, and tactical telemetry.' },
            ].map((faq, i) => (
              <Card key={i} className="bg-black/40 border-terminal-border p-6 space-y-3">
                <h4 className="text-sm font-bold text-accent">Q: {faq.q}</h4>
                <p className="text-xs text-terminal-text/60 leading-relaxed">A: {faq.a}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-accent uppercase">AI Model: Gemini 1.5 Pro</h4>
                <p className="text-xs text-terminal-text/60 leading-relaxed">
                  Utilizing the latest multimodal capabilities for deep context understanding. Context window supports up to 2M tokens, allowing for analysis of entire codebases or complex network logs in a single pass.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-accent uppercase">Real-time Synchronization</h4>
                <p className="text-xs text-terminal-text/60 leading-relaxed">
                  Powered by Firestore Real-time SDK, ensuring that tactical data, scenario analyses, and threat telemetry are synchronized across all active sessions with sub-100ms latency.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-accent uppercase">Offensive Data Mapping</h4>
                <p className="text-xs text-terminal-text/60 leading-relaxed">
                  Full integration with MITRE ATT&CK® v14.1. Techniques are mapped to tactical playbooks, Kali Linux toolsets, and automated exploit chains.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-accent uppercase">Security & Privacy</h4>
                <p className="text-xs text-terminal-text/60 leading-relaxed">
                  End-to-end encryption for all tactical data. User authentication via Firebase Auth with mandatory multi-factor support available for enterprise deployments.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Ecosystem */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest text-center">Integration Ecosystem</h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Splunk / Sentinel', type: 'SIEM Integration', icon: Activity },
              { name: 'CrowdStrike / SentinelOne', type: 'EDR Evasion', icon: Shield },
              { name: 'Jira / ServiceNow', type: 'SOAR Workflow', icon: ClipboardList },
              { name: 'Metasploit / Cobalt Strike', type: 'Framework Sync', icon: Terminal },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 text-center space-y-2">
                <item.icon className="w-5 h-5 text-accent mx-auto" />
                <div className="text-[10px] font-bold text-terminal-text uppercase tracking-tighter">{item.name}</div>
                <div className="text-[8px] font-mono text-terminal-text/30 uppercase">{item.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance & Standards Mapping */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest">Compliance & Standards Mapping</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { standard: 'NIST CSF', control: 'ID.RA, PR.IP', desc: 'Supports Risk Assessment and Information Protection through automated auditing.' },
              { standard: 'ISO/IEC 27001', control: 'A.12.6.1', desc: 'Assists in Management of Technical Vulnerabilities via continuous CVE monitoring.' },
              { standard: 'SOC2 Type II', control: 'CC7.1, CC7.2', desc: 'Provides evidence for system monitoring and vulnerability management controls.' },
            ].map((c, i) => (
              <div key={i} className="p-6 rounded-2xl bg-accent/5 border border-accent/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-accent">{c.standard}</span>
                  <Badge variant="outline" className="text-[8px] font-mono border-accent/20 text-accent/60">{c.control}</Badge>
                </div>
                <p className="text-[10px] text-terminal-text/60 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Changelog & Version History */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest shrink-0">Version History</h2>
            <div className="h-[1px] flex-1 bg-terminal-border" />
          </div>
          <div className="space-y-4">
            {[
              { version: 'v2.4.0', date: '2026-04-10', changes: ['Integrated Gemini 1.5 Pro Neural Core', 'Added Stealth & Evasion Lab', 'New APT28 Tactical Playbook'] },
              { version: 'v2.3.5', date: '2026-03-25', changes: ['Enhanced OSINT Recon Engine', 'Added Dark Web Monitor real-time feed', 'Improved payload obfuscation algorithms'] },
              { version: 'v2.2.0', date: '2026-02-15', changes: ['Initial release of Obsidian Core Architecture', 'MITRE ATT&CK v14.1 mapping', 'Weaponization Armory beta'] },
            ].map((v, i) => (
              <div key={i} className="relative pl-8 border-l border-terminal-border group">
                <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-terminal-border group-hover:bg-accent transition-colors" />
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-terminal-text">{v.version}</span>
                  <span className="text-[10px] font-mono text-terminal-text/30">{v.date}</span>
                </div>
                <ul className="space-y-1">
                  {v.changes.map((change, ci) => (
                    <li key={ci} className="text-[10px] text-terminal-text/50 flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-accent/30" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Community & Research Contribution */}
        <div className="p-8 lg:p-12 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 space-y-6">
          <div className="flex items-center gap-3 text-emerald-500">
            <Users className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-widest">Community & Research</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-sm text-terminal-text/60 leading-relaxed">
              ApexBreach is more than a tool; it's a research initiative. We encourage security researchers to contribute custom TTPs, report engine bugs, and share tactical insights. Together, we can build a more resilient digital frontier.
            </p>
            <div className="flex flex-col justify-center gap-4">
              <Button variant="outline" className="border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 uppercase font-mono text-xs">
                Submit Tactical Finding
              </Button>
              <Button variant="outline" className="border-terminal-border text-terminal-text/40 hover:bg-white/5 uppercase font-mono text-xs">
                Join Research Forum
              </Button>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-8 lg:p-12 rounded-3xl bg-accent/5 border border-accent/10 text-center space-y-6"
        >
          <h2 className="text-2xl font-bold text-terminal-text uppercase tracking-widest">Our Mission</h2>
          <p className="text-terminal-text/60 max-w-3xl mx-auto leading-relaxed italic">
            "To empower security professionals with the most advanced, AI-augmented offensive capabilities, enabling them to stay ahead of evolving threat landscapes and secure the digital frontier through proactive exploration."
          </p>
          <div className="flex items-center justify-center gap-8 pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">14+</div>
              <div className="text-[10px] font-mono text-terminal-text/30 uppercase">Modules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">AI</div>
              <div className="text-[10px] font-mono text-terminal-text/30 uppercase">Augmented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">24/7</div>
              <div className="text-[10px] font-mono text-terminal-text/30 uppercase">Intelligence</div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <div className="text-center pb-12">
          <p className="text-[10px] font-mono text-terminal-text/20 uppercase tracking-[0.2em]">
            ApexBreach v2.4.0 // Offensive Security Framework // Restricted Access
          </p>
        </div>
      </div>
    </div>
  );
};
