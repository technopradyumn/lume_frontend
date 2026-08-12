import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTweets, getVideos } from "../../../shared/services/api";
import { VideoGrid } from "../components/VideoGrid";
import { Search } from "lucide-react";
import { TweetCard } from "../../community/components/TweetCard";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (query) {
      try {
        const parsed = new URL(query, window.location.origin);
        if (
          parsed.origin === window.location.origin &&
          (/^\/watch\/[^/]+$/.test(parsed.pathname) ||
            /^\/community\/post\/[^/]+$/.test(parsed.pathname))
        ) {
          navigate(`${parsed.pathname}${parsed.search}`, { replace: true });
          return;
        }
      } catch {
      }
      searchVideos();
    }
  }, [query]);

  const searchVideos = async () => {
    setIsLoading(true);
    try {
      const [videoData, tweetData] = await Promise.all([
        getVideos(query),
        getTweets().catch(() => []),
      ]);
      setVideos(videoData);
      const term = query.toLowerCase();
      setPosts(
        tweetData.filter((post) =>
          `${post.content || ""} ${post.owner?.fullName || ""} ${post.owner?.username || ""}`
            .toLowerCase()
            .includes(term),
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
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
            <Search size={24} />
            Search Results
          </h1>
          <p className="section-subtitle">
            {isLoading
              ? "Searching..."
              : `${videos.length} results for "${query}"`}
          </p>
        </div>
      </div>
      <VideoGrid videos={videos} isLoading={isLoading} title="Videos" />
      {!isLoading && posts.length > 0 && (
        <section className="search-post-results">
          <div className="section-header">
            <div>
              <h2 className="section-title">Community posts</h2>
              <p className="section-subtitle">{posts.length} matching posts</p>
            </div>
          </div>
          {posts.map((post) => (
            <TweetCard key={post._id} tweet={post} />
          ))}
        </section>
      )}
    </div>
  );
}
