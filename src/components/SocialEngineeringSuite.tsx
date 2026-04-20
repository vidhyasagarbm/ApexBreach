import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Link as LinkIcon, 
  Users, 
  BarChart3, 
  Send, 
  Eye, 
  Copy, 
  ShieldAlert, 
  Globe, 
  Smartphone, 
  Laptop,
  Lock,
  ChevronRight,
  Plus,
  Trash2,
  ExternalLink,
  MousePointer2,
  Mic,
  Volume2,
  VolumeX,
  Play,
  Square,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface PhishingTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'CREDENTIAL_HARVEST' | 'MALWARE_DELIVERY' | 'URGENT_ACTION';
  difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
  preview: string;
}

const TEMPLATES: PhishingTemplate[] = [
  {
    id: 't-1',
    name: 'Microsoft 365 Security Alert',
    subject: 'Action Required: Unusual sign-in activity detected',
    category: 'CREDENTIAL_HARVEST',
    difficulty: 'LOW',
    preview: 'We detected a sign-in from an unrecognized device. If this was not you, please click here to secure your account...'
  },
  {
    id: 't-2',
    name: 'IT Service Desk: Password Reset',
    subject: 'Your corporate password expires in 24 hours',
    category: 'CREDENTIAL_HARVEST',
    difficulty: 'MEDIUM',
    preview: 'Your network password is set to expire. Please use the link below to update your credentials and avoid lockout...'
  },
  {
    id: 't-3',
    name: 'HR: New Policy Update',
    subject: 'Mandatory: Review updated remote work policy',
    category: 'MALWARE_DELIVERY',
    difficulty: 'HIGH',
    preview: 'Please find the attached PDF document containing the updated 2026 remote work guidelines. All employees must sign...'
  },
  {
    id: 't-4',
    name: 'LinkedIn: New Connection',
    subject: 'You have a new connection request from a recruiter',
    category: 'CREDENTIAL_HARVEST',
    difficulty: 'LOW',
    preview: 'A Senior Talent Acquisition Manager at Global Tech Corp wants to connect with you. View their profile and accept...'
  },
  {
    id: 't-5',
    name: 'Finance: Invoice Overdue',
    subject: 'URGENT: Invoice #INV-2026-991 is past due',
    category: 'URGENT_ACTION',
    difficulty: 'MEDIUM',
    preview: 'Our records show that payment for invoice #INV-2026-991 has not been received. Please review the attached statement...'
  },
  {
    id: 't-6',
    name: 'IT: System Maintenance',
    subject: 'Scheduled Maintenance: Temporary system downtime',
    category: 'MALWARE_DELIVERY',
    difficulty: 'HIGH',
    preview: 'We will be performing critical system maintenance tonight. Please download and run the diagnostic tool to ensure...'
  },
  {
    id: 't-7',
    name: 'Security: Unauthorized Login',
    subject: 'Security Alert: Login attempt from Moscow, RU',
    category: 'CREDENTIAL_HARVEST',
    difficulty: 'HIGH',
    preview: 'An unauthorized login attempt was blocked from an IP address in Moscow. If this was not you, reset your password...'
  },
  {
    id: 't-8',
    name: 'Amazon: Order Issue',
    subject: 'Problem with your recent Amazon.com order',
    category: 'URGENT_ACTION',
    difficulty: 'LOW',
    preview: 'We are having trouble processing your recent order. Please verify your payment information to avoid cancellation...'
  }
];

