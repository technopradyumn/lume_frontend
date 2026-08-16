import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Globe,
  MessageSquare,
  Monitor,
  Moon,
  Play,
  PlayCircle,
  Shield,
  Sparkles,
  Sun,
  Video,
} from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useTheme } from "../../../shared/context/ThemeContext";
import { APP_VERSION } from "../../../shared/config/version";

const themeOptions = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];
const demoVideos = [
  {
    title: "Designing products people love",
    meta: "Nova Studio · 84K views",
    duration: "12:42",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "A creative workflow that sticks",
    meta: "Mira Design · 26K views",
    duration: "08:14",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Small ideas, big momentum",
    meta: "Theo Kim · 19K views",
    duration: "15:08",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
  },
];
const communityPhotos = [
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=450&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=450&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=450&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=450&q=80",
];

export function LandingPage() {
  const navigate = useNavigate();
  const { startDemo } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext("2d");
    let frame;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 54 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.55,
      dy: (Math.random() - 0.5) * 0.55,
      alpha: Math.random() * 0.45 + 0.15,
    }));
    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(139, 92, 246, ${particle.alpha})`;
        context.fill();
      });
      frame = requestAnimationFrame(render);
    };
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="landing-page">
      <canvas ref={canvasRef} className="landing-page__particles" />
      <header className="landing-page__header">
        <div className="landing-page__brand">
          <span className="landing-page__brand-icon">
            <Play size={18} fill="white" />
          </span>
          <span className="gradient-text">Lume</span>
        </div>
        <nav className="landing-page__nav">
          <a href="#features">Features</a>
          <a href="#community">Community</a>
          <a href="#creators">Creators</a>
        </nav>
        <div className="landing-page__actions">
          <div className="landing-theme">
            <button
              className="btn btn--ghost btn--icon-sm"
              onClick={() => setShowThemeMenu((open) => !open)}
              aria-label="Choose theme"
              title="Choose theme"
            >
              {resolvedTheme === "dark" ? (
                <Moon size={17} />
              ) : (
                <Sun size={17} />
              )}
            </button>
            {showThemeMenu && (
              <>
                <div
                  className="popup-backdrop"
                  onClick={() => setShowThemeMenu(false)}
                />
                <div className="dropdown popup-menu landing-theme__menu">
                  {themeOptions.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      className={`dropdown__item ${theme === value ? "landing-theme__option--active" : ""}`}
                      onClick={() => {
                        setTheme(value);
                        setShowThemeMenu(false);
                      }}
                    >
                      <Icon size={15} /> {label}
                      {theme === value && <CheckCircle2 size={14} />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>
        </div>
      </header>
      <main className="landing-page__main">
        <section className="landing-hero">
          <div className="landing-hero__badge">
            <Sparkles size={14} /> Video, community & creator tools
          </div>
          <h1>
            Watch, create, and connect{" "}
            <span className="gradient-text">without boundaries.</span>
          </h1>
          <p>
            One beautifully focused place to enjoy videos, join conversations,
            and grow your creative world.
          </p>
          <div className="landing-hero__actions">
            <button
              className="btn btn--primary btn--lg"
              onClick={() => navigate("/register")}
            >
              Explore Lume Free <ArrowRight size={18} />
            </button>
            <button
              className="btn btn--secondary btn--lg"
              onClick={() => {
                startDemo();
                navigate("/demo");
              }}
            >
              Live Demo Access
            </button>
          </div>
        </section>
        <section
          id="features"
          className="landing-showcase"
          aria-labelledby="showcase-heading"
        >
          <div className="landing-showcase__heading">
            <div>
              <span>Explore Lume</span>
              <h2 id="showcase-heading">Six experiences in one home</h2>
            </div>
            <p>A visual preview of the product before you create an account.</p>
          </div>
          <div className="landing-bento">
            <article className="landing-bento__card landing-bento__card--video">
              <div className="landing-bento__eyebrow">
                <Video size={15} /> Video streaming
              </div>
              <div className="landing-video-preview">
                <div className="landing-video-preview__featured">
                  <img
                    src={demoVideos[0].image}
                    alt="Colorful product design workspace"
                  />
                  <span className="landing-video-preview__play">
                    <PlayCircle size={42} fill="white" color="white" />
                  </span>
                  <span className="landing-video-preview__duration">
                    {demoVideos[0].duration}
                  </span>
                </div>
                <div>
                  <h3>{demoVideos[0].title}</h3>
                  <p>
                    {demoVideos[0].meta} · {demoVideos[0].duration}
                  </p>
                  <div className="landing-video-preview__rail">
                    {demoVideos.slice(1).map((video) => (
                      <div key={video.title} className="landing-video-thumb">
                        <img src={video.image} alt="" />
                        <span>{video.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            <article
              id="community"
              className="landing-bento__card landing-bento__card--community"
            >
              <div className="landing-bento__eyebrow">
                <MessageSquare size={15} /> Community
              </div>
              <div className="landing-post-preview">
                <div className="landing-post-preview__avatar">J</div>
                <div>
                  <strong>Jordan Lee</strong>
                  <span>@jordancreates · 12m</span>
                  <p>
                    Just published my first design breakdown on Lume. Would love
                    to hear what you think!
                  </p>
                  <div className="landing-post-preview__reactions">
                    ♡ 286&nbsp;&nbsp; ◌ 42&nbsp;&nbsp; ↗ Share
                  </div>
                </div>
              </div>
              <div
                className="landing-community-marquee"
                aria-label="Community photos"
              >
                <div className="landing-community-marquee__track">
                  {[...communityPhotos, ...communityPhotos].map(
                    (photo, index) => (
                      <img
                        key={`${photo}-${index}`}
                        src={photo}
                        alt="Community members collaborating"
                      />
                    ),
                  )}
                </div>
              </div>
            </article>
            <article
              id="creators"
              className="landing-bento__card landing-bento__card--analytics"
            >
              <div className="landing-bento__eyebrow">
                <BarChart3 size={15} /> Creator analytics
              </div>
              <div className="landing-analytics">
                <div>
                  <span>Weekly views</span>
                  <strong>48.2K</strong>
                  <em>+18.4%</em>
                </div>
                <svg
                  viewBox="0 0 210 74"
                  aria-label="Example weekly views chart"
                >
                  <path
                    d="M2 62 C25 54 30 58 48 46 S78 56 98 34 S133 44 148 25 S180 29 208 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </article>
            <article className="landing-bento__card landing-bento__card--discovery">
              <div className="landing-bento__eyebrow">
                <Sparkles size={15} /> Personalized discovery
              </div>
              <div className="landing-discovery-icons">
                <span>⌁</span>
                <span>◒</span>
                <span>✦</span>
              </div>
              <h3>Find videos that match your interests.</h3>
            </article>
            <article className="landing-bento__card landing-bento__card--security">
              <div className="landing-bento__icon">
                <Shield size={23} />
              </div>
              <h3>Secure and personal</h3>
              <p>
                Profile controls, password tools, and three theme modes that
                follow your preference.
              </p>
            </article>
            <article className="landing-bento__card landing-bento__card--everywhere">
              <div className="landing-bento__icon">
                <Globe size={23} />
              </div>
              <h3>Made for every screen</h3>
              <p>Fluid layouts for your phone, tablet, and desktop.</p>
              <div className="landing-device-dots">
                <span />
                <span />
                <span />
              </div>
            </article>
          </div>
        </section>
      </main>
      <footer className="landing-page__footer">
        <span>© 2026 Lume Platform. All rights reserved.</span>
        <nav aria-label="Company and legal links">
          <Link to="/about">About</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </nav>
        <span>v{APP_VERSION}</span>
      </footer>
    </div>
  );
}
