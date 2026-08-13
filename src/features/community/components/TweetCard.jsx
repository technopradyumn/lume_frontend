import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Trash2,
  MoreHorizontal,
  Share2,
  Flag,
  Check,
} from "lucide-react";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import { timeAgo, formatViews } from "../../../shared/utils/formatters";
import { useAuth } from "../../../shared/context/AuthContext";
import {
  addTweetReply,
  toggleSubscription,
} from "../../../shared/services/api";
import { useAnimatedToggle } from "../../../shared/hooks/useAnimatedToggle";
import { ShareMenu } from "../../../shared/components/ShareMenu";

export function TweetCard({
  tweet,
  onLike,
  onDelete,
  onAddReply,
  detailView = false,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const moreMenu = useAnimatedToggle();
  const shareMenu = useAnimatedToggle();
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(
    tweet.owner?.isSubscribed || false,
  );
  const [subscribersCount, setSubscribersCount] = useState(
    tweet.owner?.subscribersCount || 0,
  );
  const [subLoading, setSubLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [moreMenuPosition, setMoreMenuPosition] = useState(null);
  const isOwner = user?._id === tweet.owner?._id;

  const shareUrl = `${window.location.origin}/community/post/${tweet._id}`;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleShared = (message) => {
    if (message === "Link copied to clipboard!") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    showToast(message);
  };

  const handleSubscribeToggle = async (e) => {
    e.stopPropagation();
    if (!user || isOwner || subLoading) return;
    setSubLoading(true);
    const wasSubscribed = isSubscribed;
    setIsSubscribed(!wasSubscribed);
    setSubscribersCount((count) => Math.max(0, count + (wasSubscribed ? -1 : 1)));
    try {
      const result = await toggleSubscription(tweet.owner._id);
      if (typeof result?.isSubscribed === "boolean") setIsSubscribed(result.isSubscribed);
      showToast(
        wasSubscribed
          ? `Unsubscribed from ${tweet.owner?.fullName}`
          : `Subscribed to ${tweet.owner?.fullName}!`,
      );
    } catch (err) {
      setIsSubscribed(wasSubscribed);
      setSubscribersCount((count) => Math.max(0, count + (wasSubscribed ? 1 : -1)));
      console.error("Toggle subscription failed:", err);
    } finally {
      setSubLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      try {
        const updatedTweet = await addTweetReply(tweet._id, replyText.trim());
        if (updatedTweet) {
          onAddReply?.(tweet._id, updatedTweet);
          setReplyText("");
        }
      } catch (err) {
        console.error("Failed to submit reply:", err);
      }
    }
  };

  const handleBodyClick = () => {
    if (!detailView) navigate(`/community/post/${tweet._id}`);
  };

  return (
    <article
      className="tweet-card animate-fade-in-up"
      style={{ position: "relative" }}
    >
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            padding: "10px 20px",
            borderRadius: "var(--radius-full)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            zIndex: 9999,
            fontSize: "var(--font-size-sm)",
            fontWeight: 500,
            border: "1px solid var(--border-default)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {toast}
        </div>
      )}

      <div className="tweet-card__header">
        <UserAvatar user={tweet.owner} size="md" />
        <div className="tweet-card__identity">
          <Link
            to={`/channel/${tweet.owner?.username}`}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tweet-card__author">{tweet.owner?.fullName}</div>
            <div className="tweet-card__handle">
              @{tweet.owner?.username} · {timeAgo(tweet.createdAt)}
            </div>
          </Link>
          <div className="tweet-card__subscribers">
            {formatViews(subscribersCount)} subscribers
          </div>
        </div>

        {user && !isOwner && (
          <button
            className={`btn btn--sm ${isSubscribed ? "btn--secondary" : "btn--primary"}`}
            onClick={handleSubscribeToggle}
            disabled={subLoading}
            style={{
              fontSize: "var(--font-size-xs)",
              padding: "4px 12px",
              flexShrink: 0,
            }}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        )}

        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            className="btn btn--icon-sm btn--ghost"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setMoreMenuPosition({
                right: Math.max(12, window.innerWidth - rect.right),
                bottom: Math.max(12, window.innerHeight - rect.top + 8),
              });
              moreMenu.toggle();
            }}
          >
            <MoreHorizontal size={16} />
          </button>
          {moreMenu.isOpen &&
            moreMenuPosition &&
            createPortal(
              <>
                <div
                  className="popup-backdrop"
                  onClick={(e) => {
                    e.stopPropagation();
                    moreMenu.close();
                  }}
                />
                <div
                  className={`dropdown popup-menu community-action-menu ${moreMenu.isClosing ? "dropdown--closing" : ""}`}
                  style={moreMenuPosition}
                >
                  {isOwner ? (
                    <button
                      className="dropdown__item"
                      style={{ color: "var(--danger)", width: "100%" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(tweet._id);
                        moreMenu.close();
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  ) : (
                    <button
                      className="dropdown__item"
                      style={{ width: "100%" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast("Post reported. We will review it.");
                        moreMenu.close();
                      }}
                    >
                      <Flag size={14} /> Report
                    </button>
                  )}
                </div>
              </>,
              document.body,
            )}
        </div>
      </div>

      <div
        onClick={handleBodyClick}
        style={{ cursor: detailView ? "default" : "pointer" }}
      >
        <p className="tweet-card__content" style={{ whiteSpace: "pre-wrap" }}>
          {tweet.content}
        </p>
        {tweet.image && (
          <div className="tweet-card__media">
            <img src={tweet.image} alt="Post attachment" />
          </div>
        )}
      </div>

      <div className="tweet-card__actions" style={{ position: "relative" }}>
        <button
          className={`tweet-card__action ${tweet.isLiked ? "tweet-card__action--liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onLike?.(tweet._id);
          }}
        >
          <Heart size={16} fill={tweet.isLiked ? "currentColor" : "none"} />
          <span>{tweet.likesCount || 0}</span>
        </button>

        <button
          className={`tweet-card__action ${showReplies ? "tweet-card__action--liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setShowReplies(!showReplies);
          }}
        >
          <MessageCircle size={16} />
          <span>{tweet.replies?.length || 0}</span>
        </button>

        <div style={{ position: "relative" }}>
          <button
            className={`tweet-card__action ${copied ? "tweet-card__action--liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              shareMenu.toggle();
            }}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>

          <ShareMenu
            isOpen={shareMenu.isOpen}
            isClosing={shareMenu.isClosing}
            onClose={shareMenu.close}
            url={shareUrl}
            onShared={handleShared}
            align="left"
          />
        </div>
      </div>

      {showReplies && (
        <div
          style={{
            marginTop: "var(--space-4)",
            borderTop: "1px solid var(--border-default)",
            paddingTop: "var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <form
            style={{
              display: "flex",
              gap: "var(--space-2)",
              alignItems: "center",
            }}
            onSubmit={(e) => {
              e.stopPropagation();
              handleReplySubmit(e);
            }}
          >
            <UserAvatar user={user} size="xs" noLink />
            <input
              className="input"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              style={{ flex: 1, height: 32, fontSize: "var(--font-size-xs)" }}
            />
            <button
              className="btn btn--primary btn--sm"
              type="submit"
              disabled={!replyText.trim()}
              style={{ height: 32 }}
            >
              Reply
            </button>
          </form>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              maxHeight: 240,
              overflowY: "auto",
            }}
          >
            {(tweet.replies || []).map((reply, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "var(--space-2)",
                  alignItems: "flex-start",
                }}
                className="animate-fade-in"
              >
                <UserAvatar user={reply.owner} size="xs" />
                <div
                  style={{
                    flex: 1,
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-2) var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "11px",
                        color: "var(--text-primary)",
                      }}
                    >
                      {reply.owner?.fullName}
                    </span>
                    <span
                      style={{ fontSize: "9px", color: "var(--text-tertiary)" }}
                    >
                      {timeAgo(reply.createdAt)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "var(--font-size-xs)",
                      color: "var(--text-secondary)",
                      margin: 0,
                    }}
                  >
                    {reply.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
