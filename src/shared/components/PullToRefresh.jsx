import React, { useRef, useState } from "react";

export function PullToRefresh({ children, onRefresh }) {
  const startY = useRef(0);
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const finishRefresh = async () => {
    if (refreshing || distance < 70) return setDistance(0);
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
      setDistance(0);
    }
  };

  return (
    <div
      className="content-scroll"
      onTouchStart={(event) => { if (event.currentTarget.scrollTop === 0) startY.current = event.touches[0].clientY; }}
      onTouchMove={(event) => {
        const next = event.touches[0].clientY - startY.current;
        if (startY.current && next > 0 && event.currentTarget.scrollTop === 0) setDistance(Math.min(next * 0.45, 100));
      }}
      onTouchEnd={finishRefresh}
      style={{ overflowY: "auto", height: "100%", overscrollBehavior: "contain" }}
    >
      {(distance > 0 || refreshing) && <div style={{ height: distance, display: "grid", placeItems: "center", color: "var(--text-secondary)", fontSize: 12 }}>{refreshing ? "Refreshing…" : distance >= 70 ? "Release to refresh" : "Pull to refresh"}</div>}
      {children}
    </div>
  );
}
