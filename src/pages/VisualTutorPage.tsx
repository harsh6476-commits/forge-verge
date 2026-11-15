import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const VisualTutorPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Visual Lessons & Conceptual Architecture</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Visual Tutor
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Understand low-level engineering flows through visual system diagrams before diving into implementation.
        </p>
      </div>

      {/* Lesson 1: Express Request-Response Lifecycle */}
      <div className="bg-surface border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <span className="text-[10px] font-mono uppercase text-emerald-400 bg-background px-2 py-0.5 rounded border border-border">
              Phase 1 · Lesson 01
            </span>
            <h3 className="text-base font-bold text-white mt-1">
              Express.js Request-Response Pipeline & Middleware Chain
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Time: 15 mins</span>
        </div>

        {/* Visual Architecture Flow Diagram */}
        <div className="bg-background border border-border rounded-xl p-6 overflow-x-auto">
          <div className="flex items-center justify-center gap-3 min-w-[600px] text-xs font-mono">
            <div className="px-3 py-2 rounded-lg bg-surface border border-slate-700 text-slate-300 text-center">
              Client Request<br/>
              <span className="text-[10px] text-emerald-400">POST /api/order</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
            
            <div className="px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-center">
              CORS / BodyParser<br/>
              <span className="text-[10px] text-slate-400">req.body parsed</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

            <div className="px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-center">
              Auth Middleware<br/>
              <span className="text-[10px] text-slate-400">Verify JWT (401)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

            <div className="px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-center">
              Controller Logic<br/>
              <span className="text-[10px] text-slate-400">Business rules</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

            <div className="px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center">
              PostgreSQL / DB<br/>
              <span className="text-[10px] text-slate-400">ACID Transaction</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            <strong>Key Mental Model:</strong> Middleware in Express executes sequentially. If any middleware does not invoke <code className="text-emerald-400 font-mono">next()</code> or return a response with <code className="text-emerald-400 font-mono">res.status()</code>, the HTTP request hangs indefinitely until connection timeout.
          </p>
        </div>

        {/* Small Code Example */}
        <div className="bg-background border border-border rounded-lg p-3 font-mono text-xs text-slate-300">
          <div className="text-[10px] text-slate-500 mb-1">// Middleware contract</div>
          <span className="text-purple-400">const</span> <span className="text-blue-400">requireAuth</span> = (req, res, next) =&gt; &#123;<br/>
          &nbsp;&nbsp;<span className="text-purple-400">const</span> token = req.headers.authorization;<br/>
          &nbsp;&nbsp;<span className="text-purple-400">if</span> (!token) <span className="text-purple-400">return</span> res.status(<span className="text-amber-400">401</span>).json(&#123; error: <span className="text-emerald-300">'Unauthorized'</span> &#125;);<br/>
          &nbsp;&nbsp;next();<br/>
          &#125;;
        </div>
      </div>
    </div>
  );
};
