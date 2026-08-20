import React, { useState } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles
} from 'lucide-react';
import { mockNetworkNodes, mockNetworkEdges } from '../data/mockData';
import type { NetworkNode } from '../types/cti';

interface NetworkGraphViewProps {
  onSelectListingByVendor?: (vendorName: string) => void;
}

export const NetworkGraphView: React.FC<NetworkGraphViewProps> = ({
  onSelectListingByVendor,
}) => {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(mockNetworkNodes[0]);
  const [filterCluster, setFilterCluster] = useState<'ALL' | 'PUNJAB' | 'SHADOW'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const filteredNodes = mockNetworkNodes.filter((node) => {
    if (filterCluster === 'PUNJAB') {
      return (
        node.id === 'v-punjab' ||
        node.id === 'a-tg-punjab' ||
        node.id === 'v-chd-pharma' ||
        node.id === 'a-hydra' ||
        node.id === 'pgp-b8c2' ||
        node.id === 'btc-bc1q' ||
        node.id === 'xmr-48ed' ||
        node.id === 'loc-chd'
      );
    }
    if (filterCluster === 'SHADOW') {
      return (
        node.id === 'v-shadow' ||
        node.id === 'a-tg-shadow' ||
        node.id === 'pgp-551a' ||
        node.id === 'btc-34xp'
      );
    }
    return true;
  });

  const filteredEdges = mockNetworkEdges.filter((edge) => {
    const sourceExists = filteredNodes.some((n) => n.id === edge.source);
    const targetExists = filteredNodes.some((n) => n.id === edge.target);
    return sourceExists && targetExists;
  });

  const getNodeColor = (type: NetworkNode['type']) => {
    switch (type) {
      case 'vendor':
        return { bg: '#06b6d4', border: '#22d3ee', text: '#ffffff', glow: 'rgba(6, 182, 212, 0.4)' };
      case 'alias':
        return { bg: '#38bdf8', border: '#7dd3fc', text: '#ffffff', glow: 'rgba(56, 189, 248, 0.4)' };
      case 'pgp':
        return { bg: '#10b981', border: '#34d399', text: '#ffffff', glow: 'rgba(16, 185, 129, 0.4)' };
      case 'wallet':
        return { bg: '#f59e0b', border: '#fbbf24', text: '#ffffff', glow: 'rgba(245, 158, 11, 0.4)' };
      case 'location':
        return { bg: '#f43f5e', border: '#fb7185', text: '#ffffff', glow: 'rgba(244, 63, 94, 0.4)' };
      default:
        return { bg: '#64748b', border: '#94a3b8', text: '#ffffff', glow: 'rgba(100, 116, 139, 0.4)' };
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Controls Bar */}
      <div
        className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-accent-subtle)',
              borderColor: 'var(--border-accent)',
              color: 'var(--accent-primary)',
            }}
          >
            <Network className="h-4 w-4" />
          </div>
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <span>DarkScope Investigation Graph</span>
              <span
                className="px-1.5 py-0.2 rounded text-[10px] font-mono border"
                style={{
                  backgroundColor: 'var(--bg-accent-badge)',
                  borderColor: 'var(--border-accent)',
                  color: 'var(--accent-primary-text)',
                }}
              >
                Cross-Platform Entity Linkage
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Interactive node-edge graph exposing shared PGP keys, common crypto wallets, and rebrand migrations.
            </p>
          </div>
        </div>

        {/* Filter Pills & Zoom */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 p-1 rounded-lg border text-xs font-mono"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setFilterCluster('ALL')}
              className="px-2.5 py-1 rounded transition-colors cursor-pointer"
              style={
                filterCluster === 'ALL'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 700,
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
            >
              All Networks ({mockNetworkNodes.length})
            </button>
            <button
              onClick={() => setFilterCluster('PUNJAB')}
              className="px-2.5 py-1 rounded transition-colors cursor-pointer"
              style={
                filterCluster === 'PUNJAB'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 700,
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
            >
              Punjab Synthetics Ring
            </button>
            <button
              onClick={() => setFilterCluster('SHADOW')}
              className="px-2.5 py-1 rounded transition-colors cursor-pointer"
              style={
                filterCluster === 'SHADOW'
                  ? {
                      backgroundColor: 'var(--bg-accent)',
                      color: 'var(--accent-primary-content)',
                      fontWeight: 700,
                    }
                  : {
                      color: 'var(--text-secondary)',
                    }
              }
            >
              ShadowBroker IAB
            </button>
          </div>

          <div
            className="flex items-center gap-1 p-1 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.4))}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.7))}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas & Details Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Interactive SVG Network Canvas (3 cols) */}
        <div
          className="lg:col-span-3 h-[520px] rounded-xl border relative overflow-hidden graph-grid-pattern flex items-center justify-center shadow-inner"
          style={{
            backgroundColor: 'var(--bg-canvas)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {/* Canvas Legend */}
          <div
            className="absolute top-3 left-3 backdrop-blur-md border rounded-lg p-2.5 text-[11px] font-mono space-y-1.5 z-10"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Node Legend</div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span className="text-slate-300">Darknet Vendor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              <span className="text-slate-300">Telegram / Forum Alias</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-slate-300">PGP Fingerprint (Key Link)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-300">Crypto Deposit Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              <span className="text-slate-300">Dead Drop Location</span>
            </div>
          </div>

          {/* SVG Graph Elements */}
          <svg 
            className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-150"
            style={{ transform: `scale(${zoomLevel})` }}
            viewBox="0 0 1000 480"
          >
            <defs>
              <linearGradient id="edgeGradAlert" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Render Edges */}
            {filteredEdges.map((edge) => {
              const sourceNode = filteredNodes.find((n) => n.id === edge.source);
              const targetNode = filteredNodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isSelected = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target);

              return (
                <g key={edge.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isSelected ? '#38bdf8' : edge.type === 'alert' ? '#10b981' : '#27334d'}
                    strokeWidth={isSelected ? 2.5 : edge.type === 'alert' ? 2 : 1.5}
                    strokeDasharray={edge.type === 'dashed' ? '4 4' : undefined}
                    className="transition-colors duration-200"
                  />
                  {/* Midpoint Label for alert edges */}
                  {edge.type === 'alert' && (
                    <text
                      x={(sourceNode.x! + targetNode.x!) / 2}
                      y={(sourceNode.y! + targetNode.y!) / 2 - 4}
                      fill="#34d399"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none bg-black/80"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Render Nodes */}
            {filteredNodes.map((node) => {
              const colors = getNodeColor(node.type);
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-all duration-200 group"
                >
                  {/* Glow Ring for Selected / Flagged */}
                  {(isSelected || node.isFlagged) && (
                    <circle
                      r={isSelected ? 24 : 18}
                      fill="none"
                      stroke={colors.bg}
                      strokeWidth={isSelected ? 3 : 1.5}
                      opacity={isSelected ? 0.8 : 0.4}
                      className={isSelected ? 'animate-pulse-subtle' : ''}
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r={node.type === 'pgp' || node.type === 'wallet' ? 15 : 17}
                    fill="#0e121a"
                    stroke={colors.bg}
                    strokeWidth={2}
                  />

                  {/* Inner Node Icon Indicator */}
                  <circle
                    r={6}
                    fill={colors.bg}
                  />

                  {/* Node Label Text */}
                  <text
                    y={28}
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow-md"
                  >
                    {node.label}
                  </text>

                  {/* Subtext indicator */}
                  <text
                    y={40}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.type.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right Details Card (1 col) */}
        <div
          className="rounded-xl border p-4 flex flex-col justify-between shadow-xs space-y-4"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          {selectedNode ? (
            <div className="space-y-4">
              <div
                className="flex items-center justify-between border-b pb-2.5"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: getNodeColor(selectedNode.type).bg }}
                  />
                  <span className="text-xs font-mono uppercase font-bold text-slate-400">
                    {selectedNode.type} Node
                  </span>
                </div>
                {selectedNode.threatScore && (
                  <span className="text-xs font-mono font-bold text-rose-400">
                    Risk: {selectedNode.threatScore}/100
                  </span>
                )}
              </div>

              <div>
                <div
                  className="text-base font-bold font-mono"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {selectedNode.label}
                </div>
                <div className="text-xs text-slate-400 font-sans mt-0.5">
                  {selectedNode.sublabel}
                </div>
              </div>

              {/* Connected Linked Entities */}
              <div
                className="space-y-2 pt-2 border-t"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">
                  Direct Graph Connections ({filteredEdges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id).length})
                </div>

                <div className="space-y-1.5">
                  {filteredEdges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge) => {
                      const otherNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                      const otherNode = mockNetworkNodes.find((n) => n.id === otherNodeId);
                      if (!otherNode) return null;

                      return (
                        <div
                          key={edge.id}
                          onClick={() => setSelectedNode(otherNode)}
                          className="p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-colors text-xs font-mono"
                          style={{
                            backgroundColor: 'var(--bg-subtle)',
                            borderColor: 'var(--border-subtle)',
                          }}
                        >
                          <div className="space-y-0.5 truncate">
                            <div
                              className="truncate font-semibold"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {otherNode.label}
                            </div>
                            <div
                              className="text-[10px]"
                              style={{ color: 'var(--accent-primary-text)' }}
                            >
                              {edge.label}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500">&rarr;</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Entity Resolution Insight */}
              <div
                className="p-3 rounded-lg border text-xs space-y-1"
                style={{
                  backgroundColor: 'var(--bg-accent-subtle)',
                  borderColor: 'var(--border-accent)',
                }}
              >
                <div
                  className="flex items-center gap-1.5 font-bold font-mono text-[11px]"
                  style={{ color: 'var(--accent-primary-text)' }}
                >
                  <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--accent-primary)' }} />
                  <span>Cross-Platform Correlation</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  This identity fingerprint links multiple darknet listings with active Telegram channels, breaking vendor alias anonymization across platform takedowns.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 font-mono text-xs py-20">
              Select a node in the graph to inspect entity resolution links.
            </div>
          )}

          {/* Jump to Investigation Feed */}
          {selectedNode && (
            <div
              className="pt-3 border-t"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <button
                onClick={() => {
                  if (onSelectListingByVendor && selectedNode) {
                    onSelectListingByVendor(selectedNode.label);
                  }
                }}
                className="w-full py-2 rounded-lg font-mono text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-accent)',
                  color: 'var(--accent-primary-content)',
                }}
              >
                Inspect Threat Listings &rarr;
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
