import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { RoadmapPage } from '@/pages/RoadmapPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { DSALabPage } from '@/pages/DSALabPage';
import { SkillMatrixPage } from '@/pages/SkillMatrixPage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { VisualTutorPage } from '@/pages/VisualTutorPage';
import { AcademicPage } from '@/pages/AcademicPage';
import { MarketRadarPage } from '@/pages/MarketRadarPage';
import { CareerPage } from '@/pages/CareerPage';
import { JournalPage } from '@/pages/JournalPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'roadmap', element: <RoadmapPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'dsa', element: <DSALabPage /> },
      { path: 'skills', element: <SkillMatrixPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'visual-tutor', element: <VisualTutorPage /> },
      { path: 'academics', element: <AcademicPage /> },
      { path: 'market-radar', element: <MarketRadarPage /> },
      { path: 'career', element: <CareerPage /> },
      { path: 'journal', element: <JournalPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
]);

