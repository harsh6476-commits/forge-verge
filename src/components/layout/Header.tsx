import React, { useState, useEffect } from 'react';
import { formatISTTime, formatHumanISTDate } from '@/lib/date-utils';
import { AcademicMode } from '@/types';
import { Clock, ShieldAlert, SunMedium, Bell } from 'lucide-react';
import { clsx } from 'clsx';

interface HeaderProps {
  currentDateStr: string;
  academicMode: AcademicMode;
  onModeChange: (mode: AcademicMode) => void;
  streakCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentDateStr,
  academicMode,
  onModeChange,
  streakCount,
}) => {
  const [istTime, setIstTime] = useState(formatISTTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setIstTime(formatISTTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Date & Live Clock (Asia/Kolkata) */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="text-xs font-semibold text-white flex items-center gap-2">
            <span>{formatHumanISTDate(currentDateStr)}</span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
              IST Zone
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono mt-0.5">
            <Clock className="w-3 h-3 text-emerald-500" />
            <span>{istTime}</span>
          </div>
        </div>
      </div>

      {/* Middle: Mode Switcher (Normal / Examination / Vacation) */}
      <div className="flex items-center bg-background border border-border rounded-lg p-1 text-xs">
        <button
          onClick={() => onModeChange('normal')}
          className={clsx(
            'px-3 py-1 rounded-md transition-all font-medium text-[11px]',
            academicMode === 'normal'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          )}
        >
          Normal Mode (2.5h)
        </button>

        <button
          onClick={() => onModeChange('examination')}
          className={clsx(
            'px-3 py-1 rounded-md transition-all font-medium text-[11px] flex items-center gap-1',
            academicMode === 'examination'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <ShieldAlert className="w-3 h-3" />
          Exam Mode (45m)
        </button>

        <button
          onClick={() => onModeChange('vacation')}
          className={clsx(
            'px-3 py-1 rounded-md transition-all font-medium text-[11px] flex items-center gap-1',
            academicMode === 'vacation'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-slate-400 hover:text-white'
          )}
        >
          <SunMedium className="w-3 h-3" />
          Vacation (4.5h)
        </button>
      </div>

      {/* Right: Streak & Notifications */}
      <div className="flex items-center gap-3">
        {/* Streak Pill */}
        <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-lg">
          <span className="text-orange-400 text-sm">🔥</span>
          <div className="flex flex-col text-right">
            <span className="text-[11px] font-bold text-white font-mono leading-none">
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
            </span>
            <span className="text-[9px] text-muted uppercase tracking-wider font-mono">Streak</span>
          </div>
        </div>

        {/* Notifications Icon */}
        <button
          title="Notification Center"
          className="p-2 rounded-lg bg-background border border-border text-slate-400 hover:text-white hover:bg-surface-hover transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>
      </div>
    </header>
  );
};

