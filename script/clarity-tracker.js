"use client";

/**
 * Utilitas Microsoft Clarity Analytics & Event Helper.
 * Skrip utama diinisialisasi melalui Next.js Script di app/layout.js.
 */

export function trackClarityEvent(eventName) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("event", eventName);
  }
}

export function setClarityTag(key, value) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("set", key, value);
  }
}

export function identifyClarityUser(customId, session, page, friendlyName) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("identify", customId, session, page, friendlyName);
  }
}

export function ClarityTracker() {
  return null;
}
