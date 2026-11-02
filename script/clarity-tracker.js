"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Utilitas Microsoft Clarity Analytics & Event Helper.
 */
export function trackClarityEvent(eventName) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    try {
      window.clarity("event", eventName);
    } catch {}
  }
}

export function setClarityTag(key, value) {
  if (
    typeof window !== "undefined" &&
    typeof window.clarity === "function" &&
    value !== undefined &&
    value !== null
  ) {
    try {
      window.clarity("set", key, String(value));
    } catch {}
  }
}

export function identifyClarityUser(customId, session, page, friendlyName) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    try {
      window.clarity("identify", customId, session, page, friendlyName);
    } catch {}
  }
}

/**
 * Tracker komponen client-side untuk merekam navigasi rute SPA di Next.js App Router
 */
export function ClarityTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.clarity === "function" && pathname) {
      try {
        window.clarity("set", "page_path", pathname);
        window.clarity("event", "page_view");
      } catch {}
    }
  }, [pathname]);

  return null;
}
