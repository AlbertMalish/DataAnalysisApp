import { ToolMeta, Lesson, InteractiveChallenge } from '../types';

export const toolCatalog: ToolMeta[] = [
  {
    id: 'excel',
    name: 'Excel & Google Sheets',
    category: 'Spreadsheets & Modeling',
    tagline: 'Formulas, Pivot Tables, XLOOKUP & Data Cleaning',
    description: 'Master the workhorse of enterprise data. Learn cell arithmetic, lookup functions, conditional logic, text formulas, and summary pivot reporting.',
    iconName: 'FileSpreadsheet',
    color: '#107C41',
    badgeBg: 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400',
    lessonsCount: 5,
    level: 'Beginner'
  },
  {
    id: 'mysql',
    name: 'MySQL & SQL Databases',
    category: 'Relational Database Querying',
    tagline: 'SELECT, Filtering, Aggregations, JOINs & Windows',
    description: 'Learn industry-standard SQL. Query tables, filter conditions, group metrics, join relational entities, and execute analytical window queries.',
    iconName: 'Database',
    color: '#00758F',
    badgeBg: 'bg-cyan-950/60 border-cyan-700/50 text-cyan-400',
    lessonsCount: 5,
    level: 'Intermediate'
  },
  {
    id: 'powerbi',
    name: 'Microsoft Power BI',
    category: 'Business Intelligence & DAX',
    tagline: 'Power Query ETL, Star Schemas & DAX Measures',
    description: 'Transform raw data into executive dashboards. Understand relational data modeling, M code data cleaning, and DAX measures like CALCULATE and SUMX.',
    iconName: 'BarChart3',
    color: '#F2C811',
    badgeBg: 'bg-amber-950/60 border-amber-700/50 text-amber-400',
    lessonsCount: 5,
    level: 'Intermediate'
  },
  {
    id: 'tableau',
    name: 'Tableau Desktop',
    category: 'Visual Analytics & Dashboards',
    tagline: 'Marks Card, Dimensions vs Measures, LOD Expressions',
    description: 'Explore data through visual perception. Understand Blue vs Green pills, visual encodings, Level of Detail (LOD) formulas, and dashboard interactivity.',
    iconName: 'PieChart',
    color: '#E97627',
    badgeBg: 'bg-orange-950/60 border-orange-700/50 text-orange-400',
    lessonsCount: 5,
    level: 'Intermediate'
  },
  {
    id: 'kobocollect',
    name: 'Kobo Collect & ODK',
    category: 'Field Data Collection & M&E',
    tagline: 'XLSForm Design, Mobile Surveys, Skip Logic & Geopoints',
    description: 'Standard tool for humanitarian, public health, and field research surveys. Build offline mobile forms, write skip logic, validate GPS data, and export for analysis.',
    iconName: 'Smartphone',
    color: '#0D8390',
    badgeBg: 'bg-teal-950/60 border-teal-700/50 text-teal-400',
    lessonsCount: 5,
    level: 'Beginner'
  }
];

