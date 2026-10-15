export interface CellCoordinate {
  col: number; // 0-indexed: A=0, B=1, ...
  row: number; // 0-indexed: 1=0, 2=1, ...
}

export function parseCoordinate(coordStr: string): CellCoordinate | null {
  const match = coordStr.trim().toUpperCase().match(/^([A-Z]+)([0-9]+)$/);
  if (!match) return null;

  const colLetters = match[1];
  let col = 0;
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 64);
  }
  col -= 1; // 0-indexed

  const row = parseInt(match[2], 10) - 1; // 0-indexed
  return { col, row };
}

export function coordinateToA1(col: number, row: number): string {
  let colStr = '';
  let tempCol = col + 1;
  while (tempCol > 0) {
    const rem = (tempCol - 1) % 26;
    colStr = String.fromCharCode(65 + rem) + colStr;
    tempCol = Math.floor((tempCol - 1) / 26);
  }
  return `${colStr}${row + 1}`;
}

export function parseRange(rangeStr: string): CellCoordinate[] {
  const parts = rangeStr.split(':').map(s => s.trim().toUpperCase());
  if (parts.length === 1) {
    const c = parseCoordinate(parts[0]);
    return c ? [c] : [];
  }
  if (parts.length === 2) {
    const start = parseCoordinate(parts[0]);
    const end = parseCoordinate(parts[1]);
    if (!start || !end) return [];

    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);

    const coords: CellCoordinate[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        coords.push({ col: c, row: r });
      }
    }
    return coords;
  }
  return [];
}

