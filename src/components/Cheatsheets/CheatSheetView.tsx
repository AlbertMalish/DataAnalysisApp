import React, { useState } from 'react';
import { ToolId } from '../../types';
import { 
  BookMarked, 
  Search, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Database, 
  BarChart3, 
  PieChart, 
  Smartphone,
  ExternalLink
} from 'lucide-react';

interface CheatItem {
  tool: ToolId;
  name: string;
  category: string;
  syntax: string;
  description: string;
  example: string;
}

const cheatItems: CheatItem[] = [
  // EXCEL / SHEETS
  {
    tool: 'excel',
    name: 'XLOOKUP',
    category: 'Lookup & Reference',
    syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode])',
    description: 'Modern exact-match lookup in any direction; immune to column additions.',
    example: '=XLOOKUP(A2, Customers!A:A, Customers!D:D, "Unknown")'
  },
  {
    tool: 'excel',
    name: 'VLOOKUP',
    category: 'Lookup & Reference',
    syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: 'Classic vertical lookup. Always pass FALSE (or 0) for exact match.',
    example: '=VLOOKUP(A2, Products!$A$2:$F$100, 3, FALSE)'
  },
  {
    tool: 'excel',
    name: 'INDEX & MATCH',
    category: 'Lookup & Reference',
    syntax: '=INDEX(return_range, MATCH(lookup_val, lookup_range, 0))',
    description: 'Two-way flexible lookup pairing position lookup with index retrieval.',
    example: '=INDEX(C2:C100, MATCH(E2, A2:A100, 0))'
  },
  {
    tool: 'excel',
    name: 'SUMIF / COUNTIF',
    category: 'Conditionals',
    syntax: '=SUMIF(range, criteria, [sum_range])',
    description: 'Sum or count values that meet specific text or numerical conditions.',
    example: '=SUMIF(D2:D100, "Technology", H2:H100)'
  },
  {
    tool: 'excel',
    name: 'TRIM & PROPER',
    category: 'Text Cleaning',
    syntax: '=TRIM(text) / =PROPER(text)',
    description: 'TRIM eliminates rogue trailing spaces; PROPER standardizes to Title Case.',
    example: '=PROPER(TRIM(B2))'
  },

  // MYSQL
  {
    tool: 'mysql',
    name: 'GROUP BY & HAVING',
    category: 'Aggregations',
    syntax: 'SELECT col, AGG(val) FROM tbl GROUP BY col HAVING AGG(val) > limit;',
    description: 'WHERE filters rows before group aggregation; HAVING filters groups after aggregation.',
    example: 'SELECT region, SUM(sales) as rev FROM orders GROUP BY region HAVING rev > 5000;'
  },
  {
    tool: 'mysql',
    name: 'INNER JOIN vs LEFT JOIN',
    category: 'Relational Joins',
    syntax: 'SELECT * FROM tbl_a [INNER | LEFT] JOIN tbl_b ON tbl_a.key = tbl_b.key;',
    description: 'INNER JOIN keeps matches only; LEFT JOIN preserves all rows from the left table.',
    example: 'SELECT o.id, c.name FROM orders o LEFT JOIN customers c ON o.cust_id = c.id;'
  },
  {
    tool: 'mysql',
    name: 'Window RANK() / DENSE_RANK()',
    category: 'Window Functions',
    syntax: 'RANK() OVER (PARTITION BY group_col ORDER BY metric_col DESC)',
    description: 'Calculates rank without collapsing individual records.',
    example: 'SELECT emp_id, RANK() OVER (PARTITION BY dept ORDER BY salary DESC) as rnk FROM hr;'
  },

  // POWER BI
  {
    tool: 'powerbi',
    name: 'CALCULATE',
    category: 'DAX Filter Context',
    syntax: 'CALCULATE(<expression>, <filter1>, <filter2>, ...)',
    description: 'The engine of DAX. Evaluates an expression inside an overridden filter context.',
    example: 'Total East Sales = CALCULATE([Total Sales], Orders[Region] = "East")'
  },
  {
    tool: 'powerbi',
    name: 'ALL() for Market Share',
    category: 'DAX Removal',
    syntax: 'DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Orders[Region])))',
    description: 'Ignores visual dimension filters to calculate global percentage benchmarks.',
    example: 'Share % = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Orders[Region])))'
  },
  {
    tool: 'powerbi',
    name: 'SAFE DIVIDE',
    category: 'DAX Math',
    syntax: 'DIVIDE(<numerator>, <denominator>, [<alternate_value>])',
    description: 'Prevents division-by-zero crashes by returning safe null or 0.',
    example: 'Margin % = DIVIDE([Profit], [Sales], 0)'
  },

  // TABLEAU
  {
    tool: 'tableau',
    name: 'FIXED Level of Detail (LOD)',
    category: 'LOD Calculations',
    syntax: '{ FIXED [Dimension1], [Dimension2] : AGG([Measure]) }',
    description: 'Computes measure aggregates at the exact grain of the specified dimensions.',
    example: '{ FIXED [Customer ID] : SUM([Sales]) }'
  },
  {
    tool: 'tableau',
    name: 'INCLUDE / EXCLUDE LOD',
    category: 'LOD Calculations',
    syntax: '{ INCLUDE [Dim] : AGG([Measure]) } / { EXCLUDE [Dim] : AGG([Measure]) }',
    description: 'Calculates at finer or coarser granularity than the current visual shelf.',
    example: '{ EXCLUDE [Sub-Category] : SUM([Sales]) }'
  },

  // KOBO COLLECT
  {
    tool: 'kobocollect',
    name: 'relevant (Skip Logic)',
    category: 'XLSForm Syntax',
    syntax: '${question_name} = \'choice_code\'',
    description: 'Controls conditional visibility of questions based on prior answers.',
    example: '${is_pregnant} = \'yes\' and ${age} >= 15'
  },
  {
    tool: 'kobocollect',
    name: 'constraint (Data Validation)',
    category: 'XLSForm Syntax',
    syntax: '. >= min_value and . <= max_value',
    description: 'Enforces valid answer ranges. The dot (.) references this question value.',
    example: '. >= 18 and . <= 100'
  },
  {
    tool: 'kobocollect',
    name: 'selected() for Multi-Select',
    category: 'XLSForm Syntax',
    syntax: 'selected(${multi_question_name}, \'target_choice\')',
    description: 'Checks whether a choice is checked inside select_multiple questions.',
    example: 'selected(${symptoms}, \'fever\')'
  }
];

