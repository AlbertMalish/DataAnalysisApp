import React, { useState, useMemo } from 'react';
import { practiceDatasets } from '../../data/practiceDatasets';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  LayoutDashboard, 
  Filter, 
  Layers, 
  Code, 
  Eye, 
  Sparkles,
  Info
} from 'lucide-react';

export const BiTableauVisualizer: React.FC = () => {
  const [toolPerspective, setToolPerspective] = useState<'powerbi' | 'tableau'>('powerbi');
  const [datasetId, setDatasetId] = useState<string>('global_superstore');
  const [chartType, setChartType] = useState<'bar' | 'hbar' | 'donut' | 'kpi' | 'table'>('bar');
  
  // Visual config
  const [dimensionCol, setDimensionCol] = useState<string>('region');
  const [measureCol, setMeasureCol] = useState<string>('sales');
  const [aggregation, setAggregation] = useState<'SUM' | 'AVG' | 'COUNT' | 'MAX'>('SUM');
  const [selectedBarFilter, setSelectedBarFilter] = useState<string | null>(null);

  const dataset = practiceDatasets.find(d => d.id === datasetId) || practiceDatasets[0];

  // Eligible dimensions and measures
  const dimensions = dataset.columns.filter(c => c.type === 'string');
  const measures = dataset.columns.filter(c => c.type === 'number');

  // Compute aggregated data
  const chartData = useMemo(() => {
    const map = new Map<string, number[]>();

    for (const row of dataset.rows) {
      const dimVal = String(row[dimensionCol] ?? 'Unknown');
      const numVal = Number(row[measureCol]) || 0;
      if (!map.has(dimVal)) map.set(dimVal, []);
      map.get(dimVal)!.push(numVal);
    }

    const items = Array.from(map.entries()).map(([dim, values]) => {
      let metric = 0;
      if (aggregation === 'SUM') {
        metric = values.reduce((s, v) => s + v, 0);
      } else if (aggregation === 'AVG') {
        metric = values.reduce((s, v) => s + v, 0) / (values.length || 1);
      } else if (aggregation === 'COUNT') {
        metric = values.length;
      } else if (aggregation === 'MAX') {
        metric = Math.max(...values);
      }
      return {
        label: dim,
        value: Math.round(metric * 100) / 100,
        count: values.length
      };
    });

    items.sort((a, b) => b.value - a.value);
    return items;
  }, [dataset, dimensionCol, measureCol, aggregation]);

  const maxVal = Math.max(...chartData.map(d => d.value), 1);
  const totalVal = chartData.reduce((acc, curr) => acc + curr.value, 0);

  // DAX & Tableau Syntax generation
  const daxFormula = useMemo(() => {
    const measureName = `[${aggregation} of ${measureCol}]`;
    const tabName = dataset.name.replace(/\s+/g, '');
    return `${measureName} = \n${aggregation}('${tabName}'[${measureCol}])\n\n-- With Filter Context:\n[${measureName} (${selectedBarFilter || 'East'})] = \nCALCULATE(\n    ${measureName},\n    '${tabName}'[${dimensionCol}] = "${selectedBarFilter || 'East'}"\n)`;
  }, [aggregation, measureCol, dataset.name, dimensionCol, selectedBarFilter]);

  const tableauFormula = useMemo(() => {
    return `// Tableau Calculated Field:\n{ FIXED [${dimensionCol}] : ${aggregation}([${measureCol}]) }\n\n// Shelf Encodings:\nColumns: [${dimensionCol}] (Blue Discrete Dimension)\nRows:    ${aggregation}([${measureCol}]) (Green Continuous Measure)`;
  }, [dimensionCol, aggregation, measureCol]);

  const colorPalette = [
    '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-slate-800 bg-slate-950/70 gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <LayoutDashboard className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Power BI & Tableau Dashboard Studio</h2>
            <p className="text-xs text-slate-400">Visual Analytics, DAX Measures & LOD Expressions</p>
          </div>
        </div>

        {/* Perspective Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
          <button
            onClick={() => setToolPerspective('powerbi')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              toolPerspective === 'powerbi' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Power BI Mode
          </button>
          <button
            onClick={() => setToolPerspective('tableau')}
            className={`px-3 py-1 rounded-md font-medium transition-colors ${
              toolPerspective === 'tableau' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tableau Mode
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-4">
        {/* Visual Builder Configuration Deck */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-2.5">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Dataset & Encodings</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Dataset:</span>
              <select
                value={datasetId}
                onChange={(e) => {
                  setDatasetId(e.target.value);
                  setSelectedBarFilter(null);
                }}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200"
              >
                {practiceDatasets.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            {/* Dimension Selection */}
            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
                <span className={toolPerspective === 'tableau' ? 'text-blue-400 font-semibold' : 'text-slate-300'}>
                  {toolPerspective === 'tableau' ? 'Dimension (Blue Pill)' : 'Category Axis'}
                </span>
              </label>
              <select
                value={dimensionCol}
                onChange={(e) => {
                  setDimensionCol(e.target.value);
                  setSelectedBarFilter(null);
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {dimensions.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Measure Selection */}
            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1">
                <span className={toolPerspective === 'tableau' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                  {toolPerspective === 'tableau' ? 'Measure (Green Pill)' : 'Value Field'}
                </span>
              </label>
              <select
                value={measureCol}
                onChange={(e) => setMeasureCol(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
              >
                {measures.map(m => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Aggregation */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Aggregation</label>
              <select
                value={aggregation}
                onChange={(e) => setAggregation(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              >
                <option value="SUM">SUM</option>
                <option value="AVG">AVERAGE</option>
                <option value="COUNT">COUNT</option>
                <option value="MAX">MAX</option>
              </select>
            </div>

            {/* Visual Type */}
            <div>
              <label className="block text-slate-400 font-medium mb-1">Visual Type</label>
              <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  onClick={() => setChartType('bar')}
                  title="Column Bar"
                  className={`p-1.5 rounded flex items-center justify-center ${chartType === 'bar' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setChartType('donut')}
                  title="Donut / Pie"
                  className={`p-1.5 rounded flex items-center justify-center ${chartType === 'donut' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <PieIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setChartType('kpi')}
                  title="KPI Cards"
                  className={`p-1.5 rounded flex items-center justify-center ${chartType === 'kpi' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setChartType('table')}
                  title="Matrix Table"
                  className={`p-1.5 rounded flex items-center justify-center ${chartType === 'table' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Visual Stage */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {aggregation} of {measureCol} by {dimensionCol}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedBarFilter ? (
                  <span className="text-amber-400 font-medium">Cross-filtering on: {selectedBarFilter} (Click to reset)</span>
                ) : (
                  <span>Click any bar or slice to cross-filter</span>
                )}
              </p>
            </div>

            {selectedBarFilter && (
              <button
                onClick={() => setSelectedBarFilter(null)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                Clear Slicer
              </button>
            )}
          </div>

          {/* Render Visual */}
          {chartType === 'bar' && (
            <div className="py-4">
              <div className="h-60 flex items-end gap-3 sm:gap-6 border-b border-l border-slate-800 px-3 pb-2">
                {chartData.map((item, idx) => {
                  const heightPct = Math.round((item.value / maxVal) * 100);
                  const isSelected = selectedBarFilter === item.label;
                  const isDimmed = selectedBarFilter && !isSelected;
                  const barColor = colorPalette[idx % colorPalette.length];

                  return (
                    <div
                      key={item.label}
                      onClick={() => setSelectedBarFilter(isSelected ? null : item.label)}
                      className={`flex-1 flex flex-col items-center justify-end h-full cursor-pointer group transition-all ${
                        isDimmed ? 'opacity-30' : 'opacity-100'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        ${item.value.toLocaleString()}
                      </div>
                      <div
                        style={{ height: `${Math.max(heightPct, 6)}%`, backgroundColor: barColor }}
                        className={`w-full max-w-[48px] rounded-t-md transition-all group-hover:brightness-125 ${
                          isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 shadow-lg' : ''
                        }`}
                      />
                      <span className="text-[11px] text-slate-300 font-medium truncate w-full text-center mt-2 group-hover:text-amber-300">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {chartType === 'donut' && (
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="flex justify-center">
                <div className="relative w-44 h-44 rounded-full flex items-center justify-center border-4 border-slate-800 bg-slate-900/50">
                  <div className="text-center">
                    <div className="text-xs text-slate-400 uppercase font-semibold">Total</div>
                    <div className="text-lg font-bold text-white font-mono">${totalVal.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">{chartData.length} categories</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {chartData.map((item, idx) => {
                  const pct = totalVal > 0 ? Math.round((item.value / totalVal) * 100) : 0;
                  const barColor = colorPalette[idx % colorPalette.length];
                  return (
                    <div
                      key={item.label}
                      onClick={() => setSelectedBarFilter(selectedBarFilter === item.label ? null : item.label)}
                      className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: barColor }} />
                        <span className="text-xs text-slate-200 font-medium">{item.label}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-300">
                        ${item.value.toLocaleString()} <span className="text-slate-500">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {chartType === 'kpi' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Total {measureCol}</div>
                <div className="text-xl font-bold text-amber-400 font-mono mt-1">${totalVal.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 mt-1">Across all {dimensionCol}s</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Top Performing</div>
                <div className="text-xl font-bold text-emerald-400 font-mono mt-1">{chartData[0]?.label || 'N/A'}</div>
                <div className="text-[10px] text-slate-400 mt-1">${chartData[0]?.value.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Average / Group</div>
                <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
                  ${Math.round(totalVal / (chartData.length || 1)).toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Benchmark</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Distinct Segments</div>
                <div className="text-xl font-bold text-purple-400 font-mono mt-1">{chartData.length}</div>
                <div className="text-[10px] text-slate-400 mt-1">Dimension Grain</div>
              </div>
            </div>
          )}

          {chartType === 'table' && (
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-slate-800 text-xs">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-300">{dimensionCol}</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-300">{aggregation} of {measureCol}</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-300">% Share</th>
                    <th className="px-3 py-2 text-right font-semibold text-slate-300">Row Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {chartData.map((row) => {
                    const pct = totalVal > 0 ? ((row.value / totalVal) * 100).toFixed(1) : '0';
                    return (
                      <tr key={row.label} className="hover:bg-slate-900/40">
                        <td className="px-3 py-2 text-slate-200 font-sans font-medium">{row.label}</td>
                        <td className="px-3 py-2 text-right text-amber-400 font-semibold">${row.value.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-slate-400">{pct}%</td>
                        <td className="px-3 py-2 text-right text-slate-500">{row.count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Code Formulation Deck (DAX vs Tableau) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 sm:p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Code className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase tracking-wider">Power BI DAX Equivalent</h4>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-amber-200 overflow-x-auto leading-relaxed border border-slate-800">
              {daxFormula}
            </pre>
            <p className="mt-2 text-[11px] text-slate-400">
              In Power BI, measures evaluate dynamically under visual filter context rather than occupying physical space in memory.
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 mb-2 text-orange-400">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-xs font-semibold uppercase tracking-wider">Tableau LOD / Calculated Field</h4>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg text-xs font-mono text-orange-200 overflow-x-auto leading-relaxed border border-slate-800">
              {tableauFormula}
            </pre>
            <p className="mt-2 text-[11px] text-slate-400">
              Tableau separates categorical discrete Blue pills (headers) from numerical continuous Green pills (axes).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
