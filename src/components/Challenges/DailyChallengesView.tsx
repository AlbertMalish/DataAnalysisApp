import React, { useState } from 'react';
import { allPracticeChallenges } from '../../data/curriculumData';
import { InteractiveChallenge } from '../../types';
import { 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Eye, 
  Flame, 
  ArrowRight,
  Code2,
  Check
} from 'lucide-react';

interface DailyChallengesViewProps {
  completedChallengeIds: string[];
  onCompleteChallenge: (id: string, xpEarned: number) => void;
  totalXp: number;
}

export const DailyChallengesView: React.FC<DailyChallengesViewProps> = ({
  completedChallengeIds,
  onCompleteChallenge,
  totalXp
}) => {
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, { passed: boolean; message: string }>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const handleInputChange = (challengeId: string, val: string) => {
    setUserInputs(prev => ({ ...prev, [challengeId]: val }));
  };

  const handleCheck = (ch: InteractiveChallenge) => {
    const input = userInputs[ch.id] || '';
    if (!ch.validate) return;
    const res = ch.validate(input);
    setFeedback(prev => ({ ...prev, [ch.id]: res }));
    if (res.passed && !completedChallengeIds.includes(ch.id)) {
      onCompleteChallenge(ch.id, 50);
    }
  };

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950/80">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Skill Evaluator</span>
            </div>
            <h2 className="text-xl font-bold text-white">Daily Data Analysis Challenges</h2>
            <p className="text-xs text-slate-300 mt-1">
              Solve hands-on formula, query, and configuration challenges to reinforce your mastery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Completed</div>
              <div className="text-lg font-bold text-teal-400 font-mono">
                {completedChallengeIds.length}/{allPracticeChallenges.length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total XP</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">{totalXp}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-4">
        {allPracticeChallenges.map((ch, idx) => {
          const isDone = completedChallengeIds.includes(ch.id);
          const currentInput = userInputs[ch.id] || '';
          const fb = feedback[ch.id];
          const isRevealed = revealedSolutions[ch.id];

          return (
            <div
              key={ch.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-slate-950/70 border-emerald-900/50'
                  : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                    isDone ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-semibold text-teal-400">
                      {ch.type.toUpperCase()} Challenge
                    </span>
                    <h3 className="text-sm font-bold text-white">{ch.title}</h3>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  +50 XP
                </span>
              </div>

              <p className="text-xs text-slate-300 mb-3 leading-relaxed">{ch.instruction}</p>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => handleInputChange(ch.id, e.target.value)}
                    placeholder={`e.g. ${ch.expectedOutputHint}`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    onClick={() => handleCheck(ch)}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-lg transition-colors shrink-0"
                  >
                    Validate
                  </button>
                </div>

                {fb && (
                  <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                    fb.passed
                      ? 'bg-emerald-950/40 border border-emerald-700/60 text-emerald-300'
                      : 'bg-rose-950/40 border border-rose-700/60 text-rose-300'
                  }`}>
                    {fb.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{fb.message}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => toggleSolution(ch.id)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isRevealed ? 'Hide Solution' : 'View Sample Solution'}</span>
                  </button>

                  <span className="text-[11px] text-slate-500 font-mono">
                    Hint: {ch.expectedOutputHint}
                  </span>
                </div>

                {isRevealed && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-teal-300">
                    <span className="text-slate-500 block text-[10px] uppercase mb-1">Standard Solution:</span>
                    {ch.solution}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
