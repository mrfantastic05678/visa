"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "visati-admin-avatar";

/** In-memory cache so all hook instances stay in sync without polling. */
let cached: string | null = null;
let initialized = false;

function getSnapshot() {
  return cached;
}

function subscribe(callback: () => void) {
  // Listen for custom event dispatched by setAvatar()
  window.addEventListener("visati-avatar-change", callback);
  return () => window.removeEventListener("visati-avatar-change", callback);
}

function init() {
  if (initialized) return;
  initialized = true;
  try {
    cached = localStorage.getItem(STORAGE_KEY);
  } catch {
    cached = null;
  }
}

/**
 * Returns the user's profile photo data URL and a setter.
 * All instances across the app stay in sync via a custom event.
 */
export function useAvatar() {
  init();
  const src = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const set = useCallback((next: string | null) => {
    cached = next;
    try {
      if (next) {
        localStorage.setItem(STORAGE_KEY, next);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
    // Notify all hook instances
    window.dispatchEvent(new Event("visati-avatar-change"));
  }, []);

  return { src, set } as const;
}
