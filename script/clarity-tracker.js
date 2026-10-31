"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "z6b213a2fj";

export function ClarityTracker() {
  useEffect(() => {
    if (typeof window !== "undefined" && CLARITY_PROJECT_ID) {
      try {
        Clarity.init(CLARITY_PROJECT_ID);
      } catch (err) {
        console.warn("Microsoft Clarity initialization notice:", err);
      }
    }
  }, []);

  return null;
}
