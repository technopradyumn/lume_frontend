"use client";

import React from "react";

export interface SkeletonProps {
  type?: "video" | "tweet" | "stat" | "generic";
  height?: string | number;
  width?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({
  type = "video",
  height,
  width,
  borderRadius,
  style,
}: SkeletonProps) {
  if (height || width || borderRadius || style) {
    return (
      <div
        className="shimmer"
        style={{
          height: height || 60,
          width: width || "100%",
          borderRadius: borderRadius || "var(--radius-md)",
          ...style,
        }}
      />
    );
  }

  if (type === "video") {
    return (
      <div
        className="card"
        style={{ pointerEvents: "none", borderColor: "transparent" }}
      >
        <div
          className="shimmer"
          style={{
            aspectRatio: "16/9",
            borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
          }}
        />
        <div
          style={{
            padding: "var(--space-4)",
            display: "flex",
            gap: "var(--space-3)",
          }}
        >
          <div
            className="shimmer"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              className="shimmer"
              style={{ height: 14, marginBottom: 8, width: "90%" }}
            />
            <div className="shimmer" style={{ height: 12, width: "60%" }} />
          </div>
        </div>
      </div>
    );
  }

  if (type === "tweet") {
    return (
      <div
        className="tweet-card"
        style={{ pointerEvents: "none", borderColor: "transparent" }}
      >
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
            marginBottom: "var(--space-3)",
          }}
        >
          <div
            className="shimmer"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              className="shimmer"
              style={{ height: 14, width: "30%", marginBottom: 6 }}
            />
            <div className="shimmer" style={{ height: 12, width: "20%" }} />
          </div>
        </div>
        <div
          className="shimmer"
          style={{ height: 14, marginBottom: 8, width: "100%" }}
        />
        <div className="shimmer" style={{ height: 14, width: "75%" }} />
      </div>
    );
  }

  if (type === "stat") {
    return (
      <div className="stat-card" style={{ pointerEvents: "none" }}>
        <div
          className="shimmer"
          style={{
            width: 44,
            height: 44,
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-4)",
          }}
        />
        <div
          className="shimmer"
          style={{ height: 28, width: "50%", marginBottom: 8 }}
        />
        <div className="shimmer" style={{ height: 14, width: "70%" }} />
      </div>
    );
  }

  return <div className="shimmer" style={{ height: 60, width: "100%" }} />;
}
