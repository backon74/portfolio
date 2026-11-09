"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { StatusBar } from "./StatusBar";
import { PhoneDock } from "./PhoneDock";
import { HomeScreen, type HomeGridItem } from "./HomeScreen";
import { AppScreen } from "./AppScreen";
import { WelcomeSheet } from "./WelcomeSheet";
import type { PhoneAppId, PhoneRoute } from "./types";
import { findProject } from "@/lib/content";

const WELCOME_SEEN = "hamzaos.welcome.seen";

const APP_TITLES: Record<PhoneAppId, string> = {
  welcome: "Welcome",
  files: "Files",
  caseStudy: "Project",
  research: "Research",
  skills: "Skills",
  hamza: "Hamza",
  photos: "Photos",
  resume: "Résumé",
  mail: "Mail",
};

function routeToUrlParam(route: PhoneRoute): string | null {
  if (route.kind === "home") return null;
  if (route.appId === "caseStudy" && route.payload && typeof route.payload.slug === "string") {
    return `project:${route.payload.slug}`;
  }
  return route.appId;
}

function titleFor(appId: PhoneAppId, payload?: Record<string, unknown>): string {
  if (appId === "caseStudy" && payload && typeof payload.slug === "string") {
    const project = findProject(payload.slug);
    if (project) return project.name;
  }
  if (appId === "files" && payload && typeof payload.location === "string") {
    const loc = payload.location;
    if (loc === "projects") return "Projects";
    if (loc === "experience") return "Experience";
    if (loc === "education") return "Education";
  }
  return APP_TITLES[appId];
}

function parseDeepLink(): PhoneRoute | null {
  if (typeof window === "undefined") return null;
  try {
    const url = new URL(window.location.href);
    const open = url.searchParams.get("open");
    if (!open) return null;
    if (open.startsWith("project:")) {
      const slug = open.slice("project:".length);
      return { kind: "app", appId: "caseStudy", title: titleFor("caseStudy", { slug }), payload: { slug } };
    }
    const allowed: PhoneAppId[] = [
      "welcome",
      "files",
      "research",
      "skills",
      "hamza",
      "photos",
      "resume",
      "mail",
    ];
    if (allowed.includes(open as PhoneAppId)) {
      return { kind: "app", appId: open as PhoneAppId, title: titleFor(open as PhoneAppId) };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function PhoneShell() {
  const [route, setRoute] = useState<PhoneRoute>({ kind: "home" });
  const [showWelcome, setShowWelcome] = useState(false);

  // Initial: deep link + welcome
  useEffect(() => {
    const deep = parseDeepLink();
    if (deep) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoute(deep);
    } else {
      // Welcome sheet on first visit
      try {
        const forceWelcome = new URL(window.location.href).searchParams.get("welcome") === "1";
        const seen = window.localStorage.getItem(WELCOME_SEEN) === "1";
        if (forceWelcome || !seen) {
          setShowWelcome(true);
        }
        window.localStorage.setItem(WELCOME_SEEN, "1");
      } catch {
        /* ignore */
      }
    }

    // Seed history so initial "back" works predictably
    try {
      window.history.replaceState({ phone: "home" }, "");
    } catch {
      /* ignore */
    }
  }, []);

  // Browser back button support
  useEffect(() => {
    const onPop = () => {
      const deep = parseDeepLink();
      setRoute(deep ?? { kind: "home" });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openApp = useCallback((item: HomeGridItem) => {
    const next: PhoneRoute = {
      kind: "app",
      appId: item.appId,
      title: titleFor(item.appId, item.payload),
      payload: item.payload,
      iconId: item.id,
    };
    try {
      const url = new URL(window.location.href);
      const value = routeToUrlParam(next);
      if (value) url.searchParams.set("open", value);
      window.history.pushState({ phone: "app", appId: item.appId }, "", url.toString());
    } catch {
      /* ignore */
    }
    setRoute(next);
  }, []);

  const openDockApp = useCallback((appId: "mail" | "welcome") => {
    if (appId === "welcome") {
      setShowWelcome(true);
      return;
    }
    const next: PhoneRoute = { kind: "app", appId, title: titleFor(appId) };
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("open", appId);
      window.history.pushState({ phone: "app", appId }, "", url.toString());
    } catch {
      /* ignore */
    }
    setRoute(next);
  }, []);

  const goHome = useCallback(() => {
    try {
      // If there's forward history, use real back; otherwise manual
      const url = new URL(window.location.href);
      url.searchParams.delete("open");
      window.history.pushState({ phone: "home" }, "", url.toString());
    } catch {
      /* ignore */
    }
    setRoute({ kind: "home" });
  }, []);

  const closeWelcome = useCallback(() => setShowWelcome(false), []);

  return (
    <main
      className="hamzaos-wallpaper hamzaos-grain relative flex h-[100dvh] w-screen flex-col overflow-hidden"
      data-shell="phone"
    >
      <Image
        src="/images/wallpaper/hamzaos-portrait.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none select-none object-cover"
        aria-hidden="true"
      />
      <div className="relative z-[1] flex h-full w-full flex-col">
        <StatusBar />
        <LayoutGroup>
          <div className="relative flex min-h-0 flex-1 flex-col">
            <HomeScreen onOpenApp={openApp} />
            <AnimatePresence mode="wait">
              {route.kind === "app" && (
                <AppScreen key={`${route.appId}:${JSON.stringify(route.payload ?? {})}`} route={route} onBack={goHome} />
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>
        {route.kind === "home" && (
          <div className="relative z-10 shrink-0 px-4">
            <PhoneDock onOpenApp={openDockApp} />
          </div>
        )}
      </div>
      <WelcomeSheet open={showWelcome} onClose={closeWelcome} />
    </main>
  );
}
