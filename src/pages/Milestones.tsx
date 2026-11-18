import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Milestone } from '../types/api';
import { CheckCircle2, Sparkles, Save, Calendar, CheckSquare, Layers, Lock } from 'lucide-react';
import { clsx } from 'clsx';
import { formatShortISTDate } from '../lib/date-utils';

interface MilestoneDetailsProps {
  milestone: Milestone;
  milestoneCount: number;
  notes: string;
  savingNotes: boolean;
  onNotesChange: (notes: string) => void;
  onSaveNotes: () => void;
}

const MilestoneDetails: React.FC<MilestoneDetailsProps> = ({
  milestone,
  milestoneCount,
  notes,
  savingNotes,
  onNotesChange,
  onSaveNotes,
}) => (
  <div className="min-w-0 bg-surface border-2 border-border rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-crisp text-ink">
    <div className="min-w-0 border-b-2 border-border pb-4 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold tracking-wider">
        <span className="uppercase bg-accent text-white px-3 py-1 rounded-md border border-accent shadow-crisp-sm">
          Phase {milestone.phase} Milestone
        </span>
        <span className="text-ink-muted font-bold">
          #{milestone.order} of {milestoneCount}
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug pt-1 text-ink">
        {milestone.title}
      </h2>
      {milestone.tagline && (
        <p className="text-xs font-semibold text-accent italic">"{milestone.tagline}"</p>
      )}
      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pt-1">
        {milestone.description}
      </p>

      <div className="pt-2 p-3 bg-surface-muted rounded-xl border border-border space-y-1.5 font-mono">
        <div className="flex justify-between text-xs font-bold text-ink">
          <span>Automated Progress</span>
          <span>{milestone.progressPct || 0}%</span>
        </div>
        <div className="w-full bg-surface-bright rounded-full h-2 overflow-hidden border border-border">
          <div
            className={clsx(
              'h-full rounded-full transition-all',
              milestone.status === 'completed' ? 'bg-accent' : 'bg-focus'
            )}
            style={{ width: `${milestone.progressPct || 0}%` }}
          />
        </div>
        <div className="text-[11px] text-ink-muted flex flex-wrap justify-between gap-x-2 gap-y-1 pt-0.5">
          <span>
            {milestone.completedItemCount || 0} / {milestone.requiredItemCount ?? milestone.requiredItemIds?.length ?? 0} topics completed
          </span>
          <span className="capitalize font-bold text-accent">{milestone.status}</span>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-ink-muted">
        <span className="inline-flex items-center gap-1.5 bg-surface-muted px-2.5 py-1 rounded-lg border border-border">
          <Calendar className="w-3.5 h-3.5 text-accent" />
          Target: {formatShortISTDate(milestone.targetDate)}
        </span>
        <span className="bg-surface-muted px-2.5 py-1 rounded-lg border border-border">
          Day {milestone.startJourneyDay || milestone.journeyDay}
          {milestone.endJourneyDay && milestone.endJourneyDay !== milestone.startJourneyDay
            ? `–${milestone.endJourneyDay}`
            : ''}
        </span>
        {milestone.projectId && (
          <span className="inline-flex items-center gap-1 bg-accent/15 text-accent px-2.5 py-1 rounded-lg border border-accent/30">
            <Layers className="w-3.5 h-3.5" />
            Project {milestone.projectId}
          </span>
        )}
      </div>
    </div>

    {milestone.acceptanceCriteria && milestone.acceptanceCriteria.length > 0 && (
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-accent flex items-center gap-1.5">
          <CheckSquare className="w-4 h-4" />
          Acceptance Criteria
        </h4>
        <ul className="text-xs sm:text-sm text-ink space-y-2 bg-surface-muted p-4 sm:p-5 rounded-2xl border border-border leading-relaxed font-medium shadow-crisp-sm">
          {milestone.acceptanceCriteria.map((criterion, index) => (
            <li key={index} className="flex min-w-0 items-start gap-2">
              <span className="text-accent font-bold">✓</span>
              <span className="min-w-0 break-words">{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {milestone.technologies && milestone.technologies.length > 0 && (
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-accent">
          Core Technologies
        </h4>
        <div className="flex flex-wrap gap-2">
          {milestone.technologies.map((technology) => (
            <span
              key={technology}
              className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-surface-muted border border-border text-ink shadow-crisp-sm"
            >
              {technology}
            </span>
          ))}
        </div>
      </div>
    )}

    {milestone.topicsCovered && milestone.topicsCovered.length > 0 && (
      <div className="space-y-2">
        <h4 className="text-xs font-mono font-extrabold uppercase tracking-widest text-accent">
          Curriculum Focus
        </h4>
        <ul className="text-xs sm:text-sm text-ink space-y-1.5 list-disc list-inside bg-surface-muted p-4 rounded-2xl border border-border leading-relaxed font-medium shadow-crisp-sm break-words">
          {milestone.topicsCovered.map((topic, index) => (
            <li key={index}>{topic}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent">
          Milestone Notes & Artifacts
        </h4>
        <button
          onClick={onSaveNotes}
          disabled={savingNotes}
          className="text-xs font-bold text-accent hover:underline flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
        </button>
      </div>
      <textarea
        rows={3}
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder="Record verification notes, PR links or repository URLs for this milestone..."
        className="w-full bg-surface-bright border-2 border-border focus:border-accent rounded-2xl p-4 text-xs sm:text-sm text-ink outline-none resize-y font-mono shadow-crisp-sm leading-relaxed"
      />
    </div>

    <div className="pt-2 border-t-2 border-border flex items-center gap-2 text-xs font-mono text-ink-muted">
      <Lock className="w-4 h-4 text-accent shrink-0" />
      <span>
        Milestone status is automated from topic completions. Manual override is disabled.
      </span>
    </div>
  </div>
);

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
      console.error('Failed to load milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, []);

  useEffect(() => {
    if (window.matchMedia('(min-width: 1024px)').matches && currentRef.current) {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [loading]);

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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-surface font-mono text-sm tracking-widest uppercase gap-3">
        <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
        LOADING 18-MONTH MILESTONES...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8 font-sans text-ink">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3 bg-surface border-2 border-border rounded-3xl p-4 sm:p-8 shadow-crisp">
        <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-md bg-accent text-white text-[10px] sm:text-xs font-mono font-extrabold uppercase tracking-widest border border-accent">
          <Sparkles className="w-4 h-4" />
          <span>18-Month Progression Path</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight uppercase text-ink">
          Engineering Milestones
        </h1>
        <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
          17 outcome-based checkpoints across 6 phases. Milestones advance automatically as you complete daily topics and checkpoints in your curriculum.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Left: Candy Crush Winding Progression Path (7 cols) */}
        <div className="order-1 min-w-0 lg:col-span-7 flex flex-col items-center py-4 sm:py-6 relative">
          {/* Vertical Winding Path Line */}
          <div className="absolute top-8 bottom-8 w-1.5 bg-border -z-0 hidden sm:block" />

          <div className="space-y-8 sm:space-y-12 w-full max-w-md z-10">
            {milestones.map((m, index) => {
              const isEven = index % 2 === 0;
              const isCurrent = m.status === 'current';
              const isCompleted = m.status === 'completed';
              const isSelected = selectedMilestone?.milestoneId === m.milestoneId;
              const progressPct = m.progressPct || 0;
              const reqCount = m.requiredItemCount ?? m.requiredItemIds?.length ?? 0;
              const compCount = m.completedItemCount || 0;

              return (
                <div key={m.milestoneId} className="space-y-4 sm:space-y-6">
                  <div
                    ref={isCurrent ? currentRef : undefined}
                    onClick={() => {
                      setSelectedMilestone(m);
                      setNotes(m.notes || '');
                    }}
                    className={clsx(
                      'flex items-center gap-2 sm:gap-5 transition-transform cursor-pointer min-w-0',
                      isEven ? 'flex-row' : 'flex-row-reverse text-right'
                    )}
                  >
                  {/* Milestone Card */}
                  <div
                    className={clsx(
                      'min-w-0 flex-1 p-3 sm:p-5 rounded-2xl sm:rounded-3xl border-2 transition-all text-xs space-y-2',
                      isSelected ? 'ring-2 ring-accent shadow-crisp-lg border-border' : 'border-border shadow-crisp',
                      isCompleted
                        ? 'bg-surface text-ink'
                        : isCurrent
                        ? 'bg-surface-bright border-focus ring-2 ring-focus shadow-crisp-lg scale-105'
                        : 'bg-surface/90 text-ink-muted hover:bg-surface hover:text-ink'
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-[10px] sm:text-[11px] font-mono font-bold mb-1">
                      <span className={clsx(isCompleted ? 'text-accent' : isCurrent ? 'text-focus' : 'text-ink-muted')}>
                        PHASE {m.phase} · {m.milestoneId}
                      </span>
                      {isCompleted && (
                        <span className="text-accent flex items-center gap-1 font-extrabold">
                          <CheckCircle2 className="w-4 h-4" /> DONE
                        </span>
                      )}
                      {isCurrent && (
                        <span className="bg-focus text-ink px-2.5 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider animate-pulse">
                          CURRENT
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-sm sm:text-base tracking-tight leading-snug text-ink">{m.title}</h3>
                    <p className="text-xs text-ink-muted line-clamp-1 font-medium">{m.tagline}</p>

                    {/* Progress bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-ink-muted">
                        <span>{compCount} / {reqCount} topics</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className={clsx('h-full rounded-full transition-all', isCompleted ? 'bg-accent' : 'bg-focus')}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-mono text-ink-muted font-semibold">
                      <span>Day {m.startJourneyDay || m.journeyDay}{m.endJourneyDay && m.endJourneyDay !== m.startJourneyDay ? `–${m.endJourneyDay}` : ''}</span>
                      {m.targetWeek && <span>· W{m.targetWeek}</span>}
                      <span>· {formatShortISTDate(m.targetDate)}</span>
                    </div>
                  </div>

                  {/* Node Connector Icon */}
                  <div
                    className={clsx(
                      'w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 border-border flex items-center justify-center shrink-0 font-mono font-extrabold text-sm sm:text-base transition-all shadow-crisp',
                      isCompleted
                        ? 'bg-accent text-white border-accent'
                        : isCurrent
                        ? 'bg-focus text-ink ring-4 ring-focus/40 scale-110 border-focus'
                        : 'bg-surface text-ink-muted'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-7 h-7 text-white" /> : m.order}
                  </div>

                  <div className="flex-1 hidden sm:block" />
                  </div>
                  {isSelected && (
                    <div className="lg:hidden">
                      <MilestoneDetails
                        milestone={m}
                        milestoneCount={milestones.length}
                        notes={notes}
                        savingNotes={savingNotes}
                        onNotesChange={setNotes}
                        onSaveNotes={handleSaveNotes}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Milestone Detail Inspector (5 cols) with independent scroll */}
        <div className="hidden lg:block min-w-0 lg:col-span-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1 scrollbar-thin">
          {selectedMilestone && (
            <MilestoneDetails
              milestone={selectedMilestone}
              milestoneCount={milestones.length}
              notes={notes}
              savingNotes={savingNotes}
              onNotesChange={setNotes}
              onSaveNotes={handleSaveNotes}
            />
          )}
        </div>
      </div>
    </div>
  );
};
