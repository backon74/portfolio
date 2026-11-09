"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Tiny client island that fires the `recruiter_view_opened` event once per
 * navigation to /recruiter. No DOM output, no visible JS beyond this.
 */
export function RecruiterAnalytics() {
  useEffect(() => {
    track("recruiter_view_opened");
  }, []);
  return null;
}
