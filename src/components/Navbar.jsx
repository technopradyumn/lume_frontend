import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { UserAvatar } from "./UserAvatar";
import { getNotifications, markNotificationsAsRead } from "../services/api";
import { timeAgo } from "../utils/formatters";
import {
  Search,
  Upload,
  Sun,
  Moon,
  Menu,
  Bell,
  LogOut,
  Settings,
  User,
} from "lucide-react";

export function Navbar({ sidebarCollapsed, onToggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenNotifications = async () => {
    setShowNotifMenu(!showNotifMenu);
    if (!showNotifMenu && unreadCount > 0) {
      await markNotificationsAsRead();
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className={`navbar glass ${scrolled ? "navbar-scrolled" : ""}`}>
      {}
      <div className="navbar__brand">
        <button
          className="btn btn--icon btn--ghost"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <Link
          to="/dashboard"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--accent-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span className="navbar__brand-text gradient-text">Lume</span>
        </Link>
      </div>

      {}
      <form className="navbar__search" onSubmit={handleSearch}>
        <Search className="navbar__search-icon" size={18} />
        <input
          className="navbar__search-input"
          type="text"
          placeholder="Search videos, channels, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {}
      <div className="navbar__actions">
        <button
          className="btn btn--icon btn--ghost"
          onClick={() => navigate("/dashboard")}
          title="Upload"
        >
          <Upload size={20} />
        </button>
        <div style={{ position: "relative" }}>
          <button
            className="btn btn--icon btn--ghost"
            title="Notifications"
            onClick={handleOpenNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  backgroundColor: "var(--danger)",
                  borderRadius: "50%",
                }}
              />
            )}
          </button>
          {showNotifMenu && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setShowNotifMenu(false)}
              />
              <div
                className="dropdown"
                style={{
                  zIndex: 100,
                  width: 320,
                  maxHeight: 400,
                  overflowY: "auto",
                  padding: "var(--space-2) 0",
                }}
              >
                <div
                  style={{
                    padding: "var(--space-2) var(--space-4)",
                    borderBottom: "1px solid var(--border-default)",
                    fontWeight: 600,
                  }}
                >
                  Notifications
                </div>
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      className="dropdown__item"
                      onClick={() => {
                        setShowNotifMenu(false);
                        if (notif.link) navigate(notif.link);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "var(--space-3)",
                        padding: "var(--space-3) var(--space-4)",
                        whiteSpace: "normal",
                        height: "auto",
                        borderBottom: "1px solid var(--border-default)",
                      }}
                    >
                      <UserAvatar user={notif.sender} size="sm" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "var(--font-size-sm)" }}>
                          {notif.message}
                        </div>
                        <div
                          style={{
                            fontSize: "var(--font-size-xs)",
                            color: "var(--text-secondary)",
                            marginTop: 4,
                          }}
                        >
                          {timeAgo(notif.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "var(--space-4)",
                      textAlign: "center",
                      color: "var(--text-secondary)",
                    }}
                  >
                    No notifications yet.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <button
          className="btn btn--icon btn--ghost"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {}
        <div style={{ position: "relative" }}>
          <button
            style={{
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <UserAvatar user={user} size="md" />
          </button>
          {showUserMenu && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setShowUserMenu(false)}
              />
              <div className="dropdown" style={{ zIndex: 100 }}>
                <div
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    borderBottom: "1px solid var(--border-default)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  <div
                    style={{ fontWeight: 700, fontSize: "var(--font-size-sm)" }}
                  >
                    {user?.fullName}
                  </div>
                  <div
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    @{user?.username}
                  </div>
                </div>
                <Link
                  to={`/channel/${user?.username}`}
                  className="dropdown__item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User size={16} /> Your Channel
                </Link>
                <Link
                  to="/settings"
                  className="dropdown__item"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={16} /> Settings
                </Link>
                <button
                  className="dropdown__item"
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  style={{ width: "100%", color: "var(--danger)" }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
