import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  label: string;
  type: 'target' | 'subdomain' | 'ip' | 'employee' | 'credential';
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

interface NeuralTargetGraphProps {
  target: string;
}

const generateMockData = (target: string) => {
  const nodes: Node[] = [
    { id: 'target', group: 1, label: target, type: 'target' },
    { id: 'sub1', group: 2, label: `api.${target}`, type: 'subdomain' },
    { id: 'sub2', group: 2, label: `dev.${target}`, type: 'subdomain' },
    { id: 'sub3', group: 2, label: `vpn.${target}`, type: 'subdomain' },
    { id: 'ip1', group: 3, label: '104.26.10.23', type: 'ip' },
    { id: 'ip2', group: 3, label: '172.67.74.152', type: 'ip' },
    { id: 'emp1', group: 4, label: 'j.doe@' + target, type: 'employee' },
    { id: 'emp2', group: 4, label: 'a.smith@' + target, type: 'employee' },
    { id: 'cred1', group: 5, label: 'DB_ADMIN:p4ssw0rd', type: 'credential' },
  ];

  const links: Link[] = [
    { source: 'target', target: 'sub1', value: 1 },
    { source: 'target', target: 'sub2', value: 1 },
    { source: 'target', target: 'sub3', value: 1 },
    { source: 'sub1', target: 'ip1', value: 2 },
    { source: 'sub2', target: 'ip2', value: 2 },
    { source: 'sub3', target: 'ip2', value: 2 },
    { source: 'target', target: 'emp1', value: 3 },
    { source: 'target', target: 'emp2', value: 3 },
    { source: 'emp1', target: 'cred1', value: 4 },
  ];

  return { nodes, links };
};

export const NeuralTargetGraph: React.FC<NeuralTargetGraphProps> = ({ target }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !target) return;

    const width = svgRef.current.parentElement?.clientWidth || 800;
    const height = 400;

    const { nodes, links } = generateMockData(target);

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#10b981")
      .attr("stroke-opacity", 0.2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .selectAll<SVGGElement, Node>("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", d => d.type === 'target' ? 12 : 6)
      .attr("fill", d => d.type === 'target' ? "#10b981" : "#064e3b")
      .attr("stroke", "#10b981")
      .attr("class", "node-glow");

    node.append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(d => d.label)
      .attr("fill", "#10b981")
      .attr("font-size", "10px")
      .attr("font-family", "monospace")
      .attr("style", "pointer-events: none; text-shadow: 0 0 5px rgba(16, 185, 129, 0.5);");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [target]);

  return (
    <div className="relative w-full h-[400px] border border-emerald-500/10 rounded-xl bg-black/40 overflow-hidden group">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Neural Target Map v1.0</span>
      </div>
      <svg ref={svgRef} className="w-full h-full cursor-move" />
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <div className="text-[8px] font-mono text-terminal-text/20 uppercase text-right">
          Interactive Node System<br/>
          Force-Directed Layout
        </div>
      </div>
      
      <style>{`
        .node-glow {
          filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.5));
          transition: filter 0.3s ease;
        }
        .group:hover .node-glow {
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.8));
        }
      `}</style>
    </div>
  );
};
