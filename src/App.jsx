import React, { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider } from "./shared/context/ThemeContext";
import { AuthProvider, useAuth } from "./shared/context/AuthContext";
import { Navbar } from "./shared/components/Navbar";
import { Sidebar } from "./shared/components/Sidebar";
import { BottomNav } from "./shared/components/BottomNav";
import { LandingPage } from "./features/auth/pages/LandingPage";
import { AuthPage } from "./features/auth/pages/AuthPage";
import { ForgotPasswordPage } from "./features/auth/pages/ForgotPasswordPage";
import { HomePage } from "./features/videos/pages/HomePage";
import { VideoPlayerPage } from "./features/videos/pages/VideoPlayerPage";
import { CommunityPage } from "./features/community/pages/CommunityPage";
import { TweetDetailPage } from "./features/community/pages/TweetDetailPage";
import { ChannelPage } from "./features/channel/pages/ChannelPage";
import { SubscriptionsPage } from "./features/subscriptions/pages/SubscriptionsPage";
import { LikedVideosPage } from "./features/videos/pages/LikedVideosPage";
import { SavedVideosPage } from "./features/videos/pages/SavedVideosPage";
import { HistoryPage } from "./features/videos/pages/HistoryPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { SettingsPage } from "./features/dashboard/pages/SettingsPage";
import { SearchResultsPage } from "./features/videos/pages/SearchResultsPage";
import { NotificationsPage } from "./features/notifications/pages/NotificationsPage";
import { PullToRefresh } from "./shared/components/PullToRefresh";
import { clearApiCache } from "./shared/services/api";

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const toggleSidebar = () =>
    window.innerWidth <= 768
      ? setMobileMenuOpen((open) => !open)
      : setSidebarCollapsed((collapsed) => !collapsed);
  return (
    <div className="app">
      <Navbar
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onNavigate={() => setMobileMenuOpen(false)}
      />
      {mobileMenuOpen && (
        <div
          className="app__mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <main
        className={`main-content ${sidebarCollapsed ? "main-content--sidebar-collapsed" : ""}`}
      >
        <PullToRefresh onRefresh={async () => { clearApiCache(); setRefreshKey((key) => key + 1); }}>
        <Routes key={refreshKey}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/watch/:videoId" element={<VideoPlayerPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route
            path="/community/post/:tweetId"
            element={<TweetDetailPage />}
          />
          <Route path="/channel/:username" element={<ChannelPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/liked" element={<LikedVideosPage />} />
          <Route path="/saved" element={<SavedVideosPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
        </PullToRefresh>
      </main>
      <BottomNav />
    </div>
  );
}

function DemoHome() {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();
  const { endDemo } = useAuth();
  const leaveDemo = (path) => {
    endDemo();
    navigate(path);
  };
  return (
    <div className="demo-home">
      <div className="demo-home__notice">
        <span>Live demo</span>
        <p>You can browse the Home screen. Sign in to interact with Lume.</p>
      </div>
      <main className="demo-home__content">
        <HomePage />
      </main>
      <button
        className="demo-home__interceptor"
        aria-label="Sign in required"
        onClick={() => setShowPrompt(true)}
      />
      {showPrompt && (
        <div className="modal-overlay" onClick={() => setShowPrompt(false)}>
          <div
            className="modal demo-home__prompt"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal__body">
              <span className="badge badge--accent">Guest demo</span>
              <h2 className="modal__title">Create an account to continue</h2>
              <p className="section-subtitle">
                Sign in or create a free account to watch videos, join
                conversations, and use creator tools.
              </p>
              <div className="demo-home__prompt-actions">
                <button
                  className="btn btn--secondary"
                  onClick={() => leaveDemo("/login")}
                >
                  Sign in
                </button>
                <button
                  className="btn btn--primary"
                  onClick={() => leaveDemo("/register")}
                >
                  Create account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MainRoutes() {
  const { isAuthenticated, isDemo, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="app-loading">
        <div />
      </div>
    );
  if (isDemo)
    return (
      <Routes>
        <Route path="/demo" element={<DemoHome />} />
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    );
  if (!isAuthenticated)
    return (
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    );
  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/dashboard" replace />} />
      <Route path="/register" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/forgot-password"
        element={<Navigate to="/dashboard" replace />}
      />
      <Route path="/*" element={<AppLayout />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MainRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
