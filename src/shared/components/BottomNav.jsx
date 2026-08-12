import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Compass, Users, Heart, Plus } from "lucide-react";

export function BottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
        }
      >
        <Home className="bottom-nav__icon" />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/community"
        className={({ isActive }) =>
          `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
        }
      >
        <Compass className="bottom-nav__icon" />
        <span>Community</span>
      </NavLink>
      <button
        className="bottom-nav__item"
        onClick={() => navigate("/dashboard")}
        style={{
          background: "var(--accent-gradient)",
          borderRadius: "var(--radius-md)",
          color: "white",
          width: 48,
          height: 36,
        }}
      >
        <Plus className="bottom-nav__icon" />
      </button>
      <NavLink
        to="/subscriptions"
        className={({ isActive }) =>
          `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
        }
      >
        <Users className="bottom-nav__icon" />
        <span>Subs</span>
      </NavLink>
      <NavLink
        to="/liked"
        className={({ isActive }) =>
          `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`
        }
      >
        <Heart className="bottom-nav__icon" />
        <span>Liked</span>
      </NavLink>
    </nav>
  );
}
