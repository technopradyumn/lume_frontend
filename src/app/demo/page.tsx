"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@/shared/components/Navigation";
import { useAuth } from "@/shared/context/AuthContext";
import { HomePage } from "@/features/videos/pages/HomePage";

export default function DemoPage() {
  const [showPrompt, setShowPrompt] = useState(false);
  const navigate = useNavigate();
  const { endDemo } = useAuth();

  const leaveDemo = (path: string) => {
    endDemo();
    navigate(path);
  };

  const returnToOverview = () => {
    endDemo();
    navigate("/", { replace: true });
  };

  return (
    <div className="demo-home">
      <div className="demo-home__notice">
        <button
          type="button"
          className="btn btn--ghost btn--sm demo-home__back"
          onClick={returnToOverview}
          aria-label="Back to overview"
        >
          <ArrowLeft size={16} /> <span>Overview</span>
        </button>
        <span>Live demo</span>
        <p>You can browse the Home screen. Sign in to interact with Lume.</p>
        <button
          type="button"
          className="btn btn--primary btn--sm demo-home__join"
          onClick={() => setShowPrompt(true)}
        >
          Sign in
        </button>
      </div>
      <main className="demo-home__content">
        <HomePage />
      </main>
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
