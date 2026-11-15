import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Bell, Lock, X } from 'lucide-react';
import { AppNotification } from '../types/api';
import { clsx } from 'clsx';

interface TopNavProps {
  streak: number;
  onLock: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  streak,
  onLock,
  notifications,
  onMarkRead,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 border-b border-border/80 bg-surface/90 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand & Main 2 Pages */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-mono font-bold text-xs">
            F
          </div>
          <span className="font-bold text-xs tracking-wider text-white uppercase font-mono">
            FORGE OS
          </span>
        </div>

        {/* The Only Two Main Pages */}
        <nav className="flex items-center gap-1 text-xs">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              clsx(
                'px-3.5 py-1.5 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              )
            }
          >
            Today
          </NavLink>

          <NavLink
            to="/milestones"
            className={({ isActive }) =>
              clsx(
                'px-3.5 py-1.5 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-teal-500/10 text-teal-300 font-semibold border border-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              )
            }
          >
            Milestones
          </NavLink>
        </nav>
      </div>

      {/* Right: Streak, Notification Bell, Manual Lock */}
      <div className="flex items-center gap-4">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-xs">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400/20" />
          <span className="font-mono font-bold text-white text-[11px]">
            {streak} {streak === 1 ? 'DAY' : 'DAYS'}
          </span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-1.5 rounded-lg border border-border text-slate-400 hover:text-white hover:bg-surface-hover transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-2xl p-3 space-y-2 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="font-semibold text-white font-mono text-[11px] uppercase">
                  Notifications
                </span>
                <button
                  onClick={() => setShowNotifs(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-[11px] font-mono">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => onMarkRead(n._id)}
                      className={clsx(
                        'p-2.5 rounded-lg border transition-colors cursor-pointer text-left',
                        n.read
                          ? 'border-border/40 bg-background/40 opacity-70'
                          : 'border-teal-500/30 bg-teal-500/5'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lock Session */}
        <button
          onClick={onLock}
          className="p-1.5 rounded-lg border border-border text-slate-400 hover:text-rose-400 hover:bg-surface-hover transition-colors"
          title="Lock Workspace"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
