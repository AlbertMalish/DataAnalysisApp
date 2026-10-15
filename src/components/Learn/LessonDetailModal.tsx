import React, { useState } from 'react';
import { Lesson, ToolId } from '../../types';
import { 
  X, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Play, 
  Lightbulb, 
  Check, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface LessonDetailModalProps {
  lesson: Lesson;
  isCompleted: boolean;
  onToggleComplete: (lessonId: string) => void;
  onClose: () => void;
  onOpenSandbox?: (toolId: ToolId) => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  lesson,
  isCompleted,
  onToggleComplete,
  onClose,
  onOpenSandbox
}) => {
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<Record<string, boolean>>({});
  
  // Interactive challenge state
  const [challengeCode, setChallengeCode] = useState<string>(lesson.interactiveChallenge?.starterCode || '');
  const [challengeResult, setChallengeResult] = useState<{ passed: boolean; message: string } | null>(null);

  const handleSelectQuiz = (quizId: string, optionIdx: number) => {
    if (submittedQuiz[quizId]) return;
    setSelectedQuizAnswers(prev => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleSubmitQuiz = (quizId: string) => {
    setSubmittedQuiz(prev => ({ ...prev, [quizId]: true }));
  };

  const handleRunChallenge = () => {
    if (!lesson.interactiveChallenge?.validate) return;
    const res = lesson.interactiveChallenge.validate(challengeCode);
    setChallengeResult(res);
    if (res.passed && !isCompleted) {
      onToggleComplete(lesson.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-xs font-mono">
              0{lesson.chapterNumber}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="uppercase font-semibold text-teal-400">{lesson.toolId}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.durationMinutes} mins
                </span>
              </div>
              <h2 className="text-base font-bold text-white leading-tight">{lesson.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Subtitle & Key Concepts */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2.5">
            <p className="text-xs text-slate-300 font-medium">{lesson.subtitle}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {lesson.keyConcepts.map((concept, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          {/* Core Content Sections */}
          <div className="space-y-6">
            {lesson.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="text-teal-400 font-mono">#{idx + 1}</span>
                  <span>{sec.heading}</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">{sec.body}</p>

                {sec.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                      {sec.codeLanguage || 'syntax'}
                    </div>
                    <pre className="p-3 text-xs font-mono text-teal-300 overflow-x-auto leading-relaxed">
                      {sec.codeSnippet}
                    </pre>
                  </div>
                )}

                {sec.tip && (
                  <div className="p-3 rounded-lg bg-teal-950/20 border border-teal-800/40 text-xs text-teal-200 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{sec.tip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Interactive Challenge Section */}
          {lesson.interactiveChallenge && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Hands-on Challenge</h4>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">+50 XP</span>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-white">{lesson.interactiveChallenge.title}</h5>
                <p className="text-xs text-slate-300 mt-1">{lesson.interactiveChallenge.instruction}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Your Code / Formula:</span>
                  <span className="text-slate-500 font-mono">Expected: {lesson.interactiveChallenge.expectedOutputHint}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={challengeCode}
                    onChange={(e) => setChallengeCode(e.target.value)}
                    placeholder="Type code here..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={handleRunChallenge}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Check
                  </button>
                </div>

                {challengeResult && (
                  <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    challengeResult.passed
                      ? 'bg-emerald-950/40 border border-emerald-700/60 text-emerald-300'
                      : 'bg-rose-950/40 border border-rose-700/60 text-rose-300'
                  }`}>
                    {challengeResult.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{challengeResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Interactive Quiz Section */}
          {lesson.quiz && lesson.quiz.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400">
                <HelpCircle className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Concept Check Quiz</h4>
              </div>

              {lesson.quiz.map((q) => {
                const selected = selectedQuizAnswers[q.id];
                const isSubmitted = submittedQuiz[q.id];
                const isCorrect = isSubmitted && selected === q.correctIndex;

                return (
                  <div key={q.id} className="space-y-3">
                    <p className="text-xs font-semibold text-slate-200 leading-snug">{q.question}</p>

                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selected === oIdx;
                        let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60';
                        if (isSubmitted) {
                          if (oIdx === q.correctIndex) {
                            optionStyle = 'bg-emerald-950/60 border-emerald-600 text-emerald-300 font-medium';
                          } else if (isChosen) {
                            optionStyle = 'bg-rose-950/60 border-rose-600 text-rose-300';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-cyan-950/50 border-cyan-500 text-cyan-200 font-medium';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectQuiz(q.id, oIdx)}
                            className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center justify-between transition-colors ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {isSubmitted && oIdx === q.correctIndex && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted ? (
                      <button
                        onClick={() => handleSubmitQuiz(q.id)}
                        disabled={selected === undefined}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                        <div className={`font-semibold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleComplete(lesson.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isCompleted
                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{isCompleted ? 'Marked Completed (+50 XP)' : 'Mark as Completed'}</span>
            </button>

            {onOpenSandbox && (
              <button
                onClick={() => {
                  onClose();
                  onOpenSandbox(lesson.toolId);
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                <span>Try in Sandbox</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
