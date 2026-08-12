import React from "react";
import { Video, Sparkles } from "lucide-react";

export function EmptyState({
  icon: Icon = Video,
  title = "No videos yet",
  description = "There are no videos available right now. Check back later or upload your first video!",
  actionLabel,
  onAction,
}) {
  return (
    <div
      className="empty-state animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-16) var(--space-6)",
        textAlign: "center",
        margin: "var(--space-6) 0",
      }}
    >
      <div
        style={{
          position: "relative",
          marginBottom: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.05) 70%, transparent 100%)",
            filter: "blur(16px)",
          }}
        />

        <div
          style={{
            width: "84px",
            height: "84px",
            borderRadius: "var(--radius-xl)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--shadow-lg), 0 0 20px rgba(139, 92, 246, 0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-glow)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Icon size={40} strokeWidth={1.5} />
        </div>
      </div>

      <h3
        style={{
          fontSize: "var(--font-size-xl)",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "var(--space-2)",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--text-secondary)",
          maxWidth: "420px",
          lineHeight: 1.6,
          marginBottom: actionLabel ? "var(--space-6)" : 0,
        }}
      >
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          className="btn btn--primary"
          onClick={onAction}
          style={{ marginTop: "var(--space-4)" }}
        >
          <Sparkles size={16} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
