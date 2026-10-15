import { practiceDatasets } from '../data/practiceDatasets';

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export function executeSql(query: string): SqlQueryResult {
  const startTime = performance.now();
  const trimmed = query.trim().replace(/;+$/, '').trim();

  if (!trimmed) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
      error: 'Empty SQL query. Type a SELECT statement and click Run Query.'
    };
  }

  try {
    // 1. Identify FROM clause table
    const fromMatch = trimmed.match(/\bFROM\s+([a-zA-Z0-9_]+)/i);
    if (!fromMatch) {
      throw new Error('Missing FROM clause. Example: SELECT * FROM global_superstore');
    }

    const tableName = fromMatch[1].toLowerCase();
    const dataset = practiceDatasets.find(d => d.id.toLowerCase() === tableName);
    if (!dataset) {
      const validTables = practiceDatasets.map(d => d.id).join(', ');
      throw new Error(`Table "${tableName}" not found. Available tables: ${validTables}`);
    }

    let workingRows: Record<string, any>[] = dataset.rows.map(r => ({ ...r }));

    // 2. WHERE clause parsing
    const whereMatch = trimmed.match(/\bWHERE\s+([\s\S]+?)(?=\bGROUP\s+BY|\bORDER\s+BY|\bLIMIT|$)/i);
    if (whereMatch) {
      const conditionStr = whereMatch[1].trim();
      workingRows = filterRows(workingRows, conditionStr);
    }

    // 3. SELECT clause parsing
    const selectMatch = trimmed.match(/^SELECT\s+([\s\S]+?)\s+\bFROM\b/i);
    if (!selectMatch) {
      throw new Error('Invalid query syntax. Query must begin with SELECT ... FROM ...');
    }
    const selectBody = selectMatch[1].trim();
    const isDistinct = /^DISTINCT\s+/i.test(selectBody);
    const cleanedSelect = selectBody.replace(/^DISTINCT\s+/i, '').trim();

    // 4. GROUP BY clause parsing
    const groupByMatch = trimmed.match(/\bGROUP\s+BY\s+([\s\S]+?)(?=\bHAVING|\bORDER\s+BY|\bLIMIT|$)/i);
    const havingMatch = trimmed.match(/\bHAVING\s+([\s\S]+?)(?=\bORDER\s+BY|\bLIMIT|$)/i);

    let finalRows: Record<string, any>[] = [];
    let finalColumns: string[] = [];

    if (groupByMatch) {
      const groupColumns = groupByMatch[1].split(',').map(s => s.trim().toLowerCase());
      const selectItems = parseSelectItems(cleanedSelect);

      const groups = new Map<string, Record<string, any>[]>();
      for (const row of workingRows) {
        const key = groupColumns.map(col => String(row[col] ?? '')).join(':::');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(row);
      }

      for (const [_, groupedRows] of groups.entries()) {
        const resultRow: Record<string, any> = {};
        for (const item of selectItems) {
          resultRow[item.alias] = evaluateSelectItem(item, groupedRows);
        }
        finalRows.push(resultRow);
      }

      finalColumns = selectItems.map(i => i.alias);

      // HAVING clause filtering
      if (havingMatch) {
        const havingCond = havingMatch[1].trim();
        finalRows = filterRows(finalRows, havingCond);
      }
    } else {
      // Check if SELECT contains pure aggregates without GROUP BY (e.g., SELECT COUNT(*), SUM(sales))
      const selectItems = parseSelectItems(cleanedSelect);
      const hasAggregates = selectItems.some(i => i.isAggregate);

      if (hasAggregates) {
        const singleRow: Record<string, any> = {};
        for (const item of selectItems) {
          singleRow[item.alias] = evaluateSelectItem(item, workingRows);
        }
        finalRows = [singleRow];
        finalColumns = selectItems.map(i => i.alias);
      } else {
        // Standard projection
        if (cleanedSelect === '*') {
          finalColumns = dataset.columns.map(c => c.name);
          finalRows = workingRows;
        } else {
          finalColumns = selectItems.map(i => i.alias);
          finalRows = workingRows.map(row => {
            const mapped: Record<string, any> = {};
            for (const item of selectItems) {
              mapped[item.alias] = row[item.expr.toLowerCase()] ?? null;
            }
            return mapped;
          });
        }
      }
    }

    // DISTINCT filter if requested
    if (isDistinct) {
      const seen = new Set<string>();
      finalRows = finalRows.filter(r => {
        const key = JSON.stringify(r);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // 5. ORDER BY parsing
    const orderByMatch = trimmed.match(/\bORDER\s+BY\s+([\s\S]+?)(?=\bLIMIT|$)/i);
    if (orderByMatch) {
      const orderExprs = orderByMatch[1].split(',').map(s => s.trim());
      finalRows.sort((a, b) => {
        for (const expr of orderExprs) {
          const parts = expr.split(/\s+/);
          const col = parts[0].toLowerCase();
          const dir = parts[1]?.toUpperCase() === 'DESC' ? -1 : 1;
          const valA = a[col];
          const valB = b[col];
          if (valA === valB) continue;
          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;
          if (typeof valA === 'number' && typeof valB === 'number') {
            return (valA - valB) * dir;
          }
          return String(valA).localeCompare(String(valB)) * dir;
        }
        return 0;
      });
    }

    // 6. LIMIT parsing
    const limitMatch = trimmed.match(/\bLIMIT\s+([0-9]+)/i);
    if (limitMatch) {
      const limitVal = parseInt(limitMatch[1], 10);
      finalRows = finalRows.slice(0, limitVal);
    }

    const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      columns: finalColumns,
      rows: finalRows,
      rowCount: finalRows.length,
      executionTimeMs: elapsed
    };
  } catch (err: any) {
    const elapsed = Math.round((performance.now() - startTime) * 100) / 100;
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: elapsed,
      error: err.message || 'Error processing query'
    };
  }
}

