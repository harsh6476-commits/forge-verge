import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DailyPlan, AssignedItem, ProgressSummary } from '../types/api';
import { formatHumanISTDate, formatISTDate, addDaysToDateStr } from '../lib/date-utils';
import { TopicDetail } from '../components/TopicDetail';
import { CheckCircle2, Circle, Clock, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';

export const TodayPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(formatISTDate());
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async (dateStr: string) => {
    setLoading(true);
    try {
      const [plan, sum] = await Promise.all([
        api.getPlanByDate(dateStr),
        api.getProgressSummary(),
      ]);
      setDailyPlan(plan);
      setSummary(sum);

      // Default selected topic to first incomplete item, or first item
      if (plan.assignedItems && plan.assignedItems.length > 0) {
        const firstIncomplete = plan.assignedItems.find((i) => !i.completed);
        setSelectedItemId(firstIncomplete ? firstIncomplete.itemId : plan.assignedItems[0].itemId);
      }
    } catch (err) {
      console.error('Failed to load daily plan:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentDate);
  }, [currentDate]);

  const handleSubtopicToggle = async (itemId: string, subtopicId: string, completed: boolean) => {
    try {
      const res = await api.updateSubtopicCompletion(currentDate, itemId, subtopicId, completed);
      setDailyPlan(res.plan);

      // Check if whole day just completed
      if (res.plan.completed && !dailyPlan?.completed) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleItemToggle = async (itemId: string, completed: boolean) => {
    try {
      const res = await api.updateItemCompletion(currentDate, itemId, completed);
      setDailyPlan(res.plan);

      if (res.plan.completed && !dailyPlan?.completed) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async (itemId: string, notes: string) => {
    await api.updateNotes(currentDate, itemId, notes);
  };

  const handleUploadAttachment = async (itemId: string, file: File) => {
    await api.uploadAttachment(currentDate, itemId, file);
    await loadData(currentDate);
  };

  const handleDeleteAttachment = async (itemId: string, publicId: string) => {
    await api.deleteAttachment(publicId, currentDate, itemId);
    await loadData(currentDate);
  };

  const handleNextTopic = () => {
    if (!dailyPlan) return;
    const items = dailyPlan.assignedItems;
    const currentIndex = items.findIndex((i) => i.itemId === selectedItemId);
    if (currentIndex !== -1 && currentIndex < items.length - 1) {
      setSelectedItemId(items[currentIndex + 1].itemId);
    } else {
      setSelectedItemId(items[0].itemId);
    }
  };

  if (loading && !dailyPlan) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] text-slate-400 font-mono text-xs">
        <div className="animate-spin mr-3 w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full"></div>
        Loading Today's Engineering Schedule...
      </div>
    );
  }

  const selectedItem: AssignedItem | undefined =
    dailyPlan?.assignedItems.find((i) => i.itemId === selectedItemId) ||
    dailyPlan?.assignedItems[0];

  const completedCount = dailyPlan?.assignedItems.filter((i) => i.completed).length || 0;
  const totalCount = dailyPlan?.assignedItems.length || 0;
  const progressPct = dailyPlan?.completionPercentage || 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Daily Summary & Date Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface border border-border rounded-2xl p-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-1">
            <span>JOURNEY DAY {dailyPlan?.journeyDay || 1}</span>
            <span>·</span>
            <span>PHASE {dailyPlan?.phase || 1}, WEEK {dailyPlan?.week || 1}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {formatHumanISTDate(currentDate)}
            </h1>

            {/* Date Browsing Navigation */}
            <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setCurrentDate(addDaysToDateStr(currentDate, -1))}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentDate(formatISTDate())}
                className="px-2 py-0.5 text-[11px] font-mono text-teal-300 hover:underline"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addDaysToDateStr(currentDate, 1))}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Metrics & Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Flame className="w-5 h-5 text-orange-400 fill-orange-400/20" />
            <div>
              <div className="text-white font-bold">{summary?.streak || 0} DAY STREAK</div>
              <div className="text-[10px] text-slate-500 uppercase">Consistent Focus</div>
            </div>
          </div>

          <div className="w-48 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white font-bold">{progressPct}%</span>
              <span className="text-slate-400 text-[11px]">
                {completedCount} / {totalCount} Completed
              </span>
            </div>
            <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border">
              <div
                className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {dailyPlan?.completed && (
        <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3 text-center text-xs text-teal-300 font-medium">
          🎉 Today's learning plan completed. Great work!
        </div>
      )}

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Left Side: Today's Learning Topics List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider px-1">
            <span>Today's Learning</span>
            <span>{totalCount} Topics</span>
          </div>

          <div className="space-y-2">
            {dailyPlan?.assignedItems.map((item) => {
              const isSelected = selectedItemId === item.itemId;
              return (
                <div
                  key={item.itemId}
                  onClick={() => setSelectedItemId(item.itemId)}
                  className={clsx(
                    'p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3',
                    isSelected
                      ? 'border-teal-400 bg-surface shadow-md shadow-teal-500/5'
                      : 'border-border/80 hover:border-slate-700 bg-surface/50 text-slate-300'
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemToggle(item.itemId, !item.completed);
                    }}
                    className="mt-0.5 text-slate-500 hover:text-teal-400 transition-colors shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-400 fill-teal-500/20" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                      <span className="uppercase text-slate-400">{item.category}</span>
                      <span className="text-teal-400 font-semibold">{item.progressPct}%</span>
                    </div>

                    <h3
                      className={clsx(
                        'text-xs font-semibold mt-1 leading-snug',
                        item.completed ? 'line-through text-slate-500' : 'text-white'
                      )}
                    >
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-2">
                      <Clock className="w-3 h-3" />
                      <span>{item.estimatedMinutes}m</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Details of the Selected Topic (8 Cols) */}
        <div className="lg:col-span-8">
          {selectedItem ? (
            <TopicDetail
              key={selectedItem.itemId}
              item={selectedItem}
              dateStr={currentDate}
              onSubtopicToggle={handleSubtopicToggle}
              onItemToggle={handleItemToggle}
              onSaveNotes={handleSaveNotes}
              onUploadAttachment={handleUploadAttachment}
              onDeleteAttachment={handleDeleteAttachment}
              onNextTopic={handleNextTopic}
            />
          ) : (
            <div className="h-full bg-surface border border-border rounded-2xl flex items-center justify-center text-xs text-slate-500 font-mono">
              Select a topic on the left to start learning.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

