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
    const data = await getTweets();
    setTweets(data);
    setIsLoading(false);
  };

  const handleCreateTweet = async (content, imageFile) => {
    const newTweet = await createTweet(content, imageFile);
    setTweets([newTweet, ...tweets]);
  };

  const handleLike = async (tweetId) => {
    await toggleTweetLike(tweetId);
    setTweets(
      tweets.map((t) =>
        t._id === tweetId
          ? {
              ...t,
              isLiked: !t.isLiked,
              likesCount: t.likesCount + (t.isLiked ? -1 : 1),
            }
          : t,
      ),
    );
  };

  const handleDelete = async (tweetId) => {
    await deleteTweet(tweetId);
    setTweets(tweets.filter((t) => t._id !== tweetId));
  };

  const handleAddReply = (tweetId, updatedTweet) => {
    setTweets(tweets.map((t) => (t._id === tweetId ? updatedTweet : t)));
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
