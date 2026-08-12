import React from "react";
import { VideoCard } from "./VideoCard";
import { Skeleton } from "../../../shared/components/Skeleton";
import { EmptyState } from "../../../shared/components/EmptyState";
import { Video } from "lucide-react";

export function VideoGrid({ videos, isLoading, title, subtitle }) {
  return (
    <div>
      {(title || subtitle) && (
        <div className="section-header">
          <div>
            {title && <h2 className="section-title">{title}</h2>}
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      {isLoading ? (
        <div className="video-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} type="video" />
          ))}
        </div>
      ) : videos.length > 0 ? (
        <div className="video-grid">
          {videos.map((video, i) => (
            <VideoCard key={video._id} video={video} index={i} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Video}
          title="No videos found"
          description="We couldn't find any videos here. Be the first to upload content!"
        />
      )}
    </div>
  );
}
