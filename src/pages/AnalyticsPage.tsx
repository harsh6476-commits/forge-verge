import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { LineChart } from 'lucide-react';
import { StreakData } from '@/types';

export const AnalyticsPage: React.FC = () => {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [dsaCount, setDsaCount] = useState(0);

  useEffect(() => {
    async function load() {
      const s = await localStore.getStreak();
      const p = await localStore.getDSAProblems();
      setStreak(s);
      setDsaCount(p.length);
    }
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <LineChart className="w-4 h-4" />
          <span>Consistency & Learning Telemetry</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Progress Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Deriving from actual records and completed sessions in Asia/Kolkata timezone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface border border-border p-5 rounded-xl">
          <div className="text-xs font-mono uppercase text-slate-400">Current Streak</div>
          <div className="text-3xl font-bold text-orange-400 font-mono mt-1">
            {streak?.currentStreak || 1} Days
          </div>
          <div className="text-xs text-slate-400 mt-1">Longest: {streak?.longestStreak || 1} Days</div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl">
          <div className="text-xs font-mono uppercase text-slate-400">Total Solved in DSA Lab</div>
          <div className="text-3xl font-bold text-emerald-400 font-mono mt-1">
            {dsaCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">With Spaced Repetition queue</div>
        </div>

        <div className="bg-surface border border-border p-5 rounded-xl">
          <div className="text-xs font-mono uppercase text-slate-400">Weekly Consistency</div>
          <div className="text-3xl font-bold text-white font-mono mt-1">
            {streak?.weeklyConsistencyPct || 100}%
          </div>
          <div className="text-xs text-emerald-400 mt-1">Non-punitive streak tracking</div>
        </div>
      </div>
    </div>
  );
};
