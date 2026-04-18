import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, ShieldAlert, Zap, Target, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

interface Incident {
  id: string;
  title: string;
  location: string;
  coords: [number, number];
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  type: string;
}

const LIVE_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    title: 'SolarWinds Supply Chain Attack',
    location: 'Washington D.C., USA',
    coords: [-77.0369, 38.9072],
    severity: 'critical',
    description: 'Sophisticated supply chain compromise impacting multiple government agencies and private organizations. Attributed to APT29.',
    type: 'Supply Chain'
  },
  {
    id: 'inc-2',
    title: 'WannaCry Ransomware Outbreak',
    location: 'London, UK',
    coords: [-0.1278, 51.5074],
    severity: 'high',
    description: 'Global ransomware attack targeting unpatched Windows systems via EternalBlue exploit. Massive impact on healthcare systems.',
    type: 'Ransomware'
  },
  {
    id: 'inc-3',
    title: 'Log4Shell Vulnerability',
    location: 'Singapore',
    coords: [103.8198, 1.3521],
    severity: 'critical',
    description: 'Critical RCE vulnerability in Apache Log4j library impacting millions of applications. Actively exploited by multiple threat actors.',
    type: 'Vulnerability'
  },
  {
    id: 'inc-4',
    title: 'Operation Aurora',
    location: 'Beijing, China',
    coords: [116.4074, 39.9042],
    severity: 'high',
    description: 'Highly targeted cyber attack originating from China against dozens of major US companies, including Google and Adobe.',
    type: 'APT'
  }
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
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
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

      // Draw Live Incident Markers
      const incidentGroup = svg.append('g').attr('class', 'incidents');
      
      LIVE_INCIDENTS.forEach(inc => {
        const pos = projection(inc.coords);
        if (pos) {
          const marker = incidentGroup.append('g')
            .attr('class', 'incident-marker')
            .style('cursor', 'pointer')
            .on('click', () => setSelectedIncident(inc));

          // Outer pulse
          marker.append('circle')
            .attr('cx', pos[0])
            .attr('cy', pos[1])
            .attr('r', 8)
            .attr('fill', inc.severity === 'critical' ? '#ff0000' : '#ff6600')
            .style('opacity', 0.3)
            .append('animate')
            .attr('attributeName', 'r')
            .attr('values', '8;15;8')
            .attr('dur', '2s')
            .attr('repeatCount', 'indefinite');

          // Inner dot
          marker.append('circle')
            .attr('cx', pos[0])
            .attr('cy', pos[1])
            .attr('r', 4)
            .attr('fill', inc.severity === 'critical' ? '#ff0000' : '#ff6600')
            .style('filter', 'drop-shadow(0 0 5px rgba(255,0,0,0.8))');

          // Label
          marker.append('text')
            .attr('x', pos[0])
            .attr('y', pos[1] + 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#ffffff')
            .attr('font-size', '8px')
            .attr('font-family', 'monospace')
            .style('opacity', 0.6)
            .text(inc.type);
        }
      });
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
          .attr('font-size', '12px')
          .attr('font-family', 'monospace')
          .style('opacity', 0)
          .text(`${source.country}`);

        const targetLabel = svg.append('text')
          .attr('x', targetPos[0])
          .attr('y', targetPos[1] - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', severity === 'critical' ? '#ff0000' : '#00ff00')
          .attr('font-size', '12px')
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
    <div className="flex flex-col h-full bg-obsidian-card rounded-2xl border border-obsidian-border overflow-hidden relative">
      <div className="p-6 border-b border-obsidian-border flex items-center justify-between bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-accent animate-pulse" />
          <h2 className="text-base font-bold text-text-primary uppercase tracking-widest">Global Threat Intelligence</h2>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-text-secondary">LOW/MED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-text-secondary">HIGH</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-text-secondary">CRITICAL</span>
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
                  <div className="text-[10px] font-mono text-terminal-green">{tooltip.content.source}</div>
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
        <div className="absolute top-4 left-4 right-4 sm:right-auto space-y-2">
          <div className="bg-black/60 border border-obsidian-border p-3 rounded-xl backdrop-blur-sm">
            <div className="text-[10px] font-mono text-text-secondary/50 mb-1 uppercase tracking-widest">Total Attacks Detected</div>
            <div className="text-xl lg:text-2xl font-mono font-bold text-accent">{stats.total.toLocaleString()}</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black/60 border border-terminal-border p-2 rounded backdrop-blur-sm">
              <div className="text-[8px] lg:text-[10px] font-mono text-terminal-text/40 uppercase">DDoS</div>
              <div className="text-xs lg:text-sm font-mono text-terminal-green">{stats.ddos}</div>
            </div>
            <div className="bg-black/60 border border-terminal-border p-2 rounded backdrop-blur-sm">
              <div className="text-[8px] lg:text-[10px] font-mono text-terminal-text/40 uppercase">Malware</div>
              <div className="text-xs lg:text-sm font-mono text-terminal-green">{stats.malware}</div>
            </div>
            <div className="bg-black/60 border border-terminal-border p-2 rounded backdrop-blur-sm">
              <div className="text-[8px] lg:text-[10px] font-mono text-terminal-text/40 uppercase">Exploit</div>
              <div className="text-xs lg:text-sm font-mono text-terminal-green">{stats.exploit}</div>
            </div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="absolute bottom-4 left-4 right-4 sm:top-4 sm:left-auto sm:right-4 sm:bottom-auto sm:w-64 h-48 sm:h-64 bg-black/60 border border-terminal-border rounded backdrop-blur-sm overflow-hidden flex flex-col">
          <div className="p-2 border-b border-terminal-border bg-black/40 flex items-center gap-2">
            <Activity className="w-3 h-3 text-terminal-green" />
            <span className="text-[10px] lg:text-xs font-mono font-bold text-terminal-green uppercase">Live Attack Feed</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {attacks.map((attack) => (
                <motion.div
                  key={attack.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-2 bg-white/5 border border-white/10 rounded text-xs font-mono"
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
                    <span className="text-[10px] text-terminal-text/30">{attack.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <div className="text-xs text-terminal-text/60">
                    <span className="text-terminal-green">{attack.source.name}, {attack.source.country}</span>
                    <span className="mx-1">→</span>
                    <span className="text-terminal-green">{attack.target.name}, {attack.target.country}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Incident Detail Overlay */}
        <AnimatePresence>
          {selectedIncident && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-black/95 border border-terminal-border rounded-lg shadow-2xl backdrop-blur-xl overflow-hidden z-50"
            >
              <div className="p-3 border-b border-terminal-border bg-terminal-green/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-terminal-green" />
                  <span className="text-xs font-mono font-bold text-terminal-green uppercase">Incident Intelligence</span>
                </div>
                <button 
                  onClick={() => setSelectedIncident(null)}
                  className="text-terminal-text/40 hover:text-terminal-green transition-colors"
                >
                  <Activity className="w-4 h-4 rotate-45" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-terminal-text">{selectedIncident.title}</h3>
                    <Badge className={cn(
                      "text-[10px] font-mono uppercase",
                      selectedIncident.severity === 'critical' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'
                    )}>
                      {selectedIncident.severity}
                    </Badge>
                  </div>
                  <div className="text-[10px] font-mono text-terminal-text/40 uppercase">{selectedIncident.location}</div>
                </div>
                
                <div className="p-3 bg-white/5 rounded border border-white/5">
                  <p className="text-xs text-terminal-text/70 leading-relaxed italic">
                    "{selectedIncident.description}"
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-[8px] font-mono text-terminal-text/30 uppercase">Vector</div>
                    <div className="text-[10px] font-mono text-terminal-green">{selectedIncident.type}</div>
                  </div>
                  <div>
                    <div className="text-[8px] font-mono text-terminal-text/30 uppercase">Status</div>
                    <div className="text-[10px] font-mono text-terminal-green">ANALYZED</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 border-t border-terminal-border bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-terminal-green" />
            <span className="text-[10px] lg:text-xs font-mono text-terminal-text/40">SENSORS: <span className="text-terminal-green">ONLINE</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3 text-terminal-green" />
            <span className="text-[10px] lg:text-xs font-mono text-terminal-text/40">THREAT: <span className="text-terminal-green">ELEVATED</span></span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-terminal-text/20 italic hidden xs:block">
          Real-time global telemetry active
        </div>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
