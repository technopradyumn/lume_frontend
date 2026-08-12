import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getVideoById,
  incrementVideoViews,
  getComments,
  addComment,
  toggleVideoLike,
  toggleCommentLike,
  getVideos,
  getSavedVideos,
  toggleSavedVideo,
  toggleSubscription,
} from "../../../shared/services/api";
import { CommentSection } from "../components/CommentSection";
import { VideoCard } from "../components/VideoCard";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import { formatViews, timeAgo } from "../../../shared/utils/formatters";
import { ArrowLeft, ThumbsUp, Share2, BookmarkPlus, BookmarkX } from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";
import { useAnimatedToggle } from "../../../shared/hooks/useAnimatedToggle";
import { ShareMenu } from "../../../shared/components/ShareMenu";

export function VideoPlayerPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCountedView, setHasCountedView] = useState(false);
  const [savedVideo, setSavedVideo] = useState(false);
  const shareMenu = useAnimatedToggle();
  const [toast, setToast] = useState({ message: "", visible: false });

  useEffect(() => {
    setHasCountedView(false);
    loadVideoData();
  }, [videoId]);

  const showToast = (msg) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  };

  const loadVideoData = async () => {
    setIsLoading(true);
    try {
      const [vid, coms, allVids, savedVideos] = await Promise.all([
        getVideoById(videoId).catch(() => null),
        getComments(videoId).catch(() => []),
        getVideos().catch(() => []),
        user?._id ? getSavedVideos().catch(() => []) : [],
      ]);
      setVideo(vid);
      setComments(coms || []);
      setRecommended(
        (allVids || []).filter((v) => v?._id !== videoId).slice(0, 6),
      );
      setSavedVideo(savedVideos.some((saved) => saved?._id === videoId));
    } catch (err) {
      console.error("Error loading video data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?._id) {
      showToast("Please login to save videos");
      return;
    }

    try {
      const result = await toggleSavedVideo(videoId);
      setSavedVideo(result?.isSaved ?? !savedVideo);
      showToast(result?.isSaved ? "Saved to Watch Later" : "Removed from Watch Later");
    } catch (err) {
      console.error(err);
      showToast("Failed to update saved videos");
    }
  };

  const handleSubscribe = async () => {
    if (!user?._id) {
      showToast("Please login to subscribe");
      return;
    }
    try {
      const result = await toggleSubscription(video.owner?._id);
      if (result) {
        const change = result.isSubscribed ? 1 : -1;
        setVideo({
          ...video,
          owner: {
            ...video.owner,
            isSubscribed: result.isSubscribed,
            subscribersCount: (video.owner.subscribersCount || 0) + change,
          },
        });
        showToast(
          result.isSubscribed
            ? "Subscribed to channel!"
            : "Unsubscribed from channel.",
        );
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to toggle subscription");
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    const updated = await toggleCommentLike(commentId);
    if (updated) {
      setComments(
        comments.map((c) =>
          c._id === commentId
            ? { ...c, isLiked: updated.isLiked, likesCount: updated.likesCount }
            : c,
        ),
      );
    }
  };

  const handleLike = async () => {
    const updated = await toggleVideoLike(videoId);
    if (updated)
      setVideo({
        ...video,
        isLiked: updated.isLiked,
        likesCount: updated.likesCount,
      });
  };

  const handleAddComment = async (vid, content) => {
    const newComment = await addComment(vid, content);
    setComments([newComment, ...comments]);
  };

  if (isLoading || !video) {
    return (
      <div className="page-container">
        <div
          className="shimmer"
          style={{
            aspectRatio: "16/9",
            borderRadius: "var(--radius-xl)",
            marginBottom: "var(--space-6)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <button
        className="btn btn--ghost btn--sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "var(--space-4)" }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="player-layout">
        <div>
          <div className="player-container">
            <video
              src={
                video.videoFile ||
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              }
              controls
              autoPlay
              poster={video.thumbnail}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "var(--radius-lg)",
              }}
              onPlay={() => {
                if (!hasCountedView) {
                  setHasCountedView(true);
                  incrementVideoViews(videoId)
                    .then((res) => {
                      if (res?.views) {
                        setVideo((prev) =>
                          prev ? { ...prev, views: res.views } : prev,
                        );
                      }
                    })
                    .catch(() => {});
                }
              }}
              onError={(e) => {
                if (
                  e.target.src !==
                  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                ) {
                  e.target.src =
                    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
                  e.target.play().catch(() => {});
                }
              }}
            />
          </div>

          <div className="player-info">
            <h1 className="player-info__title">{video.title}</h1>

            <div className="player-info__meta">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-4)",
                }}
              >
                <Link
                  to={`/channel/${video.owner?.username}`}
                  className="player-info__channel"
                >
                  <UserAvatar user={video.owner} size="lg" noLink />
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "var(--font-size-sm)",
                      }}
                    >
                      {video.owner?.fullName}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {formatViews(video.owner?.subscribersCount || 0)}{" "}
                      subscribers
                    </div>
                  </div>
                </Link>
                {user?._id !== video.owner?._id && (
                  <button
                    className={`btn btn--sm ${video.owner?.isSubscribed ? "btn--secondary" : "btn--primary"}`}
                    onClick={handleSubscribe}
                    style={{ height: 32, padding: "0 var(--space-4)" }}
                  >
                    {video.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                )}
              </div>

              <div
                className="player-info__actions"
                style={{ position: "relative" }}
              >
                <button
                  className={`btn btn--sm ${video.isLiked ? "btn--primary" : "btn--secondary"}`}
                  onClick={handleLike}
                >
                  <ThumbsUp
                    size={16}
                    fill={video.isLiked ? "currentColor" : "none"}
                  />
                  {formatViews(video.likesCount || 0)}
                </button>
                <div style={{ position: "relative" }}>
                  <button
                    className="btn btn--sm btn--secondary"
                    onClick={shareMenu.toggle}
                  >
                    <Share2 size={16} /> Share
                  </button>
                  <ShareMenu
                    isOpen={shareMenu.isOpen}
                    isClosing={shareMenu.isClosing}
                    onClose={shareMenu.close}
                    url={window.location.href}
                    onShared={showToast}
                    align="right"
                  />
                </div>
                <button
                  className={`btn btn--sm ${savedVideo ? "btn--primary" : "btn--secondary"}`}
                  onClick={handleSave}
                >
                  {savedVideo ? (
                    <BookmarkX size={16} fill="currentColor" />
                  ) : (
                    <BookmarkPlus size={16} />
                  )}
                  {savedVideo ? "Remove" : "Save"}
                </button>
              </div>
            </div>

            <div
              style={{
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-lg)",
                padding: "var(--space-4)",
                marginTop: "var(--space-4)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  marginBottom: "var(--space-2)",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 600,
                }}
              >
                <span>{formatViews(video.views)} views</span>
                <span>{timeAgo(video.createdAt)}</span>
              </div>
              <p
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {video.description}
              </p>
            </div>

            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              onToggleCommentLike={handleToggleCommentLike}
              videoId={videoId}
            />
          </div>
        </div>

        <aside className="player-sidebar">
          <h3 className="player-sidebar__title">Up Next</h3>
          {recommended.map((vid, i) => (
            <VideoCard key={vid._id} video={vid} index={i} />
          ))}
        </aside>
      </div>
      {toast.visible && (
        <div
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top, 0px) + var(--navbar-height) + var(--space-4))",
            right: 24,
            background: "var(--accent-gradient)",
            color: "white",
            padding: "12px 24px",
            borderRadius: "var(--radius-lg)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
            zIndex: "var(--z-toast)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            animation: "fade-in-up 0.2s ease-out",
          }}
        >
          <span style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