export const curriculumLessons: Lesson[] = [
  // EXCEL & GOOGLE SHEETS
  {
    id: 'excel_1',
    toolId: 'excel',
    chapterNumber: 1,
    title: 'Cell Formulas & Statistical Aggregates',
    subtitle: 'SUM, AVERAGE, MIN, MAX, COUNT & Relative References',
    durationMinutes: 12,
    summary: 'Understand spreadsheet cell coordinates (A1 notation), operator hierarchy, and standard aggregate functions for quick financial and operational analysis.',
    keyConcepts: ['Cell References (A1 vs $A$1)', 'SUM & AVERAGE', 'COUNT vs COUNTA', 'Relative vs Absolute Locking'],
    contentSections: [
      {
        heading: 'Spreadsheet Arithmetic & The Formula Bar',
        body: 'Every formula in Excel and Google Sheets starts with an equals sign (=). Spreadsheets calculate expressions following standard operator precedence: parentheses, exponents, multiplication/division, and addition/subtraction (PEMDAS). Cell references like B2 allow calculations to update dynamically when inputs change.',
        codeSnippet: '=SUM(C2:C31)\n=AVERAGE(F2:F31)\n=(D2 * E2) * (1 - G2)',
        codeLanguage: 'excel',
        tip: 'Press F4 (or Fn+F4) while selecting a cell coordinate to toggle absolute locking ($A$1) so formulas do not shift when dragged.'
      },
      {
        heading: 'Counting Non-Empty Cells and Values',
        body: 'A frequent data quality pitfall is mixing up COUNT and COUNTA. COUNT only tallies numeric cells, while COUNTA counts any cell containing text, numbers, or booleans. Use COUNTBLANK to audit missing data in your dataset.',
        codeSnippet: '=COUNT(H2:H100)      // Counts numbers only\n=COUNTA(B2:B100)     // Counts text names and filled cells\n=COUNTBLANK(A2:K100) // Audits missing fields',
        codeLanguage: 'excel'
      }
    ],
    interactiveChallenge: {
      id: 'ch_excel_1',
      title: 'Calculate Total Sales Revenue',
      instruction: 'Write the Excel formula to calculate the total sum of sales located in column C from row 2 to row 10.',
      starterCode: '=',
      expectedOutputHint: '=SUM(C2:C10)',
      type: 'formula',
      solution: '=SUM(C2:C10)',
      validate: (input) => {
        const clean = input.trim().toUpperCase().replace(/\s+/g, '');
        if (clean === '=SUM(C2:C10)') {
          return { passed: true, message: 'Correct! SUM(C2:C10) adds all numbers in the specified cell range.' };
        }
        return { passed: false, message: 'Make sure your formula starts with =SUM( and specifies range C2:C10' };
      }
    },
    quiz: [
      {
        id: 'q_ex_1',
        question: 'What is the main difference between COUNT and COUNTA in Excel and Google Sheets?',
        options: [
          'COUNT counts numbers only; COUNTA counts any non-empty cell',
          'COUNT works on rows; COUNTA works on columns',
          'COUNTA is faster than COUNT for large datasets',
          'COUNT allows text while COUNTA only permits dates'
        ],
        correctIndex: 0,
        explanation: 'COUNT only evaluates cells containing numeric values. COUNTA (Count All) tallies every non-blank cell including text, dates, and symbols.'
      }
    ]
  },
  {
    id: 'excel_2',
    toolId: 'excel',
    chapterNumber: 2,
    title: 'Conditional Logic: IF, IFS & Nested Rules',
    subtitle: 'Categorizing records with IF, AND, OR, and COUNTIF',
    durationMinutes: 15,
    summary: 'Transform raw metrics into qualitative segments. Learn how to write single IF statements, multi-branch IFS, and conditional counting with COUNTIF and SUMIF.',
    keyConcepts: ['IF(logical_test, value_if_true, value_if_false)', 'IFS for multi-conditions', 'COUNTIF & SUMIF criteria', 'Boolean AND/OR combinations'],
    contentSections: [
      {
        heading: 'The Anatomy of the IF Function',
        body: 'The IF function evaluates whether a condition is TRUE or FALSE, returning one value if true and another if false. For multiple tiers (e.g. High / Medium / Low performance), you can nest IFs or use the cleaner modern IFS function.',
        codeSnippet: '=IF(J2 > 0, "Profitable", "Loss")\n=IFS(H2 >= 1000, "Tier 1", H2 >= 500, "Tier 2", TRUE, "Standard")',
        codeLanguage: 'excel',
        tip: 'In IFS, the final fallback condition should be written as TRUE, "Fallback Value" to capture all remaining cases.'
      },
      {
        heading: 'Selective Aggregation: SUMIF & COUNTIF',
        body: 'Instead of manually filtering tables, SUMIF and COUNTIF let you summarize numbers based on matching criteria, such as summing all sales where Region is "East".',
        codeSnippet: '=COUNTIF(E2:E31, "East")\n=SUMIF(E2:E31, "East", H2:H31)',
        codeLanguage: 'excel'
      }
    ],
    interactiveChallenge: {
      id: 'ch_excel_2',
      title: 'Flag High-Value Orders with IF',
      instruction: 'Write an IF formula that checks cell H2. If H2 is greater than 500, return "High", otherwise return "Normal".',
      starterCode: '=IF(',
      expectedOutputHint: '=IF(H2>500,"High","Normal")',
      type: 'formula',
      solution: '=IF(H2>500, "High", "Normal")',
      validate: (input) => {
        const clean = input.trim().replace(/\s+/g, '').replace(/'/g, '"').toUpperCase();
        if (clean === '=IF(H2>500,"HIGH","NORMAL")') {
          return { passed: true, message: 'Spot on! The IF condition branches properly based on the threshold.' };
        }
        return { passed: false, message: 'Check syntax: =IF(H2 > 500, "High", "Normal")' };
      }
    },
    quiz: [
      {
        id: 'q_ex_2',
        question: 'Which formula correctly sums sales in column H only for the "Technology" category in column F?',
        options: [
          '=SUMIF(F2:F30, "Technology", H2:H30)',
          '=COUNTIF(F2:F30, "Technology", H2:H30)',
          '=IF(F2:F30="Technology", SUM(H2:H30))',
          '=VLOOKUP("Technology", F2:H30, 3, FALSE)'
        ],
        correctIndex: 0,
        explanation: 'SUMIF takes (range, criteria, [sum_range]). Here, F2:F30 is the criteria range, "Technology" is the match string, and H2:H30 contains values to sum.'
      }
    ]
  },
  {
    id: 'excel_3',
    toolId: 'excel',
    chapterNumber: 3,
    title: 'Lookup Functions: VLOOKUP, XLOOKUP & INDEX/MATCH',
    subtitle: 'Connecting disparate tables through primary keys',
    durationMinutes: 18,
    summary: 'Master relational data joining inside spreadsheets. Compare legacy VLOOKUP with modern XLOOKUP and flexible INDEX/MATCH combinations.',
    keyConcepts: ['VLOOKUP fourth argument (FALSE/0 exact match)', 'XLOOKUP two-way search & defaults', 'INDEX & MATCH decoupling', 'Handling #N/A errors with IFERROR'],
    contentSections: [
      {
        heading: 'Why VLOOKUP Breaks & How XLOOKUP Solves It',
        body: 'VLOOKUP requires the lookup key to be in the very first left-hand column of the table array. If a user inserts or rearranges columns, the hardcoded column index breaks. Modern Excel and Google Sheets introduce XLOOKUP, which separates lookup array from return array and searches in any direction.',
        codeSnippet: '// Classic VLOOKUP (key must be column 1):\n=VLOOKUP(A2, Products!$A$2:$D$500, 3, FALSE)\n\n// Modern XLOOKUP (safe against column shifts):\n=XLOOKUP(A2, Products!$A$2:$A$500, Products!$C$2:$C$500, "Not Found")',
        codeLanguage: 'excel',
        tip: 'Always set the 4th argument of VLOOKUP to FALSE (or 0) for exact matches, otherwise Excel defaults to approximate nearest match!'
      },
      {
        heading: 'The Power of INDEX and MATCH',
        body: 'For older spreadsheets that lack XLOOKUP, INDEX and MATCH provide dynamic two-way lookups. MATCH finds the row number where the key exists, and INDEX retrieves the value from that exact coordinate.',
        codeSnippet: '=INDEX(Employees!$E$2:$E$100, MATCH(A2, Employees!$A$2:$A$100, 0))',
        codeLanguage: 'excel'
      }
    ],
    interactiveChallenge: {
      id: 'ch_excel_3',
      title: 'Write an Exact-Match VLOOKUP',
      instruction: 'Write a VLOOKUP formula to find value in cell A2 inside table range D2:F20, returning the 3rd column with an exact match.',
      starterCode: '=VLOOKUP(',
      expectedOutputHint: '=VLOOKUP(A2, D2:F20, 3, FALSE)',
      type: 'formula',
      solution: '=VLOOKUP(A2, D2:F20, 3, FALSE)',
      validate: (input) => {
        const clean = input.trim().replace(/\s+/g, '').replace(/\$+/g, '').toUpperCase();
        if (clean === '=VLOOKUP(A2,D2:F20,3,FALSE)' || clean === '=VLOOKUP(A2,D2:F20,3,0)') {
          return { passed: true, message: 'Excellent! You set exact match (FALSE / 0) and column index 3 correctly.' };
        }
        return { passed: false, message: 'Check arguments: =VLOOKUP(A2, D2:F20, 3, FALSE)' };
      }
    },
    quiz: [
      {
        id: 'q_ex_3',
        question: 'What happens if you omit the fourth parameter in a VLOOKUP formula?',
        options: [
          'It defaults to TRUE (approximate match), which can return incorrect data if the table is unsorted',
          'It defaults to FALSE (exact match)',
          'Excel throws an immediate syntax error',
          'It returns the entire row'
        ],
        correctIndex: 0,
        explanation: 'By default, VLOOKUP assumes TRUE (approximate match) which assumes the first column is sorted ascending. Omitting it causes dangerous silent lookup bugs!'
      }
    ]
  },
  {
    id: 'excel_4',
    toolId: 'excel',
    chapterNumber: 4,
    title: 'Data Cleaning: TRIM, TEXTSPLIT & Parsing',
    subtitle: 'Standardizing messy text, dates, and casing',
    durationMinutes: 14,
    summary: 'Real-world data is dirty. Learn essential text functions to remove trailing spaces, standardize casing, concatenate strings, and split customer names.',
    keyConcepts: ['TRIM & CLEAN', 'PROPER, UPPER, LOWER', 'CONCAT / TEXTJOIN', 'TEXTSPLIT & Flash Fill'],
    contentSections: [
      {
        heading: 'Removing Invisible Spaces that Ruin Lookups',
        body: 'A common reason VLOOKUP or JOIN returns #N/A is hidden whitespace at the end of text strings (e.g., "California " vs "California"). TRIM removes leading, trailing, and duplicate middle spaces.',
        codeSnippet: '=TRIM(A2)           // Cleans rogue whitespace\n=PROPER(B2)         // Capitalizes Each First Letter\n=UPPER(C2)          // CONVERTS TO ALL CAPS',
        codeLanguage: 'excel'
      },
      {
        heading: 'Combining and Splitting Text Strings',
        body: 'Combine multiple columns into standardized codes using the ampersand (&) or TEXTJOIN with a delimiter. Use TEXTSPLIT to separate comma-delimited strings.',
        codeSnippet: '=A2 & " - " & B2\n=TEXTJOIN(", ", TRUE, C2:F2)\n=TEXTSPLIT(A2, " ")',
        codeLanguage: 'excel'
      }
    ],
    interactiveChallenge: {
      id: 'ch_excel_4',
      title: 'Clean Text with TRIM',
      instruction: 'Write a formula to remove excess whitespace from cell B2.',
      starterCode: '=',
      expectedOutputHint: '=TRIM(B2)',
      type: 'formula',
      solution: '=TRIM(B2)',
      validate: (input) => {
        const clean = input.trim().replace(/\s+/g, '').toUpperCase();
        if (clean === '=TRIM(B2)') {
          return { passed: true, message: 'Great job! TRIM sanitizes leading and trailing spaces.' };
        }
        return { passed: false, message: 'Expected formula: =TRIM(B2)' };
      }
    },
    quiz: [
      {
        id: 'q_ex_4',
        question: 'Which formula capitalizes the first letter of each word in a customer name in cell B2?',
        options: [
          '=PROPER(B2)',
          '=CAPITALIZE(B2)',
          '=UPPER(B2)',
          '=INITCAP(B2)'
        ],
        correctIndex: 0,
        explanation: '=PROPER(text) formats strings to title case, making names like "john doe" into "John Doe".'
      }
    ]
  },
  {
    id: 'excel_5',
    toolId: 'excel',
    chapterNumber: 5,
    title: 'Pivot Tables & Dynamic Aggregations',
    subtitle: 'Slicing, grouping, and building summary matrices without code',
    durationMinutes: 16,
    summary: 'Pivot Tables are the fastest way to summarize millions of data points. Learn the four quadrants: Rows, Columns, Values, and Filters, along with calculated fields.',
    keyConcepts: ['Rows, Columns, Values, Filters quadrants', 'Summarize values by SUM vs AVERAGE vs COUNT', 'Show values as % of Column Total', 'Grouping Dates by Year and Quarter'],
    contentSections: [
      {
        heading: 'The Four Quadrants of a Pivot Table',
        body: 'To generate a matrix of Sales by Region and Category: Drag Region into Rows, Category into Columns, and Sales into Values. By default, Excel sums numeric fields and counts text fields.',
        codeSnippet: 'Rows:    Region (East, West, Central, South)\nColumns: Category (Furniture, Technology, Office Supplies)\nValues:  SUM(Sales), AVERAGE(Profit Margin)\nFilters: Order Year = 2024',
        codeLanguage: 'text',
        tip: 'Right-click any value in a pivot table and choose "Show Values As" -> "% of Grand Total" to see relative market shares instantly.'
      }
    ],
    quiz: [
      {
        id: 'q_ex_5',
        question: 'Where should you place a categorical field like "Region" to see each region listed down the left side of your summary table?',
        options: [
          'Rows quadrant',
          'Values quadrant',
          'Columns quadrant',
          'Filters quadrant'
        ],
        correctIndex: 0,
        explanation: 'Fields placed in the Rows area create vertical row headers running down the left side of the Pivot Table.'
      }
    ]
  },

  // MYSQL & SQL
  {
    id: 'mysql_1',
    toolId: 'mysql',
    chapterNumber: 1,
    title: 'Relational Foundations & The SELECT Statement',
    subtitle: 'Querying tables, column aliases, and arithmetic projections',
    durationMinutes: 14,
    summary: 'Relational databases store structured records in normalized tables. Master the SELECT clause, picking columns, calculating derived metrics, and using aliases with AS.',
    keyConcepts: ['Relational Model & Tables', 'SELECT column1, column2 FROM table', 'Column Aliasing with AS', 'DISTINCT values'],
    contentSections: [
      {
        heading: 'The Structure of a SQL Query',
        body: 'SQL (Structured Query Language) is declarative: you state what data you want rather than how to fetch it. The fundamental building block is SELECT [columns] FROM [table].',
        codeSnippet: 'SELECT \n  customer_name,\n  segment,\n  region,\n  sales\nFROM global_superstore;\n\n-- Retrieve unique segments:\nSELECT DISTINCT segment FROM global_superstore;',
        codeLanguage: 'sql',
        tip: 'In production environments, avoid SELECT * on large tables. Explicitly name the columns you need to optimize query performance and bandwidth.'
      },
      {
        heading: 'Derived Projections and Mathematical Expressions',
        body: 'You can perform calculations directly in the SELECT statement. For example, compute the net revenue after discounts or calculate revenue per unit.',
        codeSnippet: 'SELECT \n  order_id,\n  sales,\n  quantity,\n  (sales / quantity) AS price_per_unit,\n  (profit / sales) * 100 AS profit_margin_pct\nFROM global_superstore;',
        codeLanguage: 'sql'
      }
    ],
    interactiveChallenge: {
      id: 'ch_sql_1',
      title: 'Select Distinct Departments',
      instruction: 'Write a SQL query to select all unique (distinct) department names from the hr_employee_attrition table.',
      starterCode: 'SELECT ',
      expectedOutputHint: 'SELECT DISTINCT department FROM hr_employee_attrition;',
      type: 'sql',
      solution: 'SELECT DISTINCT department FROM hr_employee_attrition;',
      validate: (input) => {
        const clean = input.trim().replace(/;$/, '').replace(/\s+/g, ' ').toUpperCase();
        if (clean === 'SELECT DISTINCT DEPARTMENT FROM HR_EMPLOYEE_ATTRITION') {
          return { passed: true, message: 'Perfect! SELECT DISTINCT eliminates duplicate department rows.' };
        }
        return { passed: false, message: 'Make sure you use SELECT DISTINCT department FROM hr_employee_attrition;' };
      }
    },
    quiz: [
      {
        id: 'q_sql_1',
        question: 'Which SQL keyword removes duplicate rows from the query output?',
        options: [
          'DISTINCT',
          'UNIQUE',
          'DIFFERENT',
          'GROUP'
        ],
        correctIndex: 0,
        explanation: 'SELECT DISTINCT filters out repeating duplicate values from the returned result set.'
      }
    ]
  },
  {
    id: 'mysql_2',
    toolId: 'mysql',
    chapterNumber: 2,
    title: 'Filtering Records with WHERE, LIKE & IN',
    subtitle: 'Isolating specific slices of data with Boolean logic',
    durationMinutes: 16,
    summary: 'Learn how to filter rows using comparison operators (=, !=, <, >), logical operators (AND, OR, NOT), wildcards with LIKE, and set membership with IN.',
    keyConcepts: ['WHERE clause order of execution', 'Wildcard matching with % and _', 'Set testing with IN (...)', 'Range filtering with BETWEEN'],
    contentSections: [
      {
        heading: 'Filtering Rows with WHERE Conditions',
        body: 'The WHERE clause filters rows BEFORE any grouping occurs. Combine multiple conditions using AND (both must be true) and OR (either can be true). Always use parentheses when mixing AND with OR to prevent precedence bugs.',
        codeSnippet: 'SELECT order_id, customer_name, region, sales, profit\nFROM global_superstore\nWHERE region = \'West\' \n  AND sales > 500 \n  AND profit > 0;',
        codeLanguage: 'sql',
        tip: 'In SQL strings, wrap text in single quotes (\'East\') rather than double quotes.'
      },
      {
        heading: 'Wildcards (LIKE) and Set Membership (IN)',
        body: 'Use LIKE \'%Phones%\' to match any record containing the word Phones. Use IN to match against multiple possible categories without writing multiple OR statements.',
        codeSnippet: '-- Matches any customer name starting with \'A\':\nSELECT customer_name FROM global_superstore WHERE customer_name LIKE \'A%\';\n\n-- Matches specific target regions:\nSELECT order_id, region, sales FROM global_superstore WHERE region IN (\'East\', \'Central\');',
        codeLanguage: 'sql'
      }
    ],
    interactiveChallenge: {
      id: 'ch_sql_2',
      title: 'Filter Unprofitable Orders in the West',
      instruction: 'Write a SQL query selecting order_id, region, and profit from global_superstore where region = \'West\' and profit < 0.',
      starterCode: 'SELECT order_id, region, profit FROM global_superstore WHERE ',
      expectedOutputHint: "SELECT order_id, region, profit FROM global_superstore WHERE region = 'West' AND profit < 0;",
      type: 'sql',
      solution: "SELECT order_id, region, profit FROM global_superstore WHERE region = 'West' AND profit < 0;",
      validate: (input) => {
        const clean = input.trim().replace(/;$/, '').replace(/\s+/g, ' ').replace(/"/g, "'").toUpperCase();
        if (clean.includes("WHERE REGION = 'WEST'") && clean.includes('PROFIT < 0')) {
          return { passed: true, message: 'Awesome! You successfully isolated loss-making orders in the West region.' };
        }
        return { passed: false, message: "Expected WHERE region = 'West' AND profit < 0" };
      }
    },
    quiz: [
      {
        id: 'q_sql_2',
        question: 'Which operator checks if a column value matches any item in a specified list?',
        options: [
          'IN',
          'CONTAINS',
          'EQUAL ANY',
          'EXISTS'
        ],
        correctIndex: 0,
        explanation: 'The IN operator allows you to specify multiple values in a WHERE clause (e.g., WHERE region IN (\'East\', \'West\')).'
      }
    ]
  },
  {
    id: 'mysql_3',
    toolId: 'mysql',
    chapterNumber: 3,
    title: 'Aggregations & GROUP BY / HAVING',
    subtitle: 'Summarizing metrics: COUNT, SUM, AVG, MIN, MAX',
    durationMinutes: 18,
    summary: 'Learn how to group rows into analytical summaries. Understand why non-aggregated columns must appear in GROUP BY and how HAVING differs from WHERE.',
    keyConcepts: ['Aggregate functions (COUNT, SUM, AVG)', 'GROUP BY dimension1, dimension2', 'WHERE vs HAVING difference', 'NULL handling in aggregations'],
    contentSections: [
      {
        heading: 'Grouping Data by Dimensions',
        body: 'When you want to know total sales by department or average salary by job role, GROUP BY clusters rows that have the same values into summary rows.',
        codeSnippet: 'SELECT \n  department,\n  COUNT(*) AS total_employees,\n  ROUND(AVG(monthly_salary), 2) AS avg_salary,\n  MAX(monthly_salary) AS top_salary\nFROM hr_employee_attrition\nGROUP BY department;',
        codeLanguage: 'sql',
        tip: 'Golden SQL Rule: Every column in your SELECT clause that is NOT inside an aggregate function (like SUM or AVG) MUST be listed in your GROUP BY clause!'
      },
      {
        heading: 'HAVING: Filtering Aggregated Results',
        body: 'A fundamental SQL concept: WHERE filters individual records before aggregation. HAVING filters grouped rows after aggregation.',
        codeSnippet: 'SELECT \n  region,\n  SUM(sales) AS total_revenue,\n  SUM(profit) AS total_profit\nFROM global_superstore\nGROUP BY region\nHAVING total_revenue > 2000;',
        codeLanguage: 'sql'
      }
    ],
    interactiveChallenge: {
      id: 'ch_sql_3',
      title: 'Count Employees by Department',
      instruction: 'Write a SQL query that selects department and COUNT(*) as headcount from hr_employee_attrition grouped by department.',
      starterCode: 'SELECT department, COUNT(*) AS headcount FROM hr_employee_attrition ',
      expectedOutputHint: 'SELECT department, COUNT(*) AS headcount FROM hr_employee_attrition GROUP BY department;',
      type: 'sql',
      solution: 'SELECT department, COUNT(*) AS headcount FROM hr_employee_attrition GROUP BY department;',
      validate: (input) => {
        const clean = input.trim().replace(/;$/, '').replace(/\s+/g, ' ').toUpperCase();
        if (clean.includes('GROUP BY DEPARTMENT')) {
          return { passed: true, message: 'Great job! GROUP BY department groups rows to calculate headcount.' };
        }
        return { passed: false, message: 'Ensure your query ends with GROUP BY department' };
      }
    },
    quiz: [
      {
        id: 'q_sql_3',
        question: 'Why does SQL require HAVING instead of WHERE when filtering based on an aggregate like SUM(sales) > 10000?',
        options: [
          'Because WHERE runs before rows are grouped, while HAVING runs after group aggregation',
          'HAVING is just a modern synonym for WHERE with identical execution timing',
          'WHERE only works with numbers, while HAVING works with text',
          'HAVING is an index optimization command'
        ],
        correctIndex: 0,
        explanation: 'In the SQL logical order of operations, WHERE filters individual rows from the source table. Groups are created next, and HAVING filters the resulting aggregate groups.'
      }
    ]
  },
  {
    id: 'mysql_4',
    toolId: 'mysql',
    chapterNumber: 4,
    title: 'Multi-Table JOINs: INNER & LEFT JOIN',
    subtitle: 'Connecting normalized tables using Primary and Foreign Keys',
    durationMinutes: 20,
    summary: 'Relational data is normalized across tables. Learn how to combine orders with customers and products using INNER JOIN and preserve unmatched records with LEFT JOIN.',
    keyConcepts: ['Primary Key (PK) vs Foreign Key (FK)', 'INNER JOIN: intersection only', 'LEFT JOIN: retain all left rows', 'Table Aliases (o.customer_id = c.id)'],
    contentSections: [
      {
        heading: 'Relational Integrity & Key Linking',
        body: 'In a normalized database, a customer table stores contact details, while an orders table stores purchase transactions with a foreign key customer_id pointing to customer.id.',
        codeSnippet: '-- INNER JOIN: Only returns orders that match an active customer\nSELECT \n  o.order_id,\n  o.order_date,\n  c.customer_name,\n  c.segment,\n  o.sales\nFROM orders AS o\nINNER JOIN customers AS c \n  ON o.customer_id = c.customer_id;',
        codeLanguage: 'sql',
        tip: 'Use LEFT JOIN when you want to find items that have zero purchases (e.g. products that have never been ordered, where order_id IS NULL).'
      }
    ],
    quiz: [
      {
        id: 'q_sql_4',
        question: 'If you want to list ALL customers, including those who have never placed an order, which JOIN should you use between Customers and Orders?',
        options: [
          'LEFT JOIN (Customers LEFT JOIN Orders)',
          'INNER JOIN',
          'CROSS JOIN',
          'NATURAL JOIN'
        ],
        correctIndex: 0,
        explanation: 'A LEFT JOIN keeps every single row from the left table (Customers) and populates NULL for columns from the right table (Orders) if no match exists.'
      }
    ]
  },
  {
    id: 'mysql_5',
    toolId: 'mysql',
    chapterNumber: 5,
    title: 'Ordering, Pagination & Window Functions',
    subtitle: 'ORDER BY, LIMIT, OFFSET, and analytic RANK()',
    durationMinutes: 18,
    summary: 'Structure your final outputs. Master sorting by multiple columns (ASC and DESC), implementing paginated result windows, and calculating ranking over partitions.',
    keyConcepts: ['ORDER BY col1 ASC, col2 DESC', 'LIMIT and OFFSET pagination', 'ROW_NUMBER() OVER (PARTITION BY ...)', 'DENSE_RANK() vs RANK()'],
    contentSections: [
      {
        heading: 'Sorting and Limiting Results',
        body: 'ORDER BY sorts your output by specified columns. You can combine multiple sort criteria (e.g. order by department alphabetically, then by salary descending).',
        codeSnippet: 'SELECT emp_id, department, monthly_salary\nFROM hr_employee_attrition\nORDER BY monthly_salary DESC\nLIMIT 5;',
        codeLanguage: 'sql'
      },
      {
        heading: 'Introduction to Analytical Window Functions',
        body: 'Unlike GROUP BY, which collapses multiple rows into a single summary row, window functions compute aggregate values across a set of rows while preserving individual row identity.',
        codeSnippet: 'SELECT \n  emp_id,\n  department,\n  monthly_salary,\n  RANK() OVER (PARTITION BY department ORDER BY monthly_salary DESC) as dept_salary_rank\nFROM hr_employee_attrition;',
        codeLanguage: 'sql'
      }
    ],
    quiz: [
      {
        id: 'q_sql_5',
        question: 'What is the purpose of PARTITION BY in a SQL window function?',
        options: [
          'It breaks the calculation into independent subsets or groups without collapsing rows',
          'It splits the database table across different physical hard drives',
          'It permanently deletes duplicate rows',
          'It renames the output table'
        ],
        correctIndex: 0,
        explanation: 'PARTITION BY divides the result set into partitions (e.g. per department) to apply the window function independently to each partition.'
      }
    ]
  },

  // POWER BI
  {
    id: 'pbi_1',
    toolId: 'powerbi',
    chapterNumber: 1,
    title: 'Power BI Architecture & Star Schema Design',
    subtitle: 'Fact tables, Dimension tables, and Cardinality',
    durationMinutes: 15,
    summary: 'Understand the foundation of Power BI data modeling. Learn why Star Schemas are the golden standard for high-performance VertiPaq compression and clean DAX calculations.',
    keyConcepts: ['Fact Table (transactions, metrics)', 'Dimension Tables (who, what, where, when)', '1-to-Many (*:1) Single Direction Relationships', 'Star vs Snowflake Schema'],
    contentSections: [
      {
        heading: 'The Star Schema Standard',
        body: 'In Power BI, optimal report speed and simplicity depend on the Star Schema. At the center sits the Fact Table (e.g., Fact_Sales) holding quantitative numbers (sales amount, quantity, cost). Radiating outward are Dimension Tables (Dim_Customer, Dim_Product, Dim_Date, Dim_Store) providing descriptive attributes.',
        codeSnippet: 'Fact_Sales (1,000,000 rows):\n  - OrderKey (FK)\n  - CustomerKey (FK)  ---> Links to Dim_Customer (1 to Many)\n  - ProductKey (FK)   ---> Links to Dim_Product (1 to Many)\n  - DateKey (FK)      ---> Links to Dim_Date (1 to Many)\n  - SalesAmount ($)\n  - Quantity',
        codeLanguage: 'text',
        tip: 'Always set filter direction to Single (from Dimension to Fact). Avoid Bi-Directional filtering unless strictly necessary, as it causes circular relationship ambiguities!'
      }
    ],
    quiz: [
      {
        id: 'q_pbi_1',
        question: 'In a Star Schema, which table stores numeric business transactions and metrics?',
        options: [
          'Fact table',
          'Dimension table',
          'Bridge table',
          'Hierarchy table'
        ],
        correctIndex: 0,
        explanation: 'Fact tables hold transactional measurements, metrics, and foreign keys that link out to descriptive dimension tables.'
      }
    ]
  },
  {
    id: 'pbi_2',
    toolId: 'powerbi',
    chapterNumber: 2,
    title: 'Power Query ETL & Data Transformation (M)',
    subtitle: 'Extract, Transform, and Load before reporting',
    durationMinutes: 18,
    summary: '80% of data work is preparation. Learn how Power Query records transformation steps in the M language: unpivoting columns, handling nulls, splitting delimiters, and merging queries.',
    keyConcepts: ['Applied Steps in Power Query', 'Unpivoting wide tables into tall datasets', 'Splitting columns by delimiter', 'Merging vs Appending queries'],
    contentSections: [
      {
        heading: 'Transforming Wide Data to Narrow (Unpivot)',
        body: 'Spreadsheets often store monthly numbers horizontally (Jan, Feb, Mar columns). Power BI needs narrow/tall data. Power Query allows you to select non-date columns and click "Unpivot Other Columns" in one step.',
        codeSnippet: '// Power Query M Code generated step:\n= Table.UnpivotOtherColumns(#"PreviousStep", {"Region", "Product"}, "Month", "SalesValue")',
        codeLanguage: 'powerquery',
        tip: 'Perform all heavy data transformations in Power Query during data load, not via calculated columns in DAX. Power Query optimizes memory compression.'
      }
    ],
    quiz: [
      {
        id: 'q_pbi_2',
        question: 'What is the difference between "Merge Queries" and "Append Queries" in Power Query?',
        options: [
          'Merge combines tables horizontally (like a SQL JOIN); Append stacks tables vertically (like a SQL UNION)',
          'Merge is for numbers; Append is for text',
          'Append combines tables horizontally; Merge stacks them vertically',
          'Merge creates calculated columns; Append creates DAX measures'
        ],
        correctIndex: 0,
        explanation: 'Merge matches columns side-by-side using key columns (like SQL JOIN). Append stacks rows from one table beneath another (like SQL UNION).'
      }
    ]
  },
  {
    id: 'pbi_3',
    toolId: 'powerbi',
    chapterNumber: 3,
    title: 'Calculated Columns vs DAX Measures',
    subtitle: 'Row Context vs Filter Context explained clearly',
    durationMinutes: 20,
    summary: 'The single most critical concept in Power BI. Understand why calculated columns consume RAM, whereas DAX measures evaluate on-the-fly dynamically responding to report slicers.',
    keyConcepts: ['Row Context (evaluated row-by-row during refresh)', 'Filter Context (evaluated dynamically based on visual filters and slicers)', 'RAM memory consumption differences', 'When to use Measures vs Columns'],
    contentSections: [
      {
        heading: 'Calculated Column (Static Storage in RAM)',
        body: 'A calculated column calculates a value for every single row and stores it permanently in the data model memory. Use them only when you need the field as a Slicer or Axis category.',
        codeSnippet: '// Calculated Column (Row Context):\nMargin = Orders[Sales] - Orders[Cost]',
        codeLanguage: 'dax'
      },
      {
        heading: 'DAX Measure (Dynamic On-The-Fly Aggregation)',
        body: 'A Measure does NOT store values in rows. It calculates dynamically when a user clicks a slicer or views a chart. It recalculates instantly based on the visual filter context.',
        codeSnippet: '// DAX Measure (Filter Context):\nTotal Sales = SUM(Orders[Sales])\nProfit Margin % = DIVIDE([Total Profit], [Total Sales], 0)',
        codeLanguage: 'dax',
        tip: 'Always use DIVIDE(numerator, denominator, alternate_value) in DAX instead of a slash (/) to protect against division-by-zero errors.'
      }
    ],
    quiz: [
      {
        id: 'q_pbi_3',
        question: 'Why should you almost always prefer a DAX Measure over a Calculated Column for aggregated KPIs?',
        options: [
          'Measures do not consume RAM memory and recalculate dynamically based on active visual filters and slicers',
          'Measures are written in Python while columns use DAX',
          'Calculated columns cannot compute sums',
          'Measures only work in Microsoft Excel'
        ],
        correctIndex: 0,
        explanation: 'DAX measures calculate dynamically at query time based on user interactions and slicers, saving model memory and enabling dynamic aggregation.'
      }
    ]
  },
  {
    id: 'pbi_4',
    toolId: 'powerbi',
    chapterNumber: 4,
    title: 'Mastering CALCULATE, FILTER & Time Intelligence',
    subtitle: 'The engine of advanced DAX analytics',
    durationMinutes: 22,
    summary: 'CALCULATE is the single most powerful function in DAX because it modifies the existing Filter Context. Master CALCULATE, FILTER, ALL, and Year-over-Year time intelligence.',
    keyConcepts: ['CALCULATE(expression, filter1, filter2)', 'ALL() to remove filter context for % share', 'FILTER() table iterator', 'SAMEPERIODLASTYEAR and DATEADD'],
    contentSections: [
      {
        heading: 'Modifying Filter Context with CALCULATE',
        body: 'CALCULATE evaluates any measure under a new, modified set of filters. You can override visual filters or inject specific conditions.',
        codeSnippet: '// Sales specifically for East region, regardless of visual category:\nEast Sales = \nCALCULATE(\n    [Total Sales],\n    Orders[Region] = "East"\n)',
        codeLanguage: 'dax'
      },
      {
        heading: 'Calculating Market Share with ALL()',
        body: 'To compute what percentage of total company revenue each region represents, you divide regional sales by company-wide sales where region filters have been removed via ALL().',
        codeSnippet: '% of Total Sales = \nDIVIDE(\n    [Total Sales],\n    CALCULATE([Total Sales], ALL(Orders[Region]))\n)',
        codeLanguage: 'dax'
      }
    ],
    quiz: [
      {
        id: 'q_pbi_4',
        question: 'What does the ALL() function do when passed inside a CALCULATE statement?',
        options: [
          'It ignores/removes active filters on the specified column or table',
          'It selects all columns in the database',
          'It duplicates the fact table',
          'It forces an inner join between all tables'
        ],
        correctIndex: 0,
        explanation: 'ALL(Table[Column]) ignores existing filter context applied to that column, enabling grand total or percentage of total calculations.'
      }
    ]
  },
  {
    id: 'pbi_5',
    toolId: 'powerbi',
    chapterNumber: 5,
    title: 'Report Design, Slicers & Cross-Filtering',
    subtitle: 'Building user-centric, interactive executive dashboards',
    durationMinutes: 16,
    summary: 'Learn best practices for layout hierarchy, card visuals, synchronizing slicers across report pages, and configuring visual interactions (filter vs highlight).',
    keyConcepts: ['Visual interactions: Filter vs Highlight vs None', 'Syncing Slicers across pages', 'Top-level KPI summary cards', 'Drill-through actions'],
    contentSections: [
      {
        heading: 'Dashboard Hierarchy & Visual Flow',
        body: 'Structure reports with the inverted pyramid: high-level KPI cards at the top (Total Revenue, Margin %, Active Customers), trend line charts in the center, and detailed tabular breakdowns at the bottom.',
        codeSnippet: 'Top:    [ $2.4M Revenue ] [ +14.2% YoY ] [ 98.2% CSAT ]\nMiddle: Revenue Trend by Month (Line) | Sales by Category (Bar)\nBottom: Customer Segment Matrix Breakdown with drill-down',
        codeLanguage: 'text'
      }
    ],
    quiz: [
      {
        id: 'q_pbi_5',
        question: 'What visual interaction setting causes clicking a bar chart slice to dim non-selected values rather than hiding them completely?',
        options: [
          'Highlight',
          'Filter',
          'None',
          'Drillthrough'
        ],
        correctIndex: 0,
        explanation: 'Highlight leaves the full bar visible but dims the non-selected proportion, showing relative contribution in context.'
      }
    ]
  },

  // TABLEAU
  {
    id: 'tab_1',
    toolId: 'tableau',
    chapterNumber: 1,
    title: 'Tableau Fundamentals: Blue vs Green Pills',
    subtitle: 'Discrete vs Continuous data roles in visualization',
    durationMinutes: 14,
    summary: 'The most fundamental distinction in Tableau. Understand why blue pills create headers and categorical divisions, while green pills draw continuous numerical axes.',
    keyConcepts: ['Blue = Discrete (Headers / Categories)', 'Green = Continuous (Axes / Numerical Gradients)', 'Dimensions vs Measures', 'Converting pills on the fly'],
    contentSections: [
      {
        heading: 'Blue is Discrete, Green is Continuous',
        body: 'In Tableau, pill color has NOTHING to do with whether a field is a dimension or measure! Blue pills are DISCRETE: they create separate row or column headers. Green pills are CONTINUOUS: they generate a continuous axis with coordinates.',
        codeSnippet: 'Blue Pill on Columns  --> Creates separate text column headers (e.g., East | West | South)\nGreen Pill on Columns --> Draws a quantitative horizontal numerical axis (0 to 100k)',
        codeLanguage: 'text',
        tip: 'Right-click a date pill to toggle between Discrete Date Parts (all Januarys combined across all years) and Continuous Date Values (Jan 2024, Feb 2024 chronologically).'
      }
    ],
    quiz: [
      {
        id: 'q_tab_1',
        question: 'What does a GREEN pill on the Rows shelf create in Tableau?',
        options: [
          'A continuous vertical numerical axis',
          'A set of discrete categorical row headers',
          'A filter dropdown',
          'A calculated column'
        ],
        correctIndex: 0,
        explanation: 'Green pills represent continuous data and always draw a continuous numerical axis in the visualization.'
      }
    ]
  },
  {
    id: 'tab_2',
    toolId: 'tableau',
    chapterNumber: 2,
    title: 'The Marks Card: Visual Encodings',
    subtitle: 'Color, Size, Shape, Label, Detail & Tooltip',
    durationMinutes: 16,
    summary: 'Master the visual grammar of data graphics. Learn how dragging fields onto Color, Size, Label, and Detail modifies marks and partitions the level of detail.',
    keyConcepts: ['Marks types: Bar, Line, Circle, Square, Area', 'Color gradients vs stepped color palettes', 'The Detail shelf: increasing granularity without visual marks', 'Customizing Tooltips with dynamic text'],
    contentSections: [
      {
        heading: 'Visual Variables & Perception',
        body: 'The Marks Card is how you translate numbers into human visual perception: position (X/Y), length, color hue/intensity, size, and shape.',
        codeSnippet: 'Color:   Profit (Diverging Orange-Blue palette, center at 0)\nSize:    Quantity of items ordered\nLabel:   Customer Name (top 10 only)\nDetail:  Order ID (creates one circle per order without drawing text)',
        codeLanguage: 'text',
        tip: 'Dragging a dimension to the Detail mark increases the level of granularity in the visualization without creating new rows or columns.'
      }
    ],
    quiz: [
      {
        id: 'q_tab_2',
        question: 'What happens when you drop a dimension field onto the Detail shelf of the Marks card?',
        options: [
          'It increases the visual granularity, creating individual marks for each dimension value without splitting the view into new rows/columns',
          'It hides the marks from view',
          'It converts the chart into a pie chart',
          'It changes the background color'
        ],
        correctIndex: 0,
        explanation: 'Detail changes the Level of Detail of the view, slicing marks into smaller components without adding row or column headers.'
      }
    ]
  },
  {
    id: 'tab_3',
    toolId: 'tableau',
    chapterNumber: 3,
    title: 'Building Core Visuals & Dual Axis Charts',
    subtitle: 'Combining line and bar charts with synchronized axes',
    durationMinutes: 18,
    summary: 'Build high-impact visual comparisons. Create dual-axis charts overlaying sales bars with profit ratio trendlines, configure heatmaps, and highlight outliers.',
    keyConcepts: ['Dual Axis configuration', 'Synchronizing Axes', 'Changing Mark types independently', 'Reference lines and bands'],
    contentSections: [
      {
        heading: 'Creating a Dual Axis Chart',
        body: 'To compare Sales (large numbers in thousands) and Profit Margin % (small decimals between -0.2 and +0.5) on the same date timeline: Place both measures on Rows, right-click the second measure pill, and select "Dual Axis".',
        codeSnippet: '// Dual Axis Steps:\n1. Rows: SUM(Sales), SUM(Profit)\n2. Click right pill dropdown -> Select "Dual Axis"\n3. Right-click secondary axis -> Select "Synchronize Axis" (if scales match)\n4. In Marks card: Set Sales to Bar, set Profit to Line',
        codeLanguage: 'text'
      }
    ],
    quiz: [
      {
        id: 'q_tab_3',
        question: 'When building a Dual Axis chart with two measures that share the same unit of measure (e.g. Sales and Budget Sales), what setting must you enable to ensure accurate visual comparison?',
        options: [
          'Synchronize Axis',
          'Discrete Mark',
          'Lock Scales',
          'Fixed LOD'
        ],
        correctIndex: 0,
        explanation: 'Synchronize Axis forces both the left and right vertical axes to share the exact same scale, preventing deceptive comparisons.'
      }
    ]
  },
  {
    id: 'tab_4',
    toolId: 'tableau',
    chapterNumber: 4,
    title: 'Level of Detail (LOD) Expressions: FIXED, INCLUDE, EXCLUDE',
    subtitle: 'Computing at granularities independent of the visual view',
    durationMinutes: 24,
    summary: 'Unlock advanced calculations in Tableau. Learn how FIXED expressions calculate values at a specific dimension level regardless of what dimensions are on the shelf.',
    keyConcepts: ['{ FIXED [Dimension] : AGG([Measure]) }', 'INCLUDE: computing at finer detail than shown', 'EXCLUDE: computing at coarser detail', 'Order of operations & Context Filters'],
    contentSections: [
      {
        heading: 'Why FIXED LOD Expressions are Game-Changing',
        body: 'Normally, Tableau calculates aggregates based strictly on the dimensions currently displayed on your Columns and Rows shelves. A FIXED expression lets you break free from the view: compute total customer spend or regional benchmarks anywhere.',
        codeSnippet: '// Customer Lifetime Value:\n{ FIXED [Customer ID] : SUM([Sales]) }\n\n// Regional Average Sales benchmark:\n{ FIXED [Region] : AVG([Sales]) }\n\n// Did the customer make a purchase in 2024?\n{ FIXED [Customer ID] : MAX([Order Date]) }',
        codeLanguage: 'tableau',
        tip: 'Remember Tableau\'s Order of Operations: Dimension filters apply AFTER FIXED expressions unless you right-click the filter and choose "Add to Context"!'
      }
    ],
    quiz: [
      {
        id: 'q_tab_4',
        question: 'Which LOD syntax calculates the total sales for each Region regardless of which customer or product dimensions are present on the view?',
        options: [
          '{ FIXED [Region] : SUM([Sales]) }',
          'SUM(Sales) FOR EACH Region',
          '=CALCULATE(SUM(Sales), ALL(Region))',
          'GROUP BY [Region] (SUM(Sales))'
        ],
        correctIndex: 0,
        explanation: 'In Tableau, { FIXED [Dimension] : AGG([Measure]) } computes the measure aggregate at the exact grain of the specified dimension.'
      }
    ]
  },
  {
    id: 'tab_5',
    toolId: 'tableau',
    chapterNumber: 5,
    title: 'Dashboard Actions & Interactive Stories',
    subtitle: 'Filter actions, URL actions, and parameter controls',
    durationMinutes: 16,
    summary: 'Turn static charts into an exploratory visual experience. Configure Filter Actions that allow clicking a map region to instantly filter all linked trend and breakdown charts.',
    keyConcepts: ['Dashboard Filter Actions (Source to Target)', 'Highlight Actions', 'Container layout: Tiled vs Floating', 'Building Story Points'],
    contentSections: [
      {
        heading: 'Configuring Filter Actions',
        body: 'In Dashboard -> Actions -> Add Action -> Filter: designate your geographic map as the Source Sheet, and your trend lines and product matrices as Target Sheets. Set the run action on "Select".',
        codeSnippet: 'Source: Map of Sales by State (Select)\nTarget: Monthly Trend Chart, Sub-Category Profit Bar\nClearing the selection: "Show all values"',
        codeLanguage: 'text'
      }
    ],
    quiz: [
      {
        id: 'q_tab_5',
        question: 'What action setting in Tableau causes selecting a data point in one visual to filter all other charts on the dashboard?',
        options: [
          'Filter Action',
          'Go to Sheet Action',
          'Set Parameter Action',
          'Highlight Filter'
        ],
        correctIndex: 0,
        explanation: 'A Filter Action transmits the selected dimension values from a source visual as a filter to one or more target visuals.'
      }
    ]
  },

  // KOBO COLLECT & ODK
  {
    id: 'kobo_1',
    toolId: 'kobocollect',
    chapterNumber: 1,
    title: 'Mobile Field Collection & XLSForm Architecture',
    subtitle: 'ODK standard, humanitarian surveys, and offline deployment',
    durationMinutes: 14,
    summary: 'Kobo Collect and ODK (Open Data Kit) are the world standard for offline field data collection in humanitarian relief, public health, and academic field research.',
    keyConcepts: ['ODK / XLSForm open standard', 'The 3 core Excel worksheets: survey, choices, settings', 'Offline tablet/phone caching & synchronization', 'Form ID and versioning'],
    contentSections: [
      {
        heading: 'The XLSForm Specification',
        body: 'An XLSForm is designed inside an Excel spreadsheet (.xlsx) with three mandatory worksheets: "survey" (defines question sequence and types), "choices" (defines options for multiple choice questions), and "settings" (form title and form ID).',
        codeSnippet: '// Worksheet: survey\ntype           | name            | label\n---------------+-----------------+-----------------------------------------\ntext           | surveyor_name   | What is your name?\ninteger        | household_size  | How many persons reside in this shelter?\nselect_one gender| respondent_sex| Sex of respondent\ngeopoint       | shelter_gps     | Record GPS coordinates of shelter',
        codeLanguage: 'text',
        tip: 'Kobo Collect works 100% offline in remote areas without cellular connection. Forms are cached locally and submissions sync once WiFi or mobile data is detected.'
      }
    ],
    quiz: [
      {
        id: 'q_kobo_1',
        question: 'Which worksheet in an XLSForm file defines the questions, their types, and their labels?',
        options: [
          'survey',
          'choices',
          'settings',
          'questions'
        ],
        correctIndex: 0,
        explanation: 'The "survey" worksheet is where questions, data types, variable names, labels, skip logic, and validation constraints are defined.'
      }
    ]
  },
  {
    id: 'kobo_2',
    toolId: 'kobocollect',
    chapterNumber: 2,
    title: 'Core Question Types & Choice Lists',
    subtitle: 'select_one vs select_multiple, integer, decimal & geopoint',
    durationMinutes: 16,
    summary: 'Understand field data types. Learn how choice lists link between the survey and choices sheets, how to store compact variable codes, and how GPS geopoints capture lat/long/altitude.',
    keyConcepts: ['select_one [list_name] (single radio button)', 'select_multiple [list_name] (checkboxes)', 'geopoint (latitude, longitude, altitude, accuracy)', 'note (informational text without input)'],
    contentSections: [
      {
        heading: 'Linking Survey to Choices Sheet',
        body: 'When asking a multiple-choice question, use select_one followed by a list name. On the choices worksheet, list the options under that list_name with machine-readable names and user-facing labels.',
        codeSnippet: '// survey sheet:\nselect_one water_source_list | primary_water | Main source of drinking water\n\n// choices sheet:\nlist_name          | name      | label\n-------------------+-----------+----------------------\nwater_source_list  | borehole  | Protected Borehole\nwater_source_list  | trucking  | Water Trucking\nwater_source_list  | river     | Surface River / Pond\nwater_source_list  | piped     | Piped Public Tap',
        codeLanguage: 'text',
        tip: 'Always use lowercase alphanumeric strings with underscores (no spaces) for choice names: "borehole", not "Protected Borehole". Labels can contain any language or formatting.'
      }
    ],
    quiz: [
      {
        id: 'q_kobo_2',
        question: 'Which XLSForm question type records GPS coordinates (latitude, longitude, altitude, and accuracy)?',
        options: [
          'geopoint',
          'location',
          'gps_coordinate',
          'map_pin'
        ],
        correctIndex: 0,
        explanation: 'The "geopoint" question type queries the mobile phone\'s internal GPS receiver and logs space-separated latitude, longitude, altitude, and accuracy.'
      }
    ]
  },
  {
    id: 'kobo_3',
    toolId: 'kobocollect',
    chapterNumber: 3,
    title: 'Skip Logic & Conditional Relevance',
    subtitle: 'Dynamically showing questions based on previous answers',
    durationMinutes: 18,
    summary: 'Never ask irrelevant questions in field surveys. Master the "relevant" column in XLSForm to conditionally reveal questions based on respondent gender, age, or previous answers.',
    keyConcepts: ['The relevant column: ${question_name} = \'value\'', 'Multiple conditions with and / or', 'selected(${multi_choice}, \'option\')', 'Nested skip patterns'],
    contentSections: [
      {
        heading: 'Writing Relevance Expressions in XLSForm',
        body: 'To only ask a follow-up question if a respondent answered "Yes" to a previous question named child_malnourished, set the relevant column to: ${child_malnourished} = \'yes\'.',
        codeSnippet: 'type       | name                 | label                                | relevant\n-----------+----------------------+--------------------------------------+------------------------------\nselect_one | child_malnourished   | Any child under 5 showing signs?     | \ninteger    | muac_measurement_mm  | What is the child\'s MUAC in mm?      | ${child_malnourished} = \'yes\'\ntext       | referral_clinic      | Which health post was referred?      | ${child_malnourished} = \'yes\' and ${muac_measurement_mm} < 115',
        codeLanguage: 'text',
        tip: 'For select_multiple questions, you cannot use an equals sign! Use selected(${symptoms}, \'fever\') instead.'
      }
    ],
    interactiveChallenge: {
      id: 'ch_kobo_3',
      title: 'Write an XLSForm Skip Logic Expression',
      instruction: 'Write the relevant condition to only show a question if the previous question named "has_latrine" is equal to "no".',
      starterCode: '${',
      expectedOutputHint: "${has_latrine} = 'no'",
      type: 'kobo',
      solution: "${has_latrine} = 'no'",
      validate: (input) => {
        const clean = input.trim().replace(/\s+/g, ' ').replace(/"/g, "'");
        if (clean === "${has_latrine} = 'no'") {
          return { passed: true, message: 'Spot on! ${has_latrine} = \'no\' conditionally displays the follow-up question.' };
        }
        return { passed: false, message: "Expected format: ${has_latrine} = 'no'" };
      }
    },
    quiz: [
      {
        id: 'q_kobo_3',
        question: 'Which function must you use to check if an option was chosen in a select_multiple question?',
        options: [
          'selected(${question_name}, \'option_code\')',
          '${question_name} = \'option_code\'',
          'contains(${question_name}, \'option_code\')',
          'has_item(${question_name}, \'option_code\')'
        ],
        correctIndex: 0,
        explanation: 'Because select_multiple stores space-separated values, you must use selected(${var}, \'val\') to test if a specific choice was checked.'
      }
    ]
  },
  {
    id: 'kobo_4',
    toolId: 'kobocollect',
    chapterNumber: 4,
    title: 'Data Validation & Constraints',
    subtitle: 'Preventing enumerator errors in the field',
    durationMinutes: 16,
    summary: 'Clean data starts at the point of capture. Learn how to write constraints that block impossible values (e.g. age < 0 or > 120) and provide user-friendly error messages.',
    keyConcepts: ['The constraint column: . >= 18 and . <= 100', 'The dot (.) operator referring to this question', 'constraint_message error display', 'regex() validation for phone and ID formats'],
    contentSections: [
      {
        heading: 'The Dot (.) Operator in Constraints',
        body: 'In XLSForm constraint expressions, the period (.) represents the value currently being typed into that specific question. If the condition evaluates to false, the form prevents progression.',
        codeSnippet: 'type    | name      | label             | constraint             | constraint_message\n--------+-----------+-------------------+------------------------+---------------------------------------\ninteger | head_age  | Age of HH head    | . >= 18 and . <= 110   | Age must be an adult between 18 and 110.\ndecimal | muac_mm   | MUAC strap (mm)   | . >= 50 and . <= 250   | MUAC must be between 50mm and 250mm.\ntext    | phone_num | Contact phone     | regex(., \'^[0-9]{10}$\')| Please enter a valid 10-digit number.',
        codeLanguage: 'text',
        tip: 'Always provide a clear, helpful constraint_message! Without it, enumerators will see a generic system error and may get stuck.'
      }
    ],
    quiz: [
      {
        id: 'q_kobo_4',
        question: 'What does the dot (.) character represent in an XLSForm constraint formula?',
        options: [
          'The current answer value entered for this question',
          'The entire survey response',
          'A mandatory decimal point',
          'The surveyor ID'
        ],
        correctIndex: 0,
        explanation: 'In XLSForm syntax, "." references the current question\'s entered value (e.g. ". >= 0 and . <= 100").'
      }
    ]
  },
  {
    id: 'kobo_5',
    toolId: 'kobocollect',
    chapterNumber: 5,
    title: 'Data Pipelines: Exporting to Excel, SQL & Power BI',
    subtitle: 'Connecting field collection to analytical dashboards',
    durationMinutes: 18,
    summary: 'The bridge between data collection and data analysis. Learn how raw survey submissions are exported from KoboToolbox, cleaned of metadata, and fed into MySQL or Power BI.',
    keyConcepts: ['Export formats: XLS, CSV, GeoJSON', 'Handling select_multiple columns (0/1 binary flags)', 'Audit logs & GPS accuracy filtering', 'Automating API ingestion with REST APIs'],
    contentSections: [
      {
        heading: 'From Field Phone to Analytical Model',
        body: 'Once enumerators synchronize completed forms from their Android devices to KoboToolbox server, the data pipeline begins: 1. Export as clean CSV, 2. Load into MySQL database or Power Query, 3. Calculate WASH and nutrition indicators, 4. Display on interactive Power BI/Tableau maps.',
        codeSnippet: 'Field Device (Kobo Android App)\n       |\n       v [Sync over WiFi / 4G]\nKoboToolbox Server (Submissions Database)\n       |\n       v [API / CSV Export]\nMySQL / Data Warehouse (Normalized storage)\n       |\n       v [Star Schema & DAX / LOD]\nPower BI & Tableau (Executive Humanitarian Dashboard)',
        codeLanguage: 'text'
      }
    ],
    quiz: [
      {
        id: 'q_kobo_5',
        question: 'How are select_multiple questions typically formatted when exported from KoboToolbox for data analysis in Excel or SQL?',
        options: [
          'Both as a combined space-separated text column and as individual binary (0/1 or TRUE/FALSE) indicator columns for each choice',
          'As audio recordings only',
          'They are deleted automatically',
          'They are merged into the GPS coordinates'
        ],
        correctIndex: 0,
        explanation: 'Kobo exports both the raw combined string and separate binary 0/1 columns (e.g. water_source/borehole = 1) for straightforward statistical aggregation.'
      }
    ]
  }
];

export const allPracticeChallenges: InteractiveChallenge[] = [
  {
    id: 'daily_sql_1',
    title: 'Top Sales Channels by Revenue',
    instruction: 'Query the ecommerce_marketing table to select channel and SUM(revenue_generated) as total_rev, grouped by channel and ordered by total_rev DESC.',
    type: 'sql',
    expectedOutputHint: 'SELECT channel, SUM(revenue_generated) AS total_rev FROM ecommerce_marketing GROUP BY channel ORDER BY total_rev DESC;',
    solution: 'SELECT channel, SUM(revenue_generated) AS total_rev FROM ecommerce_marketing GROUP BY channel ORDER BY total_rev DESC;',
    validate: (input) => {
      const clean = input.trim().replace(/;$/, '').replace(/\s+/g, ' ').toUpperCase();
      if (clean.includes('GROUP BY CHANNEL') && clean.includes('ORDER BY TOTAL_REV DESC')) {
        return { passed: true, message: 'Brilliant SQL! You grouped by channel and sorted by revenue descending.' };
      }
      return { passed: false, message: 'Check GROUP BY channel and ORDER BY total_rev DESC' };
    }
  },
  {
    id: 'daily_excel_1',
    title: 'XLOOKUP Customer Segment',
    instruction: 'Write an XLOOKUP formula to find order ID in cell A2 inside range Orders!A2:A100, returning the Segment from range Orders!D2:D100 with fallback "Unknown".',
    type: 'formula',
    expectedOutputHint: '=XLOOKUP(A2, Orders!A2:A100, Orders!D2:D100, "Unknown")',
    solution: '=XLOOKUP(A2, Orders!A2:A100, Orders!D2:D100, "Unknown")',
    validate: (input) => {
      const clean = input.trim().replace(/\s+/g, '').replace(/'/g, '"').toUpperCase();
      if (clean.includes('XLOOKUP(A2,ORDERS!A2:A100,ORDERS!D2:D100,"UNKNOWN")')) {
        return { passed: true, message: 'Modern XLOOKUP mastery! Safe against column changes and includes fallback.' };
      }
      return { passed: false, message: 'Ensure format: =XLOOKUP(A2, Orders!A2:A100, Orders!D2:D100, "Unknown")' };
    }
  },
  {
    id: 'daily_kobo_1',
    title: 'Adult Age Constraint Expression',
    instruction: 'Write an XLSForm constraint to ensure the entered age is at least 18 and at most 100.',
    type: 'kobo',
    expectedOutputHint: '. >= 18 and . <= 100',
    solution: '. >= 18 and . <= 100',
    validate: (input) => {
      const clean = input.trim().replace(/\s+/g, ' ');
      if (clean === '. >= 18 and . <= 100' || clean === '.>=18 and .<=100') {
        return { passed: true, message: 'Valid field constraint! Ensures enumerators cannot enter out-of-range ages.' };
      }
      return { passed: false, message: 'Expected syntax: . >= 18 and . <= 100' };
    }
  },
  {
    id: 'daily_bi_1',
    title: 'DAX Profit Ratio Measure',
    instruction: 'Write a DAX measure formula for [Profit Margin %] dividing [Total Profit] by [Total Sales] with safe default 0.',
    type: 'bi',
    expectedOutputHint: 'DIVIDE([Total Profit], [Total Sales], 0)',
    solution: 'DIVIDE([Total Profit], [Total Sales], 0)',
    validate: (input) => {
      const clean = input.trim().replace(/\s+/g, '').toUpperCase();
      if (clean.includes('DIVIDE([TOTALPROFIT],[TOTALSALES],0)')) {
        return { passed: true, message: 'Safe DAX practice! DIVIDE handles null and zero denominator cases cleanly.' };
      }
      return { passed: false, message: 'Expected: DIVIDE([Total Profit], [Total Sales], 0)' };
    }
  }
];