interface SelectItem {
  raw: string;
  expr: string;
  alias: string;
  isAggregate: boolean;
  aggFunc?: string;
  aggColumn?: string;
}

function parseSelectItems(selectStr: string): SelectItem[] {
  const parts: string[] = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < selectStr.length; i++) {
    const ch = selectStr[i];
    if (ch === '(') parenDepth++;
    if (ch === ')') parenDepth--;
    if (ch === ',' && parenDepth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());

  return parts.map(part => {
    let expr = part;
    let alias = part;

    // Check AS alias
    const asMatch = part.match(/^([\s\S]+?)\s+AS\s+([a-zA-Z0-9_]+)$/i);
    if (asMatch) {
      expr = asMatch[1].trim();
      alias = asMatch[2].trim();
    } else {
      // Check space alias (expr alias)
      const spaceMatch = part.match(/^([\s\S]+?)\s+([a-zA-Z0-9_]+)$/i);
      if (spaceMatch && !spaceMatch[1].includes('(')) {
        expr = spaceMatch[1].trim();
        alias = spaceMatch[2].trim();
      }
    }

    // Check aggregate
    const aggMatch = expr.match(/^(COUNT|SUM|AVG|MIN|MAX|ROUND)\s*\(([\s\S]*)\)$/i);
    if (aggMatch) {
      const func = aggMatch[1].toUpperCase();
      let innerCol = aggMatch[2].trim();
      // Handle ROUND(AVG(col), 2)
      if (func === 'ROUND' && innerCol.includes('(')) {
        const nestedAgg = innerCol.match(/^(AVG|SUM|COUNT)\s*\(([a-zA-Z0-9_*]+)\)/i);
        if (nestedAgg) {
          return {
            raw: part,
            expr,
            alias: alias || 'rounded',
            isAggregate: true,
            aggFunc: nestedAgg[1].toUpperCase(),
            aggColumn: nestedAgg[2].trim().toLowerCase()
          };
        }
      }

      return {
        raw: part,
        expr,
        alias: alias.replace(/[\(\)\*\s]/g, '_').toLowerCase(),
        isAggregate: true,
        aggFunc: func,
        aggColumn: innerCol.toLowerCase()
      };
    }

    return {
      raw: part,
      expr,
      alias: alias.toLowerCase(),
      isAggregate: false
    };
  });
}

