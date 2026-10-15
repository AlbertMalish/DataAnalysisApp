import React from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Signal, 
  Maximize2, 
  Smartphone, 
  Monitor,
  Flame,
  Trophy
} from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  isDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  activeNavTab: string;
  onSelectNavTab: (tab: any) => void;
  streakDays: number;
  totalXp: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isDeviceFrame,
  onToggleDeviceFrame,
  activeNavTab,
  onSelectNavTab,
  streakDays,
  totalXp
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-0 md:p-4 select-none">
      {/* Top Floating App Bar (Desktop view header / switcher) */}
      <header className="w-full max-w-6xl hidden md:flex items-center justify-between py-2 px-4 mb-2 bg-slate-900/60 border border-slate-800 rounded-xl backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-teal-500 flex items-center justify-center text-slate-950 font-bold text-xs">
            D
          </div>
          <div>
            <span className="text-xs font-bold text-white tracking-tight">DataLearn Android</span>
            <span className="text-[10px] text-slate-400 ml-2 hidden lg:inline">· Master Excel, MySQL, Power BI, Tableau & Kobo Collect</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-amber-400 font-semibold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streakDays}d Streak</span>
            </span>
            <span className="flex items-center gap-1 text-teal-400 font-semibold bg-teal-950/40 px-2 py-0.5 rounded border border-teal-800/40 font-mono">
              <Trophy className="w-3.5 h-3.5" />
              <span>{totalXp} XP</span>
            </span>
          </div>

          <button
            onClick={onToggleDeviceFrame}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            {isDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-teal-400" />
                <span>Switch to Expanded Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-400" />
                <span>Switch to Android Phone View</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container: Android Phone Shell or Expanded Desktop View */}
      <div
        className={`w-full transition-all duration-300 flex flex-col overflow-hidden bg-slate-900 ${
          isDeviceFrame
            ? 'max-w-[420px] h-[100dvh] md:h-[840px] md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-2xl md:ring-1 md:ring-slate-700/50'
            : 'max-w-6xl h-[100dvh] md:h-[860px] md:rounded-2xl md:border md:border-slate-800 md:shadow-2xl'
        }`}
      >
        {/* Android Status Bar (Shown in Phone Mode) */}
        {isDeviceFrame && (
          <div className="h-7 bg-slate-950 px-6 flex items-center justify-between text-[11px] font-medium text-slate-300 shrink-0 z-30 select-none">
            <span className="font-semibold">10:45</span>
            {/* Center camera punch hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 mx-auto" />
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3 text-slate-300" />
              <Wifi className="w-3 h-3 text-slate-300" />
              <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
            </div>
          </div>
        )}

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-hidden flex flex-col relative">
          {children}
        </div>

        {/* Android Bottom Navigation Bar */}
        <nav className="h-16 bg-slate-950/95 border-t border-slate-800 flex items-center justify-around px-2 z-30 shrink-0 backdrop-blur-md">
          <button
            onClick={() => onSelectNavTab('learn')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeNavTab === 'learn' ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${activeNavTab === 'learn' ? 'bg-teal-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeNavTab === 'learn' ? 2.5 : 2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Courses</span>
          </button>

          <button
            onClick={() => onSelectNavTab('sandboxes')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeNavTab === 'sandboxes' ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${activeNavTab === 'sandboxes' ? 'bg-teal-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeNavTab === 'sandboxes' ? 2.5 : 2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Labs</span>
          </button>

          <button
            onClick={() => onSelectNavTab('datasets')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeNavTab === 'datasets' ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${activeNavTab === 'datasets' ? 'bg-teal-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeNavTab === 'datasets' ? 2.5 : 2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Datasets</span>
          </button>

          <button
            onClick={() => onSelectNavTab('challenges')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeNavTab === 'challenges' ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${activeNavTab === 'challenges' ? 'bg-teal-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeNavTab === 'challenges' ? 2.5 : 2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Practice</span>
          </button>

          <button
            onClick={() => onSelectNavTab('cheatsheet')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              activeNavTab === 'cheatsheet' ? 'text-teal-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${activeNavTab === 'cheatsheet' ? 'bg-teal-500/10' : ''}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeNavTab === 'cheatsheet' ? 2.5 : 2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Guides</span>
          </button>
        </nav>

        {/* Android Gesture Home Bar Pill */}
        {isDeviceFrame && (
          <div className="h-4 bg-slate-950 flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
