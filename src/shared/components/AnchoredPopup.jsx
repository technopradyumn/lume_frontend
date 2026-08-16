import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const VIEWPORT_PADDING = 12;
const ANCHOR_GAP = 8;

const clamp = (value, minimum, maximum) =>
  Math.min(Math.max(value, minimum), Math.max(minimum, maximum));

export function AnchoredPopup({
  isOpen,
  isClosing,
  onClose,
  anchorRef,
  children,
  className = "",
  ariaLabel = "Actions",
  estimatedWidth = 220,
  estimatedHeight = 180,
  preferredPlacement = "bottom",
}) {
  const menuRef = useRef(null);
  const [position, setPosition] = useState(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef?.current;
    if (!anchor) return;

    const anchorRect = anchor.getBoundingClientRect();
    const measuredRect = menuRef.current?.getBoundingClientRect();
    const width = Math.min(
      measuredRect?.width || estimatedWidth,
      window.innerWidth - VIEWPORT_PADDING * 2,
    );
    const height = Math.min(
      measuredRect?.height || estimatedHeight,
      window.innerHeight - VIEWPORT_PADDING * 2,
    );
    const roomBelow = window.innerHeight - anchorRect.bottom - ANCHOR_GAP;
    const roomAbove = anchorRect.top - ANCHOR_GAP;
    const prefersBelow = preferredPlacement === "bottom";
    const opensBelow = prefersBelow
      ? roomBelow >= height || roomBelow >= roomAbove
      : !(roomAbove >= height || roomAbove >= roomBelow);
    const preferredTop = opensBelow
      ? anchorRect.bottom + ANCHOR_GAP
      : anchorRect.top - height - ANCHOR_GAP;

    setPosition({
      top: clamp(
        preferredTop,
        VIEWPORT_PADDING,
        window.innerHeight - height - VIEWPORT_PADDING,
      ),
      left: clamp(
        anchorRect.right - width,
        VIEWPORT_PADDING,
        window.innerWidth - width - VIEWPORT_PADDING,
      ),
      width,
      maxHeight: window.innerHeight - VIEWPORT_PADDING * 2,
      transformOrigin: opensBelow ? "top right" : "bottom right",
    });
  }, [anchorRef, estimatedHeight, estimatedWidth, preferredPlacement]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return undefined;
    }

    updatePosition();
    const frame = window.requestAnimationFrame(updatePosition);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("orientationchange", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("orientationchange", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="popup-backdrop" aria-hidden="true" onClick={onClose} />
      <div
        ref={menuRef}
        className={`dropdown popup-menu anchored-popup ${className} ${isClosing ? "dropdown--closing" : ""}`}
        role="menu"
        aria-label={ariaLabel}
        style={{
          position: "fixed",
          ...position,
          visibility: position ? "visible" : "hidden",
          zIndex: "var(--z-dropdown)",
        }}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
