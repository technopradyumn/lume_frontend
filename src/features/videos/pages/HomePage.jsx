import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryPills } from "../../../shared/components/CategoryPills";
import { VideoGrid } from "../components/VideoGrid";
import { getVideos } from "../../../shared/services/api";
import { Play, TrendingUp } from "lucide-react";
import { formatViews } from "../../../shared/utils/formatters";

const CATEGORIES = [
  "All",
  "Coding",
  "Design",
  "Gaming",
  "AI & Tech",
  "Music",
  "Vlogs",
];

export function HomePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, [selectedCategory]);

  const loadVideos = async () => {
    setIsLoading(true);
    const category = selectedCategory === "All" ? "" : selectedCategory;
    const data = await getVideos("", category);
    setVideos(data);
    setIsLoading(false);
  };

  const heroVideo = videos[0];

  return (
    <div className="page-container">
      <CategoryPills
        categories={CATEGORIES}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {heroVideo && !isLoading && (
        <div
          className="hero animate-fade-in"
          onClick={() => navigate(`/watch/${heroVideo._id}`)}
        >
          <img
            className="hero__image"
            src={heroVideo.thumbnail}
            alt={heroVideo.title}
          />
          <div className="hero__overlay">
            <div className="hero__badge">
              <TrendingUp size={12} />
              Featured
            </div>
            <h1 className="hero__title">{heroVideo.title}</h1>
            <p className="hero__subtitle">{heroVideo.description}</p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
                marginTop: "var(--space-4)",
              }}
            >
              <button
                className="btn btn--primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/watch/${heroVideo._id}`);
                }}
              >
                <Play size={16} fill="white" /> Watch Now
              </button>
              <span
                style={{
                  fontSize: "var(--font-size-sm)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {formatViews(heroVideo.views)} views
              </span>
            </div>
          </div>
        </div>
      )}

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        title={
          selectedCategory === "All"
            ? "Trending Videos"
            : `${selectedCategory} Videos`
        }
        subtitle={`${videos.length} videos`}
      />
    </div>
  );
}