export const CheatSheetView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | ToolId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filtered = cheatItems.filter(item => {
    const matchesTool = activeFilter === 'all' || item.tool === activeFilter;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.syntax.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTool && matchesSearch;
  });

  const handleCopy = (syntax: string, key: string) => {
    navigator.clipboard.writeText(syntax);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Top Header */}
      <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold">
            <BookMarked className="w-4 h-4" />
            <span>Developer Reference</span>
          </div>
          <h2 className="text-xl font-bold text-white">Syntax & Formula Cheat Sheets</h2>
          <p className="text-xs text-slate-300">
            Rapid reference guide for Excel functions, MySQL queries, Power BI DAX, Tableau LODs, and Kobo XLSForm tags.
          </p>

          {/* Search bar */}
          <div className="relative pt-2">
            <Search className="w-4 h-4 absolute left-3 top-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas (e.g. XLOOKUP, CALCULATE, relevant, GROUP BY)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'all'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              All Tools ({cheatItems.length})
            </button>
            <button
              onClick={() => setActiveFilter('excel')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'excel'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Excel & Sheets
            </button>
            <button
              onClick={() => setActiveFilter('mysql')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'mysql'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              MySQL
            </button>
            <button
              onClick={() => setActiveFilter('powerbi')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'powerbi'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Power BI DAX
            </button>
            <button
              onClick={() => setActiveFilter('tableau')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'tableau'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Tableau
            </button>
            <button
              onClick={() => setActiveFilter('kobocollect')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === 'kobocollect'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Kobo Collect
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Cheat Cards */}
      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No formulas match "{searchQuery}". Try searching for SUM, JOIN, or LOD.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item, idx) => {
              const cardKey = `${item.tool}-${item.name}-${idx}`;
              const isCopied = copiedKey === cardKey;

              return (
                <div
                  key={cardKey}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-[10px] uppercase font-mono font-semibold text-teal-400">
                        <span>{item.tool}</span>
                        <span>·</span>
                        <span className="text-slate-500">{item.category}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5">{item.name}</h3>
                    </div>

                    <button
                      onClick={() => handleCopy(item.syntax, cardKey)}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Copy Syntax"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-xs text-teal-300 overflow-x-auto">
                    {item.syntax}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>

                  <div className="pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-400">
                    <span className="text-slate-500 block text-[10px] uppercase mb-0.5">Example:</span>
                    <span className="text-slate-200">{item.example}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