export const SocialEngineeringSuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'templates' | 'links' | 'campaigns' | 'analytics' | 'vishing'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<PhishingTemplate | null>(null);
  const [targetUrl, setTargetUrl] = useState('https://portal.office.com/login');
  const [maskedUrl, setMaskedUrl] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  
  // Vishing State
  const [vishingText, setVishingText] = useState("Hello, this is John from the IT Security department. We've detected an unusual login attempt on your account and need you to verify your credentials immediately to avoid a full account lockout. Please go to the security portal link I'm sending you now.");
  const [isPlayingVishing, setIsPlayingVishing] = useState(false);
  const [vishingVoice, setVishingVoice] = useState<'male' | 'female'>('male');

  const handleGenerateLink = () => {
    setIsGeneratingLink(true);
    setTimeout(() => {
      const randomId = Math.random().toString(36).substring(7);
      setMaskedUrl(`https://secure-verify.net/auth/${randomId}`);
      setIsGeneratingLink(false);
    }, 1500);
  };

  const handlePlayVishing = () => {
    if (isPlayingVishing) {
      window.speechSynthesis.cancel();
      setIsPlayingVishing(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(vishingText);
    
    // Attempt to pick a decent voice
    const voices = window.speechSynthesis.getVoices();
    if (vishingVoice === 'male') {
      utterance.voice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Male')) || null;
      utterance.pitch = 0.9;
      utterance.rate = 0.95;
    } else {
      utterance.voice = voices.find(v => v.name.includes('Google UK English') || v.name.includes('Female')) || null;
      utterance.pitch = 1.1;
      utterance.rate = 1.0;
    }

    utterance.onend = () => setIsPlayingVishing(false);
    utterance.onerror = () => setIsPlayingVishing(false);
    
    setIsPlayingVishing(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-full flex flex-col bg-black/20 overflow-hidden min-h-0">
      {/* Header */}
      <div className="p-4 lg:p-8 border-b border-terminal-border bg-obsidian-bg/80 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
              <Users className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-terminal-text uppercase tracking-tight">Social Engineering Suite</h2>
              <p className="text-[10px] lg:text-sm font-mono text-terminal-text/50">Human-centric vulnerability exploitation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-obsidian-card p-1 rounded-lg border border-terminal-border overflow-x-auto custom-scrollbar">
            {[
              { id: 'templates', label: 'Templates', icon: Mail },
              { id: 'vishing', label: 'Vishing AI', icon: Mic },
              { id: 'links', label: 'Link Forge', icon: LinkIcon },
              { id: 'campaigns', label: 'Campaigns', icon: Send },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={cn(
                  "px-3 lg:px-4 py-1.5 rounded-md text-[9px] lg:text-[10px] font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap",
                  activeSubTab === tab.id 
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20" 
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar min-h-0">
        <AnimatePresence mode="wait">
          {activeSubTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TEMPLATES.map((template) => (
                    <Card 
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template);
                        // Optional: scroll to preview on mobile
                        if (window.innerWidth < 1024) {
                          const previewEl = document.getElementById('template-preview');
                          previewEl?.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={cn(
                        "p-4 lg:p-5 bg-black/40 border-terminal-border hover:border-red-500/30 transition-all cursor-pointer group",
                        selectedTemplate?.id === template.id && "border-red-500/50 bg-red-500/5"
                      )}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline" className="text-[10px] font-mono border-red-500/20 text-red-400">
                          {template.category.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <ShieldAlert className={cn(
                            "w-3.5 h-3.5",
                            template.difficulty === 'LOW' ? "text-terminal-green" :
                            template.difficulty === 'MEDIUM' ? "text-orange-500" : "text-red-500"
                          )} />
                          <span className="text-[10px] font-mono text-terminal-text/40">{template.difficulty}</span>
                        </div>
                      </div>
                      <h3 className="text-sm font-bold text-terminal-text group-hover:text-red-400 transition-colors mb-2">{template.name}</h3>
                      <p className="text-xs text-terminal-text/50 line-clamp-2 italic">"{template.preview}"</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-6" id="template-preview">
                {selectedTemplate ? (
                  <Card className="p-6 bg-obsidian-card border-terminal-border lg:sticky lg:top-0">
                    <div className="flex items-center gap-2 mb-6">
                      <Eye className="w-4 h-4 text-red-500" />
                      <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Template Preview</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-terminal-text/30 uppercase">Subject</label>
                        <div className="p-3 rounded bg-black/40 border border-terminal-border text-xs text-terminal-text">
                          {selectedTemplate.subject}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-terminal-text/30 uppercase">Body Content</label>
                        <div className="p-4 rounded bg-black/40 border border-terminal-border text-xs text-terminal-text/70 leading-relaxed h-48 overflow-y-auto custom-scrollbar">
                          {selectedTemplate.preview}
                          <br /><br />
                          [PHISHING_LINK_PLACEHOLDER]
                          <br /><br />
                          Regards,<br />
                          System Administration
                        </div>
                      </div>
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-xs h-10">
                        USE THIS TEMPLATE
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-12 border border-dashed border-terminal-border rounded-2xl opacity-30">
                    <Mail className="w-12 h-12 mb-4" />
                    <p className="text-xs font-mono uppercase tracking-widest">Select a template to preview</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'links' && (
            <motion.div
              key="links"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-terminal-text">Link Forge</h3>
                <p className="text-sm text-terminal-text/50">Generate obfuscated URLs and tracking pixels for your campaigns.</p>
              </div>

              <Card className="p-4 lg:p-8 bg-obsidian-card border-terminal-border space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold text-terminal-text/50 uppercase tracking-widest">Destination URL</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input 
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        className="bg-black/40 border-terminal-border text-terminal-text h-11 lg:h-12 flex-1"
                        placeholder="https://your-harvest-site.com"
                      />
                      <Button 
                        onClick={handleGenerateLink}
                        disabled={isGeneratingLink}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 h-11 lg:h-12 font-bold w-full sm:w-auto"
                      >
                        {isGeneratingLink ? "FORGING..." : "FORGE LINK"}
                      </Button>
                    </div>
                  </div>

                  {maskedUrl && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 rounded-xl bg-red-500/5 border border-red-500/20 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest">Generated Malicious Link</span>
                        <Badge className="bg-red-500 text-white text-[10px]">STEALTH: HIGH</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 p-3 rounded bg-black/60 border border-red-500/30 font-mono text-sm text-red-400 truncate">
                          {maskedUrl}
                        </div>
                        <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-11 px-4">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                <Separator className="bg-terminal-border" />

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-terminal-border text-center space-y-2">
                    <Globe className="w-5 h-5 text-terminal-cyan mx-auto" />
                    <div className="text-[10px] font-mono text-terminal-text/40 uppercase">Domain Masking</div>
                    <div className="text-xs font-bold text-terminal-text">ENABLED</div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-terminal-border text-center space-y-2">
                    <Smartphone className="w-5 h-5 text-terminal-cyan mx-auto" />
                    <div className="text-[10px] font-mono text-terminal-text/40 uppercase">Device Fingerprint</div>
                    <div className="text-xs font-bold text-terminal-text">ACTIVE</div>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-terminal-border text-center space-y-2">
                    <Lock className="w-5 h-5 text-terminal-cyan mx-auto" />
                    <div className="text-[10px] font-mono text-terminal-text/40 uppercase">SSL Certificate</div>
                    <div className="text-xs font-bold text-terminal-text">VALID</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeSubTab === 'campaigns' && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-terminal-text">Active Campaigns</h3>
                <Button className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs">
                  <Plus className="w-4 h-4 mr-2" />
                  NEW CAMPAIGN
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { name: 'Operation: Blue Harvest', target: 'Global Finance Corp', status: 'RUNNING', clicks: 142, success: '12%' },
                  { name: 'IT Support Phish', target: 'Internal Staff', status: 'PAUSED', clicks: 45, success: '8%' },
                ].map((campaign, i) => (
                  <Card key={i} className="p-4 lg:p-6 bg-black/40 border-terminal-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-red-500/30 transition-all">
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0">
                        <Send className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm lg:text-base font-bold text-terminal-text group-hover:text-red-400 transition-colors truncate">{campaign.name}</h4>
                        <p className="text-[10px] lg:text-xs text-terminal-text/40 font-mono uppercase tracking-widest truncate">Target: {campaign.target}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-4 lg:gap-12 border-t sm:border-t-0 border-terminal-border pt-4 sm:pt-0">
                      <div className="text-center">
                        <div className="text-[8px] lg:text-[10px] font-mono text-terminal-text/30 uppercase mb-1">Status</div>
                        <Badge className={cn(
                          "text-[8px] lg:text-[10px] font-bold px-1.5 py-0",
                          campaign.status === 'RUNNING' ? "bg-terminal-green text-black" : "bg-orange-500 text-white"
                        )}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] lg:text-[10px] font-mono text-terminal-text/30 uppercase mb-1">Clicks</div>
                        <div className="text-sm lg:text-lg font-mono font-bold text-terminal-text">{campaign.clicks}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[8px] lg:text-[10px] font-mono text-terminal-text/30 uppercase mb-1">Success</div>
                        <div className="text-sm lg:text-lg font-mono font-bold text-red-400">{campaign.success}</div>
                      </div>
                      <div className="flex gap-1 lg:gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 lg:h-10 lg:w-10 border-terminal-border hover:bg-white/5">
                          <BarChart3 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 lg:h-10 lg:w-10 border-terminal-border hover:bg-red-500/10 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubTab === 'vishing' && (
            <motion.div
              key="vishing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-terminal-text uppercase tracking-tight">Vocal Synthesis Engine</h3>
                <p className="text-sm text-terminal-text/50 font-mono">Simulate AI-driven voice phishing (Vishing) attacks with neural synthesis.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6 bg-obsidian-card border-terminal-border space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-terminal-text/50 uppercase tracking-widest">Call Script</label>
                      <Badge variant="outline" className="text-[10px] border-red-500/20 text-red-400">NEURAL_READY</Badge>
                    </div>
                    <textarea 
                      value={vishingText}
                      onChange={(e) => setVishingText(e.target.value)}
                      className="w-full h-48 bg-black/40 border border-terminal-border rounded-xl p-4 font-mono text-sm text-terminal-text focus:outline-none focus:border-red-500/40 transition-colors resize-none custom-scrollbar"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center justify-center h-24 bg-black/60 rounded-xl border border-terminal-border relative overflow-hidden">
                      {isPlayingVishing ? (
                        <div className="flex items-center gap-1">
                          {[...Array(24)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ 
                                height: [10, Math.random() * 40 + 10, 10],
                                opacity: [0.3, 1, 0.3]
                              }}
                              transition={{ 
                                duration: 0.5 + Math.random(), 
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="w-1 bg-red-500 rounded-full"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 opacity-20">
                          {[...Array(24)].map((_, i) => (
                            <div key={i} className="w-1 h-3 bg-red-500 rounded-full" />
                          ))}
                        </div>
                      )}
                      <div className="absolute top-2 left-3 flex items-center gap-1.5">
                        <Volume2 className={cn("w-3 h-3", isPlayingVishing ? "text-red-500 animate-pulse" : "text-terminal-text/20")} />
                        <span className="text-[8px] font-mono text-terminal-text/20 uppercase tracking-tighter">Audio Spectrum</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handlePlayVishing}
                      className={cn(
                        "h-24 w-24 rounded-xl flex flex-col gap-2 font-bold transition-all",
                        isPlayingVishing 
                          ? "bg-red-900/20 border border-red-500 text-red-500 hover:bg-red-900/30" 
                          : "bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/20"
                      )}
                    >
                      {isPlayingVishing ? <Square className="w-8 h-8" /> : <Play className="w-8 h-8 border-none" />}
                      <span className="text-xs uppercase">{isPlayingVishing ? "Stop" : "Speak"}</span>
                    </Button>
                  </div>
                </Card>

                <div className="space-y-6">
                  <Card className="p-6 bg-obsidian-card border-terminal-border space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-red-500" />
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest">Voice Profile</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => setVishingVoice('male')}
                          className={cn(
                            "p-3 rounded-lg border font-mono text-[10px] transition-all",
                            vishingVoice === 'male' 
                              ? "bg-red-500 text-white border-red-500" 
                              : "bg-black/40 border-terminal-border text-terminal-text/40 hover:border-red-500/30"
                          )}
                        >
                          MALE_V2
                        </button>
                        <button 
                          onClick={() => setVishingVoice('female')}
                          className={cn(
                            "p-3 rounded-lg border font-mono text-[10px] transition-all",
                            vishingVoice === 'female' 
                              ? "bg-red-500 text-white border-red-500" 
                              : "bg-black/40 border-terminal-border text-terminal-text/40 hover:border-red-500/30"
                          )}
                        >
                          FEMALE_V1
                        </button>
                      </div>
                    </div>

                    <Separator className="bg-terminal-border" />

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-red-500" />
                        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest">Acoustic Mods</h4>
                      </div>
                      <div className="space-y-3">
                        {['Voice Deepener', 'Background Noise (Office)', 'Call Latency Sim'].map(mod => (
                          <div key={mod} className="flex items-center justify-between group cursor-pointer">
                            <span className="text-[10px] font-mono text-terminal-text/40 group-hover:text-terminal-text/60">{mod}</span>
                            <div className="w-8 h-4 rounded-full bg-black/60 border border-terminal-border relative">
                              <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-terminal-text/20" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 space-y-2">
                    <div className="flex items-center gap-2 text-red-500">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Warning</span>
                    </div>
                    <p className="text-[10px] font-mono text-terminal-text/50 leading-relaxed italic">
                      Neural synthesis can be highly convincing. Ensure all simulations follow local ethical guidelines and authorized scope.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card className="p-6 bg-obsidian-card border-terminal-border">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <MousePointer2 className="w-4 h-4 text-red-500" />
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Global Click Distribution</h3>
                  </div>
                  <Badge variant="outline" className="border-terminal-border text-[10px]">LAST 24H</Badge>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: 'Desktop (Windows)', value: 65, color: 'bg-red-500' },
                    { label: 'Mobile (iOS)', value: 22, color: 'bg-red-400' },
                    { label: 'Mobile (Android)', value: 10, color: 'bg-red-300' },
                    { label: 'Desktop (MacOS)', value: 3, color: 'bg-red-200' },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-terminal-text/50">{item.label}</span>
                        <span className="text-terminal-text">{item.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          className={cn("h-full rounded-full", item.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-obsidian-card border-terminal-border">
                <div className="flex items-center gap-2 mb-8">
                  <Users className="w-4 h-4 text-red-500" />
                  <h3 className="text-xs font-mono font-bold uppercase tracking-widest">Target Vulnerability Index</h3>
                </div>
                
                <div className="flex items-center justify-center h-64 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-2 border-dashed border-red-500/20 animate-spin-slow" />
                  </div>
                  <div className="text-center z-10">
                    <div className="text-4xl font-mono font-bold text-red-500">7.4</div>
                    <div className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">High Risk</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-black/40 border border-terminal-border text-center">
                    <div className="text-[10px] font-mono text-terminal-text/30 uppercase">Total Targets</div>
                    <div className="text-lg font-mono font-bold text-terminal-text">1,240</div>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-terminal-border text-center">
                    <div className="text-[10px] font-mono text-terminal-text/30 uppercase">Compromised</div>
                    <div className="text-lg font-mono font-bold text-red-400">148</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
