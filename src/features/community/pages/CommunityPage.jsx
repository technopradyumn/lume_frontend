import React, { useState, useEffect } from "react";
import {
  getTweets,
  createTweet,
  toggleTweetLike,
  deleteTweet,
} from "../../../shared/services/api";
import { TweetCard } from "../components/TweetCard";
import { TweetComposer } from "../components/TweetComposer";
import { Skeleton } from "../../../shared/components/Skeleton";
import { EmptyState } from "../../../shared/components/EmptyState";
import { MessageSquare } from "lucide-react";

export function CommunityPage() {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTweets();
  }, []);

  const loadTweets = async () => {
    setIsLoading(true);
    try {
      const data = await getTweets();
      setTweets(data);
    } catch (error) {
      console.error("Failed to load community posts:", error);
      setTweets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTweet = async (content, imageFile) => {
    const newTweet = await createTweet(content, imageFile);
    setTweets((current) => [newTweet, ...current]);
  };

  const handleLike = async (tweetId) => {
    const previous = tweets;
    setTweets((current) =>
      current.map((t) =>
        t._id === tweetId
          ? {
            ...t,
              isLiked: !t.isLiked,
              likesCount: Math.max(0, (t.likesCount || 0) + (t.isLiked ? -1 : 1)),
            }
          : t,
      ),
    );
    try {
      await toggleTweetLike(tweetId);
    } catch (error) {
      setTweets(previous);
      console.error("Failed to like post:", error);
    }
  };

  const handleDelete = async (tweetId) => {
    await deleteTweet(tweetId);
    setTweets((current) => current.filter((t) => t._id !== tweetId));
  };

  const handleAddReply = (tweetId, updatedTweet) => {
    setTweets((current) => current.map((t) => (t._id === tweetId ? updatedTweet : t)));
  };

  return (
    <div className="page-container" style={{ maxWidth: 680 }}>
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
            <MessageSquare size={24} className="gradient-text" />
            Community
          </h1>
          <p className="section-subtitle">
            Share thoughts, updates, and connect with creators
          </p>
        </div>
      </div>

      <TweetComposer onSubmit={handleCreateTweet} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} type="tweet" />
          ))
        ) : tweets.length > 0 ? (
          tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              onLike={handleLike}
              onDelete={handleDelete}
              onAddReply={handleAddReply}
            />
          ))
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No posts yet"
            description="Be the first to share something with the community!"
          />
        )}
      </div>
    </div>
  );
}
