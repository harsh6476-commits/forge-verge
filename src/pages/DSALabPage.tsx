import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { DSAProblem, RevisionQueueItem, DSATopic, DSADifficulty } from '@/types';
import { Code2, Plus, ExternalLink, Flame, CheckCircle2, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { formatShortISTDate } from '@/lib/date-utils';

export const DSALabPage: React.FC = () => {
  const [problems, setProblems] = useState<DSAProblem[]>([]);
  const [revisionQueue, setRevisionQueue] = useState<RevisionQueueItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [topic, setTopic] = useState<DSATopic>('Arrays');
  const [difficulty, setDifficulty] = useState<DSADifficulty>('easy');
  const [timeComplexity, setTimeComplexity] = useState('O(n)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [bruteForceNotes, setBruteForceNotes] = useState('');
  const [optimalNotes, setOptimalNotes] = useState('');
  const [solvedIndependently, setSolvedIndependently] = useState(true);

  const loadData = async () => {
    const p = await localStore.getDSAProblems();
    const q = await localStore.getRevisionQueue();
    setProblems(p);
    setRevisionQueue(q);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await localStore.logDSAProblem({
      title,
      platform: 'leetcode',
      url,
      topic,
      difficulty,
      language: 'cpp',
      solvedIndependently,
      usedHints: !solvedIndependently,
      bruteForceNotes,
      optimalNotes,
      timeComplexity,
      spaceComplexity,
    });

    setIsModalOpen(false);
    setTitle('');
    setUrl('');
    setBruteForceNotes('');
    setOptimalNotes('');
    await loadData();
  };

  const handleCompleteRevision = async (queueId: string, success: boolean) => {
    await localStore.completeRevision(queueId, success);
    await loadData();
  };

  const pendingRevisions = revisionQueue.filter(q => q.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Problem Tracking & Spaced Repetition (C++)</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            DSA Laboratory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Log algorithmic problems with time/space complexity notes. Spaced repetition automatically triggers reviews at 1, 3, 7, and 21 days.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition-colors shrink-0 shadow-lg shadow-emerald-500/10"
        >
          <Plus className="w-4 h-4" />
          Log DSA Problem
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-mono uppercase">Total Solved</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{problems.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">Target: ~200 Quality Problems</div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-mono uppercase">Independent Solutions</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {problems.filter(p => p.solvedIndependently).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Without viewing editorials</div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-mono uppercase">Active Revision Queue</div>
          <div className="text-2xl font-bold text-orange-400 font-mono mt-1">
            {pendingRevisions.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting reinforcement</div>
        </div>

        <div className="bg-surface border border-border p-4 rounded-xl">
          <div className="text-xs text-slate-400 font-mono uppercase">Primary Language</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">C++ 20</div>
          <div className="text-[11px] text-slate-400 mt-1">Standard Template Library (STL)</div>
        </div>
      </div>

      {/* Spaced Repetition Queue Section */}
      {pendingRevisions.length > 0 && (
        <div className="bg-surface border border-orange-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Spaced Repetition Queue ({pendingRevisions.length})
            </h2>
            <span className="text-xs text-slate-400 font-mono">Stages: 1d → 3d → 7d → 21d</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingRevisions.map((rev) => (
              <div
                key={rev.id}
                className="bg-background border border-border p-3.5 rounded-lg flex flex-col justify-between text-xs space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase text-emerald-400">
                      {rev.topic}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface border border-border text-slate-300">
                      Stage {rev.intervalStage} ({rev.intervalStage === 1 ? '1d' : rev.intervalStage === 2 ? '3d' : rev.intervalStage === 3 ? '7d' : '21d'})
                    </span>
                  </div>
                  <div className="font-semibold text-white mt-1">{rev.problemTitle}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Due: {formatShortISTDate(rev.nextRevisionDate)}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <button
                    onClick={() => handleCompleteRevision(rev.id, true)}
                    className="flex-1 py-1 px-2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed (Advance)
                  </button>
                  <button
                    onClick={() => handleCompleteRevision(rev.id, false)}
                    className="py-1 px-2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                    title="Reset back to Stage 1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Problems Table / Log */}
      <div className="bg-surface border border-border rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
          Solved Problems Registry ({problems.length})
        </h2>

        {problems.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono space-y-2">
            <div>No problems recorded yet.</div>
            <div>Click "Log DSA Problem" above to record your first C++ problem.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                  <th className="pb-3">Problem Title</th>
                  <th className="pb-3">Topic</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Complexity</th>
                  <th className="pb-3">Independent?</th>
                  <th className="pb-3">Date Solved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="py-3 font-semibold text-white flex items-center gap-2">
                      <span>{p.title}</span>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-emerald-400"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </td>
                    <td className="py-3 font-mono text-slate-300">{p.topic}</td>
                    <td className="py-3">
                      <span
                        className={clsx(
                          'text-[10px] font-mono px-2 py-0.5 rounded border uppercase',
                          p.difficulty === 'easy' && 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                          p.difficulty === 'medium' && 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                          p.difficulty === 'hard' && 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        )}
                      >
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-400">
                      T: {p.timeComplexity} · S: {p.spaceComplexity}
                    </td>
                    <td className="py-3">
                      {p.solvedIndependently ? (
                        <span className="text-emerald-400 font-mono text-[11px]">Yes (Solo)</span>
                      ) : (
                        <span className="text-amber-400 font-mono text-[11px]">With Hints</span>
                      )}
                    </td>
                    <td className="py-3 font-mono text-slate-500">
                      {formatShortISTDate(p.firstSolvedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Log New DSA Problem */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Log DSA Problem
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProblem} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Problem Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subarray Sum Equals K"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Problem Link (LeetCode / Striver)</label>
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value as DSATopic)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Arrays">Arrays</option>
                    <option value="Strings">Strings</option>
                    <option value="Hashing">Hashing</option>
                    <option value="Two Pointers">Two Pointers</option>
                    <option value="Sliding Window">Sliding Window</option>
                    <option value="Binary Search">Binary Search</option>
                    <option value="Linked Lists">Linked Lists</option>
                    <option value="Stacks">Stacks</option>
                    <option value="Queues">Queues</option>
                    <option value="Trees">Trees</option>
                    <option value="Graphs">Graphs</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DSADifficulty)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Time Complexity</label>
                  <input
                    type="text"
                    value={timeComplexity}
                    onChange={(e) => setTimeComplexity(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Space Complexity</label>
                  <input
                    type="text"
                    value={spaceComplexity}
                    onChange={(e) => setSpaceComplexity(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="indepCheck"
                  checked={solvedIndependently}
                  onChange={(e) => setSolvedIndependently(e.target.checked)}
                  className="rounded bg-background border-border text-emerald-500 focus:ring-0"
                />
                <label htmlFor="indepCheck" className="text-slate-300">
                  Solved independently without viewing editorial
                </label>
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
                  Save & Add to Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
