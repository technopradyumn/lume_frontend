import React from "react";
import { ArrowLeft, Play } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { APP_VERSION } from "../../../shared/config/version";

export function PublicPageShell({ eyebrow, title, intro, children }) {
  const navigate = useNavigate();

  return (
    <div className="public-info-page">
      <header className="public-info-page__header">
        <Link to="/" className="public-info-page__brand" aria-label="Lume home">
          <span className="public-info-page__brand-mark"><Play size={18} fill="currentColor" /></span>
          <span>Lume</span>
        </Link>
        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </header>

      <div className="public-info-page__main">
        <article className="public-info-page__article">
          <div className="public-info-page__hero">
            <span className="badge badge--accent">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{intro}</p>
          </div>
          <div className="public-info-page__content">{children}</div>
        </article>
      </div>

      <footer className="public-info-page__footer">
        <span>© 2026 Lume Platform</span>
        <nav aria-label="Legal links">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
        <span>v{APP_VERSION}</span>
      </footer>
    </div>
  );
}
