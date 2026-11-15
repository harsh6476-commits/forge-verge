import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DailyPlan, AssignedItem } from '../types/api';
import { formatShortISTDate, formatHumanISTDate } from '../lib/date-utils';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { clsx } from 'clsx';

export const DailyListPage: React.FC = () => {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemModal, setSelectedItemModal] = useState<{
    item: AssignedItem;
    date: string;
    journeyDay: number;
    phase: number;
    week: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await api.getDailyList();
        setPlans(data);
      } catch (err) {
        console.error('Failed to load daily list:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-black font-mono text-sm tracking-widest uppercase">
        <div className="animate-spin mr-3 w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
        LOADING DAILY LIST & CURRICULUM...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8 space-y-8 font-mono">
      {/* Header */}
      <div className="bg-highlight border-2 border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-crisp space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-accent text-highlight text-xs font-extrabold uppercase tracking-widest border border-zinc-200">
          <Calendar className="w-4 h-4" />
          <span>Curriculum Schedule & Daily Plans</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black tracking-wider uppercase">
          Daily Roadmap & Topic Catalog
        </h1>
        <p className="text-xs sm:text-sm text-black/85 max-w-3xl leading-relaxed">
          Browse daily assignments across your journey. Click on any topic card to view full details: learning objectives, subtopics, and what to do.
        </p>
      </div>

      {/* Grid of Days */}
      <div className="space-y-6">
        {plans.map((plan) => (
          <div
            key={plan.date}
            className="bg-highlight border-2 border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-crisp space-y-5"
          >
            {/* Day Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
              <div className="flex items-center gap-3.5">
                <span className="px-3.5 py-1 bg-accent text-highlight border-2 border-zinc-200 rounded-xl text-xs font-extrabold tracking-widest shadow-crisp-sm">
                  DAY {plan.journeyDay}
                </span>
                <h2 className="text-sm sm:text-base font-extrabold text-black uppercase tracking-wider">
                  {formatHumanISTDate(plan.date)}
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-black font-extrabold flex-wrap">
                <span className="px-3 py-1 bg-canvas border-2 border-zinc-200 rounded-xl shadow-crisp-sm">
                  PHASE {plan.phase} · WEEK {plan.week}
                </span>
                <span
                  className={clsx(
                    'px-3 py-1 rounded-xl border-2 border-zinc-200 shadow-crisp-sm',
                    plan.completed ? 'bg-accent text-highlight' : 'bg-white text-black'
                  )}
                >
                  {plan.completionPercentage}% COMPLETED
                </span>
              </div>
            </div>

            {/* Topics Cards in this Day */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-1">
              {plan.assignedItems.map((item) => (
                <div
                  key={item.itemId}
                  onClick={() =>
                    setSelectedItemModal({
                      item,
                      date: plan.date,
                      journeyDay: plan.journeyDay,
                      phase: plan.phase,
                      week: plan.week,
                    })
                  }
                  className="bg-canvas border-2 border-zinc-200 rounded-2xl p-5 shadow-crisp hover:shadow-crisp-lg hover:-translate-y-0.5 cursor-pointer transition-all flex flex-col justify-between group space-y-3.5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="px-2.5 py-0.5 rounded bg-accent text-highlight border border-black uppercase tracking-wider text-[10px]">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-black font-extrabold">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {item.estimatedMinutes}m
                      </span>
                    </div>

                    <h3 className="font-extrabold text-black text-sm group-hover:text-accent transition-colors leading-snug tracking-wide">
                      {item.title}
                    </h3>

                    <p className="text-xs text-black/85 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t-2 border-black flex items-center justify-between text-xs font-bold text-black">
                    <span className="flex items-center gap-2">
                      {item.completed ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-accent fill-accent/20" />
                          <span className="font-extrabold text-accent">Done</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-black/40" />
                          <span>{item.progressPct}%</span>
                        </>
                      )}
                    </span>

                    <span className="flex items-center gap-1 text-accent font-extrabold group-hover:translate-x-1 transition-transform">
                      <span>INSPECT</span>
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* POPUP MODAL FOR WHOLE TOPIC DATA */}
      {selectedItemModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 select-none font-mono">
          <div className="bg-highlight border-4 border-black rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-deep max-h-[90vh] overflow-y-auto space-y-6 text-black">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b-2 border-black">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-0.5 bg-accent text-highlight rounded border border-black uppercase tracking-wider">
                    {selectedItemModal.item.category}
                  </span>
                  <span className="text-black/80 font-bold">
                    Day {selectedItemModal.journeyDay} · {formatShortISTDate(selectedItemModal.date)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-2 tracking-wide leading-snug">
                  {selectedItemModal.item.title}
                </h2>
              </div>

              <button
                onClick={() => setSelectedItemModal(null)}
                className="p-2 rounded-xl border-2 border-zinc-200 bg-canvas hover:bg-accent hover:text-highlight transition-colors shadow-crisp-sm"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-accent">
                Core Overview
              </h3>
              <p className="text-xs sm:text-sm bg-canvas/60 p-4 rounded-2xl border-2 border-zinc-200 leading-relaxed shadow-crisp-sm">
                {selectedItemModal.item.description}
              </p>
            </div>

            {/* What is your learning */}
            {selectedItemModal.item.whatYouWillLearn && selectedItemModal.item.whatYouWillLearn.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  What Is Your Learning (Key Concepts)
                </h3>
                <ul className="text-xs sm:text-sm bg-canvas/60 p-4 sm:p-5 rounded-2xl border-2 border-zinc-200 space-y-2.5 list-disc list-inside leading-relaxed font-medium shadow-crisp-sm">
                  {selectedItemModal.item.whatYouWillLearn.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Subtopics Checklist / Steps */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-accent">
                Subtopics & Execution Steps
              </h3>
              <div className="space-y-2.5">
                {selectedItemModal.item.subtopics.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 bg-canvas/60 border-2 border-zinc-200 rounded-2xl text-xs space-y-1 shadow-crisp-sm"
                  >
                    <div className="flex items-center gap-2 font-extrabold">
                      {sub.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-black/40 shrink-0" />
                      )}
                      <span>{sub.name}</span>
                    </div>
                    {sub.description && (
                      <p className="text-[11px] text-black/80 pl-6 leading-relaxed">
                        {sub.description}
                      </p>
                    )}
                    {sub.explanation && (
                      <div className="ml-6 mt-1.5 p-2.5 bg-highlight border-2 border-zinc-200 rounded-xl font-mono text-xs text-accent font-bold leading-relaxed">
                        {sub.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* What to do / Practical Task */}
            {selectedItemModal.item.practicalTask && (
              <div className="space-y-2 p-5 bg-accent text-highlight rounded-2xl border-2 border-zinc-200 text-xs sm:text-sm shadow-crisp">
                <div className="font-extrabold uppercase tracking-widest">
                  What To Do (Practical Implementation)
                </div>
                <p className="leading-relaxed font-medium">{selectedItemModal.item.practicalTask}</p>
                {selectedItemModal.item.expectedOutcome && (
                  <div className="pt-2 border-t border-highlight/30 text-xs font-bold text-highlight/90">
                    Expected Outcome: {selectedItemModal.item.expectedOutcome}
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t-2 border-black flex items-center justify-between">
              <span className="text-xs font-extrabold text-black/80">
                DURATION: {selectedItemModal.item.estimatedMinutes} MINS
              </span>
              <button
                onClick={() => setSelectedItemModal(null)}
                className="px-6 py-2.5 rounded-2xl bg-accent text-highlight border-2 border-zinc-200 font-extrabold text-xs shadow-crisp hover:bg-black transition-colors uppercase tracking-wider"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
