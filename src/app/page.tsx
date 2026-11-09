"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DesktopShell = dynamic(
  () => import("@/components/desktop/DesktopShell").then((m) => m.DesktopShell),
  { ssr: false },
);

const PhoneShell = dynamic(
  () => import("@/components/phone/PhoneShell").then((m) => m.PhoneShell),
  { ssr: false },
);

type Mode = "unknown" | "desktop" | "phone";

function detectMode(): Exclude<Mode, "unknown"> {
  if (typeof window === "undefined") return "desktop";
  try {
    return window.matchMedia("(max-width: 767px)").matches ? "phone" : "desktop";
  } catch {
    return "desktop";
  }
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("unknown");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(detectMode());
    let mql: MediaQueryList | null = null;
    try {
      mql = window.matchMedia("(max-width: 767px)");
      const onChange = () => setMode(mql!.matches ? "phone" : "desktop");
      mql.addEventListener("change", onChange);
      return () => mql?.removeEventListener("change", onChange);
    } catch {
      return;
    }
  }, []);

  if (mode === "unknown") {
    return (
      <main
        className="hamzaos-wallpaper flex min-h-screen flex-1 items-center justify-center"
        aria-label="HamzaOS loading"
      >
        <div className="h-[30px] w-full" />
      </main>
    );
  }

  return mode === "phone" ? <PhoneShell /> : <DesktopShell />;
}
