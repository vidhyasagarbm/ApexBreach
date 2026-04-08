import React, { useState } from 'react';
import { ClipboardList, CheckCircle2, Circle, Trophy, Flag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const MISSIONS = [
  {
    id: 'web-pentest',
    title: 'Web Application Pentest',
    tasks: [
      'Information Gathering & Recon',
      'Vulnerability Scanning',
      'Exploit Discovery',
      'Post-Exploitation Analysis',
      'Reporting & Remediation'
    ]
  },
  {
    id: 'cloud-audit',
    title: 'Cloud Infrastructure Audit',
    tasks: [
      'IAM Policy Review',
      'Storage Bucket Permissions',
      'Network Security Groups',
      'Logging & Monitoring Check',
      'Compliance Verification'
    ]
  }
];

export const MissionChecklist: React.FC = () => {
  const [activeMission, setActiveMission] = useState(MISSIONS[0]);
  const [completedTasks, setCompletedTasks] = useState<Record<string, string[]>>({
    'web-pentest': [],
    'cloud-audit': []
  });

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => {
      const current = prev[activeMission.id] || [];
      const updated = current.includes(taskId)
        ? current.filter(id => id !== taskId)
        : [...current, taskId];
      return { ...prev, [activeMission.id]: updated };
    });
  };

  const progress = ((completedTasks[activeMission.id]?.length || 0) / activeMission.tasks.length) * 100;

  return (
    <div className="space-y-6 p-6 bg-black/40 border border-terminal-border rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-5 h-5 text-terminal-green" />
          <h3 className="text-lg font-bold text-terminal-green uppercase tracking-tight">Mission Checklist</h3>
        </div>
        <div className="flex gap-2">
          {MISSIONS.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMission(m)}
              className={`px-3 py-1 text-[10px] font-mono font-bold rounded border transition-all ${
                activeMission.id === m.id 
                  ? 'bg-terminal-green/20 border-terminal-green text-terminal-green' 
                  : 'border-terminal-border text-terminal-text/40 hover:border-terminal-text/20'
              }`}
            >
              {m.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">Operation Progress</span>
            <span className="text-xs font-mono text-terminal-green font-bold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-black/60" />
        </div>

        <div className="grid grid-cols-1 gap-2">
          {activeMission.tasks.map((task, i) => {
            const isCompleted = completedTasks[activeMission.id]?.includes(task);
            return (
              <button
                key={i}
                onClick={() => toggleTask(task)}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all text-left group ${
                  isCompleted 
                    ? 'bg-terminal-green/5 border-terminal-green/30 text-terminal-green' 
                    : 'bg-black/40 border-terminal-border/50 text-terminal-text/60 hover:border-terminal-green/20'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-terminal-green shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-terminal-text/20 group-hover:text-terminal-green/40 shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`text-xs font-mono font-medium ${isCompleted ? 'line-through opacity-50' : ''}`}>
                    {task}
                  </p>
                  <p className="text-[9px] font-mono text-terminal-text/30 uppercase mt-1">
                    Phase 0{i + 1}
                  </p>
                </div>
                {isCompleted && <Trophy className="w-4 h-4 text-terminal-green/40" />}
              </button>
            );
          })}
        </div>
      </div>

      {progress === 100 && (
        <div className="p-4 bg-terminal-green/10 border border-terminal-green/30 rounded-lg flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2">
          <Flag className="w-6 h-6 text-terminal-green" />
          <div>
            <p className="text-xs font-bold text-terminal-green uppercase">Mission Accomplished</p>
            <p className="text-[10px] font-mono text-terminal-green/70">All tactical objectives secured. Ready for exfiltration.</p>
          </div>
        </div>
      )}
    </div>
  );
};
