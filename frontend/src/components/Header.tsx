import React from 'react';
import { Shield, Radio, FileText, UserCheck, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  currentView: 'stream' | 'dossier';
  onNavigateStream: () => void;
  onOpenStix: () => void;
  onOpenPipelineModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateStream,
  onOpenStix,
  onOpenPipelineModal,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-black/90 backdrop-blur-md px-4 py-2.5 sticky top-0 z-40">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Branding & Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-zinc-900 border border-zinc-800 text-zinc-100">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider text-zinc-100 uppercase">
                  CTI SENTINEL
                </span>
                <span className="rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.2 text-[10px] font-semibold text-zinc-300 tracking-wide uppercase">
                  Narcotics Track
                </span>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                <span>Chandigarh Police Cyber Cell</span>
                {currentView === 'dossier' && (
                  <>
                    <span>/</span>
                    <button
                      onClick={onNavigateStream}
                      className="text-zinc-300 hover:text-white flex items-center gap-0.5"
                    >
                      <ArrowLeft className="h-2.5 w-2.5 inline" /> Stream
                    </button>
                    <span>/</span>
                    <span className="text-zinc-200">Case Dossier</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions & Pipeline Status */}
        <div className="flex items-center gap-2.5">
          {/* Active LangGraph Status Indicator */}
          <div className="flex items-center gap-2 rounded bg-zinc-950 border border-zinc-800 px-2.5 py-1 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-zinc-500">STATUS:</span>
            <span className="text-[11px] font-mono font-medium text-emerald-400">
              STREAM ACTIVE
            </span>
          </div>

          {/* Quick Actions */}
          <button
            onClick={onOpenPipelineModal}
            className="flex items-center gap-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-200 transition-colors"
            title="Open Autonomous Agent Pipeline Simulator"
          >
            <Radio className="h-3.5 w-3.5 text-zinc-300" />
            <span>Agent Simulator</span>
          </button>

          <button
            onClick={onOpenStix}
            className="flex items-center gap-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-200 transition-colors"
            title="Inspect OASIS STIX 2.1 Threat Intel Bundle"
          >
            <FileText className="h-3.5 w-3.5 text-amber-400" />
            <span>STIX 2.1</span>
          </button>

          {/* User Profile */}
          <div className="hidden sm:flex items-center gap-2 border-l border-zinc-800 pl-3">
            <div className="h-7 w-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <UserCheck className="h-3.5 w-3.5 text-zinc-300" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-semibold text-zinc-200">Cyber SOC Analyst</div>
              <div className="text-[9px] text-zinc-500 font-mono">CC-CHD #419</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
