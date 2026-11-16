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
    <header className="h-16 border-b-2 border-border bg-canvas px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm font-mono tracking-wide">
      {/* Brand & Main Pages */}
      <div className="flex items-center gap-6 sm:gap-10">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="w-9 h-9 rounded-xl bg-accent text-white border-2 border-border flex items-center justify-center font-bold text-base shadow-crisp-sm">
            F
          </div>
          <span className="font-extrabold text-base tracking-widest text-surface uppercase hidden sm:inline-block">
            FORGE OS
          </span>
        </div>

        {/* 3 Main Pages: TODAY, TOPICS, MILESTONES */}
        <nav className="flex items-center gap-2 sm:gap-3 text-xs">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-xl font-bold transition-all border-2 shadow-crisp-sm tracking-wider',
                isActive
                  ? 'bg-accent text-white border-border shadow-crisp'
                  : 'bg-surface text-ink hover:bg-surface-bright border-border'
              )
            }
          >
            TODAY
          </NavLink>

          <NavLink
            to="/topics"
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-xl font-bold transition-all border-2 shadow-crisp-sm tracking-wider',
                isActive
                  ? 'bg-accent text-white border-border shadow-crisp'
                  : 'bg-surface text-ink hover:bg-surface-bright border-border'
              )
            }
          >
            TOPICS
          </NavLink>

          <NavLink
            to="/milestones"
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-xl font-bold transition-all border-2 shadow-crisp-sm tracking-wider',
                isActive
                  ? 'bg-accent text-white border-border shadow-crisp'
                  : 'bg-surface text-ink hover:bg-surface-bright border-border'
              )
            }
          >
            MILESTONES
          </NavLink>
        </nav>
      </div>

      {/* Right: Streak, Notification Bell, Lock */}
      <div className="flex items-center gap-3">
        {/* Streak Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface border-2 border-border shadow-crisp-sm text-xs font-bold text-ink tracking-wider">
          <Flame className="w-4 h-4 text-focus fill-focus" />
          <span>{streak} {streak === 1 ? 'DAY' : 'DAYS'}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl border-2 border-border bg-surface text-ink hover:bg-surface-bright shadow-crisp-sm transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-ink" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-surface" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 bg-surface border-2 border-border rounded-2xl shadow-card p-5 space-y-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-3 border-b-2 border-border">
                <span className="font-extrabold text-ink uppercase tracking-wider text-xs font-mono">
                  NOTIFICATIONS
                </span>
                <button
                  onClick={() => setShowNotifs(false)}
                  className="text-ink-muted hover:text-ink font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-ink-muted font-mono text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => onMarkRead(n._id)}
                      className={clsx(
                        'p-3 rounded-xl border-2 transition-all cursor-pointer text-left shadow-crisp-sm space-y-1',
                        n.read
                          ? 'bg-surface-muted text-ink-muted border-border'
                          : 'bg-surface-bright text-ink border-border font-semibold'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{n.title}</span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-accent" />}
                      </div>
                      <p className="text-[11px] text-ink-muted leading-relaxed">{n.message}</p>
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
          className="p-2 rounded-xl border-2 border-border bg-surface text-ink hover:bg-accent hover:text-white hover:border-accent shadow-crisp-sm transition-all"
          title="Lock Workspace"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
