import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import { PinGate } from './components/PinGate';
import { TopNav } from './components/TopNav';
import { TodayPage } from './pages/Today';
import { MilestonesPage } from './pages/Milestones';
import { AppNotification } from './types/api';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const checkAuth = async () => {
    try {
      const res = await api.checkSession();
      setIsAuthenticated(res.authenticated);
      if (res.authenticated) {
        loadHeaderData();
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const loadHeaderData = async () => {
    try {
      const [sum, notifs] = await Promise.all([
        api.getProgressSummary().catch(() => ({ streak: 0 })),
        api.getNotifications().catch(() => []),
      ]);
      setStreak(sum.streak || 0);
      setNotifications(notifs || []);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleUnlock = () => {
    setIsAuthenticated(true);
    loadHeaderData();
  };

  const handleLock = async () => {
    await api.lock();
    setIsAuthenticated(false);
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-slate-500 font-mono text-xs">
        Initializing FORGE OS...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PinGate onUnlock={handleUnlock} apiUnlock={api.unlock} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-slate-100 flex flex-col font-sans">
        {/* Top Header Navigation */}
        <TopNav
          streak={streak}
          onLock={handleLock}
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
        />

        {/* The Only Two Main Pages */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
