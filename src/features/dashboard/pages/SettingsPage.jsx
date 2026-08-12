import React, { useEffect, useRef, useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Image,
  Moon,
  Sun,
  Shield,
  X,
  Monitor,
} from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useTheme } from "../../../shared/context/ThemeContext";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import {
  changePassword,
  updateAccountDetails,
  updateUserAvatar,
} from "../../../shared/services/api";

export function SettingsPage() {
  const { user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const avatarInputRef = useRef(null);

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const updatedUser = await updateUserAvatar(file);
      if (updatedUser) {
        localStorage.setItem(
          "lume_user",
          JSON.stringify({ ...user, avatar: updatedUser.avatar }),
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateAccountDetails({
        fullName: fullName.trim(),
        email: email.trim(),
      });
      if (updatedUser)
        localStorage.setItem("lume_user", JSON.stringify(updatedUser));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const closePasswordModal = () => {
    if (changingPassword) return;
    setShowPasswordModal(false);
    setPasswordError("");
    setPasswords({ current: "", next: "", confirm: "" });
  };

  useEffect(() => {
    if (!showPasswordModal) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closePasswordModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPasswordModal, changingPassword]);

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPasswordError("");
    if (passwords.next.length < 8)
      return setPasswordError(
        "Your new password must be at least 8 characters.",
      );
    if (passwords.next !== passwords.confirm)
      return setPasswordError("Your new passwords do not match.");
    try {
      setChangingPassword(true);
      await changePassword(passwords.current, passwords.next);
      closePasswordModal();
    } catch (error) {
      setPasswordError(
        error?.response?.data?.message ||
          "Unable to change password. Check your current password and try again.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 720 }}>
      <div className="section-header">
        <div>
          <h1
            className="section-title"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
            }}
          >
            <SettingsIcon size={24} /> Settings
          </h1>
          <p className="section-subtitle">
            Manage your account and preferences
          </p>
        </div>
      </div>
      <div className="settings-section animate-fade-in-up stagger-1">
        <h3 className="settings-section__title">
          <User size={18} /> Profile
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-5)",
            marginBottom: "var(--space-6)",
          }}
        >
          <UserAvatar user={user} size="2xl" />
          <div>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
            >
              <Image size={14} />{" "}
              {uploadingAvatar ? "Uploading…" : "Change Avatar"}
            </button>
            <p className="section-subtitle">JPG, PNG, or WEBP. Max 5MB.</p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <label className="auth-form__label">
            Full Name
            <input
              className="input"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </label>
          <label className="auth-form__label">
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="auth-form__label">
            Username
            <input
              className="input"
              value={`@${user?.username || ""}`}
              disabled
            />
          </label>
          <button
            className="btn btn--primary btn--sm"
            onClick={handleSave}
            disabled={!fullName.trim() || !email.trim()}
            style={{ alignSelf: "flex-start" }}
          >
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
      <div className="settings-section animate-fade-in-up stagger-2">
        <h3 className="settings-section__title">
          {resolvedTheme === "dark" ? <Moon size={18} /> : <Sun size={18} />}{" "}
          Appearance
        </h3>
        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Theme</div>
            <div className="settings-row__description">
              System is the default and follows your device automatically.
            </div>
          </div>
          <div
            className="theme-mode-picker"
            role="group"
            aria-label="Choose theme"
          >
            {[
              ["system", Monitor, "System"],
              ["light", Sun, "Light"],
              ["dark", Moon, "Dark"],
            ].map(([value, Icon, label]) => (
              <button
                key={value}
                className={`theme-mode-picker__option ${theme === value ? "theme-mode-picker__option--active" : ""}`}
                onClick={() => setTheme(value)}
                title={`${label} theme`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="settings-section animate-fade-in-up stagger-3">
        <h3 className="settings-section__title">
          <Shield size={18} /> Security
        </h3>
        <div className="settings-row">
          <div className="settings-row__info">
            <div className="settings-row__label">Change Password</div>
            <div className="settings-row__description">
              Update your password to keep your account secure
            </div>
          </div>
          <button
            className="btn btn--secondary btn--sm"
            onClick={() => setShowPasswordModal(true)}
          >
            <Lock size={14} /> Change
          </button>
        </div>
      </div>
      {showPasswordModal && (
        <div className="modal-overlay" onClick={closePasswordModal}>
          <form
            className="modal"
            onClick={(event) => event.stopPropagation()}
            onSubmit={handleChangePassword}
          >
            <div className="modal__header">
              <div>
                <h2 className="modal__title">Change password</h2>
                <p className="section-subtitle">
                  Use a strong, unique password.
                </p>
              </div>
              <button
                type="button"
                className="btn btn--icon-sm btn--ghost"
                onClick={closePasswordModal}
                aria-label="Close change password dialog"
              >
                <X size={18} />
              </button>
            </div>
            <div
              className="modal__body"
              style={{ display: "grid", gap: "var(--space-4)" }}
            >
              {passwordError && (
                <div className="settings-password-error">{passwordError}</div>
              )}
              <label className="auth-form__label">
                Current password
                <input
                  className="input"
                  type="password"
                  autoComplete="current-password"
                  value={passwords.current}
                  onChange={(event) =>
                    setPasswords({ ...passwords, current: event.target.value })
                  }
                  required
                />
              </label>
              <label className="auth-form__label">
                New password
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.next}
                  onChange={(event) =>
                    setPasswords({ ...passwords, next: event.target.value })
                  }
                  minLength="8"
                  required
                />
              </label>
              <label className="auth-form__label">
                Confirm new password
                <input
                  className="input"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.confirm}
                  onChange={(event) =>
                    setPasswords({ ...passwords, confirm: event.target.value })
                  }
                  minLength="8"
                  required
                />
              </label>
            </div>
            <div className="modal__footer">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={closePasswordModal}
                disabled={changingPassword}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={changingPassword}
              >
                {changingPassword ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
