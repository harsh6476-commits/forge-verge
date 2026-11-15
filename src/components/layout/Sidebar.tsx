import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Calendar,
  Code2,
  BrainCircuit,
  FolderGit2,
  GraduationCap,
  Sparkles,
  BookOpen,
  LineChart,
  Settings,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  currentPhaseNumber: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPhaseNumber }) => {
  const navItems = [
    { label: 'Overview', isHeader: true },
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/roadmap', label: '18M Roadmap', icon: Map },
    { to: '/calendar', label: 'Daily Planner', icon: Calendar },

    { label: 'Engineering Core', isHeader: true },
    { to: '/dsa', label: 'DSA Lab', icon: Code2 },
    { to: '/skills', label: 'Skill Matrix', icon: BrainCircuit },
    { to: '/projects', label: 'Projects & Checkpoints', icon: FolderGit2 },
    { to: '/visual-tutor', label: 'Visual Tutor', icon: Sparkles },

    { label: 'Career & Academics', isHeader: true },
    { to: '/academics', label: 'Academic Manager', icon: GraduationCap },
    { to: '/market-radar', label: 'Market Radar', icon: Compass },
    { to: '/career', label: 'Career OS', icon: ShieldCheck },

    { label: 'Intelligence & Reflections', isHeader: true },
    { to: '/journal', label: 'Engineering Journal', icon: BookOpen },
    { to: '/analytics', label: 'Analytics', icon: LineChart },
    { to: '/settings', label: 'Settings & Sync', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-surface border-r border-border flex flex-col h-screen select-none shrink-0">
      {/* Brand & Phase indicator */}
      <div className="p-5 border-b border-border flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg shadow-sm">
            F
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white uppercase flex items-center gap-1.5">
              FORGE OS
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded font-mono font-semibold">
                v1.0
              </span>
            </h1>
            <p className="text-[11px] text-muted font-mono">Build Your Future</p>
          </div>
        </div>

        {/* Phase Pill */}
        <div className="mt-2 bg-background border border-border rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">Phase {currentPhaseNumber} of 6</span>
          </div>
          <span className="text-[10px] font-mono bg-border px-1.5 py-0.5 rounded text-muted">
            13 Wks
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item, idx) => {
          if (item.isHeader) {
            return (
              <div
                key={`header-${idx}`}
                className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 pt-4 pb-1 font-mono"
              >
                {item.label}
              </div>
            );
          }

          const Icon = item.icon!;
          return (
            <NavLink
              key={item.to}
              to={item.to!}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-surface-hover'
                )
              }
            >
              <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Profile Info */}
      <div className="p-3 border-t border-border bg-background/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-emerald-400 font-bold text-xs">
              CS
            </div>
            <div className="truncate max-w-[130px]">
              <div className="text-white font-medium truncate text-[11px]">B.Tech CSE</div>
              <div className="text-[10px] text-muted truncate">Sem 3 · 2026–2028</div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Local Mode Active"></span>
        </div>
      </div>
    </aside>
  );
};

