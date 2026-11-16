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
      <div className="min-h-screen bg-canvas flex items-center justify-center text-black font-mono text-xs tracking-widest uppercase">
        Initializing FORGE OS...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PinGate onUnlock={handleUnlock} apiUnlock={api.unlock} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-canvas text-black flex flex-col font-mono tracking-wide selection:bg-accent selection:text-highlight">
        {/* Top Header Navigation */}
        <TopNav
          streak={streak}
          onLock={handleLock}
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
        />

        {/* 2 Main Pages: Today and Milestones */}
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
