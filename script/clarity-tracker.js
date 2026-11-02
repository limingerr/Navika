"use client";

import { useEffect, useRef } from "react";
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

export function identifyClarityUser(customId, session = null, page = null, friendlyName = null) {
  if (typeof window !== "undefined" && typeof window.clarity === "function" && customId) {
    try {
      if (friendlyName) {
        window.clarity("identify", String(customId), session || "", page || "", String(friendlyName));
      } else {
        window.clarity("identify", String(customId));
      }
    } catch {}
  }
}

export function upgradeClaritySession(reason = "user_interaction") {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    try {
      window.clarity("upgrade", reason);
    } catch {}
  }
}

/**
 * Tracker komponen client-side untuk merekam navigasi rute SPA di Next.js App Router
 * serta memastikan rekaman sesi diprioritaskan (upgrade) dan diflush saat tab ditutup.
 */
export function ClarityTracker() {
  const pathname = usePathname();
  const hasUpgraded = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Berikan sinyal consent dan upgrade awal
    if (typeof window.clarity === "function") {
      try {
        window.clarity("consent");
        window.clarity("upgrade", "session_start");
      } catch {}
    }

    // 2. Tangkap interaksi pertama pengguna untuk memprioritaskan rekaman
    const handleFirstInteraction = () => {
      if (!hasUpgraded.current && typeof window.clarity === "function") {
        hasUpgraded.current = true;
        try {
          window.clarity("upgrade", "first_interaction");
        } catch {}
      }
    };

    window.addEventListener("click", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("scroll", handleFirstInteraction, { passive: true, once: true });
    window.addEventListener("keydown", handleFirstInteraction, { passive: true, once: true });

    // 3. Pastikan data rekaman diflush ke server saat pengguna berpindah/menutup tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && typeof window.clarity === "function") {
        try {
          window.clarity("event", "tab_hidden");
        } catch {}
      }
    };

    const handlePageHide = () => {
      if (typeof window.clarity === "function") {
        try {
          window.clarity("event", "page_exit");
        } catch {}
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.clarity === "function" && pathname) {
      try {
        window.clarity("set", "page_path", pathname);
        window.clarity("event", "page_view");
        window.clarity("upgrade", `nav_${pathname.replace(/[^a-zA-Z0-9_-]/g, "_")}`);
      } catch {}
    }
  }, [pathname]);

  return null;
}
