import React from "react";
import { Link } from "react-router-dom";

export function UserAvatar({
  user,
  size = "md",
  className = "",
  noLink = false,
  linkTo,
}) {
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
            e.target.style.display = "none";
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
