import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Share2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TTP_DATA } from '../data/ttps';
import { Button } from "@/components/ui/button";

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
  label: string;
  type: 'ttp' | 'technique';
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

// Generate graph data from TTP_DATA
const generateGraphData = () => {
  const nodes: Node[] = [];
  const links: Link[] = [];

  TTP_DATA.forEach((ttp, i) => {
    // Add TTP category node
    nodes.push({
      id: ttp.id,
      group: i + 1,
      label: ttp.name,
      type: 'ttp'
    });

    // Add primary techniques for this TTP
    ttp.techniques.slice(0, 2).forEach((tech) => {
      nodes.push({
        id: tech.id,
        group: i + 1,
        label: tech.name,
        type: 'technique'
      });

      // Link technique to its TTP
      links.push({
        source: ttp.id,
        target: tech.id,
        value: 1
      });
    });

    // Link TTPs sequentially to show the "Kill Chain"
    if (i > 0) {
      links.push({
        source: TTP_DATA[i - 1].id,
        target: ttp.id,
        value: 2
      });
    }
  });

  return { nodes, links };
};

const DATA = generateGraphData();

export const AttackPathVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const width = 800;
    const height = 500;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`);

    const g = d3.select(gRef.current);

    // Clear previous content
    g.selectAll('*').remove();

    // Initialize zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    // Create a deep copy of data for the simulation
    const nodes: Node[] = DATA.nodes.map(d => ({ ...d }));
    const links: Link[] = DATA.links.map(d => ({ ...d }));

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(d => d.value === 2 ? 150 : 80))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => d.value === 2 ? '#10b981' : '#06b6d4')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => d.value === 2 ? 2 : 1)
      .attr('stroke-dasharray', d => d.value === 2 ? 'none' : '4,2');

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag<SVGGElement, Node>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }) as any);

    // Node circles
    node.append('circle')
      .attr('r', d => d.type === 'ttp' ? 12 : 6)
      .attr('fill', d => {
        const colors = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#14b8a6'];
        return colors[(d.group - 1) % colors.length];
      })
      .attr('stroke', '#000')
      .attr('stroke-width', 2);

    // Node labels
    node.append('text')
      .attr('x', d => d.type === 'ttp' ? 16 : 10)
      .attr('y', 4)
      .text(d => d.label)
      .attr('fill', d => d.type === 'ttp' ? '#10b981' : '#ffffff')
      .attr('font-size', d => d.type === 'ttp' ? '12px' : '9px')
      .attr('font-family', 'monospace')
      .attr('font-weight', d => d.type === 'ttp' ? 'bold' : 'normal')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 0 4px rgba(0,0,0,0.8)');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as Node).x!)
        .attr('y1', d => (d.source as Node).y!)
        .attr('x2', d => (d.target as Node).x!)
        .attr('y2', d => (d.target as Node).y!);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.scaleBy, 0.7);
    }
  };

  const handleReset = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).transition().call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-black/40 border border-terminal-border rounded-xl overflow-hidden relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Share2 className="w-5 h-5 text-terminal-cyan" />
          <h3 className="text-lg font-bold text-terminal-cyan uppercase tracking-tight">Attack Path Visualizer</h3>
        </div>
        <div className="text-[10px] font-mono text-terminal-text/40 uppercase tracking-widest">
          Live Kill-Chain Mapping
        </div>
      </div>

      <div className="bg-black/60 border border-terminal-border/50 rounded-lg overflow-hidden cursor-move relative">
        <svg ref={svgRef} className="w-full h-[500px]">
          <g ref={gRef} />
        </svg>

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomIn}
            className="w-8 h-8 bg-black/60 border-terminal-border hover:border-terminal-green hover:text-terminal-green"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleZoomOut}
            className="w-8 h-8 bg-black/60 border-terminal-border hover:border-terminal-green hover:text-terminal-green"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleReset}
            className="w-8 h-8 bg-black/60 border-terminal-border hover:border-terminal-green hover:text-terminal-green"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-terminal-green" />
          <span className="text-[9px] font-mono text-terminal-text/60 uppercase">TTP Category</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <span className="text-[9px] font-mono text-terminal-text/60 uppercase">Technique</span>
        </div>
      </div>
    </div>
  );
};
