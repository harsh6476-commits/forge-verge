import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { DailyPlan, LearningTask, RoadmapPhase } from '@/types';
import { formatISTDate } from '@/lib/date-utils';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Code2,
  ArrowRight,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [todayPlan, setTodayPlan] = useState<DailyPlan | null>(null);
  const [currentPhase, setCurrentPhase] = useState<RoadmapPhase | null>(null);
  const [selectedTask, setSelectedTask] = useState<LearningTask | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const todayStr = formatISTDate();

  const loadData = async () => {
    setLoading(true);
    await localStore.initializeStore();
    const plan = await localStore.getDailyPlanForDate(todayStr);
    const phases = await localStore.getRoadmapPhases();

    setTodayPlan(plan);
    const activePhase = phases.find(p => p.phaseNumber === plan.phaseNumber) || phases[0];
    setCurrentPhase(activePhase);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [todayStr]);

  const handleToggleTask = async (task: LearningTask) => {
    if (!todayPlan) return;
    const isCompleted = task.status === 'completed';
    const result = await localStore.toggleTaskCompletion(todayStr, task.id, !isCompleted);
    setTodayPlan({ ...result.dailyPlan });
  };

  if (loading || !todayPlan || !currentPhase) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 font-mono text-sm">
        <div className="animate-spin mr-3 w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
        Loading Today's Command Centre...
      </div>
    );
  }

  const completedTasksCount = todayPlan.tasks.filter(t => t.status === 'completed').length;
  const progressPct = Math.round((completedTasksCount / todayPlan.tasks.length) * 100) || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-surface border border-border rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
              <span>DAY {todayPlan.dayNumber} OF 548</span>
              <span>·</span>
              <span>PHASE {todayPlan.phaseNumber}: {currentPhase.name.toUpperCase()}</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {todayPlan.dayTitle}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {todayPlan.dailyObjective}
            </p>
          </div>

          {/* Daily Progress Gauge */}
          <div className="flex items-center gap-4 bg-background border border-border p-4 rounded-xl shrink-0">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold font-mono text-emerald-400">{progressPct}%</span>
              <span className="text-[10px] text-muted uppercase tracking-wider font-mono">Today's Goal</span>
            </div>
            <div className="h-8 w-px bg-border"></div>
            <div className="flex flex-col text-xs text-slate-300">
              <span>{completedTasksCount} / {todayPlan.tasks.length} Completed</span>
              <span className="text-muted font-mono text-[11px]">{todayPlan.actualHours}h of {todayPlan.plannedHours}h spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Tasks + Strategic Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Scheduled Action Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Today's Learning Tasks ({todayPlan.tasks.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">Mode: {todayPlan.mode}</span>
          </div>

          <div className="space-y-3">
            {todayPlan.tasks.map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={clsx(
                    'bg-surface border rounded-xl p-4 transition-all flex items-start gap-4 group',
                    isDone
                      ? 'border-emerald-500/30 bg-emerald-500/[0.02]'
                      : 'border-border hover:border-slate-700 hover:bg-surface-hover'
                  )}
                >
                  <button
                    onClick={() => handleToggleTask(task)}
                    className="mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-background border border-border text-slate-300 font-medium">
                        {task.sessionType}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {task.durationMinutes}m
                      </span>
                      {task.priority === 'p0' && (
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          P0 Essential
                        </span>
                      )}
                    </div>

                    <h3
                      className={clsx(
                        'text-sm font-semibold mt-1.5',
                        isDone ? 'line-through text-slate-500' : 'text-white'
                      )}
                    >
                      {task.topic}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {task.objective}
                    </p>

                    {/* Quick Action Footer */}
                    <div className="mt-3 flex items-center gap-3 pt-2 border-t border-border/50 text-xs">
                      {task.sessionType === 'dsa' && (
                        <Link
                          to="/dsa"
                          className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px] font-mono"
                        >
                          <Code2 className="w-3 h-3" />
                          Log In DSA Lab
                        </Link>
                      )}
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="text-slate-400 hover:text-white text-[11px] font-mono flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Details & Notes
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Key Indicators & Upcoming Checkpoints */}
        <div className="space-y-6">
          {/* Phase 1 Major Milestone Card */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-white uppercase tracking-wider font-mono">
                Current Milestone
              </span>
              <span className="text-emerald-400 font-mono">Wk {todayPlan.weekNumber} / 13</span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white">
                {currentPhase.majorProjectTitle}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {currentPhase.focusArea}
              </p>
            </div>

            <div className="bg-background border border-border p-3 rounded-lg text-xs space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted">Target Checkpoint:</span>
                <span className="text-slate-200 font-mono">Week 7 Assessment</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(todayPlan.weekNumber * 7.7, 100)}%` }}
                ></div>
              </div>
            </div>

            <Link
              to="/roadmap"
              className="text-xs text-emerald-400 hover:underline flex items-center justify-between w-full pt-1"
            >
              <span>Explore Complete 18-Month Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Spaced Revision Quick Alert */}
          <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                Spaced Revision
              </span>
              <Link to="/dsa" className="text-emerald-400 text-[11px] font-mono hover:underline">
                View Queue
              </Link>
            </div>

            <p className="text-xs text-slate-400">
              Spaced repetition intervals (1, 3, 7, 21 days) reinforce algorithms into long-term memory.
            </p>

            <div className="p-3 bg-background rounded-lg border border-border text-xs flex items-center justify-between">
              <span className="text-slate-300">Queue Status</span>
              <span className="text-emerald-400 font-mono font-bold">1 Ready Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase bg-background border border-border px-2 py-0.5 rounded text-emerald-400">
                  {selectedTask.sessionType} · {selectedTask.durationMinutes} mins
                </span>
                <h3 className="text-lg font-bold text-white mt-2">{selectedTask.topic}</h3>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                  Objective & Task
                </h4>
                <p className="bg-background p-3 rounded-lg border border-border leading-relaxed">
                  {selectedTask.objective}
                </p>
              </div>

              {selectedTask.challengePrompt && (
                <div>
                  <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px] mb-1">
                    Specific Challenge
                  </h4>
                  <p className="bg-background p-3 rounded-lg border border-border font-mono text-[11px] text-emerald-300">
                    {selectedTask.challengePrompt}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-lg bg-background border border-border text-xs text-slate-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleToggleTask(selectedTask);
                  setSelectedTask(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-black"
              >
                {selectedTask.status === 'completed' ? 'Mark Incomplete' : 'Mark Completed'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
