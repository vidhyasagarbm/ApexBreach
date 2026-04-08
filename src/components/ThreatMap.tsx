import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ShieldAlert, Zap, Target, Activity } from 'lucide-react';

const CITIES = [
  { name: 'New York', country: 'USA', coords: [-74.006, 40.7128] },
  { name: 'London', country: 'UK', coords: [-0.1278, 51.5074] },
  { name: 'Tokyo', country: 'Japan', coords: [139.6917, 35.6895] },
  { name: 'Sydney', country: 'Australia', coords: [151.2093, -33.8688] },
  { name: 'Moscow', country: 'Russia', coords: [37.6173, 55.7558] },
  { name: 'Beijing', country: 'China', coords: [116.4074, 39.9042] },
  { name: 'Berlin', country: 'Germany', coords: [13.405, 52.52] },
  { name: 'Paris', country: 'France', coords: [2.3522, 48.8566] },
  { name: 'San Francisco', country: 'USA', coords: [-122.4194, 37.7749] },
  { name: 'Sao Paulo', country: 'Brazil', coords: [-46.6333, -23.5505] },
  { name: 'Mumbai', country: 'India', coords: [72.8777, 19.076] },
  { name: 'Lagos', country: 'Nigeria', coords: [3.3792, 6.5244] },
  { name: 'Singapore', country: 'Singapore', coords: [103.8198, 1.3521] },
  { name: 'Dubai', country: 'UAE', coords: [55.2708, 25.2048] },
  { name: 'Los Angeles', country: 'USA', coords: [-118.2437, 34.0522] },
  { name: 'Seoul', country: 'South Korea', coords: [126.978, 37.5665] },
  { name: 'Hong Kong', country: 'China', coords: [114.1694, 22.3193] },
  { name: 'Toronto', country: 'Canada', coords: [-79.3832, 43.6532] },
  { name: 'Mexico City', country: 'Mexico', coords: [-99.1332, 19.4326] },
  { name: 'Johannesburg', country: 'South Africa', coords: [28.0473, -26.2041] },
];

const ATTACK_TYPES = [
  'DDoS', 'SQL Injection', 'Brute Force', 'Phishing', 'Malware', 'Exploit', 'Ransomware'
];

