import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Upload,
  Image,
  FileVideo,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function UploadModal({ isOpen, onClose, onUploaded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Coding");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const categories = [
    "Coding",
    "Design",
    "Gaming",
    "AI & Tech",
    "Music",
    "Vlogs",
  ];

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Coding");
    setVideoFile(null);
    setThumbnailFile(null);
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !uploading) handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, uploading]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!videoFile) {
      setError("Please select a video file to upload");
      return;
    }
    if (!thumbnailFile) {
      setError("Please select a thumbnail image");
      return;
    }

    try {
      setUploading(true);
      await onUploaded?.({
        title: title.trim(),
        description: description.trim(),
        category,
        videoFile,
        thumbnailFile,
      });
      resetForm();
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload video. Please check your backend connection/Cloudinary settings.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Upload Video</h2>
          <button className="btn btn--icon-sm btn--ghost" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            className="modal__body"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            {error && (
              <div
                style={{
                  padding: "var(--space-3) var(--space-4)",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid var(--danger)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--danger)",
                  fontSize: "var(--font-size-sm)",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="auth-form__label">Video File *</label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/mkv"
                style={{ display: "none" }}
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
              <div
                onClick={() => videoInputRef.current?.click()}
                style={{
                  border: videoFile
                    ? "2px solid var(--accent-color)"
                    : "2px dashed var(--border-default)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-8)",
                  textAlign: "center",
                  cursor: "pointer",
                  background: videoFile
                    ? "rgba(99, 102, 241, 0.05)"
                    : "transparent",
                  transition: "all var(--duration-fast)",
                }}
              >
                {videoFile ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-2)",
                    }}
                  >
                    <CheckCircle2
                      size={24}
                      style={{ color: "var(--accent-color)" }}
                    />
                    <span style={{ fontWeight: 600, wordBreak: "break-all" }}>
                      {videoFile.name}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  </div>
                ) : (
                  <>
                    <FileVideo
                      size={36}
                      style={{
                        margin: "0 auto var(--space-2)",
                        color: "var(--text-tertiary)",
                      }}
                    />
                    <p
                      style={{
                        fontWeight: 600,
                        marginBottom: "var(--space-1)",
                      }}
                    >
                      Click to select or drop video file
                    </p>
                    <p
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      MP4, WebM, MOV, MKV
                    </p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="auth-form__label">Title *</label>
              <input
                className="input"
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="auth-form__label">Description *</label>
              <textarea
                className="textarea"
                placeholder="Tell viewers about your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div>
              <label className="auth-form__label">Category</label>
              <div className="pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`pill ${category === cat ? "pill--active" : ""}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="auth-form__label">Thumbnail Image *</label>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                style={{ display: "none" }}
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
              />
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                style={{
                  border: thumbnailFile
                    ? "1px solid var(--accent-color)"
                    : "1px dashed var(--border-default)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--space-5)",
                  textAlign: "center",
                  cursor: "pointer",
                  background: thumbnailFile
                    ? "rgba(99, 102, 241, 0.05)"
                    : "transparent",
                }}
              >
                {thumbnailFile ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-2)",
                    }}
                  >
                    <CheckCircle2
                      size={18}
                      style={{ color: "var(--accent-color)" }}
                    />
                    <span
                      style={{
                        fontSize: "var(--font-size-sm)",
                        fontWeight: 600,
                      }}
                    >
                      {thumbnailFile.name}
                    </span>
                  </div>
                ) : (
                  <>
                    <Image
                      size={20}
                      style={{
                        margin: "0 auto var(--space-1)",
                        color: "var(--text-tertiary)",
                      }}
                    />
                    <p
                      style={{
                        fontSize: "var(--font-size-xs)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      Click to upload thumbnail (PNG, JPG, WEBP)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={
                uploading ||
                !title.trim() ||
                !description.trim() ||
                !videoFile ||
                !thumbnailFile
              }
            >
              {uploading ? (
                <>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid transparent",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Publish
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
