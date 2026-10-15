import React, { useState } from 'react';
import { toolCatalog, curriculumLessons } from '../../data/curriculumData';
import { ToolId, Lesson } from '../../types';
import { LessonDetailModal } from './LessonDetailModal';
import { 
  FileSpreadsheet, 
  Database, 
  BarChart3, 
  PieChart, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Trophy,
  Play,
  Bookmark,
  Layers,
  Flame
} from 'lucide-react';

interface CourseTrackViewProps {
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  onToggleComplete: (lessonId: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  onOpenSandbox: (toolId: ToolId) => void;
  streakDays: number;
  totalXp: number;
}

export const CourseTrackView: React.FC<CourseTrackViewProps> = ({
  completedLessonIds,
  bookmarkedLessonIds,
  onToggleComplete,
  onToggleBookmark,
  onOpenSandbox,
  streakDays,
  totalXp
}) => {
  const [selectedToolId, setSelectedToolId] = useState<ToolId>('excel');
  const [activeLessonModal, setActiveLessonModal] = useState<Lesson | null>(null);

  const selectedTool = toolCatalog.find(t => t.id === selectedToolId) || toolCatalog[0];
  const trackLessons = curriculumLessons.filter(l => l.toolId === selectedToolId);

  const completedInTrack = trackLessons.filter(l => completedLessonIds.includes(l.id)).length;
  const trackProgressPct = Math.round((completedInTrack / trackLessons.length) * 100);

  const getToolIcon = (id: ToolId) => {
    switch (id) {
      case 'excel': return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'mysql': return <Database className="w-4 h-4 text-cyan-400" />;
      case 'powerbi': return <BarChart3 className="w-4 h-4 text-amber-400" />;
      case 'tableau': return <PieChart className="w-4 h-4 text-orange-400" />;
      case 'kobocollect': return <Smartphone className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Hero Learning Header with Generated Asset */}
      <div className="relative border-b border-slate-800 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 opacity-25 mix-blend-luminosity pointer-events-none">
          <img
            src="/src/assets/images/data_analysis_hero_1792074852565.jpg"
            alt="Data Analytics Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-4 sm:p-6 max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider font-mono">
              Data Analytics Academy
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 font-semibold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-800/40">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {streakDays} Day Streak
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-800/40 font-mono">
                <Trophy className="w-3.5 h-3.5" />
                {totalXp} XP
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Learn Excel, MySQL, Power BI, Tableau & Kobo Collect
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Hands-on curriculum with interactive sandboxes, practical business datasets, and real-world field survey collection.
          </p>
        </div>
      </div>

      {/* Tool Selector Horizontal Strip */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-5xl mx-auto">
          {toolCatalog.map(tool => {
            const isSelected = selectedToolId === tool.id;
            const completedCount = curriculumLessons.filter(l => l.toolId === tool.id && completedLessonIds.includes(l.id)).length;

            return (
              <button
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-slate-800 border-teal-500 text-white shadow-sm ring-1 ring-teal-500/50'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {getToolIcon(tool.id)}
                <span>{tool.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 text-slate-400 font-mono">
                  {completedCount}/{tool.lessonsCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Track Body */}
      <div className="p-3 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Track Overview Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="font-semibold text-teal-400 uppercase">{selectedTool.category}</span>
                <span>·</span>
                <span>{selectedTool.level} Level</span>
                <span>·</span>
                <span>{selectedTool.lessonsCount} Core Modules</span>
              </div>
              <h2 className="text-lg font-bold text-white">{selectedTool.name}</h2>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">{selectedTool.description}</p>
            </div>

            <button
              onClick={() => onOpenSandbox(selectedTool.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch {selectedTool.name} Sandbox</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-400">Track Progress</span>
              <span className="text-teal-400 font-mono">{trackProgressPct}% Complete ({completedInTrack}/{trackLessons.length})</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{ width: `${trackProgressPct}%` }}
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Chapters Stack */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum Modules</h3>

          <div className="space-y-3">
            {trackLessons.map(lesson => {
              const isCompleted = completedLessonIds.includes(lesson.id);
              const isBookmarked = bookmarkedLessonIds.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-950/60 border-slate-800/60 opacity-95'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 mt-0.5 ${
                        isCompleted ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : `0${lesson.chapterNumber}`}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white hover:text-teal-400 transition-colors cursor-pointer"
                              onClick={() => setActiveLessonModal(lesson)}>
                            {lesson.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {lesson.durationMinutes}m
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-2">{lesson.summary}</p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {lesson.keyConcepts.slice(0, 3).map((concept, cIdx) => (
                            <span key={cIdx} className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onToggleBookmark(lesson.id)}
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                        className={`p-2 rounded-lg border transition-colors ${
                          isBookmarked
                            ? 'bg-amber-950/50 border-amber-700/60 text-amber-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={() => setActiveLessonModal(lesson)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                            : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                        }`}
                      >
                        <span>{isCompleted ? 'Review' : 'Start'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lesson Detail Reader Modal */}
      {activeLessonModal && (
        <LessonDetailModal
          lesson={activeLessonModal}
          isCompleted={completedLessonIds.includes(activeLessonModal.id)}
          onToggleComplete={onToggleComplete}
          onClose={() => setActiveLessonModal(null)}
          onOpenSandbox={onOpenSandbox}
        />
      )}
    </div>
  );
};
