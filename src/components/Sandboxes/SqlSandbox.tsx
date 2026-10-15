import React, { useState } from 'react';
import { executeSql, SqlQueryResult } from '../../utils/sqlEngine';
import { practiceDatasets } from '../../data/practiceDatasets';
import { 
  Database, 
  Play, 
  RotateCcw, 
  Download, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const SqlSandbox: React.FC = () => {
  const [selectedTableId, setSelectedTableId] = useState<string>('global_superstore');
  const [queryInput, setQueryInput] = useState<string>(
    `SELECT \n  region,\n  category,\n  COUNT(*) AS order_count,\n  SUM(sales) AS total_sales,\n  ROUND(AVG(profit), 2) AS avg_profit\nFROM global_superstore\nGROUP BY region, category\nORDER BY total_sales DESC;`
  );
  const [result, setResult] = useState<SqlQueryResult>(() => executeSql(
    `SELECT \n  region,\n  category,\n  COUNT(*) AS order_count,\n  SUM(sales) AS total_sales,\n  ROUND(AVG(profit), 2) AS avg_profit\nFROM global_superstore\nGROUP BY region, category\nORDER BY total_sales DESC;`
  ));
  const [showSchema, setShowSchema] = useState<boolean>(false);

  const currentDataset = practiceDatasets.find(d => d.id === selectedTableId) || practiceDatasets[0];

  const handleRun = () => {
    const res = executeSql(queryInput);
    setResult(res);
  };

  const handlePresetQuery = (sql: string, tableId?: string) => {
    if (tableId) setSelectedTableId(tableId);
    setQueryInput(sql);
    const res = executeSql(sql);
    setResult(res);
  };

  const handleExportCsv = () => {
    if (!result || result.rows.length === 0) return;
    let csv = result.columns.join(',') + '\n';
    result.rows.forEach(r => {
      const rowVals = result.columns.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`);
      csv += rowVals.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sql_results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Top Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950/70 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">MySQL & SQL Console</h2>
            <p className="text-xs text-slate-400">Interactive Relational Query Runner</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSchema(!showSchema)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              showSchema
                ? 'bg-cyan-950/70 border-cyan-700 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schema Explorer</span>
          </button>

          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Query</span>
          </button>
        </div>
      </div>

      {/* Schema Drawer (collapsible) */}
      {showSchema && (
        <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Table Schema:</span>
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-cyan-300 font-mono"
              >
                {practiceDatasets.map(d => (
                  <option key={d.id} value={d.id}>{d.id} ({d.recordsCount} rows)</option>
                ))}
              </select>
            </span>
            <span className="text-slate-500">{currentDataset.domain}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {currentDataset.columns.map(c => (
              <div key={c.name} className="p-2 bg-slate-900 border border-slate-800 rounded">
                <div className="font-mono text-cyan-300 font-semibold">{c.name}</div>
                <div className="text-[10px] text-slate-500 uppercase">{c.type}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5" title={c.description}>
                  {c.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preset Starters */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto text-[11px]">
        <span className="text-slate-500 text-[10px] uppercase font-semibold shrink-0">Sample Queries:</span>
        <button
          onClick={() => handlePresetQuery(
            `SELECT region, SUM(sales) as revenue, SUM(profit) as profit \nFROM global_superstore \nGROUP BY region \nORDER BY revenue DESC;`,
            'global_superstore'
          )}
          className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700 font-mono shrink-0"
        >
          Regional Sales
        </button>
        <button
          onClick={() => handlePresetQuery(
            `SELECT department, COUNT(*) as headcount, ROUND(AVG(monthly_salary), 2) as avg_salary \nFROM hr_employee_attrition \nGROUP BY department \nORDER BY avg_salary DESC;`,
            'hr_employee_attrition'
          )}
          className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700 font-mono shrink-0"
        >
          Dept Salaries
        </button>
        <button
          onClick={() => handlePresetQuery(
            `SELECT channel, ad_spend, revenue_generated, roas \nFROM ecommerce_marketing \nWHERE roas > 4 \nORDER BY roas DESC;`,
            'ecommerce_marketing'
          )}
          className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700 font-mono shrink-0"
        >
          High ROAS Channels
        </button>
        <button
          onClick={() => handlePresetQuery(
            `SELECT settlement_zone, primary_water_source, COUNT(*) as households \nFROM humanitarian_wash \nGROUP BY settlement_zone, primary_water_source;`,
            'humanitarian_wash'
          )}
          className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700 font-mono shrink-0"
        >
          WASH Sources
        </button>
      </div>

      {/* Query Input Editor */}
      <div className="p-3 bg-slate-950 border-b border-slate-800">
        <textarea
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          rows={5}
          placeholder="Write SQL query here... e.g. SELECT * FROM global_superstore WHERE profit > 100;"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Result Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950/60 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          {result.error ? (
            <div className="flex items-center gap-1.5 text-rose-400">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Query Failed</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{result.rowCount} rows returned</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-slate-500 font-mono">
            <Clock className="w-3 h-3" />
            <span>{result.executionTimeMs}ms</span>
          </div>
        </div>

        {result.rows.length > 0 && (
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      {/* Results View */}
      <div className="flex-1 overflow-auto p-2 bg-slate-950">
        {result.error ? (
          <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-800/50 text-rose-300 text-xs font-mono">
            <div className="font-semibold mb-1 text-rose-200">SQL Error:</div>
            <div>{result.error}</div>
            <div className="mt-3 text-slate-400 font-sans">
              Tip: Verify table name exists (e.g. <code>global_superstore</code>, <code>hr_employee_attrition</code>) and column names are spelled correctly.
            </div>
          </div>
        ) : result.rows.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            Query returned 0 rows. Try adjusting your WHERE filters.
          </div>
        ) : (
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-800 text-xs">
              <thead className="bg-slate-900">
                <tr>
                  <th className="w-10 px-3 py-2 text-center text-slate-500 border-r border-slate-800 font-mono">#</th>
                  {result.columns.map(col => (
                    <th key={col} className="px-3 py-2 text-left font-mono font-semibold text-cyan-300 border-r border-slate-800 last:border-r-0">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {result.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-3 py-1.5 text-center text-slate-500 border-r border-slate-800">{idx + 1}</td>
                    {result.columns.map(col => {
                      const val = row[col];
                      const isNum = typeof val === 'number';
                      return (
                        <td key={col} className={`px-3 py-1.5 border-r border-slate-800 last:border-r-0 truncate max-w-[180px] ${
                          isNum ? 'text-right text-slate-200' : 'text-slate-300'
                        }`}>
                          {val !== null && val !== undefined ? String(val) : <span className="text-slate-600">NULL</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
