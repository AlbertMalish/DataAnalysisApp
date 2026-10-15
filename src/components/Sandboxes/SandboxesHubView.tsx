import React, { useState } from 'react';
import { ToolId } from '../../types';
import { SpreadsheetSandbox } from './SpreadsheetSandbox';
import { SqlSandbox } from './SqlSandbox';
import { BiTableauVisualizer } from './BiTableauVisualizer';
import { KoboCollectSimulator } from './KoboCollectSimulator';
import { 
  FileSpreadsheet, 
  Database, 
  BarChart3, 
  Smartphone,
  Layers
} from 'lucide-react';

interface SandboxesHubViewProps {
  initialTool?: ToolId;
}

export const SandboxesHubView: React.FC<SandboxesHubViewProps> = ({ initialTool = 'excel' }) => {
  const [activeLab, setActiveLab] = useState<ToolId>(initialTool);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Top Sandbox Selector Strip */}
      <div className="flex items-center gap-1.5 p-2 bg-slate-950 border-b border-slate-800 overflow-x-auto shrink-0">
        <button
          onClick={() => setActiveLab('excel')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeLab === 'excel'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Excel Lab</span>
        </button>

        <button
          onClick={() => setActiveLab('mysql')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeLab === 'mysql'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MySQL Lab</span>
        </button>

        <button
          onClick={() => setActiveLab('powerbi')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeLab === 'powerbi' || activeLab === 'tableau'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Power BI & Tableau</span>
        </button>

        <button
          onClick={() => setActiveLab('kobocollect')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeLab === 'kobocollect'
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Kobo Collect</span>
        </button>
      </div>

      {/* Main Sandbox Content Stage */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeLab === 'excel' && <SpreadsheetSandbox />}
        {activeLab === 'mysql' && <SqlSandbox />}
        {(activeLab === 'powerbi' || activeLab === 'tableau') && <BiTableauVisualizer />}
        {activeLab === 'kobocollect' && <KoboCollectSimulator />}
      </div>
    </div>
  );
};
