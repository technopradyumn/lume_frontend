"use client";

import React from "react";

export interface CategoryPillsProps {
  categories: string[];
  selected: string;
  onSelect: (cat: string) => void;
}

export function CategoryPills({ categories, selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="pills" style={{ marginBottom: "var(--space-6)" }}>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`pill ${selected === cat ? "pill--active" : ""}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
