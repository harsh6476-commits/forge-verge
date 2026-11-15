import React from 'react';
import { FolderGit2, CheckCircle2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const projects = [
    {
      title: 'Production Order Management & Inventory Locking',
      priority: 'High Priority (P0)',
      timeline: 'Phases 2 & 3',
      stack: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
      features: [
        'Atomic database transactions to prevent overselling',
        'Redis distributed locking for concurrent cart checkouts',
        'Automated Vitest integration tests & API documentation',
      ],
      deliverable: 'GitHub Repository + Passing Test Suite + Live Deployment',
    },
    {
      title: 'RAG-Based Document Intelligence & Citation System',
      priority: 'AI Specialization',
      timeline: 'Phase 6',
      stack: ['Python', 'FastAPI', 'Ollama', 'ChromaDB', 'LangChain'],
      features: [
        'Document parsing & semantic text chunking strategies',
        'Local LLM inference without paid cloud APIs',
        'Benchmarking Recall@K and Mean Reciprocal Rank (MRR)',
      ],
      deliverable: 'Research Notebook + Benchmark Evaluation + Web Interface',
    },
    {
      title: 'Engineering Productivity & Task Intelligence Platform (FORGE OS)',
      priority: 'Active Portfolio',
      timeline: 'Phase 1 Foundation',
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'IndexedDB', 'Vitest'],
      features: [
        '18-Month adaptive curriculum with rolling 30-day planner',
        'Spaced repetition engine (1, 3, 7, 21-day cycles)',
        'Asia/Kolkata timezone safe calculations & zero dead buttons',
      ],
      deliverable: 'Full Working Application + Strict Test Pass Rate',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <FolderGit2 className="w-4 h-4" />
          <span>Major Engineering Portfolio & Milestone Gates</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Projects & Checkpoints
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Each project solves a concrete engineering challenge with real deliverables and passing test suites.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="bg-surface border border-border rounded-xl p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-emerald-400 font-semibold uppercase">
                  {proj.priority}
                </span>
                <span className="text-xs font-mono text-slate-500">{proj.timeline}</span>
              </div>

              <h3 className="text-base font-bold text-white">{proj.title}</h3>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-slate-300"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border">
                <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono">
                  Core Engineering Milestones:
                </div>
                {proj.features.map((f, i) => (
                  <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border text-[11px] font-mono text-slate-400 bg-background/50 p-2.5 rounded-lg border border-border/60">
              <span className="text-emerald-400 font-semibold">Deliverable: </span>
              {proj.deliverable}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
