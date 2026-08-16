import React from "react";
import { Facebook, Link2, Send, Twitter } from "lucide-react";
import { AnchoredPopup } from "./AnchoredPopup";

const SHARE_OPTIONS = [
  { label: "Copy Link", icon: Link2 },
  { label: "WhatsApp", icon: Send },
  { label: "Twitter / X", icon: Twitter },
  { label: "Facebook", icon: Facebook },
];

export function ShareMenu({
  isOpen,
  isClosing,
  onClose,
  url,
  onShared,
  anchorRef,
}) {
  if (!isOpen) return null;

  const share = async (label) => {
    try {
      if (label === "Copy Link") {
        await navigator.clipboard.writeText(url);
        onShared?.("Link copied to clipboard!");
      } else {
        const shareUrl =
          label === "WhatsApp"
            ? `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`
            : label === "Twitter / X"
              ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`
              : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, "_blank", "noopener,noreferrer");
        onShared?.(`Opening ${label}…`);
      }
    } catch {
      onShared?.("Unable to share right now. Please copy the link manually.");
    } finally {
      onClose();
    }
  };

  return (
    <AnchoredPopup
      isOpen={isOpen}
      isClosing={isClosing}
      onClose={onClose}
      anchorRef={anchorRef}
      className="share-menu"
      ariaLabel="Share options"
      estimatedWidth={220}
      estimatedHeight={208}
      preferredPlacement="top"
    >
      <div className="share-menu__label">Share to</div>
      {SHARE_OPTIONS.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="dropdown__item"
          onClick={() => share(label)}
        >
          <Icon size={15} /> {label}
        </button>
      ))}
    </AnchoredPopup>
  );
}
