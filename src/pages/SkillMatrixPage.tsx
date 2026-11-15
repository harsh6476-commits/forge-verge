import React, { useState, useEffect } from 'react';
import { localStore } from '@/services/localStore';
import { SkillItem, SkillCategory, SkillMaturityLevel } from '@/types';
import { BrainCircuit } from 'lucide-react';
import { clsx } from 'clsx';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: 'Frontend Engineering',
  backend: 'Backend & Systems',
  databases: 'Databases & Storage',
  messaging: 'Streaming & Messaging',
  devops: 'DevOps & Cloud',
  testing: 'Testing & QA',
  monitoring: 'Observability & Monitoring',
  ai: 'AI & Research',
  security: 'Security & Auth',
  core_cs: 'Core Computer Science',
};

const MATURITY_RUBRIC: Record<SkillMaturityLevel, { label: string; desc: string }> = {
  0: { label: 'Level 0 — Not Started', desc: 'No prior exposure or active study.' },
  1: { label: 'Level 1 — Conceptual', desc: 'Understands basic terms, syntax, and theory.' },
  2: { label: 'Level 2 — Guided Practice', desc: 'Can implement solutions following tutorials/docs.' },
  3: { label: 'Level 3 — Independent Implementation', desc: 'Writes production code without constant handholding.' },
  4: { label: 'Level 4 — Tested & Deployed', desc: 'Builds, writes automated tests, and deploys to production.' },
  5: { label: 'Level 5 — Architectural Mastery', desc: 'Explains internals, runtime trade-offs, and debugs complex edge cases.' },
};

export const SkillMatrixPage: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<SkillCategory | 'all'>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);

  const loadData = async () => {
    const data = await localStore.getSkills();
    setSkills(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLevelSelect = async (skill: SkillItem, level: SkillMaturityLevel) => {
    await localStore.updateSkillLevel(skill.id, level);
    await loadData();
    if (selectedSkill?.id === skill.id) {
      setSelectedSkill({ ...skill, currentLevel: level });
    }
  };

  const categories = Object.keys(CATEGORY_LABELS) as SkillCategory[];
  const filteredSkills = activeCategory === 'all' ? skills : skills.filter(s => s.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>Competency Evaluation · Level 0 to 5</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Engineering Skill Matrix
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Progress requires independent engineering evidence. Watching a course does not equal Level 4 mastery.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors',
            activeCategory === 'all'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
              : 'bg-surface border border-border text-slate-400 hover:text-white'
          )}
        >
          All Skills ({skills.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors',
              activeCategory === cat
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold'
                : 'bg-surface border border-border text-slate-400 hover:text-white'
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => setSelectedSkill(skill)}
            className="bg-surface border border-border rounded-xl p-4 space-y-3 cursor-pointer hover:border-slate-700 transition-all hover:bg-surface-hover"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-slate-500">
                {CATEGORY_LABELS[skill.category]}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                Lvl {skill.currentLevel} / {skill.targetLevel}
              </span>
            </div>

            <div className="text-sm font-bold text-white">{skill.name}</div>

            {/* 5-Segment Progress Bar */}
            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <div
                  key={lvl}
                  className={clsx(
                    'h-1.5 rounded-full transition-all',
                    skill.currentLevel >= lvl
                      ? 'bg-emerald-400 shadow-sm shadow-emerald-500/30'
                      : 'bg-slate-800'
                  )}
                />
              ))}
            </div>

            <div className="text-[11px] text-slate-400 line-clamp-1">
              {MATURITY_RUBRIC[skill.currentLevel].label}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Detail & Level Upgrading Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400">
                  {CATEGORY_LABELS[selectedSkill.category]}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedSkill.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Maturity Progression Rubric
              </h4>

              {([0, 1, 2, 3, 4, 5] as SkillMaturityLevel[]).map((lvl) => {
                const isSelected = selectedSkill.currentLevel === lvl;
                return (
                  <div
                    key={lvl}
                    onClick={() => handleLevelSelect(selectedSkill, lvl)}
                    className={clsx(
                      'p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3',
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-white'
                        : 'bg-background border-border text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    )}
                  >
                    <div
                      className={clsx(
                        'w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono',
                        isSelected ? 'border-emerald-400 bg-emerald-500 text-black' : 'border-slate-700'
                      )}
                    >
                      {lvl}
                    </div>
                    <div>
                      <div className="font-semibold">{MATURITY_RUBRIC[lvl].label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {MATURITY_RUBRIC[lvl].desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-3 border-t border-border">
              <button
                onClick={() => setSelectedSkill(null)}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-xs font-semibold text-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
