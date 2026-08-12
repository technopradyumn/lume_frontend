import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import {
  deleteTweet,
  getTweetById,
  getTweets,
  toggleTweetLike,
} from "../../../shared/services/api";
import { TweetCard } from "../components/TweetCard";
import { Skeleton } from "../../../shared/components/Skeleton";
import { EmptyState } from "../../../shared/components/EmptyState";

export function TweetDetailPage() {
  const { tweetId } = useParams();
  const navigate = useNavigate();
  const [tweet, setTweet] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setIsLoading(true);
      try {
        const [post, posts] = await Promise.all([
          getTweetById(tweetId),
          getTweets(),
        ]);
        setTweet(post);
        setRelated(
          (posts || []).filter((item) => item._id !== tweetId).slice(0, 4),
        );
      } catch (error) {
        console.error("Failed to load post:", error);
        setTweet(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadPost();
  }, [tweetId]);

  const handleLike = async (id) => {
    await toggleTweetLike(id);
    setTweet(
      (current) =>
        current && {
          ...current,
          isLiked: !current.isLiked,
          likesCount: (current.likesCount || 0) + (current.isLiked ? -1 : 1),
        },
    );
  };

  const handleDelete = async (id) => {
    await deleteTweet(id);
    navigate("/community");
  };

  return (
    <div className="page-container animate-fade-in">
      <button
        className="btn btn--ghost btn--sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: "var(--space-4)" }}
      >
        <ArrowLeft size={16} /> Back to Community
      </button>
      {isLoading ? (
        <Skeleton height="300px" borderRadius="var(--radius-xl)" />
      ) : tweet ? (
        <div className="player-layout">
          <section style={{ minWidth: 0 }}>
            <div className="section-header">
              <div>
                <h1 className="section-title">Post</h1>
                <p className="section-subtitle">Join the conversation</p>
              </div>
            </div>
            <TweetCard
              tweet={tweet}
              onLike={handleLike}
              onDelete={handleDelete}
              onAddReply={setTweet}
              detailView
            />
          </section>
          <aside className="player-sidebar">
            <h2 className="player-sidebar__title">
              <MessageSquare size={18} /> More from Community
            </h2>
            {related.map((post) => (
              <TweetCard
                key={post._id}
                tweet={post}
                onLike={() => {}}
                onDelete={() => {}}
              />
            ))}
          </aside>
        </div>
      ) : (
        <EmptyState
          title="Post not found"
          description="This community post may have been removed or does not exist."
        />
      )}
    </div>
  );
}
