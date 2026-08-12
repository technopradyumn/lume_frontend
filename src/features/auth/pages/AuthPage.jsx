import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const isRegister = location.pathname === "/register";

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      if (isRegister) {
        await register(formData);
      } else {
        await login({
          email: formData.email.trim(),
          password: formData.password,
        });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setIsLoading(false);
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
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "var(--radius-lg)",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto var(--space-6)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <h2 className="auth-page__visual-title">Lume</h2>
          <p className="auth-page__visual-subtitle">Watch. Create. Connect.</p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <form className="auth-form animate-fade-in-up" onSubmit={handleSubmit}>
          <button
            type="button"
            className="auth-form__back"
            onClick={() => navigate("/")}
          >
            <ArrowLeft size={16} /> Back to overview
          </button>
          <h1 className="auth-form__title">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="auth-form__subtitle">
            {isRegister
              ? "Join Lume and start sharing your creativity"
              : "Sign in to continue to Lume"}
          </p>

          {error && (
            <div
              style={{
                padding: "var(--space-3) var(--space-4)",
                background: "var(--danger-muted)",
                color: "var(--danger)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--font-size-sm)",
                marginBottom: "var(--space-5)",
              }}
            >
              {error}
            </div>
          )}

          {isRegister && (
            <>
              <div className="auth-form__field">
                <label className="auth-form__label">Full Name</label>
                <input
                  className="input input--lg"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="auth-form__field">
                <label className="auth-form__label">Username</label>
                <input
                  className="input input--lg"
                  name="username"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div className="auth-form__field">
            <label className="auth-form__label">Email</label>
            <input
              className="input input--lg"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form__field">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-2)",
              }}
            >
              <label className="auth-form__label" style={{ marginBottom: 0 }}>
                Password
              </label>
              {!isRegister && (
                <span
                  className="auth-form__link"
                  style={{ fontSize: "var(--font-size-xs)" }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </span>
              )}
            </div>
            <div style={{ position: "relative" }}>
              <input
                className="input input--lg"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-tertiary)",
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--lg"
            disabled={isLoading}
            style={{ width: "100%", marginTop: "var(--space-4)" }}
          >
            {isLoading ? (
              <div
                style={{
                  width: 18,
                  height: 18,
                  border: "2px solid transparent",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }}
              />
            ) : (
              <>
                {isRegister ? "Create Account" : "Sign In"}
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p
            style={{
              textAlign: "center",
              marginTop: "var(--space-6)",
              fontSize: "var(--font-size-sm)",
              color: "var(--text-secondary)",
            }}
          >
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <span
              className="auth-form__link"
              onClick={() => navigate(isRegister ? "/login" : "/register")}
            >
              {isRegister ? "Sign In" : "Create one"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
