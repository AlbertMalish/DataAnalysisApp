import React, { useState, useMemo } from 'react';
import { practiceDatasets } from '../../data/practiceDatasets';
import { Dataset, ToolId } from '../../types';
import { 
  Database, 
  Search, 
  Download, 
  Table as TableIcon, 
  FileSpreadsheet, 
  BarChart3, 
  ArrowUpRight,
  Filter,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Layers
} from 'lucide-react';

interface PracticeDatasetsViewProps {
  onOpenInTool?: (toolId: ToolId, datasetId: string) => void;
}

export const PracticeDatasetsView: React.FC<PracticeDatasetsViewProps> = ({ onOpenInTool }) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('global_superstore');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDictionary, setShowDictionary] = useState<boolean>(false);

  const dataset = practiceDatasets.find(d => d.id === selectedDatasetId) || practiceDatasets[0];

  // Filtered rows based on search
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return dataset.rows;
    const q = searchQuery.toLowerCase();
    return dataset.rows.filter(r => {
      return Object.values(r).some(val => String(val).toLowerCase().includes(q));
    });
  }, [dataset, searchQuery]);

  // Summary statistics for numeric columns
  const numericStats = useMemo(() => {
    const numCols = dataset.columns.filter(c => c.type === 'number');
    return numCols.map(col => {
      const vals = dataset.rows.map(r => Number(r[col.name])).filter(n => !isNaN(n));
      const total = vals.reduce((a, b) => a + b, 0);
      const avg = vals.length ? total / vals.length : 0;
      const min = vals.length ? Math.min(...vals) : 0;
      const max = vals.length ? Math.max(...vals) : 0;
      return {
        colName: col.name,
        total: Math.round(total * 100) / 100,
        avg: Math.round(avg * 100) / 100,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100
      };
    });
  }, [dataset]);

  const handleDownloadCsv = () => {
    const headers = dataset.columns.map(c => c.name);
    let csv = headers.join(',') + '\n';
    dataset.rows.forEach(r => {
      const rowVals = headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`);
      csv += rowVals.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataset.id}_dataset.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950/70">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white">Practice Datasets Repository</h2>
            <p className="text-xs text-slate-400">
              Clean, curated datasets with data dictionaries designed for SQL, Spreadsheets, Power BI & Tableau
            </p>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Dataset selection pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {practiceDatasets.map(d => (
            <button
              key={d.id}
              onClick={() => {
                setSelectedDatasetId(d.id);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedDatasetId === d.id
                  ? 'bg-teal-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              {d.name} ({d.recordsCount} rows)
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-4">
        {/* Dataset Meta Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-teal-400 uppercase">{dataset.domain}</span>
                <span>·</span>
                <span>{dataset.columns.length} Columns</span>
                <span>·</span>
                <span>{dataset.recordsCount} Records</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{dataset.description}</p>
            </div>

            <button
              onClick={() => setShowDictionary(!showDictionary)}
              className="flex items-center gap-1 text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showDictionary ? 'Hide Dictionary' : 'Data Dictionary'}</span>
            </button>
          </div>

          {/* Quick Launch Actions */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Open Dataset In:</span>
            {onOpenInTool && (
              <>
                <button
                  onClick={() => onOpenInTool('excel', dataset.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-emerald-800/60 text-emerald-300 hover:bg-emerald-950/40 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Spreadsheet Lab</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
                <button
                  onClick={() => onOpenInTool('mysql', dataset.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-cyan-800/60 text-cyan-300 hover:bg-cyan-950/40 transition-colors"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>SQL Lab</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
                <button
                  onClick={() => onOpenInTool('powerbi', dataset.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-amber-800/60 text-amber-300 hover:bg-amber-950/40 transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>BI Visualizer</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Data Dictionary (collapsible) */}
        {showDictionary && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span>Column Specifications & Data Dictionary</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {dataset.columns.map(c => (
                <div key={c.name} className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-semibold text-teal-300">{c.name}</span>
                    <span className="text-[10px] uppercase font-mono text-slate-500">{c.type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Metric Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {numericStats.slice(0, 4).map(st => (
            <div key={st.colName} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400 truncate">{st.colName}</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                ${st.total.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Avg: ${st.avg.toLocaleString()}</span>
                <span>Max: ${st.max.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Search bar & Live Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search values in dataset..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Showing {filteredRows.length} of {dataset.rows.length} rows
            </span>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-x-auto bg-slate-950">
            <table className="min-w-full divide-y divide-slate-800 text-xs">
              <thead className="bg-slate-900 font-mono text-slate-300">
                <tr>
                  <th className="w-10 px-3 py-2 text-center text-slate-500 border-r border-slate-800">#</th>
                  {dataset.columns.map(col => (
                    <th key={col.name} className="px-3 py-2 text-left font-semibold text-slate-300 border-r border-slate-800 last:border-r-0 whitespace-nowrap">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-3 py-1.5 text-center text-slate-500 border-r border-slate-800">{idx + 1}</td>
                    {dataset.columns.map(col => {
                      const val = row[col.name];
                      const isNum = col.type === 'number';
                      return (
                        <td key={col.name} className={`px-3 py-1.5 border-r border-slate-800 last:border-r-0 whitespace-nowrap ${
                          isNum ? 'text-right text-emerald-400' : 'text-slate-300'
                        }`}>
                          {val !== null && val !== undefined ? String(val) : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