export function evaluateFormula(
  formula: string,
  grid: Record<string, string>,
  evaluatedCache: Record<string, any> = {}
): any {
  if (!formula.startsWith('=')) {
    // Check if plain number
    const num = Number(formula);
    return isNaN(num) || formula.trim() === '' ? formula : num;
  }

  const rawExpr = formula.substring(1).trim();

  // Helper to fetch cell value
  const getCellValue = (coordStr: string): any => {
    const cleanKey = coordStr.trim().toUpperCase();
    if (cleanKey in evaluatedCache) {
      return evaluatedCache[cleanKey];
    }
    const cellFormula = grid[cleanKey] ?? '';
    const val = evaluateFormula(cellFormula, grid, evaluatedCache);
    evaluatedCache[cleanKey] = val;
    return val;
  };

  try {
    // 1. SUM function
    const sumMatch = rawExpr.match(/^SUM\s*\(([\s\S]+)\)$/i);
    if (sumMatch) {
      const coords = parseRange(sumMatch[1]);
      let total = 0;
      for (const c of coords) {
        const key = coordinateToA1(c.col, c.row);
        const val = Number(getCellValue(key));
        if (!isNaN(val)) total += val;
      }
      return Math.round(total * 100) / 100;
    }

    // 2. AVERAGE function
    const avgMatch = rawExpr.match(/^AVERAGE\s*\(([\s\S]+)\)$/i);
    if (avgMatch) {
      const coords = parseRange(avgMatch[1]);
      let total = 0;
      let count = 0;
      for (const c of coords) {
        const key = coordinateToA1(c.col, c.row);
        const val = Number(getCellValue(key));
        if (!isNaN(val)) {
          total += val;
          count++;
        }
      }
      return count > 0 ? Math.round((total / count) * 100) / 100 : 0;
    }

    // 3. COUNT / COUNTA function
    const countMatch = rawExpr.match(/^COUNT\s*\(([\s\S]+)\)$/i);
    if (countMatch) {
      const coords = parseRange(countMatch[1]);
      return coords.filter(c => {
        const val = Number(getCellValue(coordinateToA1(c.col, c.row)));
        return !isNaN(val) && val !== null;
      }).length;
    }

    const countaMatch = rawExpr.match(/^COUNTA\s*\(([\s\S]+)\)$/i);
    if (countaMatch) {
      const coords = parseRange(countaMatch[1]);
      return coords.filter(c => {
        const val = getCellValue(coordinateToA1(c.col, c.row));
        return val !== '' && val !== null && val !== undefined;
      }).length;
    }

    // 4. MIN / MAX
    const minMatch = rawExpr.match(/^MIN\s*\(([\s\S]+)\)$/i);
    if (minMatch) {
      const coords = parseRange(minMatch[1]);
      const nums = coords.map(c => Number(getCellValue(coordinateToA1(c.col, c.row)))).filter(n => !isNaN(n));
      return nums.length > 0 ? Math.min(...nums) : 0;
    }

    const maxMatch = rawExpr.match(/^MAX\s*\(([\s\S]+)\)$/i);
    if (maxMatch) {
      const coords = parseRange(maxMatch[1]);
      const nums = coords.map(c => Number(getCellValue(coordinateToA1(c.col, c.row)))).filter(n => !isNaN(n));
      return nums.length > 0 ? Math.max(...nums) : 0;
    }

    // 5. IF function: IF(test, val_true, val_false)
    const ifMatch = rawExpr.match(/^IF\s*\(([\s\S]+)\)$/i);
    if (ifMatch) {
      const args = splitTopLevelArgs(ifMatch[1]);
      if (args.length >= 2) {
        const condition = evaluateSimpleCondition(args[0], getCellValue);
        const trueVal = evaluateArg(args[1], getCellValue);
        const falseVal = args[2] ? evaluateArg(args[2], getCellValue) : false;
        return condition ? trueVal : falseVal;
      }
    }

    // 6. VLOOKUP(lookup_val, range, col_index, [approx])
    const vlookupMatch = rawExpr.match(/^VLOOKUP\s*\(([\s\S]+)\)$/i);
    if (vlookupMatch) {
      const args = splitTopLevelArgs(vlookupMatch[1]);
      if (args.length >= 3) {
        const lookupVal = String(evaluateArg(args[0], getCellValue)).trim().toLowerCase();
        const rangeStr = args[1].trim();
        const colIndex = parseInt(args[2].trim(), 10); // 1-indexed

        const rangeParts = rangeStr.split(':');
        const start = parseCoordinate(rangeParts[0]);
        const end = parseCoordinate(rangeParts[1]);

        if (start && end) {
          const minRow = Math.min(start.row, end.row);
          const maxRow = Math.max(start.row, end.row);
          const lookupCol = start.col;
          const targetCol = start.col + (colIndex - 1);

          for (let r = minRow; r <= maxRow; r++) {
            const rowKey = coordinateToA1(lookupCol, r);
            const candidateVal = String(getCellValue(rowKey)).trim().toLowerCase();
            if (candidateVal === lookupVal) {
              const resKey = coordinateToA1(targetCol, r);
              return getCellValue(resKey);
            }
          }
          return '#N/A';
        }
      }
    }

    // 7. Text manipulation: TRIM, UPPER, LOWER, CONCAT
    const trimMatch = rawExpr.match(/^TRIM\s*\(([\s\S]+)\)$/i);
    if (trimMatch) {
      return String(evaluateArg(trimMatch[1], getCellValue)).trim().replace(/\s+/g, ' ');
    }
    const upperMatch = rawExpr.match(/^UPPER\s*\(([\s\S]+)\)$/i);
    if (upperMatch) {
      return String(evaluateArg(upperMatch[1], getCellValue)).toUpperCase();
    }
    const lowerMatch = rawExpr.match(/^LOWER\s*\(([\s\S]+)\)$/i);
    if (lowerMatch) {
      return String(evaluateArg(lowerMatch[1], getCellValue)).toLowerCase();
    }

    // 8. Basic arithmetic with cell references: e.g. A1 + B1, C2 * 1.2
    const replaced = rawExpr.replace(/[A-Z]+[0-9]+/g, (match) => {
      const val = getCellValue(match);
      return typeof val === 'number' ? String(val) : JSON.stringify(val);
    });

    // Safely evaluate simple math expressions
    if (/^[\d\s+\-*/().%]+$/.test(replaced)) {
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${replaced});`)();
      return typeof result === 'number' ? Math.round(result * 100) / 100 : result;
    }

    return replaced;
  } catch (err: any) {
    return '#VALUE!';
  }
}

function splitTopLevelArgs(str: string): string[] {
  const args: string[] = [];
  let current = '';
  let depth = 0;
  let inQuotes = false;

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '"' && (i === 0 || str[i - 1] !== '\\')) {
      inQuotes = !inQuotes;
    }
    if (!inQuotes) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        args.push(current.trim());
        current = '';
        continue;
      }
    }
    current += ch;
  }
  if (current.trim()) args.push(current.trim());
  return args;
}

function evaluateArg(arg: string, getCellValue: (k: string) => any): any {
  const trimmed = arg.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  if (parseCoordinate(trimmed)) {
    return getCellValue(trimmed);
  }
  const num = Number(trimmed);
  return isNaN(num) ? trimmed : num;
}

function evaluateSimpleCondition(condStr: string, getCellValue: (k: string) => any): boolean {
  const opMatch = condStr.match(/([\s\S]+?)(>=|<=|!=|<>|>|<|=)([\s\S]+)/);
  if (!opMatch) return false;

  const left = evaluateArg(opMatch[1], getCellValue);
  const op = opMatch[2];
  const right = evaluateArg(opMatch[3], getCellValue);

  if (typeof left === 'number' && typeof right === 'number') {
    if (op === '=') return left === right;
    if (op === '!=' || op === '<>') return left !== right;
    if (op === '>') return left > right;
    if (op === '<') return left < right;
    if (op === '>=') return left >= right;
    if (op === '<=') return left <= right;
  }

  const strL = String(left).toLowerCase();
  const strR = String(right).toLowerCase();
  if (op === '=') return strL === strR;
  if (op === '!=' || op === '<>') return strL !== strR;
  return false;
}
