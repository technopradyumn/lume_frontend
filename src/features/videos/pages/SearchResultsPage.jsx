import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Search, UserRound, Video, MessageSquare } from "lucide-react";
import { searchContent } from "../../../shared/services/api";
import { UserAvatar } from "../../../shared/components/UserAvatar";
import { VideoGrid } from "../components/VideoGrid";
import { TweetCard } from "../../community/components/TweetCard";

const emptyResults = {
  people: [],
  videos: [],
  posts: [],
  counts: { all: 0, people: 0, videos: 0, posts: 0 },
};

const filters = [
  { value: "all", label: "All" },
  { value: "people", label: "People" },
  { value: "videos", label: "Videos" },
  { value: "posts", label: "Community" },
];

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q")?.trim() || "";
  const requestedType = searchParams.get("type") || "all";
  const activeFilter = filters.some(({ value }) => value === requestedType)
    ? requestedType
    : "all";
  const [results, setResults] = useState(emptyResults);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setResults(emptyResults);
      setIsLoading(false);
      return;
    }

    try {
      const parsed = new URL(query, window.location.origin);
      if (
        parsed.origin === window.location.origin &&
        (/^\/watch\/[^/]+$/.test(parsed.pathname) ||
          /^\/community\/post\/[^/]+$/.test(parsed.pathname) ||
          /^\/channel\/[^/]+$/.test(parsed.pathname))
      ) {
        navigate(`${parsed.pathname}${parsed.search}`, { replace: true });
        return;
      }
    } catch {
      // Treat malformed URLs as ordinary search text.
    }

    let isCurrent = true;
    setIsLoading(true);
    setError("");
    searchContent(query, "all")
      .then((data) => {
        if (isCurrent) setResults({ ...emptyResults, ...data });
      })
      .catch((requestError) => {
        if (isCurrent) {
          setResults(emptyResults);
          setError(requestError?.response?.data?.message || "Search is unavailable right now.");
        }
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [navigate, query]);

  const chooseFilter = (type) => {
    const next = new URLSearchParams(searchParams);
    if (type === "all") next.delete("type");
    else next.set("type", type);
    setSearchParams(next);
  };

  const showPeople = activeFilter === "all" || activeFilter === "people";
  const showVideos = activeFilter === "all" || activeFilter === "videos";
  const showPosts = activeFilter === "all" || activeFilter === "posts";
  const total = results.counts?.all ?? 0;
  const visibleTotal = activeFilter === "all" ? total : (results.counts?.[activeFilter] ?? 0);

  return (
    <div className="page-container search-results-page">
      <div className="section-header search-results-page__header">
        <div>
          <h1 className="section-title search-results-page__title">
            <Search size={24} /> Search results
          </h1>
          <p className="section-subtitle" aria-live="polite">
            {isLoading
              ? "Searching people, videos, and community posts…"
              : `${visibleTotal} ${visibleTotal === 1 ? "result" : "results"} for “${query}”`}
          </p>
        </div>
      </div>

      <div className="search-filters" role="tablist" aria-label="Search result filters">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={activeFilter === filter.value}
            className={`search-filter ${activeFilter === filter.value ? "search-filter--active" : ""}`}
            onClick={() => chooseFilter(filter.value)}
          >
            {filter.label}
            {!isLoading && <span>{results.counts?.[filter.value] || 0}</span>}
          </button>
        ))}
      </div>

      {error && <div className="search-results-page__error">{error}</div>}

      {!isLoading && !error && visibleTotal === 0 && (
        <div className="empty-state search-empty-state">
          <Search size={30} />
          <h2 className="empty-state__title">No matches yet</h2>
          <p className="empty-state__description">
            Try a username, creator name, video title, topic, or words from a community post.
          </p>
        </div>
      )}

      {showPeople && results.people.length > 0 && (
        <section className="search-section" aria-labelledby="people-results-heading">
          <div className="search-section__heading">
            <h2 id="people-results-heading"><UserRound size={19} /> People</h2>
            <span>{results.people.length}</span>
          </div>
          <div className="search-people-grid">
            {results.people.map((person) => (
              <Link key={person._id} to={`/channel/${person.username}`} className="search-person-card">
                <UserAvatar user={person} size="lg" noLink />
                <span className="search-person-card__identity">
                  <strong>{person.fullName}</strong>
                  <small>@{person.username}</small>
                </span>
                <span className="search-person-card__open">View profile</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {showVideos && results.videos.length > 0 && (
        <section className="search-section" aria-labelledby="video-results-heading">
          <div className="search-section__heading">
            <h2 id="video-results-heading"><Video size={19} /> Videos</h2>
            <span>{results.videos.length}</span>
          </div>
          <VideoGrid videos={results.videos} isLoading={false} />
        </section>
      )}

      {showPosts && results.posts.length > 0 && (
        <section className="search-section search-post-results" aria-labelledby="post-results-heading">
          <div className="search-section__heading">
            <h2 id="post-results-heading"><MessageSquare size={19} /> Community posts</h2>
            <span>{results.posts.length}</span>
          </div>
          {results.posts.map((post) => (
            <TweetCard key={post._id} tweet={post} />
          ))}
        </section>
      )}
    </div>
  );
}
