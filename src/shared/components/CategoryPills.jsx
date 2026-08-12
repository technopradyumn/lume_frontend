import React from "react";

export function CategoryPills({ categories, selected, onSelect }) {
  return (
    <div className="pills" style={{ marginBottom: "var(--space-6)" }}>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`pill ${selected === cat ? "pill--active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
