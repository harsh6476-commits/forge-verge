import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { RoadmapPhase } from '@/types';
import { formatShortISTDate } from '@/lib/date-utils';
import { MapPin, Layers, Award, Terminal } from 'lucide-react';
import { clsx } from 'clsx';

export const RoadmapPage: React.FC = () => {
  const [phases, setPhases] = useState<RoadmapPhase[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<RoadmapPhase | null>(null);

  useEffect(() => {
    async function loadPhases() {
      const data = await localStore.getRoadmapPhases();
      setPhases(data);
      setSelectedPhase(data[0]);
    }
    loadPhases();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Layers className="w-4 h-4" />
          <span>Curriculum Architecture · 78 Weeks · 6 Phases</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          18-Month Engineering Roadmap
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Each phase is exactly 13 weeks. Progress is earned through verified evidence, code reviews, and project defenses.
        </p>
      </div>

      {/* 6 Phases Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {phases.map((phase) => {
          const isActive = phase.status === 'active';
          const isSelected = selectedPhase?.id === phase.id;

          return (
            <div
              key={phase.id}
              onClick={() => setSelectedPhase(phase)}
              className={clsx(
                'bg-surface border rounded-xl p-5 cursor-pointer transition-all relative flex flex-col justify-between',
                isSelected
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'border-border hover:border-slate-700 hover:bg-surface-hover'
              )}
            >
              {isActive && (
                <span className="absolute top-4 right-4 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Now
                </span>
              )}

              <div>
                <div className="text-xs font-mono text-slate-400 uppercase">
                  Phase {phase.phaseNumber} · 13 Weeks
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {phase.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {phase.focusArea}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {phase.primaryTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-background border border-border text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Date range */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>{formatShortISTDate(phase.startDate)}</span>
                <span>→</span>
                <span>{formatShortISTDate(phase.endDate)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Phase Deep Dive */}
      {selectedPhase && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase">
                Phase {selectedPhase.phaseNumber} Deep Dive
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                {selectedPhase.name}
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-400">
              {formatShortISTDate(selectedPhase.startDate)} – {formatShortISTDate(selectedPhase.endDate)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Core Engineering Stack
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedPhase.primaryTechnologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-background border border-border text-emerald-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  Major Portfolio Deliverable
                </h4>
                <p className="text-sm font-semibold text-white mt-1">
                  {selectedPhase.majorProjectTitle}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Must include automated test suites, README architecture diagrams, and working cloud/container deployment.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Phase Milestone Checkpoint
                </h4>
                <p className="text-sm font-semibold text-white mt-1">
                  {selectedPhase.checkpointTitle}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Evaluated at ≥70% passing threshold: DSA problem solving (35%), independent architecture (30%), verbal technical explanation (15%), and project repository proof (20%).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
