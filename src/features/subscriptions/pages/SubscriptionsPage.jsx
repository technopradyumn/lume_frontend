import React, { useState, useEffect } from "react";
import { getSubscribedChannels, getVideos } from "../../../shared/services/api";
import { useAuth } from "../../../shared/context/AuthContext";
import { VideoGrid } from "../../videos/components/VideoGrid";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { formatViews } from "../../../shared/utils/formatters";

export function SubscriptionsPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [chs, vids] = await Promise.all([
        getSubscribedChannels(user?._id).catch(() => []),
        getVideos().catch(() => []),
      ]);
      setChannels(chs || []);
      setVideos((vids || []).slice(0, 6));
    } catch {
      setChannels([]);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="section-header">
        <div>
          <h1 className="section-title">Subscriptions</h1>
          <p className="section-subtitle">
            {channels.length} channels you follow
          </p>
        </div>
      </div>

      {channels.length > 0 ? (
        <div
          style={{
            display: "flex",
            gap: "var(--space-4)",
            marginBottom: "var(--space-8)",
            overflowX: "auto",
            paddingBottom: "var(--space-2)",
          }}
          className="no-scrollbar"
        >
          {channels.map((ch, i) => (
            <Link
              key={ch._id}
              to={`/channel/${ch.username}`}
              className={`animate-fade-in-up stagger-${i + 1}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--space-2)",
                flexShrink: 0,
              }}
            >
              <UserAvatar user={ch} size="xl" noLink />
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  textAlign: "center",
                  maxWidth: 80,
                }}
                className="text-truncate"
              >
                {ch.fullName}
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-tertiary)" }}>
                {formatViews(ch.subscribersCount)} subs
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No subscriptions yet"
          description="Explore channels across Lume and subscribe to stay updated with your favorite creators."
        />
      )}

      {}
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        title="Latest from Your Subscriptions"
      />
    </div>
  );
}