interface Attack {
  id: string;
  source: typeof CITIES[0];
  target: typeof CITIES[0];
  type: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export const ThreatMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    ddos: 0,
    malware: 0,
    exploit: 0
  });

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: {
      type: string;
      source: string;
      target: string;
      severity: string;
    };
  } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 1000;
    const height = 600;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const projection = d3.geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Load world map
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data: any) => {
      const countries = topojson.feature(data, data.objects.countries);

      svg.append('g')
        .selectAll('path')
        .data((countries as any).features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', '#0a1a0a')
        .attr('stroke', '#1a3a1a')
        .attr('stroke-width', 0.5);
    });

    // Attack simulation interval
    const interval = setInterval(() => {
      const source = CITIES[Math.floor(Math.random() * CITIES.length)];
      let target = CITIES[Math.floor(Math.random() * CITIES.length)];
      while (target === source) {
        target = CITIES[Math.floor(Math.random() * CITIES.length)];
      }

      const type = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
      const severities: Attack['severity'][] = ['low', 'medium', 'high', 'critical'];
      const severity = severities[Math.floor(Math.random() * severities.length)];

      const newAttack: Attack = {
        id: Math.random().toString(36).substr(2, 9),
        source,
        target,
        type,
        timestamp: new Date(),
        severity
      };

      setAttacks(prev => [newAttack, ...prev].slice(0, 10));
      setStats(prev => ({
        total: prev.total + 1,
        ddos: prev.ddos + (type === 'DDoS' ? 1 : 0),
        malware: prev.malware + (type === 'Malware' ? 1 : 0),
        exploit: prev.exploit + (type === 'Exploit' ? 1 : 0)
      }));

      // Draw attack arc
      const sourcePos = projection(source.coords as [number, number]);
      const targetPos = projection(target.coords as [number, number]);

      if (sourcePos && targetPos) {
        // Draw labels for 3 seconds
        const sourceLabel = svg.append('text')
          .attr('x', sourcePos[0])
          .attr('y', sourcePos[1] - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', '#00ff00')
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .style('opacity', 0)
          .text(`${source.country}`);

        const targetLabel = svg.append('text')
          .attr('x', targetPos[0])
          .attr('y', targetPos[1] - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', severity === 'critical' ? '#ff0000' : '#00ff00')
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .style('opacity', 0)
          .text(`${target.country}`);

        sourceLabel.transition().duration(500).style('opacity', 1)
          .transition().delay(2000).duration(500).style('opacity', 0).remove();
        
        targetLabel.transition().duration(500).style('opacity', 1)
          .transition().delay(2000).duration(500).style('opacity', 0).remove();

        const arc = svg.append('path')
          .attr('d', () => {
            const dx = targetPos[0] - sourcePos[0];
            const dy = targetPos[1] - sourcePos[1];
            const dr = Math.sqrt(dx * dx + dy * dy);
            return `M${sourcePos[0]},${sourcePos[1]}A${dr},${dr} 0 0,1 ${targetPos[0]},${targetPos[1]}`;
          })
          .attr('fill', 'none')
          .attr('stroke', severity === 'critical' ? '#ff0000' : severity === 'high' ? '#ff6600' : '#00ff00')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '1000')
          .attr('stroke-dashoffset', '1000')
          .style('cursor', 'pointer');

        // Tooltip events for arc
        arc.on('mouseover', (event) => {
          setTooltip({
            x: event.clientX,
            y: event.clientY,
            content: {
              type: newAttack.type,
              source: `${newAttack.source.name}, ${newAttack.source.country}`,
              target: `${newAttack.target.name}, ${newAttack.target.country}`,
              severity: newAttack.severity
            }
          });
        })
        .on('mousemove', (event) => {
          setTooltip(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null);
        })
        .on('mouseout', () => {
          setTooltip(null);
        });

        arc.transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr('stroke-dashoffset', 0)
          .on('end', () => {
            arc.transition()
              .duration(500)
              .style('opacity', 0)
              .remove();
            
            // Pulse at target
            const pulse = svg.append('circle')
              .attr('cx', targetPos[0])
              .attr('cy', targetPos[1])
              .attr('r', 2)
              .attr('fill', severity === 'critical' ? '#ff0000' : '#00ff00')
              .style('opacity', 1)
              .style('cursor', 'pointer');

            // Tooltip events for pulse
            pulse.on('mouseover', (event) => {
              setTooltip({
                x: event.clientX,
                y: event.clientY,
                content: {
                  type: newAttack.type,
                  source: `${newAttack.source.name}, ${newAttack.source.country}`,
                  target: `${newAttack.target.name}, ${newAttack.target.country}`,
                  severity: newAttack.severity
                }
              });
            })
            .on('mousemove', (event) => {
              setTooltip(prev => prev ? { ...prev, x: event.clientX, y: event.clientY } : null);
            })
            .on('mouseout', () => {
              setTooltip(null);
            });

            pulse.transition()
              .duration(1000)
              .attr('r', 15)
              .style('opacity', 0)
              .remove();
          });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black/40 rounded-lg border border-terminal-border overflow-hidden relative">
      <div className="p-4 border-b border-terminal-border flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-terminal-green animate-pulse" />
          <h2 className="text-sm font-mono font-bold text-terminal-green uppercase tracking-widest">Live Cyber Threat Map</h2>
        </div>
        <div className="flex gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-terminal-green" />
            <span className="text-terminal-text/60">LOW/MED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-terminal-text/60">HIGH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-terminal-text/60">CRITICAL</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative min-h-[400px]">
        <svg ref={svgRef} className="w-full h-full" />
        
        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: 'fixed',
                left: tooltip.x + 15,
                top: tooltip.y + 15,
                pointerEvents: 'none',
                zIndex: 100
              }}
              className="bg-black/90 border border-terminal-border p-3 rounded shadow-2xl backdrop-blur-md min-w-[180px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                  tooltip.content.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                  tooltip.content.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                  'bg-terminal-green/20 text-terminal-green'
                )}>
                  {tooltip.content.type}
                </span>
                <ShieldAlert className={cn(
                  "w-3 h-3",
                  tooltip.content.severity === 'critical' ? 'text-red-500' : 'text-terminal-green'
                )} />
              </div>
              <div className="space-y-1.5">
                <div>
                  <div className="text-[8px] font-mono text-terminal-text/40 uppercase">Source</div>
                  <div className="text-[10px] font-mono text-terminal-cyan">{tooltip.content.source}</div>
                </div>
                <div>
                  <div className="text-[8px] font-mono text-terminal-text/40 uppercase">Target</div>
                  <div className="text-[10px] font-mono text-red-400">{tooltip.content.target}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Overlay Stats */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-black/60 border border-terminal-border p-3 rounded backdrop-blur-sm">
            <div className="text-[10px] font-mono text-terminal-text/40 mb-1 uppercase">Total Attacks Detected</div>
            <div className="text-xl font-mono font-bold text-terminal-green">{stats.total.toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/60 border border-terminal-border p-2 rounded backdrop-blur-sm">
              <div className="text-[8px] font-mono text-terminal-text/40 uppercase">DDoS</div>
              <div className="text-xs font-mono text-terminal-cyan">{stats.ddos}</div>
            </div>
            <div className="bg-black/60 border border-terminal-border p-2 rounded backdrop-blur-sm">
              <div className="text-[8px] font-mono text-terminal-text/40 uppercase">Malware</div>
              <div className="text-xs font-mono text-terminal-cyan">{stats.malware}</div>
            </div>
            <div className="bg-black/60 border border-terminal-border p-2 rounded backdrop-blur-sm">
              <div className="text-[8px] font-mono text-terminal-text/40 uppercase">Exploit</div>
              <div className="text-xs font-mono text-terminal-cyan">{stats.exploit}</div>
            </div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="absolute top-4 right-4 w-64 h-64 bg-black/60 border border-terminal-border rounded backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="p-2 border-b border-terminal-border bg-black/40 flex items-center gap-2">
            <Activity className="w-3 h-3 text-terminal-green" />
            <span className="text-[10px] font-mono font-bold text-terminal-green uppercase">Live Attack Feed</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {attacks.map((attack) => (
                <motion.div
                  key={attack.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-2 bg-white/5 border border-white/10 rounded text-[9px] font-mono"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={cn(
                      "px-1 rounded",
                      attack.severity === 'critical' ? 'bg-red-500/20 text-red-500' :
                      attack.severity === 'high' ? 'bg-orange-500/20 text-orange-500' :
                      'bg-terminal-green/20 text-terminal-green'
                    )}>
                      {attack.type}
                    </span>
                    <span className="text-terminal-text/30">{attack.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="text-terminal-text/60">
                    <span className="text-terminal-cyan">{attack.source.name}, {attack.source.country}</span>
                    <span className="mx-1">→</span>
                    <span className="text-terminal-cyan">{attack.target.name}, {attack.target.country}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-terminal-border bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-terminal-cyan" />
            <span className="text-[10px] font-mono text-terminal-text/40">SENSORS: <span className="text-terminal-cyan">ONLINE</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-terminal-green" />
            <span className="text-[10px] font-mono text-terminal-text/40">THREAT LEVEL: <span className="text-terminal-green">ELEVATED</span></span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-terminal-text/20 italic">
          Real-time global telemetry active
        </div>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
