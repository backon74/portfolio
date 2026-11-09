// Thin wrapper around @vercel/analytics so the rest of the app imports a
// single helper and we can swap/mute it in one place. Safe on server (no-ops).

import { track as vercelTrack } from "@vercel/analytics";

export type AnalyticsEvent =
  | { name: "recruiter_view_opened"; props?: Record<string, string | number | boolean> }
  | { name: "resume_downloaded"; props?: Record<string, string | number | boolean> }
  | { name: "project_opened"; props: { slug: string } }
  | { name: "contact_sent"; props?: Record<string, string | number | boolean> };

export function track<E extends AnalyticsEvent>(
  name: E["name"],
  props?: E extends { props: infer P } ? P : Record<string, string | number | boolean>,
): void {
  if (typeof window === "undefined") return;
  try {
    vercelTrack(name, props as Record<string, string | number | boolean> | undefined);
  } catch {
    // Analytics must never break the page.
  }
}
