import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../services/api';
import {
  CurriculumCatalogItem,
  CurriculumItemDetail,
  CurriculumListSummary,
  CurriculumKind,
} from '../types/api';
import {
  Search,
  X,
  ChevronDown,
  Clock,
  BookOpen,
  CheckCircle2,
  Loader2,
  ExternalLink,
  Tag,
  Layers,
  BarChart2,
  AlertCircle,
  Code2,
} from 'lucide-react';
import { clsx } from 'clsx';
import { formatShortISTDate } from '../lib/date-utils';
import { useNavigate } from 'react-router-dom';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const KIND_LABELS: Record<CurriculumKind, string> = {
  topic: 'TOPIC',
  checkpoint: 'CHECKPOINT',
  review: 'REVIEW',
};

const KIND_COLORS: Record<CurriculumKind, string> = {
  topic: 'bg-accent text-white border-accent',
  checkpoint: 'bg-focus text-ink border-focus',
  review: 'bg-surface-muted text-ink-muted border-border',
};



function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────

interface DetailDrawerProps {
  itemId: string;
  onClose: () => void;
  onOpenToday: (date: string) => void;
}

const DetailDrawer: React.FC<DetailDrawerProps> = ({ itemId, onClose, onOpenToday }) => {
  const [item, setItem] = useState<CurriculumItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .getCurriculumItemDetails(itemId)
      .then(setItem)
      .catch((e) => setError(e.message || 'Failed to load item'))
      .finally(() => setLoading(false));
  }, [itemId]);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />

      {/* Drawer panel */}
      <div
        className="relative w-full max-w-xl h-full bg-surface flex flex-col overflow-hidden border-l-2 border-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black bg-surface-bright shrink-0">
          <span className="font-mono text-xs font-bold text-ink-muted uppercase tracking-widest">
            TOPIC DETAIL
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-zinc-200 bg-surface hover:bg-surface-muted text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-accent animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <p className="text-sm text-ink-muted font-mono">{error}</p>
          </div>
        )}

        {item && !loading && (
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Kind + Category badges */}
            <div className="flex flex-wrap gap-2">
              <span className={clsx('px-3 py-1 rounded-md text-[11px] font-bold border tracking-wider font-mono', KIND_COLORS[item.kind])}>
                {KIND_LABELS[item.kind]}
              </span>
              <span className="px-3 py-1 rounded-md text-[11px] font-bold border border-zinc-200 bg-surface-muted text-ink font-mono tracking-wider">
                {item.category}
              </span>
              {item.completed && (
                <span className="px-3 py-1 rounded-md text-[11px] font-bold border border-green-700 bg-green-50 text-green-800 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" /> DONE
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-xl font-extrabold text-ink leading-snug tracking-wide">
              {item.title}
            </h2>

            {/* Meta info row */}
            <div className="flex flex-wrap gap-3 text-xs font-mono font-bold text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Phase {item.phase}, Week {item.phaseWeek}
              </span>
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" />
                Day {item.journeyDay}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {item.minutes}m
              </span>
              {item.date && (
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  {formatShortISTDate(item.date)}
                </span>
              )}
            </div>

            {/* Progress bar (if in progress) */}
            {item.progressPct > 0 && !item.completed && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono font-bold text-ink-muted">
                  <span>Progress</span>
                  <span>{item.progressPct}%</span>
                </div>
                <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden border border-zinc-200">
                  <div
                    className="bg-accent h-full rounded-full transition-all"
                    style={{ width: `${item.progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent font-mono">
                  Overview
                </h4>
                <p className="text-sm text-ink leading-relaxed">{item.description}</p>
              </div>
            )}

            {/* Subtopics / what you'll learn */}
            {item.subtopicItems && item.subtopicItems.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent font-mono flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Subtopics
                </h4>
                <ul className="space-y-2">
                  {item.subtopicItems.map((sub, i) => {
                    const isComplete = item.completedSubtopicIds?.includes(sub.id);
                    return (
                      <li
                        key={sub.id || i}
                        className="flex items-start gap-2.5 text-sm text-ink bg-surface-muted px-4 py-3 rounded-xl border border-zinc-200"
                      >
                        {isComplete ? (
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border-2 border-zinc-300 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className={clsx('font-semibold', isComplete && 'line-through text-ink-muted')}>
                            {sub.name}
                          </span>
                          {sub.description && (
                            <p className="text-xs text-ink-muted mt-0.5 leading-relaxed">{sub.description}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Fallback: plain subtopics array */}
            {(!item.subtopicItems || item.subtopicItems.length === 0) &&
              item.subtopics &&
              item.subtopics.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent font-mono">
                    Subtopics
                  </h4>
                  <ul className="space-y-1.5 text-sm text-ink bg-surface-muted px-4 py-3 rounded-xl border border-zinc-200">
                    {item.subtopics.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-accent font-bold">·</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Practical Task */}
            {item.practice && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent font-mono flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  Practice Task
                </h4>
                <p className="text-sm text-ink leading-relaxed bg-surface-muted px-4 py-3 rounded-xl border border-zinc-200">
                  {item.practice}
                </p>
              </div>
            )}

            {/* Supporting Practice (DSA Recall) */}
            {item.supportingPractice && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-focus font-mono">
                  Supporting Practice
                </h4>
                <p className="text-sm text-ink leading-relaxed bg-focus/10 px-4 py-3 rounded-xl border border-focus/30">
                  {item.supportingPractice}
                </p>
              </div>
            )}

            {/* Research Checkpoint */}
            {item.weekResearchCheckpoint && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent font-mono">
                  Weekly Research Checkpoint
                </h4>
                <div className="bg-surface-muted px-4 py-3 rounded-xl border border-zinc-200 space-y-1.5 text-sm text-ink">
                  {typeof item.weekResearchCheckpoint === 'object' ? (
                    <>
                      <p className="font-semibold">{item.weekResearchCheckpoint.title}</p>
                      <p className="text-ink-muted">{item.weekResearchCheckpoint.task}</p>
                      {item.weekResearchCheckpoint.note && (
                        <p className="text-xs text-ink-muted italic">{item.weekResearchCheckpoint.note}</p>
                      )}
                    </>
                  ) : (
                    <p>{item.weekResearchCheckpoint}</p>
                  )}
                </div>
              </div>
            )}

            {/* Linked Project */}
            {item.linkedProject && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-accent font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Linked Project
                </h4>
                <div className="bg-surface-muted px-4 py-3 rounded-xl border border-zinc-200 space-y-1 text-sm text-ink">
                  <p className="font-bold">{item.linkedProject.title}</p>
                  <p className="text-ink-muted text-xs leading-relaxed">{item.linkedProject.description}</p>
                  {item.linkedProject.technologies && item.linkedProject.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.linkedProject.technologies.map((t) => (
                        <span key={t} className="text-[10px] font-mono font-bold px-2 py-0.5 bg-surface-bright rounded border border-zinc-200 text-ink">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Open in Today */}
            {item.date && (
              <button
                onClick={() => onOpenToday(item.date!)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-black bg-accent text-white font-mono font-extrabold text-xs uppercase tracking-widest hover:bg-ink transition-colors shadow-crisp"
              >
                <ExternalLink className="w-4 h-4" />
                Open Scheduled Day
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Filter Bar ───────────────────────────────────────────────────────────────



const SelectFilter: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pl-3 pr-7 py-2 text-xs font-mono font-bold border-2 border-zinc-200 rounded-xl bg-surface text-ink cursor-pointer hover:border-black focus:border-black outline-none shadow-crisp-sm transition-colors"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" />
  </div>
);

// ─── Catalog Item Card ─────────────────────────────────────────────────────────

interface ItemCardProps {
  item: CurriculumCatalogItem;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const isCompleted = item.completed;
  const inProgress = !isCompleted && item.progressPct > 0;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full text-left p-5 rounded-2xl border-2 transition-all group hover:-translate-y-0.5 space-y-3',
        isCompleted
          ? 'bg-green-50 border-green-200 hover:border-green-500 shadow-crisp-sm'
          : inProgress
          ? 'bg-surface border-focus/40 hover:border-focus shadow-crisp-sm'
          : 'bg-surface border-zinc-200 hover:border-black shadow-crisp-sm'
      )}
    >
      {/* Top row: kind + day */}
      <div className="flex items-center justify-between gap-2">
        <span className={clsx('text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border tracking-wider', KIND_COLORS[item.kind])}>
          {KIND_LABELS[item.kind]}
        </span>
        <span className="text-[10px] font-mono font-bold text-ink-muted">
          DAY {item.journeyDay}
        </span>
      </div>

      {/* Title */}
      <h3 className={clsx('text-sm font-bold leading-snug tracking-wide', isCompleted ? 'line-through text-ink-muted' : 'text-ink')}>
        {item.title}
      </h3>

      {/* Category + duration */}
      <div className="flex items-center gap-3 text-[11px] font-mono text-ink-muted">
        <span className="font-semibold">{item.category}</span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {item.minutes}m
        </span>
        {item.date && (
          <>
            <span>·</span>
            <span>{formatShortISTDate(item.date)}</span>
          </>
        )}
      </div>

      {/* Progress bar */}
      {(isCompleted || inProgress) && (
        <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all', isCompleted ? 'bg-green-500' : 'bg-focus')}
            style={{ width: `${isCompleted ? 100 : item.progressPct}%` }}
          />
        </div>
      )}
    </button>
  );
};

// ─── Summary Stats Bar ────────────────────────────────────────────────────────

interface SummaryBarProps {
  summary: CurriculumListSummary;
  total: number;
}

const SummaryBar: React.FC<SummaryBarProps> = ({ summary, total }) => {
  const pct = summary.totalItems > 0 ? Math.round((summary.completed / summary.totalItems) * 100) : 0;
  return (
    <div className="bg-surface border-2 border-zinc-200 rounded-2xl p-4 flex flex-wrap gap-6 items-center shadow-crisp-sm">
      <div className="flex flex-col text-center min-w-[52px]">
        <span className="text-lg font-extrabold font-mono text-accent">{summary.completed}</span>
        <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest">Done</span>
      </div>
      <div className="flex flex-col text-center min-w-[52px]">
        <span className="text-lg font-extrabold font-mono text-focus">{summary.inProgress}</span>
        <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest">Active</span>
      </div>
      <div className="flex flex-col text-center min-w-[52px]">
        <span className="text-lg font-extrabold font-mono text-ink">{summary.notStarted}</span>
        <span className="text-[10px] font-mono text-ink-muted uppercase tracking-widest">Ahead</span>
      </div>
      <div className="flex-1 min-w-[120px] space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono font-bold text-ink-muted">
          <span>18-Month Journey</span>
          <span>{pct}%</span>
        </div>
        <div className="w-full bg-surface-muted rounded-full h-2 overflow-hidden border border-zinc-200">
          <div className="bg-accent h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="ml-auto text-[11px] font-mono text-ink-muted">
        Showing <span className="font-bold text-ink">{total}</span> items
      </div>
    </div>
  );
};

// ─── Main Topics Page ─────────────────────────────────────────────────────────

export const TopicsPage: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<CurriculumCatalogItem[]>([]);
  const [summary, setSummary] = useState<CurriculumListSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [searchInput, setSearchInput] = useState('');
  const [phase, setPhase] = useState('');
  const [kind, setKind] = useState('');
  const [status, setStatus] = useState('');

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchInput, 300);

  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchItems = useCallback(
    async (reset = false) => {
      if (reset) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const params: Parameters<typeof api.getCurriculumList>[0] = {
          limit: 24,
          ...(phase ? { phase: Number(phase) } : {}),
          ...(kind ? { kind } : {}),
          ...(status ? { status } : {}),
          ...(debouncedSearch ? { q: debouncedSearch } : {}),
        };
        if (!reset && nextCursor != null) {
          params.cursor = nextCursor;
        }

        const res = await api.getCurriculumList(params);

        if (reset) {
          setItems(res.items);
          setSummary(res.summary);
          setTotal(res.total);
        } else {
          setItems((prev) => [...prev, ...res.items]);
          setTotal(res.total);
        }
        setNextCursor(res.nextCursor);
      } catch (err) {
        console.error('Failed to load curriculum list:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [phase, kind, status, debouncedSearch, nextCursor]
  );

  // Reset when filters change
  useEffect(() => {
    setNextCursor(null);
    fetchItems(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, kind, status, debouncedSearch]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor != null && !loadingMore && !loading) {
          fetchItems(false);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextCursor, loadingMore, loading, fetchItems]);

  const handleOpenToday = (date: string) => {
    setSelectedItemId(null);
    navigate(`/?date=${date}`);
  };

  const hasFilters = phase || kind || status || searchInput;
  const clearFilters = () => {
    setSearchInput('');
    setPhase('');
    setKind('');
    setStatus('');
  };

  return (
    <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8 space-y-6 font-sans text-ink">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          18-Month Curriculum
        </h1>
        <p className="text-sm text-ink-muted">
          Browse all 547 topics, checkpoints and reviews across 6 phases.
        </p>
      </div>

      {/* Summary Stats */}
      {summary && <SummaryBar summary={summary} total={total} />}

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search topics, practice, subtopics..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border-2 border-zinc-200 rounded-xl bg-surface text-ink placeholder:text-ink-muted focus:border-black outline-none shadow-crisp-sm transition-colors font-sans"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Phase filter */}
        <SelectFilter
          value={phase}
          onChange={setPhase}
          placeholder="All Phases"
          options={[1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `Phase ${n}` }))}
        />

        {/* Kind filter */}
        <SelectFilter
          value={kind}
          onChange={setKind}
          placeholder="All Types"
          options={[
            { value: 'topic', label: 'Topics' },
            { value: 'checkpoint', label: 'Checkpoints' },
            { value: 'review', label: 'Reviews' },
          ]}
        />

        {/* Status filter */}
        <SelectFilter
          value={status}
          onChange={setStatus}
          placeholder="All Status"
          options={[
            { value: 'completed', label: 'Completed' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'not_started', label: 'Not Started' },
          ]}
        />

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border-2 border-zinc-200 bg-surface text-ink-muted hover:border-black hover:text-ink transition-colors shadow-crisp-sm"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-ink-muted">
          <Loader2 className="w-5 h-5 animate-spin text-accent" />
          <span className="text-sm font-mono uppercase tracking-widest">Loading Curriculum...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <BookOpen className="w-10 h-10 text-ink-muted" />
          <p className="text-sm text-ink-muted font-mono">No items match your filters.</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-mono font-bold text-accent underline hover:no-underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <ItemCard
              key={item.itemId}
              item={item}
              onClick={() => setSelectedItemId(item.itemId)}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={loaderRef} className="flex justify-center py-4">
        {loadingMore && (
          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
            Loading more...
          </div>
        )}
        {!loadingMore && nextCursor == null && items.length > 0 && !loading && (
          <p className="text-xs font-mono text-ink-muted">
            All {total} items loaded.
          </p>
        )}
      </div>

      {/* Detail Drawer */}
      {selectedItemId && (
        <DetailDrawer
          itemId={selectedItemId}
          onClose={() => setSelectedItemId(null)}
          onOpenToday={handleOpenToday}
        />
      )}
    </div>
  );
};
