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

  // Scroll to current milestone automatically on mount
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
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] text-slate-400 font-mono text-xs">
        <div className="animate-spin mr-3 w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full"></div>
        Loading 18-Month Engineering Milestones...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>18-Month Progression Path</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Engineering Milestones
        </h1>
        <p className="text-xs text-slate-400">
          A winding journey across 6 phases. Mark checkpoints complete as you master technologies and deploy real systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Candy Crush Winding Progression Path (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center py-6 relative">
          {/* Vertical Winding Path Line */}
          <div className="absolute top-8 bottom-8 w-0.5 bg-gradient-to-b from-teal-500 via-cyan-500/50 to-slate-800 -z-0" />

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
                    'flex items-center gap-4 transition-transform cursor-pointer',
                    isEven ? 'flex-row' : 'flex-row-reverse text-right'
                  )}
                >
                  {/* Milestone Card */}
                  <div
                    className={clsx(
                      'flex-1 p-4 rounded-2xl border transition-all text-xs',
                      isSelected && 'ring-2 ring-teal-400',
                      isCompleted
                        ? 'border-teal-500/30 bg-teal-500/10 text-slate-300'
                        : isCurrent
                        ? 'border-cyan-400 bg-surface shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                        : 'border-border/60 bg-surface/40 text-slate-500 hover:border-slate-700'
                    )}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={clsx(isCompleted ? 'text-teal-400' : isCurrent ? 'text-cyan-300' : 'text-slate-500')}>
                        PHASE {m.phase} · #{m.order}
                      </span>
                      {isCompleted && (
                        <span className="text-teal-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      )}
                      {isCurrent && (
                        <span className="text-cyan-400 font-semibold uppercase animate-pulse">
                          Current Focus
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-white text-sm tracking-tight">{m.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{m.tagline}</p>
                  </div>

                  {/* Node Connector Icon */}
                  <div
                    className={clsx(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-all shadow-md',
                      isCompleted
                        ? 'bg-teal-500 border-teal-400 text-slate-950 shadow-teal-500/20'
                        : isCurrent
                        ? 'bg-cyan-500 border-cyan-300 text-slate-950 ring-4 ring-cyan-500/20 scale-110 shadow-cyan-500/30'
                        : 'bg-surface border-slate-700 text-slate-500'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : m.order}
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
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="uppercase text-teal-400 font-semibold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    Phase {selectedMilestone.phase} Milestone
                  </span>
                  <span className="uppercase text-slate-500">#{selectedMilestone.order} of 12</span>
                </div>

                <h2 className="text-lg font-bold text-white mt-2">
                  {selectedMilestone.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {selectedMilestone.description}
                </p>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-1.5">
                  Core Technologies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedMilestone.technologies.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-teal-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics Covered */}
              <div>
                <h4 className="text-[11px] font-mono text-slate-400 uppercase font-semibold mb-1.5">
                  Curriculum Focus
                </h4>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside bg-background/50 p-3 rounded-xl border border-border/60">
                  {selectedMilestone.topicsCovered.map((topic, i) => (
                    <li key={i}>{topic}</li>
                  ))}
                </ul>
              </div>

              {/* Milestone Personal Notes */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                    Milestone Notes & Takeaways
                  </h4>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="text-xs font-mono text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record summary notes or key repository links for this milestone..."
                  className="w-full bg-background border border-border focus:border-teal-400 rounded-xl p-3 text-xs text-white outline-none resize-y"
                />
              </div>

              {/* Action Button: Mark Completed */}
              <div className="pt-2 border-t border-border">
                <button
                  onClick={() => handleToggleCompletion(selectedMilestone)}
                  className={clsx(
                    'w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2',
                    selectedMilestone.status === 'completed'
                      ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                      : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-slate-950 shadow-md shadow-teal-500/10'
                  )}
                >
                  {selectedMilestone.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed · Mark as Incomplete</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      <span>Mark Milestone Complete</span>
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
