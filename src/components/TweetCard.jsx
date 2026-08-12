import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Trash2,
  MoreHorizontal,
  Share2,
  Link2,
  Flag,
  Users,
  Check,
  Twitter,
  Facebook,
  Send,
} from "lucide-react";
import { UserAvatar } from "./UserAvatar";
import { timeAgo, formatViews } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";
import { addTweetReply, toggleSubscription } from "../services/api";

const SHARE_OPTIONS = [
  {
    label: "Copy Link",
    icon: Link2,
    action: (url, onCopy) => {
      navigator.clipboard.writeText(url);
      onCopy();
    },
  },
  {
    label: "WhatsApp",
    icon: Send,
    action: (url) =>
      window.open(
        `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
        "_blank",
      ),
  },
  {
    label: "Twitter / X",
    icon: Twitter,
    action: (url) =>
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        "_blank",
      ),
  },
  {
    label: "Facebook",
    icon: Facebook,
    action: (url) =>
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank",
      ),
  },
];

export function TweetCard({ tweet, onLike, onDelete, onAddReply }) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
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
  const isOwner = user?._id === tweet.owner?._id;

  const shareUrl = `${window.location.origin}/community`;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleShare = (option) => {
    if (option.label === "Copy Link") {
      option.action(shareUrl, () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast("🔗 Link copied to clipboard!");
      });
    } else {
      option.action(shareUrl);
    }
    setShowShareMenu(false);
  };

  const handleSubscribeToggle = async () => {
    if (!user || isOwner || subLoading) return;
    setSubLoading(true);
    try {
      await toggleSubscription(tweet.owner._id);
      const wasSubscribed = isSubscribed;
      setIsSubscribed(!wasSubscribed);
      setSubscribersCount((c) => (wasSubscribed ? c - 1 : c + 1));
      showToast(
        wasSubscribed
          ? `Unsubscribed from ${tweet.owner?.fullName}`
          : `Subscribed to ${tweet.owner?.fullName}!`,
      );
    } catch (err) {
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
          }}
        >
          {toast}
        </div>
      )}

      <div className="tweet-card__header">
        <UserAvatar user={tweet.owner} size="md" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link
            to={`/channel/${tweet.owner?.username}`}
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>
              {tweet.owner?.fullName}
            </div>
            <div
              style={{
                fontSize: "var(--font-size-xs)",
                color: "var(--text-tertiary)",
              }}
            >
              @{tweet.owner?.username} · {timeAgo(tweet.createdAt)}
            </div>
          </Link>
          <div
            style={{
              fontSize: "var(--font-size-xs)",
              color: "var(--text-secondary)",
              marginTop: 2,
            }}
          >
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
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontal size={16} />
          </button>
          {showMenu && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 10 }}
                onClick={() => setShowMenu(false)}
              />
              <div className="dropdown" style={{ zIndex: 11 }}>
                {isOwner ? (
                  <button
                    className="dropdown__item"
                    style={{ color: "var(--danger)", width: "100%" }}
                    onClick={() => {
                      onDelete?.(tweet._id);
                      setShowMenu(false);
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                ) : (
                  <button
                    className="dropdown__item"
                    style={{ width: "100%" }}
                    onClick={() => {
                      showToast("Post reported. We will review it.");
                      setShowMenu(false);
                    }}
                  >
                    <Flag size={14} /> Report
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <p className="tweet-card__content" style={{ whiteSpace: "pre-wrap" }}>
        {tweet.content}
      </p>

      {tweet.image && (
        <div
          style={{
            marginTop: "var(--space-3)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--border-default)",
            maxHeight: "360px",
          }}
        >
          <img
            src={tweet.image}
            alt="Attachment"
            style={{ width: "100%", maxHeight: "360px", objectFit: "cover" }}
          />
        </div>
      )}

      <div className="tweet-card__actions" style={{ position: "relative" }}>
        <button
          className={`tweet-card__action ${tweet.isLiked ? "tweet-card__action--liked" : ""}`}
          onClick={() => onLike?.(tweet._id)}
        >
          <Heart size={16} fill={tweet.isLiked ? "currentColor" : "none"} />
          <span>{tweet.likesCount || 0}</span>
        </button>

        <button
          className={`tweet-card__action ${showReplies ? "tweet-card__action--liked" : ""}`}
          onClick={() => setShowReplies(!showReplies)}
        >
          <MessageCircle size={16} />
          <span>{tweet.replies?.length || 0}</span>
        </button>

        <div style={{ position: "relative" }}>
          <button
            className={`tweet-card__action ${copied ? "tweet-card__action--liked" : ""}`}
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>

          {showShareMenu && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 20 }}
                onClick={() => setShowShareMenu(false)}
              />
              <div
                className="dropdown"
                style={{
                  zIndex: 21,
                  bottom: "100%",
                  top: "auto",
                  left: 0,
                  minWidth: 180,
                  marginBottom: "var(--space-2)",
                }}
              >
                {SHARE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.label}
                      className="dropdown__item"
                      onClick={() => handleShare(opt)}
                      style={{ width: "100%" }}
                    >
                      <Icon size={14} /> {opt.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
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
            onSubmit={handleReplySubmit}
          >
            <UserAvatar user={user} size="xs" noLink />
            <input
              className="input"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
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
