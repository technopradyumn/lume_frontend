import React, { useState } from "react";
import { Heart, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { timeAgo } from "../../../shared/utils/formatters";
import { useAuth } from "../../../shared/context/AuthContext";
import { UserAvatar } from "../../../shared/components/UserAvatar";

export function CommentSection({
  comments,
  onAddComment,
  onToggleCommentLike,
  videoId,
}) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(videoId, newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div className="comments">
      <div className="comments__header">
        <h3 className="comments__count">{comments.length} Comments</h3>
      </div>

      <form className="comment-input-box" onSubmit={handleSubmit}>
        <UserAvatar user={user} size="md" noLink />
        <input
          className="input"
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn--primary btn--icon"
          disabled={!newComment.trim()}
          style={{ opacity: newComment.trim() ? 1 : 0.5 }}
        >
          <Send size={16} />
        </button>
      </form>

      <div>
        {comments.map((comment) => (
          <div key={comment._id} className="comment animate-fade-in">
            <UserAvatar user={comment.owner} size="sm" />
            <div className="comment__body">
              <div className="comment__author">
                <Link
                  to={`/channel/${comment.owner?.username}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: 600,
                  }}
                >
                  {comment.owner?.fullName}
                </Link>
                <span className="comment__time">
                  {timeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="comment__text">{comment.content}</p>
              <div className="comment__actions">
                <button
                  className={`tweet-card__action ${comment.isLiked ? "tweet-card__action--active" : ""}`}
                  onClick={() => onToggleCommentLike?.(comment._id)}
                  style={{
                    color: comment.isLiked ? "var(--danger)" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  <Heart
                    size={14}
                    fill={comment.isLiked ? "currentColor" : "none"}
                  />
                  <span>{comment.likesCount || 0}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
