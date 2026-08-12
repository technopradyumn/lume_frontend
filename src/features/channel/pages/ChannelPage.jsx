import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getUserChannelProfile,
  getVideos,
  getTweets,
  toggleSubscription,
  toggleTweetLike,
} from "../../../shared/services/api";
import { VideoGrid } from "../../videos/components/VideoGrid";
import { TweetCard } from "../../community/components/TweetCard";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import { formatViews } from "../../../shared/utils/formatters";
import { UserPlus, UserCheck } from "lucide-react";

export function ChannelPage() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChannel();
  }, [username]);

  const loadChannel = async () => {
    setIsLoading(true);
    try {
      const ch = await getUserChannelProfile(username).catch(() => null);
      if (ch) {
        const [vids, tws] = await Promise.all([
          getVideos("", "", ch._id).catch(() => []),
          getTweets(ch._id).catch(() => []),
        ]);
        setChannel(ch);
        setVideos((vids || []).slice(0, 6));
        setTweets((tws || []).slice(0, 4));
      } else {
        setChannel(null);
      }
    } catch {
      setChannel(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    await toggleSubscription(channel?._id);
    setChannel({ ...channel, isSubscribed: !channel?.isSubscribed });
  };

  const handleLikeTweet = async (tweetId) => {
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

  const handleAddReply = (tweetId, updatedTweet) => {
    setTweets(tweets.map((t) => (t._id === tweetId ? updatedTweet : t)));
  };

  if (isLoading || !channel) {
    return (
      <div className="page-container">
        <div
          className="shimmer"
          style={{
            height: 240,
            borderRadius: "var(--radius-xl)",
            marginBottom: "var(--space-6)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="channel-banner">
        <img
          className="channel-banner__image"
          src={
            channel.coverImage ||
            "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=1600&q=80"
          }
          alt="Channel banner"
        />
        <div className="channel-banner__gradient" />
      </div>

      <div className="channel-info">
        <UserAvatar user={channel} size="2xl" />
        <div className="channel-info__details">
          <h1 className="channel-info__name">{channel.fullName}</h1>
          <p className="channel-info__handle">@{channel.username}</p>
          <div className="channel-info__stats">
            <span>
              {formatViews(channel.subscribersCount || 0)} subscribers
            </span>
            <span>•</span>
            <span>{formatViews(channel.totalViews || 0)} views</span>
            <span>•</span>
            <span>{videos.length} videos</span>
          </div>
        </div>
        <button
          className={`btn ${channel.isSubscribed ? "btn--secondary" : "btn--primary"}`}
          onClick={handleSubscribe}
        >
          {channel.isSubscribed ? (
            <>
              <UserCheck size={16} /> Subscribed
            </>
          ) : (
            <>
              <UserPlus size={16} /> Subscribe
            </>
          )}
        </button>
      </div>

      <div className="tabs" style={{ marginTop: "var(--space-6)" }}>
        {["videos", "community", "about"].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "videos" && (
        <VideoGrid videos={videos} isLoading={false} />
      )}

      {activeTab === "community" && (
        <div
          style={{
            maxWidth: 680,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet._id}
              tweet={tweet}
              onLike={handleLikeTweet}
              onAddReply={handleAddReply}
            />
          ))}
        </div>
      )}

      {activeTab === "about" && (
        <div style={{ maxWidth: 680 }}>
          <div className="settings-section">
            <h3 className="settings-section__title">About</h3>
            <p
              style={{
                fontSize: "var(--font-size-sm)",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
              }}
            >
              Welcome to {channel.fullName}'s channel. Creating content about
              technology, programming, and digital creativity.
            </p>
            <div
              style={{
                marginTop: "var(--space-4)",
                display: "flex",
                gap: "var(--space-6)",
                fontSize: "var(--font-size-sm)",
                color: "var(--text-secondary)",
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  {formatViews(channel.subscribersCount || 0)}
                </span>{" "}
                subscribers
              </div>
              <div>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  {formatViews(channel.totalViews || 0)}
                </span>{" "}
                views
              </div>
              <div>
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
                  {videos.length}
                </span>{" "}
                videos
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
