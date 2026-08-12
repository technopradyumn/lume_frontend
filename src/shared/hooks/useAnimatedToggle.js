import { useState, useCallback, useRef, useEffect } from "react";

const CLOSE_DURATION = 150;
export function useAnimatedToggle(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef(null);

  const close = useCallback(() => {
    if (!isOpen || isClosing) return;
    setIsClosing(true);
    timerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, CLOSE_DURATION);
  }, [isOpen, isClosing]);

  const open = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsClosing(false);
    setIsOpen(true);
  }, []);

  const toggle = useCallback(() => {
    if (isOpen && !isClosing) close();
    else open();
  }, [isOpen, isClosing, open, close]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  useEffect(() => {
    const handlePointerDown = () => close();
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [close]);

  return { isOpen, isClosing, open, close, toggle };
}
