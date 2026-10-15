import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/Shell/AndroidFrame';
import { CourseTrackView } from './components/Learn/CourseTrackView';
import { SandboxesHubView } from './components/Sandboxes/SandboxesHubView';
import { PracticeDatasetsView } from './components/PracticeDatasets/PracticeDatasetsView';
import { DailyChallengesView } from './components/Challenges/DailyChallengesView';
import { CheatSheetView } from './components/Cheatsheets/CheatSheetView';
import { ToolId, UserProgress } from './types';

export default function App() {
  const [activeNavTab, setActiveNavTab] = useState<'learn' | 'sandboxes' | 'datasets' | 'challenges' | 'cheatsheet'>('learn');
  const [activeSandboxTool, setActiveSandboxTool] = useState<ToolId>('excel');
  const [isDeviceFrame, setIsDeviceFrame] = useState<boolean>(true);

  // User persistent progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('datalearn_android_progress');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return {
      completedLessons: ['excel_1', 'mysql_1'],
      completedChallenges: ['daily_sql_1'],
      bookmarkedLessons: ['excel_3', 'pbi_4', 'kobo_3'],
      xp: 250,
      streakDays: 4,
      lastActiveDate: new Date().toISOString()
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('datalearn_android_progress', JSON.stringify(progress));
    } catch (e) {
      // silent
    }
  }, [progress]);

  const handleToggleCompleteLesson = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.completedLessons.includes(lessonId);
      const updated = exists
        ? prev.completedLessons.filter(id => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      const xpDelta = exists ? -50 : 50;
      return {
        ...prev,
        completedLessons: updated,
        xp: Math.max(0, prev.xp + xpDelta)
      };
    });
  };

  const handleToggleBookmarkLesson = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.bookmarkedLessons.includes(lessonId);
      return {
        ...prev,
        bookmarkedLessons: exists
          ? prev.bookmarkedLessons.filter(id => id !== lessonId)
          : [...prev.bookmarkedLessons, lessonId]
      };
    });
  };

  const handleCompleteChallenge = (challengeId: string, xpEarned: number) => {
    setProgress(prev => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId],
        xp: prev.xp + xpEarned
      };
    });
  };

  const handleOpenSandbox = (toolId: ToolId) => {
    setActiveSandboxTool(toolId);
    setActiveNavTab('sandboxes');
  };

  const handleOpenDatasetInTool = (toolId: ToolId, datasetId: string) => {
    setActiveSandboxTool(toolId);
    setActiveNavTab('sandboxes');
  };

  return (
    <AndroidFrame
      isDeviceFrame={isDeviceFrame}
      onToggleDeviceFrame={() => setIsDeviceFrame(!isDeviceFrame)}
      activeNavTab={activeNavTab}
      onSelectNavTab={setActiveNavTab}
      streakDays={progress.streakDays}
      totalXp={progress.xp}
    >
      {activeNavTab === 'learn' && (
        <CourseTrackView
          completedLessonIds={progress.completedLessons}
          bookmarkedLessonIds={progress.bookmarkedLessons}
          onToggleComplete={handleToggleCompleteLesson}
          onToggleBookmark={handleToggleBookmarkLesson}
          onOpenSandbox={handleOpenSandbox}
          streakDays={progress.streakDays}
          totalXp={progress.xp}
        />
      )}

      {activeNavTab === 'sandboxes' && (
        <SandboxesHubView initialTool={activeSandboxTool} />
      )}

      {activeNavTab === 'datasets' && (
        <PracticeDatasetsView onOpenInTool={handleOpenDatasetInTool} />
      )}

      {activeNavTab === 'challenges' && (
        <DailyChallengesView
          completedChallengeIds={progress.completedChallenges}
          onCompleteChallenge={handleCompleteChallenge}
          totalXp={progress.xp}
        />
      )}

      {activeNavTab === 'cheatsheet' && (
        <CheatSheetView />
      )}
    </AndroidFrame>
  );
}