function evaluateSelectItem(item: SelectItem, rows: Record<string, any>[]): any {
  if (!item.isAggregate) {
    return rows[0]?.[item.expr.toLowerCase()] ?? null;
  }

  const func = item.aggFunc;
  const col = item.aggColumn ?? '';

  if (func === 'COUNT') {
    if (col === '*' || !col) return rows.length;
    return rows.filter(r => r[col] !== null && r[col] !== undefined).length;
  }

  const values: number[] = rows
    .map(r => r[col])
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));

  if (values.length === 0) return 0;

  if (func === 'SUM') {
    const total = values.reduce((sum, v) => sum + v, 0);
    return Math.round(total * 100) / 100;
  }
  if (func === 'AVG') {
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    return Math.round(avg * 100) / 100;
  }
  if (func === 'MIN') {
    return Math.min(...values);
  }
  if (func === 'MAX') {
    return Math.max(...values);
  }

  return 0;
}

function filterRows(rows: Record<string, any>[], conditionStr: string): Record<string, any>[] {
  const andClauses = conditionStr.split(/\bAND\b/i).map(c => c.trim());

  return rows.filter(row => {
    return andClauses.every(clause => evaluateSingleCondition(row, clause));
  });
}

function evaluateSingleCondition(row: Record<string, any>, clause: string): boolean {
  const trimmed = clause.trim();

  // Handle IN operator: col IN ('a', 'b')
  const inMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s+IN\s*\(([\s\S]+)\)$/i);
  if (inMatch) {
    const col = inMatch[1].toLowerCase();
    const allowed = inMatch[2]
      .split(',')
      .map(s => s.trim().replace(/^['"]|['"]$/g, ''));
    const val = String(row[col] ?? '');
    return allowed.includes(val);
  }

  // Handle LIKE: col LIKE 'foo%'
  const likeMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s+LIKE\s+['"]([\s\S]+)['"]$/i);
  if (likeMatch) {
    const col = likeMatch[1].toLowerCase();
    const pattern = likeMatch[2];
    const regexStr = '^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$';
    const regex = new RegExp(regexStr, 'i');
    return regex.test(String(row[col] ?? ''));
  }

  // Handle standard comparisons: =, !=, <>, >=, <=, >, <
  const opMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*(=|!=|<>|>=|<=|>|<)\s*([\s\S]+)$/i);
  if (!opMatch) return true;

  const col = opMatch[1].toLowerCase();
  const op = opMatch[2];
  let rhs: any = opMatch[3].trim().replace(/^['"]|['"]$/g, '');

  const rowVal = row[col];
  if (rowVal === undefined || rowVal === null) return false;

  if (typeof rowVal === 'number' && !isNaN(Number(rhs))) {
    const numRhs = Number(rhs);
    if (op === '=') return rowVal === numRhs;
    if (op === '!=' || op === '<>') return rowVal !== numRhs;
    if (op === '>') return rowVal > numRhs;
    if (op === '<') return rowVal < numRhs;
    if (op === '>=') return rowVal >= numRhs;
    if (op === '<=') return rowVal <= numRhs;
  }

  // String comparison
  const strRow = String(rowVal).toLowerCase();
  const strRhs = String(rhs).toLowerCase();

  if (op === '=') return strRow === strRhs;
  if (op === '!=' || op === '<>') return strRow !== strRhs;
  if (op === '>') return strRow > strRhs;
  if (op === '<') return strRow < strRhs;
  if (op === '>=') return strRow >= strRhs;
  if (op === '<=') return strRow <= strRhs;

  return true;
}
