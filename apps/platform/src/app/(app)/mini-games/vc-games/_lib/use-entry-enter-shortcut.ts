"use client";

import { useEffect } from "react";

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof HTMLElement
    && Boolean(
      target.closest(
        "a, button, input, textarea, select, [role='button'], [contenteditable='true']",
      ),
    );
}

export function useEntryEnterShortcut(enabled: boolean, onEnter: () => void) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "Enter"
        || event.defaultPrevented
        || event.repeat
        || event.altKey
        || event.ctrlKey
        || event.metaKey
        || isInteractiveTarget(event.target)
      ) {
        return;
      }

      event.preventDefault();
      onEnter();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEnter]);
}
