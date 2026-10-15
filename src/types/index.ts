export type ToolId = 'excel' | 'mysql' | 'powerbi' | 'tableau' | 'kobocollect';

export interface ToolMeta {
  id: ToolId;
  name: string;
  category: string;
  tagline: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
  lessonsCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveChallenge {
  id: string;
  title: string;
  instruction: string;
  starterCode?: string;
  expectedOutputHint: string;
  type: 'sql' | 'formula' | 'kobo' | 'bi';
  datasetId?: string;
  solution: string;
  validate?: (input: string) => { passed: boolean; message: string };
}

export interface Lesson {
  id: string;
  toolId: ToolId;
  chapterNumber: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  summary: string;
  keyConcepts: string[];
  contentSections: {
    heading: string;
    body: string;
    codeSnippet?: string;
    codeLanguage?: string;
    tip?: string;
  }[];
  interactiveChallenge?: InteractiveChallenge;
  quiz?: QuizQuestion[];
}

export interface DatasetColumn {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description: string;
}

export interface Dataset {
  id: string;
  name: string;
  toolRelevance: ToolId[];
  recordsCount: number;
  description: string;
  domain: 'E-Commerce' | 'Humanitarian & Health' | 'Human Resources' | 'Digital Marketing';
  columns: DatasetColumn[];
  rows: Record<string, any>[];
}

export interface UserProgress {
  completedLessons: string[]; // lesson ids
  completedChallenges: string[]; // challenge ids
  bookmarkedLessons: string[];
  xp: number;
  streakDays: number;
  lastActiveDate: string;
}

export interface KoboFieldQuestion {
  name: string;
  type: 'text' | 'integer' | 'decimal' | 'select_one' | 'select_multiple' | 'date' | 'geopoint' | 'note';
  label: string;
  hint?: string;
  required?: boolean;
  relevant?: string; // e.g., "${is_pregnant} = 'yes'"
  constraint?: string; // e.g., ". >= 18 and . <= 100"
  constraintMessage?: string;
  choices?: { name: string; label: string }[];
}

export interface KoboSubmission {
  id: string;
  submittedAt: string;
  data: Record<string, any>;
}
