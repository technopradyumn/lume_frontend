"use client";

import React from "react";
import { Link } from "./Navigation";
import { UserSummary } from "../services/api";

export interface UserAvatarProps {
  user?: Partial<UserSummary> | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  noLink?: boolean;
  linkTo?: string;
}

export function UserAvatar({
  user,
  size = "md",
  className = "",
  noLink = false,
  linkTo,
}: UserAvatarProps) {
  const name = user?.fullName || user?.username || "User";
  const firstLetter = name.charAt(0).toUpperCase();
  const avatarUrl = user?.avatar;
  const sizeClass = `avatar--${size}`;

  const avatarContent = (
    <div className={`avatar ${sizeClass} avatar--gradient-border ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          onError={(e) => {
            (e.target as HTMLElement).style.display = "none";
          }}
        />
      ) : null}
      <div
        className="avatar__fallback"
        style={{ display: avatarUrl ? "none" : "flex" }}
      >
        {firstLetter}
      </div>
    </div>
  );

  const destination =
    linkTo || (user?.username ? `/channel/${user.username}` : null);

  if (!noLink && destination) {
    return (
      <Link
        to={destination}
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "inline-flex",
          flexShrink: 0,
          textDecoration: "none",
        }}
      >
        {avatarContent}
      </Link>
    );
  }

  return avatarContent;
}
