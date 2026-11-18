import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Flame, Bell, Lock, Menu, X, Sun, Moon } from 'lucide-react';
import { AppNotification } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import { clsx } from 'clsx';

interface TopNavProps {
  streak: number;
  onLock: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
}

interface NotificationsPanelProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onMarkRead,
  onClose,
}) => (
  <div className="bg-surface border-2 border-border rounded-2xl shadow-card p-5 space-y-3 z-50 text-xs">
    <div className="flex items-center justify-between pb-3 border-b-2 border-border">
      <span className="font-extrabold text-ink uppercase tracking-wider text-xs font-mono">
        NOTIFICATIONS
      </span>
      <button
        onClick={onClose}
        className="text-ink-muted hover:text-ink font-bold"
        aria-label="Close notifications"
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
        notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() => onMarkRead(notification._id)}
            className={clsx(
              'p-3 rounded-xl border-2 transition-all cursor-pointer text-left shadow-crisp-sm space-y-1',
              notification.read
                ? 'bg-surface-muted text-ink-muted border-border'
                : 'bg-surface-bright text-ink border-border font-semibold'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs">{notification.title}</span>
              {!notification.read && <span className="w-2 h-2 rounded-full bg-accent" />}
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">{notification.message}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

export const TopNav: React.FC<TopNavProps> = ({
  streak,
  onLock,
  notifications,
  onMarkRead,
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="min-h-16 border-b-2 border-border bg-canvas px-3 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm font-mono tracking-wide">
      {/* Brand & Main Pages */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-10 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Black Logo with zinc-200 outline and shadow */}
          <img className='mx-auto w-9 h-9 rounded-lg overflow-hidden border p-1 border-zinc-700 flex items-center justify-center text-[#E8D2B5] dark:text-zinc-100 font-bold text-2xl shadow-white' src="/public/Icon.png" alt="" />
          {/* <div className="w-9 h-9 rounded-xl bg-black text-[#E8D2B5] dark:text-zinc-100 border-2 border-zinc-200 flex items-center justify-center font-bold text-base shadow-crisp-sm">
            F
          </div> */}
          <span className="font-extrabold text-base tracking-widest text-ink uppercase hidden sm:inline-block">
            FORGE OS
          </span>
        </div>

        {/* 3 Main Pages: TODAY, TOPICS, MILESTONES */}
        <nav className="hidden lg:flex items-center gap-2 sm:gap-3 text-xs">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-xl font-bold transition-all border-2 border-border shadow-crisp-sm tracking-wider',
                isActive
                  ? 'bg-accent text-white border-zinc-200 shadow-crisp'
                  : 'bg-surface text-ink hover:bg-surface-bright'
              )
            }
          >
            TODAY
          </NavLink>

          <NavLink
            to="/topics"
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-xl font-bold transition-all border-2 border-border shadow-crisp-sm tracking-wider',
                isActive
                  ? 'bg-accent text-white border-zinc-200 shadow-crisp'
                  : 'bg-surface text-ink hover:bg-surface-bright'
              )
            }
          >
            TOPICS
          </NavLink>

          <NavLink
            to="/milestones"
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 rounded-xl font-bold transition-all border-2 border-border shadow-crisp-sm tracking-wider',
                isActive
                  ? 'bg-accent text-white border-zinc-200 shadow-crisp'
                  : 'bg-surface text-ink hover:bg-surface-bright'
              )
            }
          >
            MILESTONES
          </NavLink>
        </nav>
      </div>

      {/* Right: Streak and menu */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Streak Pill */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3.5 py-1.5 rounded-xl bg-surface border-2 border-border shadow-crisp-sm text-[10px] sm:text-xs font-bold text-ink tracking-wider whitespace-nowrap">
          <Flame className="w-4 h-4 text-accent fill-accent" />
          <span>{streak} <span className="hidden sm:inline">{streak === 1 ? 'DAY' : 'DAYS'}</span></span>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border-2 border-border bg-surface text-ink hover:bg-surface-bright shadow-crisp-sm transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl border-2 border-border bg-surface text-ink hover:bg-surface-bright shadow-crisp-sm transition-all relative"
              title="Notifications"
              aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
              aria-expanded={showNotifs}
            >
              <Bell className="w-4 h-4 text-ink" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent border-2 border-zinc-200" />
              )}
            </button>
            {showNotifs && (
              <div className="absolute right-0 z-50 mt-3 w-80 max-w-[calc(100vw-2rem)]">
                <NotificationsPanel
                  notifications={notifications}
                  onMarkRead={onMarkRead}
                  onClose={() => setShowNotifs(false)}
                />
              </div>
            )}
          </div>

          <button
            onClick={onLock}
            className="p-2 rounded-xl border-2 border-border bg-surface text-ink hover:bg-accent hover:text-white hover:border-zinc-200 shadow-crisp-sm transition-all"
            title="Lock Workspace"
            aria-label="Lock workspace"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>

        <div className="relative lg:hidden">
          <button
            onClick={() => {
              setShowMenu(!showMenu);
              setShowNotifs(false);
            }}
            className="p-2 rounded-xl border-2 border-border bg-surface text-ink hover:bg-surface-bright shadow-crisp-sm transition-all"
            title={showMenu ? 'Close navigation and settings' : 'Open navigation and settings'}
            aria-label={showMenu ? 'Close navigation and settings' : 'Open navigation and settings'}
            aria-expanded={showMenu}
            aria-controls="nav-actions-menu"
          >
            {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {showMenu && (
            <div
              id="nav-actions-menu"
              className="absolute right-0 mt-3 w-80 max-w-[calc(100vw-1.5rem)] max-h-[calc(100vh-5rem)] overflow-y-auto bg-surface border-2 border-border rounded-2xl shadow-card p-3 space-y-2 z-50 text-xs"
            >
              <nav className="flex flex-col gap-2 pb-3 border-b-2 border-border" aria-label="Main navigation">
                <NavLink
                  to="/"
                  end
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-2 rounded-xl font-bold transition-all border-2 border-border shadow-crisp-sm tracking-wider',
                      isActive
                        ? 'bg-accent text-white border-zinc-200 shadow-crisp'
                        : 'bg-surface text-ink hover:bg-surface-bright'
                    )
                  }
                >
                  TODAY
                </NavLink>
                <NavLink
                  to="/topics"
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-2 rounded-xl font-bold transition-all border-2 border-border shadow-crisp-sm tracking-wider',
                      isActive
                        ? 'bg-accent text-white border-zinc-200 shadow-crisp'
                        : 'bg-surface text-ink hover:bg-surface-bright'
                    )
                  }
                >
                  TOPICS
                </NavLink>
                <NavLink
                  to="/milestones"
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) =>
                    clsx(
                      'px-4 py-2 rounded-xl font-bold transition-all border-2 border-border shadow-crisp-sm tracking-wider',
                      isActive
                        ? 'bg-accent text-white border-zinc-200 shadow-crisp'
                        : 'bg-surface text-ink hover:bg-surface-bright'
                    )
                  }
                >
                  MILESTONES
                </NavLink>
              </nav>

              <button
                onClick={() => {
                  toggleTheme();
                  setShowMenu(false);
                  setShowNotifs(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-ink hover:bg-surface-bright transition-colors text-left font-bold"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
              </button>

              <button
                onClick={() => setShowNotifs(!showNotifs)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-ink hover:bg-surface-bright transition-colors text-left font-bold"
                aria-expanded={showNotifs}
              >
                <span className="relative">
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent border border-surface" />
                  )}
                </span>
                REMINDERS
              </button>

              {showNotifs && (
                <div className="border-t-2 border-border pt-3 space-y-3">
                  <NotificationsPanel
                    notifications={notifications}
                    onMarkRead={onMarkRead}
                    onClose={() => setShowNotifs(false)}
                  />
                </div>
              )}

              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowNotifs(false);
                  onLock();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-ink hover:bg-accent hover:text-white transition-colors text-left font-bold"
                title="Lock Workspace"
              >
                <Lock className="w-4 h-4" />
                LOCK WORKSPACE
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
