import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Milestone } from '../types/api';
import { CheckCircle2, Circle, Sparkles, Save } from 'lucide-react';
import { clsx } from 'clsx';

export const MilestonesPage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentRef = useRef<HTMLDivElement>(null);

  const loadMilestones = async () => {
    setLoading(true);
    try {
      const data = await api.getMilestones();
      setMilestones(data);

      const current = data.find((m) => m.status === 'current') || data[0];
      setSelectedMilestone(current);
      setNotes(current?.notes || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  useEffect(() => {
    if (currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading]);

  const handleToggleCompletion = async (m: Milestone) => {
    const isCompleted = m.status === 'completed';
    const updated = await api.updateMilestoneCompletion(m.milestoneId, !isCompleted);
    setMilestones(updated);
    const refreshed = updated.find((item) => item.milestoneId === m.milestoneId);
    if (refreshed) {
      setSelectedMilestone(refreshed);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMilestone) return;
    setSavingNotes(true);
    try {
      const res = await api.updateMilestoneNotes(selectedMilestone.milestoneId, notes);
      setSelectedMilestone(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-black font-mono text-sm tracking-widest uppercase">
        <div className="animate-spin mr-3 w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
        LOADING 18-MONTH MILESTONES...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 space-y-8 font-mono text-black">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3 bg-highlight border-2 border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-crisp">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-accent text-highlight text-xs font-extrabold uppercase tracking-widest border border-zinc-200">
          <Sparkles className="w-4 h-4" />
          <span>18-Month Progression Path</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase">
          Engineering Milestones
        </h1>
        <p className="text-xs sm:text-sm text-black/85 leading-relaxed">
          Candy Crush-style winding progression across 6 phases. Mark checkpoints complete as you master technologies and build independent projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Candy Crush Winding Progression Path (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center py-6 relative">
          {/* Vertical Winding Path Line with zinc-200 contrast */}
          <div className="absolute top-8 bottom-8 w-1.5 bg-black -z-0" />

          <div className="space-y-12 w-full max-w-md z-10">
            {milestones.map((m, index) => {
              const isEven = index % 2 === 0;
              const isCurrent = m.status === 'current';
              const isCompleted = m.status === 'completed';
              const isSelected = selectedMilestone?.milestoneId === m.milestoneId;

              return (
                <div
                  key={m.milestoneId}
                  ref={isCurrent ? currentRef : undefined}
                  onClick={() => {
                    setSelectedMilestone(m);
                    setNotes(m.notes || '');
                  }}
                  className={clsx(
                    'flex items-center gap-5 transition-transform cursor-pointer',
                    isEven ? 'flex-row' : 'flex-row-reverse text-right'
                  )}
                >
                  {/* Milestone Card */}
                  <div
                    className={clsx(
                      'flex-1 p-5 rounded-3xl border-2 transition-all text-xs space-y-1',
                      isSelected ? 'ring-4 ring-black shadow-crisp-lg border-black' : 'border-zinc-200 shadow-crisp',
                      isCompleted
                        ? 'bg-canvas text-black'
                        : isCurrent
                        ? 'bg-highlight border-black ring-2 ring-accent scale-105'
                        : 'bg-highlight/70 text-black/75 hover:bg-highlight hover:border-black'
                    )}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                      <span className={clsx(isCompleted ? 'text-accent' : isCurrent ? 'text-black' : 'text-black/70')}>
                        PHASE {m.phase} · #{m.order}
                      </span>
                      {isCompleted && (
                        <span className="text-accent flex items-center gap-1 font-extrabold">
                          <CheckCircle2 className="w-4 h-4" /> DONE
                        </span>
                      )}
                      {isCurrent && (
                        <span className="bg-accent text-highlight px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider animate-pulse">
                          CURRENT
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base tracking-wide leading-snug">{m.title}</h3>
                    <p className="text-xs text-black/80 mt-1 line-clamp-1 font-medium">{m.tagline}</p>
                  </div>

                  {/* Node Connector Icon */}
                  <div
                    className={clsx(
                      'w-14 h-14 rounded-2xl border-2 border-zinc-200 flex items-center justify-center shrink-0 font-extrabold text-base transition-all shadow-crisp',
                      isCompleted
                        ? 'bg-accent text-highlight border-black'
                        : isCurrent
                        ? 'bg-highlight text-black ring-4 ring-accent scale-110 border-black'
                        : 'bg-canvas text-black'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-7 h-7 text-highlight" /> : m.order}
                  </div>

                  <div className="flex-1 hidden sm:block" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Milestone Detail Inspector (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          {selectedMilestone && (
            <div className="bg-highlight border-2 border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-crisp text-black">
              <div className="border-b-2 border-black pb-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold tracking-wider">
                  <span className="uppercase bg-accent text-highlight px-3 py-1 rounded-md border-2 border-zinc-200 shadow-crisp-sm">
                    Phase {selectedMilestone.phase} Milestone
                  </span>
                  <span className="text-black/80 font-bold">#{selectedMilestone.order} of 12</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide leading-snug pt-1">
                  {selectedMilestone.title}
                </h2>
                <p className="text-xs sm:text-sm text-black/85 leading-relaxed pt-1">
                  {selectedMilestone.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent">
                  Core Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMilestone.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-bold px-3 py-1 rounded-lg bg-canvas border-2 border-zinc-200 text-black shadow-crisp-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics Covered */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent">
                  Curriculum Focus
                </h4>
                <ul className="text-xs sm:text-sm text-black space-y-2 list-disc list-inside bg-canvas/60 p-4 sm:p-5 rounded-2xl border-2 border-zinc-200 leading-relaxed font-medium shadow-crisp-sm">
                  {selectedMilestone.topicsCovered.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>

              {/* Milestone Personal Notes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent">
                    Milestone Notes & Takeaways
                  </h4>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record summary notes or repository links for this milestone..."
                  className="w-full bg-white border-2 border-zinc-200 focus:border-black rounded-2xl p-4 text-xs sm:text-sm text-black outline-none resize-y font-mono shadow-crisp-sm leading-relaxed"
                />
              </div>

              {/* Action Button: Mark Completed */}
              <div className="pt-2 border-t-2 border-black">
                <button
                  onClick={() => handleToggleCompletion(selectedMilestone)}
                  className={clsx(
                    'w-full py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all border-2 border-zinc-200 shadow-crisp flex items-center justify-center gap-2',
                    selectedMilestone.status === 'completed'
                      ? 'bg-canvas text-black hover:bg-white'
                      : 'bg-accent hover:bg-black text-highlight'
                  )}
                >
                  {selectedMilestone.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span>COMPLETED · MARK INCOMPLETE</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-highlight/50" />
                      <span>MARK MILESTONE COMPLETE</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
