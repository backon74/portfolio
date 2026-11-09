"use client";

import { LogoMark } from "@/components/ui/icons/LogoMark";
import { links } from "@/content/site";

export default function AboutOs() {
  return (
    <div
      className="flex h-full w-full flex-col items-center gap-3 overflow-y-auto px-6 py-6 text-center"
      style={{ background: "var(--color-surface)" }}
      data-app-about-os
    >
      <LogoMark size={48} />
      <div>
        <h1 className="text-[18px] font-[650] tracking-[-0.01em] text-[color:var(--color-ink)]">
          HamzaOS 1.0
        </h1>
        <p className="mt-1 text-[12px] text-[color:var(--color-ink-3)]">
          Designed and built by Hamza Alkhaldi with Next.js.
        </p>
      </div>
      <a
        href={links.sourceRepo}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] font-medium text-[color:var(--color-accent)] underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40"
      >
        View source on GitHub
      </a>
      <dl
        className="mt-2 grid w-full max-w-[340px] grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-left text-[11px]"
        style={{ color: "var(--color-ink-2)" }}
      >
        <dt className="font-semibold tracking-[0.02em] text-[color:var(--color-ink-3)] uppercase">
          Weather
        </dt>
        <dd>Open-Meteo</dd>
        <dt className="font-semibold tracking-[0.02em] text-[color:var(--color-ink-3)] uppercase">
          Music preview
        </dt>
        <dd>Apple iTunes Search API</dd>
        <dt className="font-semibold tracking-[0.02em] text-[color:var(--color-ink-3)] uppercase">
          Icons
        </dt>
        <dd>Lucide · Simple Icons</dd>
      </dl>
    </div>
  );
}
