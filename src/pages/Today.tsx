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

      if (res.plan.completed && !dailyPlan?.completed) {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
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
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-black font-mono text-sm tracking-widest uppercase">
        <div className="animate-spin mr-3 w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
        LOADING TODAY'S SCHEDULE...
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
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8 font-mono">
      {/* Daily Summary & Date Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-highlight border-2 border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-crisp">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-bold text-accent uppercase tracking-widest">
            <span className="bg-canvas px-3 py-1 rounded-md border-2 border-zinc-200 text-black shadow-crisp-sm">
              DAY {dailyPlan?.journeyDay || 1}
            </span>
            <span>·</span>
            <span>PHASE {dailyPlan?.phase || 1}, WEEK {dailyPlan?.week || 1}</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black tracking-wider uppercase">
              {formatHumanISTDate(currentDate)}
            </h1>

            {/* Date Browsing Navigation */}
            <div className="flex items-center gap-1.5 bg-canvas border-2 border-zinc-200 rounded-xl p-1 text-xs shadow-crisp-sm">
              <button
                onClick={() => setCurrentDate(addDaysToDateStr(currentDate, -1))}
                className="p-1.5 text-black hover:text-accent font-extrabold"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(formatISTDate())}
                className="px-3.5 py-1 text-xs font-extrabold text-black hover:text-accent uppercase tracking-wider"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addDaysToDateStr(currentDate, 1))}
                className="p-1.5 text-black hover:text-accent font-extrabold"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Metrics & Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0">
          <div className="flex items-center gap-3 text-xs bg-canvas px-4 py-3 rounded-2xl border-2 border-zinc-200 shadow-crisp-sm">
            <Flame className="w-5 h-5 text-accent fill-accent" />
            <div>
              <div className="text-black font-extrabold tracking-wider">{summary?.streak || 0} DAY STREAK</div>
              <div className="text-[10px] text-black/70 font-bold uppercase tracking-wider">Daily Habit</div>
            </div>
          </div>

          <div className="w-56 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold tracking-wider">
              <span className="text-black text-sm font-extrabold">{progressPct}%</span>
              <span className="text-black/80 text-[11px] font-bold">
                {completedCount} / {totalCount} DONE
              </span>
            </div>
            <div className="w-full bg-canvas rounded-full h-3.5 overflow-hidden border-2 border-zinc-200 shadow-crisp-sm">
              <div
                className="bg-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {dailyPlan?.completed && (
        <div className="bg-white border-2 border-zinc-200 rounded-2xl p-4 text-center text-xs font-extrabold text-accent tracking-widest shadow-crisp uppercase">
          🎉 Today's learning plan completed. Great work!
        </div>
      )}

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[620px]">
        {/* Left Side: Today's Learning Topics List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-widest text-black px-1">
            <span>TODAY'S LEARNING</span>
            <span className="bg-highlight px-2.5 py-1 rounded-md border-2 border-zinc-200 shadow-crisp-sm text-[11px]">
              {totalCount} TOPICS
            </span>
          </div>

          <div className="space-y-3.5">
            {dailyPlan?.assignedItems.map((item) => {
              const isSelected = selectedItemId === item.itemId;
              return (
                <div
                  key={item.itemId}
                  onClick={() => setSelectedItemId(item.itemId)}
                  className={clsx(
                    'p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer',
                    isSelected
                      ? 'bg-highlight border-black shadow-crisp-lg -translate-y-0.5'
                      : 'bg-highlight/60 hover:bg-highlight border-zinc-200 hover:border-black shadow-crisp-sm text-black'
                  )}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemToggle(item.itemId, !item.completed);
                    }}
                    className="mt-1 text-black hover:text-accent transition-colors shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-accent fill-accent/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-black/40" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center justify-between gap-1 text-[11px] font-bold">
                      <span className="uppercase px-2.5 py-0.5 bg-accent text-highlight rounded border border-black text-[10px] tracking-wider">
                        {item.category}
                      </span>
                      <span className="text-black font-extrabold">{item.progressPct}%</span>
                    </div>

                    <h3
                      className={clsx(
                        'text-sm font-extrabold leading-snug tracking-wide',
                        item.completed ? 'line-through text-black/50' : 'text-black'
                      )}
                    >
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-black/75 font-bold pt-1">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span>{item.estimatedMinutes}m duration</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Details of the Selected Topic (7 Cols) */}
        <div className="lg:col-span-7">
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
            <div className="h-full bg-highlight border-2 border-zinc-200 rounded-3xl flex items-center justify-center text-xs text-black/70 font-bold p-8 shadow-crisp tracking-wider">
              SELECT A TOPIC ON THE LEFT TO INSPECT DETAILS.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
