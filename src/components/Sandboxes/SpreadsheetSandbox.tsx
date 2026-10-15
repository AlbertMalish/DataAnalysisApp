import React, { useState, useMemo } from 'react';
import { coordinateToA1, evaluateFormula } from '../../utils/spreadsheetEngine';
import { practiceDatasets } from '../../data/practiceDatasets';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Table as TableIcon, 
  Calculator, 
  Sparkles, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const SpreadsheetSandbox: React.FC = () => {
  // 7 columns (A to G), 14 rows (1 to 14)
  const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const ROWS = Array.from({ length: 14 }, (_, i) => i + 1);

  // Initialize with Superstore sample data
  const initialGrid = useMemo(() => {
    const grid: Record<string, string> = {};
    const dataset = practiceDatasets[0]; // Superstore

    // Headers on row 1
    grid['A1'] = 'OrderID';
    grid['B1'] = 'Customer';
    grid['C1'] = 'Region';
    grid['D1'] = 'Category';
    grid['E1'] = 'Sales';
    grid['F1'] = 'Quantity';
    grid['G1'] = 'Profit';

    dataset.rows.slice(0, 10).forEach((row, idx) => {
      const r = idx + 2;
      grid[`A${r}`] = String(row.order_id);
      grid[`B${r}`] = String(row.customer_name);
      grid[`C${r}`] = String(row.region);
      grid[`D${r}`] = String(row.category);
      grid[`E${r}`] = String(row.sales);
      grid[`F${r}`] = String(row.quantity);
      grid[`G${r}`] = String(row.profit);
    });

    // Summary calculations on rows 12 & 13
    grid['D12'] = 'Total Sales:';
    grid['E12'] = '=SUM(E2:E11)';
    grid['D13'] = 'Avg Profit:';
    grid['G13'] = '=AVERAGE(G2:G11)';

    return grid;
  }, []);

  const [grid, setGrid] = useState<Record<string, string>>(initialGrid);
  const [selectedCell, setSelectedCell] = useState<string>('E12');
  const [formulaInput, setFormulaInput] = useState<string>('=SUM(E2:E11)');
  const [activeTab, setActiveTab] = useState<'sheet' | 'pivot'>('sheet');
  const [pivotRowCol, setPivotRowCol] = useState<string>('Region');
  const [pivotValCol, setPivotValCol] = useState<string>('Sales');

  // Evaluated values memo
  const evaluatedCells = useMemo(() => {
    const evaluated: Record<string, any> = {};
    for (const key of Object.keys(grid)) {
      evaluated[key] = evaluateFormula(grid[key] ?? '', grid, evaluated);
    }
    return evaluated;
  }, [grid]);

  const handleCellClick = (cellKey: string) => {
    setSelectedCell(cellKey);
    setFormulaInput(grid[cellKey] ?? '');
  };

  const handleFormulaChange = (val: string) => {
    setFormulaInput(val);
    setGrid(prev => ({ ...prev, [selectedCell]: val }));
  };

  const handleQuickFormula = (snippet: string) => {
    setFormulaInput(snippet);
    setGrid(prev => ({ ...prev, [selectedCell]: snippet }));
  };

  const handleReset = () => {
    setGrid(initialGrid);
    setSelectedCell('E12');
    setFormulaInput('=SUM(E2:E11)');
  };

  const exportCsv = () => {
    let csv = '';
    ROWS.forEach(r => {
      const rowVals = COLS.map(c => {
        const val = evaluatedCells[`${c}${r}`] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csv += rowVals.join(',') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet_practice.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pivot Table calculation
  const pivotData = useMemo(() => {
    // Extract rows 2 to 11
    const groups = new Map<string, { count: number; total: number }>();
    const colIdxMap: Record<string, string> = {
      'Region': 'C',
      'Category': 'D',
      'Customer': 'B'
    };
    const valIdxMap: Record<string, string> = {
      'Sales': 'E',
      'Quantity': 'F',
      'Profit': 'G'
    };

    const rowColLetter = colIdxMap[pivotRowCol] || 'C';
    const valColLetter = valIdxMap[pivotValCol] || 'E';

    for (let r = 2; r <= 11; r++) {
      const catVal = String(evaluatedCells[`${rowColLetter}${r}`] ?? 'Other');
      const numVal = Number(evaluatedCells[`${valColLetter}${r}`]) || 0;

      const curr = groups.get(catVal) || { count: 0, total: 0 };
      groups.set(catVal, {
        count: curr.count + 1,
        total: Math.round((curr.total + numVal) * 100) / 100
      });
    }

    return Array.from(groups.entries()).map(([name, stat]) => ({
      name,
      count: stat.count,
      total: stat.total,
      average: Math.round((stat.total / stat.count) * 100) / 100
    }));
  }, [evaluatedCells, pivotRowCol, pivotValCol]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* Top action toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950/70 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Interactive Spreadsheet Lab</h2>
            <p className="text-xs text-slate-400">Excel & Google Sheets Live Formula Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('sheet')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'sheet' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setActiveTab('pivot')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'pivot' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pivot Table
            </button>
          </div>

          <button
            onClick={exportCsv}
            title="Download CSV"
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title="Reset Grid"
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeTab === 'sheet' ? (
        <>
          {/* Formula Bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="w-12 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center font-mono font-semibold text-emerald-400 shrink-0">
              {selectedCell}
            </div>
            <div className="text-slate-500 font-mono font-bold select-none shrink-0">fx</div>
            <input
              type="text"
              value={formulaInput}
              onChange={(e) => handleFormulaChange(e.target.value)}
              placeholder="Type number, text, or formula (=SUM, =AVERAGE, =IF...)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick formula chips */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto text-[11px]">
            <span className="text-slate-500 text-[10px] uppercase font-semibold shrink-0">Quick Insert:</span>
            <button
              onClick={() => handleQuickFormula('=SUM(E2:E11)')}
              className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 hover:bg-slate-700 border border-slate-700 font-mono shrink-0"
            >
              =SUM(E2:E11)
            </button>
            <button
              onClick={() => handleQuickFormula('=AVERAGE(G2:G11)')}
              className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 border border-slate-700 font-mono shrink-0"
            >
              =AVERAGE(G2:G11)
            </button>
            <button
              onClick={() => handleQuickFormula('=IF(E2>500,"High","Normal")')}
              className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700 font-mono shrink-0"
            >
              =IF(E2&gt;500,"High","Normal")
            </button>
            <button
              onClick={() => handleQuickFormula('=TRIM(B2)')}
              className="px-2 py-0.5 rounded bg-slate-800 text-purple-300 hover:bg-slate-700 border border-slate-700 font-mono shrink-0"
            >
              =TRIM(B2)
            </button>
          </div>

          {/* Grid Table */}
          <div className="flex-1 overflow-auto bg-slate-950 p-2">
            <div className="inline-block min-w-full align-middle border border-slate-800 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-slate-800 text-xs">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-400 font-mono">
                    <th className="w-10 px-2 py-1.5 text-center border-r border-slate-800 select-none bg-slate-900">#</th>
                    {COLS.map(col => (
                      <th key={col} className="px-3 py-1.5 text-center font-medium border-r border-slate-800 last:border-r-0 select-none">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {ROWS.map(rowNum => (
                    <tr key={rowNum} className="hover:bg-slate-800/30 transition-colors">
                      <td className="w-10 px-2 py-1 text-center text-slate-500 bg-slate-900/70 border-r border-slate-800 select-none font-semibold">
                        {rowNum}
                      </td>
                      {COLS.map(colLetter => {
                        const cellKey = `${colLetter}${rowNum}`;
                        const isSelected = selectedCell === cellKey;
                        const rawFormula = grid[cellKey] ?? '';
                        const evaluated = evaluatedCells[cellKey];
                        const isFormula = rawFormula.startsWith('=');
                        const isHeader = rowNum === 1;

                        return (
                          <td
                            key={colLetter}
                            onClick={() => handleCellClick(cellKey)}
                            className={`px-2.5 py-1 border-r border-slate-800/80 last:border-r-0 cursor-pointer select-none transition-all ${
                              isSelected
                                ? 'bg-emerald-950/50 outline outline-2 outline-emerald-500 z-10'
                                : isHeader
                                ? 'bg-slate-900/50 font-semibold text-slate-200'
                                : 'text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between min-w-[75px] max-w-[130px] overflow-hidden truncate">
                              <span className={`truncate ${isFormula ? 'text-emerald-400 font-medium' : ''}`}>
                                {evaluated !== undefined && evaluated !== null ? String(evaluated) : ''}
                              </span>
                              {isFormula && (
                                <span className="text-[9px] text-emerald-500/70 ml-1">fx</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active cell helper info */}
          <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Click any cell to edit formula. Try <code className="text-emerald-300">=SUM(E2:E11)</code> or <code className="text-emerald-300">=AVERAGE(G2:G11)</code></span>
            </div>
            <div className="font-mono text-slate-500">
              Cell {selectedCell}: {grid[selectedCell] || '(empty)'}
            </div>
          </div>
        </>
      ) : (
        /* Pivot Table View */
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Dynamic Pivot Summary</h3>
                <p className="text-xs text-slate-400">Aggregate dataset by custom dimensions and metrics</p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Row Group:</span>
                  <select
                    value={pivotRowCol}
                    onChange={(e) => setPivotRowCol(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="Region">Region (Col C)</option>
                    <option value="Category">Category (Col D)</option>
                    <option value="Customer">Customer (Col B)</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Values:</span>
                  <select
                    value={pivotValCol}
                    onChange={(e) => setPivotValCol(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 focus:outline-none"
                  >
                    <option value="Sales">Sales (Col E)</option>
                    <option value="Profit">Profit (Col G)</option>
                    <option value="Quantity">Quantity (Col F)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generated Pivot Matrix */}
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-slate-800 text-xs">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-slate-300">{pivotRowCol}</th>
                    <th className="px-4 py-2 text-right font-semibold text-slate-300">Record Count</th>
                    <th className="px-4 py-2 text-right font-semibold text-slate-300">Sum of {pivotValCol}</th>
                    <th className="px-4 py-2 text-right font-semibold text-slate-300">Average of {pivotValCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {pivotData.map((row) => (
                    <tr key={row.name} className="hover:bg-slate-900/50">
                      <td className="px-4 py-2 text-slate-200 font-sans font-medium">{row.name}</td>
                      <td className="px-4 py-2 text-right text-slate-400">{row.count}</td>
                      <td className="px-4 py-2 text-right text-emerald-400 font-semibold">${row.total.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right text-cyan-400">${row.average.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
