import React, { useState, useEffect } from "react";
import { getWatchHistory } from "../../../shared/services/api";
import { VideoGrid } from "../components/VideoGrid";
import { Clock } from "lucide-react";

export function HistoryPage() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getWatchHistory();
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
            <Clock size={24} />
            Watch History
          </h1>
          <p className="section-subtitle">Your recently watched videos</p>
        </div>
      </div>
      <VideoGrid videos={videos} isLoading={isLoading} />
    </div>
  );
}
