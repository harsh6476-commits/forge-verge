import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { DailyPlan } from '@/types';
import { formatISTDate, formatShortISTDate } from '@/lib/date-utils';
import { Calendar as CalendarIcon, CheckCircle2, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export const CalendarPage: React.FC = () => {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DailyPlan | null>(null);
  const todayStr = formatISTDate();

  useEffect(() => {
    async function loadPlans() {
      const allPlans = await localStore.getAllDailyPlans();
      setPlans(allPlans);
      const today = allPlans.find(p => p.dateStr === todayStr) || allPlans[0];
      setSelectedPlan(today);
    }
    loadPlans();
  }, [todayStr]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <CalendarIcon className="w-4 h-4" />
          <span>Rolling 30-Day Planner · Asia/Kolkata</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Daily & Weekly Planner
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Select any date in your rolling window to review scheduled sessions, objectives, and completions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Rolling 30 Days List / Calendar Strip */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Rolling Schedule Window ({plans.length} Days)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[620px] overflow-y-auto pr-1">
            {plans.map((p) => {
              const isToday = p.dateStr === todayStr;
              const isSelected = selectedPlan?.id === p.id;
              const isDone = p.status === 'completed';

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p)}
                  className={clsx(
                    'p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-xs',
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-border hover:border-slate-700 bg-background',
                    isToday && 'ring-1 ring-emerald-400'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-slate-400">
                      Day {p.dayNumber} · Wk {p.weekNumber}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">
                        {p.plannedHours}h
                      </span>
                    )}
                  </div>

                  <div className="mt-2 font-semibold text-white truncate">
                    {p.dayTitle}
                  </div>

                  <div className="mt-2 pt-2 border-t border-border flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">{formatShortISTDate(p.dateStr)}</span>
                    {isToday && (
                      <span className="text-[9px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                        Today
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Selected Date Plan Breakdown */}
        {selectedPlan && (
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="border-b border-border pb-3">
              <span className="text-xs font-mono text-emerald-400">
                {formatShortISTDate(selectedPlan.dateStr)} · Day {selectedPlan.dayNumber}
              </span>
              <h3 className="text-base font-bold text-white mt-1">
                {selectedPlan.dayTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {selectedPlan.dailyObjective}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Scheduled Tasks ({selectedPlan.tasks.length})
              </h4>

              {selectedPlan.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-background border border-border rounded-lg text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono uppercase text-[10px] bg-surface px-1.5 py-0.5 rounded text-emerald-400 border border-border">
                      {task.sessionType}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.durationMinutes}m
                    </span>
                  </div>
                  <div className="font-semibold text-white">{task.topic}</div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    {task.objective}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
