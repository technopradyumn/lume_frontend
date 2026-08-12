import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__visual">
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 30% 50%, rgba(139,92,246,0.3), transparent 60%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.3), transparent 60%)",
          }}
        />
        <div className="auth-page__visual-content">
          <h2 className="auth-page__visual-title">Reset Password</h2>
          <p className="auth-page__visual-subtitle">
            Recover access to your Lume account
          </p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <div className="auth-form animate-fade-in-up">
          <button
            type="button"
            className="auth-form__back"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} /> Back to overview
          </button>
          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <CheckCircle2
                size={48}
                color="var(--success)"
                style={{ margin: "0 auto var(--space-4)" }}
              />
              <h1 className="auth-form__title">Reset Link Sent</h1>
              <p className="auth-form__subtitle">
                We sent a password reset link to{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {email}
                </strong>
                . Please check your inbox.
              </p>
              <button
                className="btn btn--primary btn--lg"
                onClick={() => navigate("/login")}
                style={{ width: "100%", marginTop: "var(--space-4)" }}
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className="auth-form__title">Forgot Password?</h1>
              <p className="auth-form__subtitle">
                Enter your email address below and we'll send you instructions
                to reset your password.
              </p>

              <div className="auth-form__field">
                <label className="auth-form__label">Email Address</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input input--lg"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--lg"
                style={{ width: "100%", marginTop: "var(--space-4)" }}
              >
                Send Reset Link <ArrowRight size={16} />
              </button>

              <p
                style={{
                  textAlign: "center",
                  marginTop: "var(--space-6)",
                  fontSize: "var(--font-size-sm)",
                  color: "var(--text-secondary)",
                }}
              >
                Remembered your password?{" "}
                <span
                  className="auth-form__link"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
