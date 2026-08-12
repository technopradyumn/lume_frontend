import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  formatViews,
  formatDuration,
  timeAgo,
} from "../../../shared/utils/formatters";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import { Link } from "react-router-dom";
import { BookmarkPlus, BookmarkX, MoreVertical, Play, Flag, Share2 } from "lucide-react";
import { ShareMenu } from "../../../shared/components/ShareMenu";
import { useAnimatedToggle } from "../../../shared/hooks/useAnimatedToggle";
import { getSavedVideos, toggleSavedVideo } from "../../../shared/services/api";
import { useAuth } from "../../../shared/context/AuthContext";

export function VideoCard({ video, index = 0 }) {
  const staggerClass = index < 12 ? `stagger-${index + 1}` : "";
  const channelPath = `/channel/${video.owner?.username}`;
  const shareMenu = useAnimatedToggle();
  const actionMenu = useAnimatedToggle();
  const { user } = useAuth();
  const [toast, setToast] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [actionMenuPosition, setActionMenuPosition] = useState(null);
  const videoPath = `/watch/${video._id}`;

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  useEffect(() => {
    if (!user?._id) {
      setIsSaved(false);
      return undefined;
    }

    let isCurrent = true;
    getSavedVideos()
      .then((savedVideos) => {
        if (isCurrent) {
          setIsSaved(savedVideos.some((saved) => saved?._id === video._id));
        }
      })
      .catch(() => {
        if (isCurrent) setIsSaved(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [user?._id, video._id]);

  const handleSave = async () => {
    if (!user?._id) {
      showToast("Please sign in to save videos.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await toggleSavedVideo(video._id);
      setIsSaved(Boolean(result?.isSaved));
      showToast(result?.isSaved ? "Saved to Watch Later" : "Removed from Watch Later");
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to save video.");
    } finally {
      setIsSaving(false);
      actionMenu.close();
    }
  };

  return (
    <article
      className={`card video-card animate-fade-in-up ${staggerClass}`}
      style={{ position: "relative" }}
    >
      {toast && <div className="video-card__toast">{toast}</div>}
      <Link
        to={videoPath}
        className="card__thumbnail"
        aria-label={`Watch ${video.title}`}
      >
        <img src={video.thumbnail} alt={video.title} loading="lazy" />
        <span className="card__duration">{formatDuration(video.duration)}</span>
        <div className="card__play-overlay">
          <Play size={32} fill="white" color="white" />
        </div>
      </Link>
      <div className="card__body">
        <div style={{ display: "flex", gap: "var(--space-3)" }}>
          <UserAvatar user={video.owner} size="sm" noLink />
          <div style={{ flex: 1, minWidth: 0 }}>
            <Link to={videoPath} className="card__title text-clamp-2">
              {video.title}
            </Link>
            <div className="card__meta">
              <Link
                to={channelPath}
                onClick={(e) => e.stopPropagation()}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <span style={{ fontWeight: 500 }}>
                  {video.owner?.fullName || video.owner?.username}
                </span>
              </Link>
            </div>
            <div className="card__meta">
              <span>{formatViews(video.views)} views</span>
              <span className="card__meta-dot" />
              <span>{timeAgo(video.createdAt)}</span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              top: "var(--space-2)",
              right: "var(--space-2)",
              zIndex: 2,
            }}
          >
            <button
              className="btn btn--icon-sm"
              aria-label={`More actions for ${video.title}`}
              style={{
                background: "rgba(15, 23, 42, 0.76)",
                color: "white",
                backdropFilter: "blur(8px)",
              }}
              onClick={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const menuHeight = 152;
                const gap = 8;
                const edge = 12;
                const opensBelow = rect.bottom + gap + menuHeight <= window.innerHeight - edge;
                setActionMenuPosition({
                  right: Math.max(edge, window.innerWidth - rect.right),
                  top: opensBelow
                    ? rect.bottom + gap
                    : Math.max(edge, rect.top - menuHeight - gap),
                });
                actionMenu.toggle();
              }}
            >
              <MoreVertical size={18} />
            </button>
            {actionMenu.isOpen &&
              actionMenuPosition &&
              createPortal(
                <>
                <div
                  className="popup-backdrop"
                  aria-hidden="true"
                  onClick={actionMenu.close}
                />
                <div
                  className={`dropdown popup-menu card-action-menu ${actionMenu.isClosing ? "dropdown--closing" : ""}`}
                  role="menu"
                  style={{
                    position: "fixed",
                    ...actionMenuPosition,
                    zIndex: "var(--z-dropdown)",
                  }}
                >
                  <button
                    className="dropdown__item"
                    type="button"
                    disabled={isSaving}
                    onClick={handleSave}
                  >
                    {isSaved ? <BookmarkX size={15} /> : <BookmarkPlus size={15} />}
                    {isSaving
                      ? "Saving..."
                      : isSaved
                        ? "Remove from Watch Later"
                        : "Save to Watch Later"}
                  </button>
                  <button
                    className="dropdown__item"
                    type="button"
                    onClick={() => {
                      actionMenu.close();
                      window.setTimeout(shareMenu.open, 160);
                    }}
                  >
                    <Share2 size={15} /> Share
                  </button>
                  <button
                    className="dropdown__item"
                    type="button"
                    onClick={() => {
                      actionMenu.close();
                      showToast("Video reported. We will review it.");
                    }}
                  >
                    <Flag size={15} /> Report
                  </button>
                </div>
                </>,
                document.body,
              )}
            <ShareMenu
              isOpen={shareMenu.isOpen}
              isClosing={shareMenu.isClosing}
              onClose={shareMenu.close}
              url={`${window.location.origin}${videoPath}`}
              onShared={showToast}
              align="right"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
