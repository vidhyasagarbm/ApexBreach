import React from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { motion } from 'motion/react';
import { Activity, Shield, AlertTriangle, Zap, Globe, Target } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const ATTACK_TRENDS = [
  { time: '00:00', attacks: 400, blocked: 380, severity: 20 },
  { time: '04:00', attacks: 300, blocked: 290, severity: 10 },
  { time: '08:00', attacks: 600, blocked: 550, severity: 50 },
  { time: '12:00', attacks: 800, blocked: 720, severity: 80 },
  { time: '16:00', attacks: 500, blocked: 480, severity: 30 },
  { time: '20:00', attacks: 900, blocked: 850, severity: 60 },
  { time: '23:59', attacks: 700, blocked: 680, severity: 40 },
];

const ATTACK_TYPES = [
  { name: 'DDoS', value: 45, color: '#ef4444' },
  { name: 'Malware', value: 25, color: '#f97316' },
  { name: 'SQL Injection', value: 15, color: '#3b82f6' },
  { name: 'Phishing', value: 10, color: '#a855f7' },
  { name: 'Zero-Day', value: 5, color: '#10b981' },
];

const REGIONAL_RISK = [
  { region: 'North America', risk: 75 },
  { region: 'Europe', risk: 60 },
  { region: 'Asia', risk: 85 },
  { region: 'South America', risk: 40 },
  { region: 'Africa', risk: 30 },
];

export const AnalyticsDashboard: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 lg:p-8 space-y-6 lg:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-terminal-green uppercase tracking-tight">Global Threat Analytics</h2>
          <p className="text-xs lg:text-base text-terminal-text/50 font-mono">Real-time data visualization of simulated global cyber activity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 lg:px-4 py-1.5 lg:py-2 bg-black/40 border border-terminal-border rounded-lg flex items-center gap-3">
            <Activity className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-terminal-green animate-pulse" />
            <div className="flex flex-col">
              <span className="text-[10px] text-terminal-text/40 uppercase font-mono">System Health</span>
              <span className="text-xs lg:text-sm text-terminal-green font-mono">OPTIMAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[
          { label: 'Total Attacks', value: '1.2M', icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Mitigated', value: '98.4%', icon: Shield, color: 'text-terminal-green' },
          { label: 'Avg Latency', value: '42ms', icon: Zap, color: 'text-terminal-green' },
          { label: 'Active Nodes', value: '14,205', icon: Globe, color: 'text-purple-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 lg:p-6 rounded-xl bg-black/40 border border-terminal-border hover:border-terminal-green/30 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Target className="w-4 h-4 text-terminal-text/40" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl lg:text-3xl font-bold font-mono tracking-tighter">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Trend Chart */}
        <Card className="lg:col-span-2 p-4 lg:p-6 bg-black/40 border-terminal-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h3 className="text-[10px] lg:text-sm font-mono font-bold uppercase tracking-widest text-terminal-text/60">Attack Frequency (24h)</h3>
            <div className="flex items-center gap-4 text-[10px] lg:text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-terminal-green" />
                <span>TOTAL ATTACKS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-terminal-green/50" />
                <span>BLOCKED</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTACK_TRENDS}>
                <defs>
                  <linearGradient id="colorAttacks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#4b5563" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', fontSize: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="attacks" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorAttacks)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="blocked" 
                  stroke="#00FF41" 
                  fillOpacity={0.5} 
                  fill="url(#colorBlocked)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Attack Type Distribution */}
        <Card className="p-4 lg:p-6 bg-black/40 border-terminal-border">
          <h3 className="text-[10px] lg:text-sm font-mono font-bold uppercase tracking-widest text-terminal-text/60 mb-8">Attack Vectors</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ATTACK_TYPES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ATTACK_TYPES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {ATTACK_TYPES.map((type, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-terminal-text/60">{type.name}</span>
                </div>
                <span className="font-bold">{type.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Regional Risk Bar Chart */}
        <Card className="p-4 lg:p-6 bg-black/40 border-terminal-border">
          <h3 className="text-[10px] lg:text-sm font-mono font-bold uppercase tracking-widest text-terminal-text/60 mb-8">Regional Risk Index</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REGIONAL_RISK} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="region" 
                  type="category" 
                  stroke="#4b5563" 
                  fontSize={12} 
                  width={100}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #374151', fontSize: '12px' }}
                />
                <Bar dataKey="risk" fill="#10b981" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Live Activity Feed (Mini) */}
        <Card className="p-4 lg:p-6 bg-black/40 border-terminal-border">
          <h3 className="text-[10px] lg:text-sm font-mono font-bold uppercase tracking-widest text-terminal-text/60 mb-6">System Log Activity</h3>
          <div className="space-y-4">
            {[
              { time: '11:02:15', event: 'DDoS Mitigation triggered in ASIA-EAST1', status: 'RESOLVED' },
              { time: '11:01:42', event: 'Unauthorized SQLi attempt detected from 185.23.1.4', status: 'BLOCKED' },
              { time: '11:00:05', event: 'New Zero-Day signature added to database', status: 'UPDATED' },
              { time: '10:58:12', event: 'Global sync completed across 14 nodes', status: 'SUCCESS' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-4 text-xs font-mono border-b border-white/5 pb-3 last:border-0">
                <span className="text-terminal-text/30 shrink-0">{log.time}</span>
                <span className="flex-1 text-terminal-text/70">{log.event}</span>
                <span className={cn(
                  "shrink-0 font-bold",
                  log.status === 'RESOLVED' || log.status === 'SUCCESS' ? "text-terminal-green" : "text-terminal-green/60"
                )}>{log.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
