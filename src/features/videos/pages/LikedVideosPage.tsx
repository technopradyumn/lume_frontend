"use client";

import React, { useState, useEffect } from "react";
import { getLikedVideos, VideoItem } from "../../../shared/services/api";
import { VideoGrid } from "../components/VideoGrid";
import { Heart } from "lucide-react";

export function LikedVideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLikedVideos();
  }, []);

  const loadLikedVideos = async () => {
    setIsLoading(true);
    try {
      const data = await getLikedVideos();
      setVideos(data || []);
    } catch {
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
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
            <Heart
              size={24}
              style={{ color: "var(--danger)" }}
              fill="var(--danger)"
            />
            Liked Videos
          </h1>
          <p className="section-subtitle">
            {videos.length} videos you&apos;ve liked
          </p>
        </div>
      </div>
      <VideoGrid videos={videos} isLoading={isLoading} />
    </div>
  );
}
