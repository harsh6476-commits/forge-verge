import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { localStore } from '@/services/localStore';
import { AcademicMode } from '@/types';
import { formatISTDate, getPhaseNumberForDate } from '@/lib/date-utils';

export const AppLayout: React.FC = () => {
  const [academicMode, setAcademicMode] = useState<AcademicMode>('normal');
  const [streakCount, setStreakCount] = useState<number>(1);
  const [currentDateStr] = useState<string>(formatISTDate());
  const [currentPhaseNumber, setCurrentPhaseNumber] = useState<number>(1);

  useEffect(() => {
    async function loadInitialData() {
      await localStore.initializeStore();
      const profile = await localStore.getProfile();
      const streak = await localStore.getStreak();
      setAcademicMode(profile.academicMode);
      setStreakCount(streak.currentStreak);
      setCurrentPhaseNumber(getPhaseNumberForDate(currentDateStr));
    }
    loadInitialData();
  }, [currentDateStr]);

  const handleModeChange = async (newMode: AcademicMode) => {
    setAcademicMode(newMode);
    await localStore.setAcademicMode(newMode);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden text-slate-100">
      {/* Persistent Left Sidebar */}
      <Sidebar currentPhaseNumber={currentPhaseNumber} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentDateStr={currentDateStr}
          academicMode={academicMode}
          onModeChange={handleModeChange}
          streakCount={streakCount}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

