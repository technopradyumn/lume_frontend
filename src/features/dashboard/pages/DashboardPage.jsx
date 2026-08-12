import React, { useEffect, useState } from "react";
import { Eye, Film, Heart, TrendingUp, Upload, Users } from "lucide-react";
import {
  createVideo,
  getChannelStats,
  getChannelVideos,
} from "../../../shared/services/api";
import { formatViews } from "../../../shared/utils/formatters";
import { UploadModal } from "../../videos/components/UploadModal";
import { VideoGrid } from "../../videos/components/VideoGrid";

const FALLBACK_STATS = {
  totalViews: 128400,
  totalSubscribers: 8420,
  totalVideos: 36,
  totalLikes: 19200,
};

export function DashboardPage() {
  const [stats, setStats] = useState(FALLBACK_STATS);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [nextStats, nextVideos] = await Promise.all([
        getChannelStats().catch(() => null),
        getChannelVideos().catch(() => []),
      ]);
      if (nextStats) setStats(nextStats);
      setVideos(nextVideos || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (videoData) => {
    const newVideo = await createVideo(videoData);
    if (newVideo) {
      setVideos((current) => [newVideo, ...current]);
      const nextStats = await getChannelStats().catch(() => null);
      if (nextStats) setStats(nextStats);
    }
  };

  const statCards = [
    {
      icon: Eye,
      label: "Total Views",
      value: stats.totalViews,
      color: "var(--accent-glow)",
    },
    {
      icon: Users,
      label: "Subscribers",
      value: stats.totalSubscribers,
      color: "var(--success)",
    },
    {
      icon: Film,
      label: "Videos",
      value: stats.totalVideos,
      color: "var(--info)",
    },
    {
      icon: Heart,
      label: "Total Likes",
      value: stats.totalLikes,
      color: "var(--danger)",
    },
  ];

  return (
    <div className="page-container dashboard-overview">
      <div className="section-header">
        <div>
          <h1 className="section-title dashboard-overview__title">
            <TrendingUp size={24} /> Creator Overview
          </h1>
          <p className="section-subtitle">
            Everything important to your channel, in one place.
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => setShowUpload(true)}
        >
          <Upload size={16} /> Upload Video
        </button>
      </div>
      <section
        className="dashboard-overview__stats"
        aria-label="Channel performance"
      >
        {statCards.map((stat, index) => (
          <div
            key={stat.label}
            className={`stat-card animate-fade-in-up stagger-${index + 1}`}
          >
            <div
              className="stat-card__icon"
              style={{ background: `${stat.color}20`, color: stat.color }}
            >
              <stat.icon size={22} />
            </div>
            <div className="stat-card__value">{formatViews(stat.value)}</div>
            <div className="stat-card__label">{stat.label}</div>
          </div>
        ))}
      </section>
      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        title="Your Videos"
        subtitle={
          videos.length
            ? "Manage and track your latest content"
            : "Upload your first video to begin tracking performance"
        }
      />
      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleUpload}
      />
    </div>
  );
}
