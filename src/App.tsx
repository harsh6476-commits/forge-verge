import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import { PinGate } from './components/PinGate';
import { TopNav } from './components/TopNav';
import { TodayPage } from './pages/Today';
import { AppNotification } from './types/api';

const MilestonesPage = lazy(() => import('./pages/Milestones').then((m) => ({ default: m.MilestonesPage })));
const TopicsPage = lazy(() => import('./pages/Topics').then((m) => ({ default: m.TopicsPage })));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] text-ink-muted font-mono text-xs tracking-widest uppercase gap-3">
      <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
      Loading...
    </div>
  );
}

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
      setStreak((sum as any).streak || 0);
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
      <div className="min-h-screen bg-canvas flex items-center justify-center text-surface font-mono text-xs tracking-widest uppercase gap-3">
        <div className="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full" />
        Initializing FORGE OS...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PinGate onUnlock={handleUnlock} apiUnlock={api.unlock} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-canvas text-ink flex flex-col selection:bg-accent selection:text-white">
        <TopNav
          streak={streak}
          onLock={handleLock}
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
        />

        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<TodayPage />} />
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/milestones" element={<MilestonesPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
