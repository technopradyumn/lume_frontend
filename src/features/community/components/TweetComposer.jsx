import React, { useState, useRef } from "react";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { useAuth } from "../../../shared/context/AuthContext";

export function TweetComposer({ onSubmit }) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef(null);
  const maxLength = 500;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim(), imageFile);
      setContent("");
      clearImage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="tweet-card" style={{ marginBottom: "var(--space-6)" }}>
      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <div className="avatar avatar--md avatar--gradient-border">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.fullName} />
          ) : (
            <div className="avatar__fallback">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <textarea
            className="textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
            onKeyDown={handleKeyDown}
            rows={3}
            style={{ resize: "none", minHeight: "auto" }}
          />

          {imagePreview && (
            <div
              style={{
                position: "relative",
                marginTop: "var(--space-3)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                maxWidth: "320px",
              }}
            >
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  borderRadius: "var(--radius-md)",
                  objectFit: "cover",
                }}
              />
              <button
                type="button"
                onClick={clearImage}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                }}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "var(--space-3)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "var(--space-2)",
                alignItems: "center",
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <button
                type="button"
                className="btn btn--secondary btn--icon-sm"
                onClick={() => fileInputRef.current?.click()}
                title="Add Image"
                style={{ borderRadius: "50%" }}
              >
                <ImageIcon size={15} />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-4)",
              }}
            >
              <span
                style={{
                  fontSize: "var(--font-size-xs)",
                  color:
                    content.length > maxLength * 0.9
                      ? "var(--danger)"
                      : "var(--text-tertiary)",
                }}
              >
                {content.length}/{maxLength}
              </span>
              <button
                className="btn btn--primary btn--sm"
                onClick={handleSubmit}
                disabled={!content.trim()}
                style={{ opacity: content.trim() ? 1 : 0.5 }}
              >
                <Send size={14} />
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
