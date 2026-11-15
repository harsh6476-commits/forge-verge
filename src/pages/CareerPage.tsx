import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const CareerPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Internship Readiness & Interview Preparation</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Career OS
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Track technical interview readiness, resume project proof, and internship pipelines for your 3rd-year summer internship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400">DSA Interview Readiness</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">Phase 1 Target: 45</div>
          <p className="text-xs text-slate-400">
            Focus on writing clean C++ code, identifying time/space trade-offs on the whiteboard, and handling corner cases.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400">Core CS Fundamentals</div>
          <div className="text-2xl font-bold text-white font-mono">In Progress</div>
          <p className="text-xs text-slate-400">
            Operating Systems, Database Management Systems, and Computer Networks. Crucial for technical rounds.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5 space-y-3">
          <div className="text-xs font-mono uppercase text-slate-400">Portfolio Proof Target</div>
          <div className="text-2xl font-bold text-blue-400 font-mono">2 Fullstack + 1 AI</div>
          <p className="text-xs text-slate-400">
            Real deployed applications with automated tests and architecture documentation, not tutorial clones.
          </p>
        </div>
      </div>
    </div>
  );
};
