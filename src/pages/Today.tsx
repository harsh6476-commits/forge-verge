import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { DailyPlan, AssignedItem, ProgressSummary } from '../types/api';
import { formatHumanISTDate, formatISTDate, addDaysToDateStr } from '../lib/date-utils';
import { TopicDetail } from '../components/TopicDetail';
import { CheckCircle2, Circle, Clock, Flame, ChevronLeft, ChevronRight, AlertCircle, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { clsx } from 'clsx';

export const TodayPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dateParam = searchParams.get('date');

  const [currentDate, setCurrentDate] = useState<string>(dateParam || formatISTDate());
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Sync date when query parameter changes
  useEffect(() => {
    if (dateParam) {
      setCurrentDate((prev) => (dateParam !== prev ? dateParam : prev));
    }
  }, [dateParam]);

  const loadData = async (dateStr: string) => {
    setLoading(true);
    setNotFound(false);
    try {
      const [plan, sum] = await Promise.all([
        api.getPlanByDate(dateStr).catch((err) => {
          if (err.status === 404 || err.message?.includes('404') || err.message?.includes('not found')) {
            return null;
          }
          throw err;
        }),
        api.getProgressSummary().catch(() => null),
      ]);

      if (!plan) {
        setNotFound(true);
        setDailyPlan(null);
      } else {
        setDailyPlan(plan);
        if (plan.assignedItems && plan.assignedItems.length > 0) {
          const firstIncomplete = plan.assignedItems.find((i) => !i.completed);
          setSelectedItemId(firstIncomplete ? firstIncomplete.itemId : plan.assignedItems[0].itemId);
        }
      }
      setSummary(sum);
    } catch (err) {
      console.error('Failed to load daily plan:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentDate);
  }, [currentDate]);

  const changeDate = (newDate: string) => {
    setCurrentDate(newDate);
    setSearchParams({ date: newDate });
  };

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

  if (loading && !dailyPlan && !notFound) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-surface font-mono text-sm tracking-widest uppercase gap-3">
        <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
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
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8 font-sans text-ink">
      {/* Daily Summary & Date Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-surface border-2 border-border rounded-3xl p-6 sm:p-8 shadow-crisp">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-bold text-accent uppercase tracking-widest font-mono">
            {dailyPlan ? (
              <>
                <span className="bg-surface-muted px-3 py-1 rounded-md border border-border text-ink shadow-crisp-sm">
                  DAY {dailyPlan.journeyDay}
                </span>
                <span>·</span>
                <span>PHASE {dailyPlan.phase}, WEEK {dailyPlan.week}</span>
              </>
            ) : (
              <span className="bg-surface-muted px-3 py-1 rounded-md border border-border text-ink-muted">
                OUT OF SCHEDULE RANGE
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-ink tracking-tight uppercase">
              {formatHumanISTDate(currentDate)}
            </h1>

            {/* Date Browsing Navigation */}
            <div className="flex items-center gap-1.5 bg-surface-muted border-2 border-border rounded-xl p-1 text-xs shadow-crisp-sm font-mono">
              <button
                onClick={() => changeDate(addDaysToDateStr(currentDate, -1))}
                className="p-1.5 text-ink hover:text-accent font-extrabold"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => changeDate(formatISTDate())}
                className="px-3.5 py-1 text-xs font-extrabold text-ink hover:text-accent uppercase tracking-wider"
              >
                Today
              </button>
              <button
                onClick={() => changeDate(addDaysToDateStr(currentDate, 1))}
                className="p-1.5 text-ink hover:text-accent font-extrabold"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Metrics & Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 shrink-0">
          <div className="flex items-center gap-3 text-xs bg-surface-muted px-4 py-3 rounded-2xl border-2 border-border shadow-crisp-sm font-mono">
            <Flame className="w-5 h-5 text-focus fill-focus" />
            <div>
              <div className="text-ink font-extrabold tracking-wider">{summary?.streak || 0} DAY STREAK</div>
              <div className="text-[10px] text-ink-muted font-bold uppercase tracking-wider">Daily Habit</div>
            </div>
          </div>

          {dailyPlan && (
            <div className="w-56 space-y-2.5 font-mono">
              <div className="flex items-center justify-between text-xs font-bold tracking-wider">
                <span className="text-ink text-sm font-extrabold">{progressPct}%</span>
                <span className="text-ink-muted text-[11px] font-bold">
                  {completedCount} / {totalCount} DONE
                </span>
              </div>
              <div className="w-full bg-surface-muted rounded-full h-3.5 overflow-hidden border border-border shadow-crisp-sm">
                <div
                  className="bg-accent h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {dailyPlan?.completed && (
        <div className="bg-surface-bright border-2 border-border rounded-2xl p-4 text-center text-xs font-mono font-extrabold text-accent tracking-widest shadow-crisp uppercase">
          🎉 Today's learning plan completed. Great work!
        </div>
      )}

      {/* Out of schedule range 404 state */}
      {notFound && (
        <div className="bg-surface border-2 border-border rounded-3xl p-10 text-center space-y-4 shadow-crisp max-w-xl mx-auto">
          <AlertCircle className="w-10 h-10 text-focus mx-auto" />
          <h2 className="text-lg font-bold text-ink uppercase tracking-wide font-mono">
            No Curriculum Scheduled
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed">
            The 18-month engineering curriculum runs from 16 November 2026 to 14 May 2028.
            There are no assigned topics for {formatHumanISTDate(currentDate)}.
          </p>
          <button
            onClick={() => changeDate(formatISTDate())}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white font-mono font-bold text-xs uppercase tracking-wider shadow-crisp transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Go to Today
          </button>
        </div>
      )}

      {/* Main Two-Panel Layout */}
      {!notFound && dailyPlan && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[620px]">
          {/* Left Side: Today's Learning Topics List (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono font-extrabold uppercase tracking-widest text-surface px-1">
              <span>TODAY'S LEARNING</span>
              <span className="bg-surface text-ink px-2.5 py-1 rounded-md border border-border shadow-crisp-sm text-[11px]">
                {totalCount} TOPICS
              </span>
            </div>

            <div className="space-y-3.5">
              {dailyPlan.assignedItems.map((item) => {
                const isSelected = selectedItemId === item.itemId;
                return (
                  <div
                    key={item.itemId}
                    onClick={() => setSelectedItemId(item.itemId)}
                    className={clsx(
                      'p-5 rounded-2xl border-2 transition-all flex items-start gap-4 cursor-pointer',
                      isSelected
                        ? 'bg-surface-bright border-border ring-2 ring-accent shadow-crisp-lg -translate-y-0.5'
                        : 'bg-surface hover:bg-surface-bright border-border shadow-crisp-sm text-ink'
                    )}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemToggle(item.itemId, !item.completed);
                      }}
                      className="mt-1 text-ink hover:text-accent transition-colors shrink-0"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-accent fill-accent/20" />
                      ) : (
                        <Circle className="w-5 h-5 text-ink-muted" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between gap-1 text-[11px] font-mono font-bold">
                        <span className="uppercase px-2.5 py-0.5 bg-accent text-white rounded border border-accent text-[10px] tracking-wider">
                          {item.category}
                        </span>
                        <span className="text-ink font-extrabold">{item.progressPct}%</span>
                      </div>

                      <h3
                        className={clsx(
                          'text-sm font-bold leading-snug tracking-wide',
                          item.completed ? 'line-through text-ink-muted' : 'text-ink'
                        )}
                      >
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-ink-muted font-mono font-bold pt-1">
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
              <div className="h-full bg-surface border-2 border-border rounded-3xl flex items-center justify-center text-xs text-ink-muted font-mono font-bold p-8 shadow-crisp tracking-wider">
                SELECT A TOPIC ON THE LEFT TO INSPECT DETAILS.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
