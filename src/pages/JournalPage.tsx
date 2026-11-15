import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { JournalEntry } from '@/types';
import { formatShortISTDate, formatISTDate } from '@/lib/date-utils';
import { BookOpen, Plus, Tag, Calendar, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';

export const JournalPage: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [entryType, setEntryType] = useState<JournalEntry['entryType']>('daily');
  const [content, setContent] = useState('');
  const [keyLearning, setKeyLearning] = useState('');
  const [blocker, setBlocker] = useState('');
  const [tagsStr, setTagsStr] = useState('React, DSA');

  const loadData = async () => {
    const data = await localStore.getJournalEntries();
    setEntries(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    const keyLearnings = keyLearning ? [keyLearning] : [];
    const blockers = blocker ? [blocker] : [];

    await localStore.createJournalEntry({
      dateStr: formatISTDate(),
      entryType,
      title,
      content,
      keyLearnings,
      blockers,
      tags,
    });

    setIsModalOpen(false);
    setTitle('');
    setContent('');
    setKeyLearning('');
    setBlocker('');
    await loadData();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Engineering Reflections & Architecture Decisions</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Engineering Journal
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Document daily technical reflections, weekly retrospectives, and Architecture Decision Records (ADRs).
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition-colors shrink-0 shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          New Journal Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center text-slate-500 font-mono text-xs space-y-3">
            <Sparkles className="w-6 h-6 text-emerald-400 mx-auto" />
            <p>Your engineering journal is currently clean.</p>
            <p>Record your first technical breakthrough or architectural trade-off analysis.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="bg-surface border border-border rounded-xl p-5 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={clsx(
                      'text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold',
                      entry.entryType === 'architecture_decision'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : entry.entryType === 'weekly'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    )}
                  >
                    {entry.entryType.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-bold text-white">{entry.title}</h3>
                </div>

                <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatShortISTDate(entry.dateStr)}</span>
                </div>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </div>

              {entry.keyLearnings.length > 0 && (
                <div className="p-3 bg-background rounded-lg border border-border text-xs">
                  <span className="font-semibold text-emerald-400">Key Learning: </span>
                  <span className="text-slate-300">{entry.keyLearnings[0]}</span>
                </div>
              )}

              {entry.tags.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  <Tag className="w-3 h-3 text-slate-500" />
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal: New Journal Entry */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                Write Journal Entry
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Entry Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Why O(n) prefix sums beat quadratic subarray checks"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Entry Type</label>
                <select
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value as JournalEntry['entryType'])}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                >
                  <option value="daily">Daily Technical Reflection</option>
                  <option value="weekly">Weekly Synthesis & Retrospective</option>
                  <option value="architecture_decision">Architecture Decision Record (ADR)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Reflection / Notes</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail your engineering findings, trade-offs evaluated, and lessons learned..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Main Key Takeaway</label>
                <input
                  type="text"
                  placeholder="e.g. Always benchmark before optimizing"
                  value={keyLearning}
                  onChange={(e) => setKeyLearning(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-background border border-border text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 font-semibold text-black"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

