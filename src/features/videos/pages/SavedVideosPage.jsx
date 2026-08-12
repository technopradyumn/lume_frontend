import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { getSavedVideos } from "../../../shared/services/api";
import { EmptyState } from "../../../shared/components/EmptyState";
import { VideoCard } from "../components/VideoCard";

export function SavedVideosPage() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setError("");
    getSavedVideos()
      .then((data) => setVideos(Array.isArray(data) ? data : []))
      .catch((requestError) => {
        setVideos([]);
        setError(
          requestError?.response?.data?.message ||
            "Unable to load saved videos. Please try again.",
        );
      })
      .finally(() => setIsLoading(false));
  }, [location.key]);

  if (isLoading) {
    return <div className="page-container"><div className="shimmer" style={{ height: 240 }} /></div>;
  }

  return (
    <div className="page-container">
      <div className="section-header">
        <div>
          <h1 className="section-title">Saved Videos</h1>
          <p className="section-subtitle">{videos.length} videos you've saved to Watch Later</p>
        </div>
      </div>
      {error && <p className="section-subtitle" role="alert">{error}</p>}
      {videos.length ? (
        <div className="video-grid">
          {videos.map((video, index) => <VideoCard key={video._id} video={video} index={index} />)}
        </div>
      ) : (
        <EmptyState icon={Bookmark} title="No saved videos yet" description="Save videos to watch them later." />
      )}
    </div>
  );
}
