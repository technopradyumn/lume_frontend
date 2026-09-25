"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "../../../shared/components/Navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import {
  requestForgotPassword,
  resetPasswordWithOTP,
} from "../../../shared/services/api";

type Step = "request" | "verify" | "success";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [previewOtp, setPreviewOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setStatusMessage("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your account email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await requestForgotPassword(cleanEmail);
      setLoading(false);
      setStep("verify");
      setResendCooldown(60);

      if (res?.previewOtp) {
        setPreviewOtp(res.previewOtp);
        setOtp(res.previewOtp);
        setStatusMessage(
          "Verification code generated! Auto-filled for testing, or check server logs.",
        );
      } else {
        setPreviewOtp(null);
        setStatusMessage(
          "We sent a 6-digit verification code to your email inbox. Please check your spam folder if you don't see it.",
        );
      }
    } catch (err: any) {
      setLoading(false);
      setError(
        err?.response?.data?.message ||
          "Unable to process request. Please make sure the email address is correct.",
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setLoading(true);
      await resetPasswordWithOTP(email.trim(), otp.trim(), newPassword);
      setLoading(false);
      setStep("success");
    } catch (err: any) {
      setLoading(false);
      setError(
        err?.response?.data?.message ||
          "Failed to reset password. Please check your verification code.",
      );
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
            Securely recover and restore access to your Lume creator account
          </p>
        </div>
      </div>

      <div className="auth-page__form-side">
        <div className="auth-form animate-fade-in-up">
          <button
            type="button"
            className="auth-form__back"
            onClick={() => {
              if (step === "verify") {
                setStep("request");
                setError("");
              } else {
                navigate("/");
              }
            }}
          >
            <ArrowLeft size={16} />{" "}
            {step === "verify" ? "Back to email entry" : "Back to overview"}
          </button>

          {/* STEP 3: SUCCESS */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.12)",
                  border: "2px solid var(--success)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto var(--space-5)",
                }}
              >
                <CheckCircle2 size={38} color="var(--success)" />
              </div>
              <h1 className="auth-form__title">Password Reset Complete!</h1>
              <p className="auth-form__subtitle" style={{ marginBottom: "var(--space-6)" }}>
                Your account password has been updated securely. You can now sign in with your new password.
              </p>
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={() => navigate("/login")}
                style={{ width: "100%" }}
              >
                Sign In Now <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 1: REQUEST CODE */}
          {step === "request" && (
            <form onSubmit={handleRequestCode}>
              <h1 className="auth-form__title">Forgot Password?</h1>
              <p className="auth-form__subtitle">
                Enter your registered email address and we will send you a verification code to reset your password.
              </p>

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    color: "var(--danger)",
                    fontSize: "var(--font-size-sm)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div className="auth-form__field">
                <label className="auth-form__label">Email Address</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input input--lg"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    style={{ paddingLeft: 42 }}
                  />
                  <Mail
                    size={18}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-tertiary)",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={loading || !email.trim()}
                style={{ width: "100%", marginTop: "var(--space-4)" }}
              >
                {loading ? "Sending Code..." : "Send Verification Code"}{" "}
                <ArrowRight size={16} />
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
                  style={{ cursor: "pointer" }}
                >
                  Sign In
                </span>
              </p>
            </form>
          )}

          {/* STEP 2: VERIFY CODE & SET NEW PASSWORD */}
          {step === "verify" && (
            <form onSubmit={handleResetPassword}>
              <h1 className="auth-form__title">Set New Password</h1>
              <p className="auth-form__subtitle">
                Enter the code sent to{" "}
                <strong style={{ color: "var(--text-primary)" }}>{email}</strong>{" "}
                and choose a strong new password.
              </p>

              {statusMessage && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(139, 92, 246, 0.12)",
                    border: "1px solid rgba(139, 92, 246, 0.3)",
                    color: "var(--accent-glow)",
                    fontSize: "var(--font-size-sm)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <Sparkles size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{statusMessage}</span>
                </div>
              )}

              {previewOtp && (
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.12)",
                    border: "1px dashed rgba(245, 158, 11, 0.4)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px 14px",
                    marginBottom: "var(--space-4)",
                    fontSize: "var(--font-size-xs)",
                    color: "#FBBF24",
                  }}
                >
                  <strong>Quick Dev Access:</strong> Verification Code is{" "}
                  <code style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>
                    {previewOtp}
                  </code>
                </div>
              )}

              {error && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.25)",
                    color: "var(--danger)",
                    fontSize: "var(--font-size-sm)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              {/* 6-DIGIT OTP FIELD */}
              <div className="auth-form__field">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <label className="auth-form__label" style={{ margin: 0 }}>
                    Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRequestCode()}
                    disabled={resendCooldown > 0 || loading}
                    style={{
                      background: "none",
                      border: "none",
                      color:
                        resendCooldown > 0
                          ? "var(--text-tertiary)"
                          : "var(--accent-glow)",
                      fontSize: "var(--font-size-xs)",
                      cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: 0,
                    }}
                  >
                    <RefreshCw size={12} />
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend Code"}
                  </button>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    className="input input--lg"
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    required
                    disabled={loading}
                    style={{
                      paddingLeft: 42,
                      letterSpacing: "4px",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      fontSize: "var(--font-size-base)",
                    }}
                  />
                  <KeyRound
                    size={18}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-tertiary)",
                    }}
                  />
                </div>
              </div>

              {/* NEW PASSWORD FIELD */}
              <div className="auth-form__field">
                <label className="auth-form__label">New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input input--lg"
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                    style={{ paddingLeft: 42, paddingRight: 42 }}
                  />
                  <Lock
                    size={18}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-tertiary)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM NEW PASSWORD FIELD */}
              <div className="auth-form__field">
                <label className="auth-form__label">Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    className="input input--lg"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    disabled={loading}
                    style={{ paddingLeft: 42 }}
                  />
                  <Lock
                    size={18}
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-tertiary)",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={
                  loading ||
                  otp.length < 6 ||
                  newPassword.length < 8 ||
                  newPassword !== confirmPassword
                }
                style={{ width: "100%", marginTop: "var(--space-4)" }}
              >
                {loading ? "Resetting Password..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
