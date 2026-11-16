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
    <header className="h-16 border-b-2 border-black bg-canvas px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm font-mono tracking-wide">
      {/* Brand & Main Pages */}
      <div className="flex items-center gap-6 sm:gap-10">
        <div className="flex items-center gap-3">
          {/* Black Logo with zinc-200 outline and shadow */}
          <div className="w-9 h-9 rounded-xl bg-black text-[#E8D2B5] border-2 border-zinc-200 flex items-center justify-center font-bold text-base shadow-crisp-sm">
            F
          </div>
          <span className="font-extrabold text-base tracking-widest text-black uppercase hidden sm:inline-block">
            FORGE OS
          </span>
        </div>

        {/* 2 Main Pages: TODAY, MILESTONES */}
        <nav className="flex items-center gap-2 sm:gap-3 text-xs">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-xl font-bold transition-all border-2 border-zinc-200 shadow-crisp-sm tracking-wider',
                isActive
                  ? 'bg-accent text-highlight border-black shadow-crisp'
                  : 'bg-highlight text-black hover:bg-white'
              )
            }
          >
            TODAY
          </NavLink>

          <NavLink
            to="/milestones"
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-xl font-bold transition-all border-2 border-zinc-200 shadow-crisp-sm tracking-wider',
                isActive
                  ? 'bg-accent text-highlight border-black shadow-crisp'
                  : 'bg-highlight text-black hover:bg-white'
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
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-highlight border-2 border-zinc-200 shadow-crisp-sm text-xs font-bold text-black tracking-wider">
          <Flame className="w-4 h-4 text-accent fill-accent" />
          <span>{streak} {streak === 1 ? 'DAY' : 'DAYS'}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl border-2 border-zinc-200 bg-highlight text-black hover:bg-white shadow-crisp-sm transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-black" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-zinc-200" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-3 w-80 bg-highlight border-2 border-black rounded-2xl shadow-deep p-5 space-y-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                <span className="font-extrabold text-black uppercase tracking-wider text-xs">
                  NOTIFICATIONS
                </span>
                <button
                  onClick={() => setShowNotifs(false)}
                  className="text-black hover:text-accent font-bold"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-black/60 font-mono text-xs">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => onMarkRead(n._id)}
                      className={clsx(
                        'p-3 rounded-xl border-2 border-black transition-all cursor-pointer text-left shadow-crisp-sm space-y-1',
                        n.read
                          ? 'bg-canvas/70 text-black/70'
                          : 'bg-white text-black font-semibold'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{n.title}</span>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-accent" />}
                      </div>
                      <p className="text-[11px] text-black/80 leading-relaxed">{n.message}</p>
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
          className="p-2 rounded-xl border-2 border-zinc-200 bg-highlight text-black hover:bg-accent hover:text-highlight hover:border-black shadow-crisp-sm transition-all"
          title="Lock Workspace"
        >
          <Lock className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
