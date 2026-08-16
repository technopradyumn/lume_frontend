import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Flame,
  Compass,
  Users,
  Heart,
  Clock,
  LayoutDashboard,
  Settings,
  Bookmark,
  Info,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/search?q=trending", icon: Flame, label: "Trending" },
  { to: "/community", icon: Compass, label: "Community" },
  { to: "/subscriptions", icon: Users, label: "Subscriptions" },
];

const LIBRARY_ITEMS = [
  { to: "/liked", icon: Heart, label: "Liked Videos" },
  { to: "/saved", icon: Bookmark, label: "Saved Videos" },
  { to: "/history", icon: Clock, label: "History" },
];

const CREATOR_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

const COMPANY_ITEMS = [
  { to: "/about", icon: Info, label: "About" },
  { to: "/privacy", icon: ShieldCheck, label: "Privacy" },
];

export function Sidebar({ collapsed, mobileOpen, onNavigate }) {
  const sidebarClass = [
    "sidebar",
    collapsed ? "sidebar--collapsed" : "",
    mobileOpen ? "sidebar--mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={sidebarClass}>
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
          }
          onClick={onNavigate}
        >
          <item.icon className="sidebar__icon" />
          <span className="sidebar__label">{item.label}</span>
        </NavLink>
      ))}

      <div className="sidebar__divider" />
      <div className="sidebar__section-title">Library</div>

      {LIBRARY_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
          }
          onClick={onNavigate}
        >
          <item.icon className="sidebar__icon" />
          <span className="sidebar__label">{item.label}</span>
        </NavLink>
      ))}

      <div className="sidebar__divider" />
      <div className="sidebar__section-title">Creator</div>

      {CREATOR_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
          }
          onClick={onNavigate}
        >
          <item.icon className="sidebar__icon" />
          <span className="sidebar__label">{item.label}</span>
        </NavLink>
      ))}

      <div className="sidebar__divider" />
      <div className="sidebar__section-title">Lume</div>

      {COMPANY_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `sidebar__item ${isActive ? "sidebar__item--active" : ""}`
          }
          onClick={onNavigate}
        >
          <item.icon className="sidebar__icon" />
          <span className="sidebar__label">{item.label}</span>
        </NavLink>
      ))}

    </aside>
  );
}
