import React from "react";
import { Clapperboard, Search, ShieldCheck, Users } from "lucide-react";
import { PublicPageShell } from "../components/PublicPageShell";
import { API_VERSION, APP_VERSION } from "../../../shared/config/version";

const FEATURES = [
  {
    icon: Clapperboard,
    title: "Watch and create",
    text: "Discover videos, publish original work, and manage a creator channel from one responsive workspace.",
  },
  {
    icon: Users,
    title: "Build community",
    text: "Follow creators, share community posts, reply to conversations, and stay connected through notifications.",
  },
  {
    icon: Search,
    title: "Find what matters",
    text: "Search people, creators, videos, and community posts with filters designed for quick discovery.",
  },
  {
    icon: ShieldCheck,
    title: "Stay in control",
    text: "Clear account controls and persistent, secure sessions keep the experience convenient across devices.",
  },
];

export function AboutPage() {
  return (
    <PublicPageShell
      eyebrow="About Lume"
      title="A place to watch, create, and connect."
      intro="Lume is a modern video and community platform built to give viewers and creators a focused, friendly experience on every screen."
    >
      <section>
        <h2>What Lume is for</h2>
        <p>
          Lume brings video publishing, creator profiles, community updates,
          subscriptions, search, and channel analytics into a single product.
          The interface is designed to remain clear and usable from a phone,
          tablet, or desktop.
        </p>
      </section>

      <section className="public-info-page__feature-grid" aria-label="Lume features">
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <div key={title} className="public-info-page__feature">
            <Icon size={21} />
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Product principles</h2>
        <ul>
          <li>Content and controls should remain visible and understandable.</li>
          <li>Creator identity should always lead to the correct profile.</li>
          <li>Search should cover every meaningful content type.</li>
          <li>Privacy and account control should be explained plainly.</li>
        </ul>
      </section>

      <section className="public-info-page__version-card">
        <div><span>Frontend release</span><strong>v{APP_VERSION}</strong></div>
        <div><span>API compatibility</span><strong>{API_VERSION}</strong></div>
      </section>
    </PublicPageShell>
  );
}

