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

  const startPull = (clientY, scrollTop) => {
    if (scrollTop === 0) startY.current = clientY;
  };

  const movePull = (clientY, scrollTop) => {
    const next = clientY - startY.current;
    if (startY.current && next > 0 && scrollTop === 0) {
      setDistance(Math.min(next * 0.45, 100));
    }
  };

  return (
    <div
      className="content-scroll"
      onTouchStart={(event) => startPull(event.touches[0].clientY, event.currentTarget.scrollTop)}
      onTouchMove={(event) => {
        movePull(event.touches[0].clientY, event.currentTarget.scrollTop);
      }}
      onTouchEnd={() => { startY.current = 0; finishRefresh(); }}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button === 0) startPull(event.clientY, event.currentTarget.scrollTop);
      }}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" && event.buttons === 1) movePull(event.clientY, event.currentTarget.scrollTop);
      }}
      onPointerUp={() => { startY.current = 0; finishRefresh(); }}
      style={{ overflowY: "auto", height: "100%", overscrollBehavior: "contain" }}
    >
      {(distance > 0 || refreshing) && <div style={{ height: distance, display: "grid", placeItems: "center", color: "var(--text-secondary)", fontSize: 12 }}>{refreshing ? "Refreshing…" : distance >= 70 ? "Release to refresh" : "Pull to refresh"}</div>}
      {children}
    </div>
  );
}
