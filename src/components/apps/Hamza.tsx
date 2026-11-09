"use client";

import { useState } from "react";
import { Mail, FileText } from "lucide-react";
import { profile } from "@/content/site";
import { bio, hobbies, awards } from "@/content/about";
import { Button } from "@/components/ui/atoms";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { useOs } from "@/os/store";
import { cn } from "@/lib/cn";

type Tab = "about" | "beyond" | "awards";

const TABS: { id: Tab; label: string }[] = [
  { id: "about", label: "About" },
  { id: "beyond", label: "Beyond code" },
  { id: "awards", label: "Awards" },
];

export default function Hamza() {
  const [tab, setTab] = useState<Tab>("about");
  const open = useOs((s) => s.open);

  const downloadResume = () => {
    const a = document.createElement("a");
    a.href = "/resume/Hamza_Alkhaldi_Resume.pdf";
    a.download = "Hamza_Alkhaldi_Resume.pdf";
    a.click();
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden" data-app-hamza>
      {/* Header — holographic hero */}
      <div
        className="relative flex shrink-0 items-start gap-5 overflow-hidden px-7 py-6"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,211,255,.18) 0%, rgba(138,92,240,.12) 50%, rgba(255,79,166,.08) 100%)",
          borderBottom: "1px solid rgba(34,211,255,.18)",
        }}
      >
        {/* halftone dot overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(10,30,60,.1) 1px, transparent 1px)",
            backgroundSize: "6px 6px",
            opacity: 0.35,
          }}
        />
        <div className="relative shrink-0">
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-[20px]"
            style={{
              background: "linear-gradient(135deg, #22D3FF, #8A5CF0, #FF4FA6)",
              opacity: 0.8,
              filter: "blur(8px)",
            }}
          />
          <ImageSlot slot={profile.photo} aspect="1 / 1" rounded={16} className="relative w-[96px]" />
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="mono-stroke"
              style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--color-accent)" }}
            >
              OPERATOR · 001
            </span>
            <span
              aria-hidden="true"
              style={{ width: 6, height: 6, borderRadius: "50%", background: "#22D3FF", boxShadow: "0 0 8px #22D3FF", animation: "cyan-pulse 2s ease-in-out infinite" }}
            />
          </div>
          <h1
            className="mt-1 text-[32px] leading-[1] font-bold text-[color:var(--color-ink)]"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
          >
            {profile.name}
          </h1>
          <div className="mt-1 text-[12px] text-[color:var(--color-ink-2)]">{profile.roleLong}</div>
          <p className="mt-3 max-w-[56ch] text-[13px] leading-5 text-[color:var(--color-ink)]">
            {bio.short}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => open("mail")}>
              <Mail size={13} />
              Say hi
            </Button>
            <Button variant="secondary" size="sm" onClick={downloadResume}>
              <FileText size={13} />
              Résumé
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex shrink-0 items-center gap-1 px-7 py-2"
        style={{ borderBottom: "1px solid rgba(34,211,255,.15)" }}
        role="tablist"
        aria-label="Hamza sections"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={cn(
              "rounded-[8px] px-3 py-1 text-[13px] font-medium",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40",
              tab === t.id
                ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                : "text-[color:var(--color-ink-2)] hover:bg-[color:var(--color-surface-3)]",
            )}
            onClick={() => setTab(t.id)}
            data-tab={t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-y-auto px-7 py-5">
        {tab === "about" && <AboutPane />}
        {tab === "beyond" && <BeyondPane />}
        {tab === "awards" && <AwardsPane />}
      </div>
    </div>
  );
}

function AboutPane() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div className="flex flex-col gap-3 text-[13px] leading-6 text-[color:var(--color-ink)]">
        {bio.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <aside
        className="flex flex-col gap-2 rounded-[12px] p-4 text-[12px]"
        style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-hairline)" }}
      >
        <h2 className="mb-1 text-[11px] font-bold tracking-[0.04em] text-[color:var(--color-ink-3)] uppercase">
          Quick facts
        </h2>
        {bio.quickFacts.map((f) => (
          <div key={f.k} className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-[0.02em] text-[color:var(--color-ink-3)] uppercase">
              {f.k}
            </span>
            <span className="text-[13px] text-[color:var(--color-ink)]">{f.v}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}

function BeyondPane() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {hobbies.map((h) => (
        <article
          key={h.id}
          className="flex flex-col gap-3 rounded-[12px] p-4"
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-hairline)" }}
        >
          <h3 className="text-[14px] font-semibold tracking-[-0.005em] text-[color:var(--color-ink)]">
            {h.title}
          </h3>
          <p className="text-[13px] leading-5 text-[color:var(--color-ink-2)]">{h.text}</p>
          <ImageSlot slot={h.image} aspect="16 / 10" rounded={8} />
        </article>
      ))}
    </div>
  );
}

function AwardsPane() {
  return (
    <ul className="flex flex-col gap-3">
      {awards.map((a) => (
        <li
          key={a.id}
          className="flex items-start gap-4 rounded-[12px] p-4"
          style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-hairline)" }}
        >
          <div className="shrink-0">
            <ImageSlot slot={a.image} aspect="1 / 1" rounded={10} className="w-[64px]" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-[14px] font-semibold tracking-[-0.005em] text-[color:var(--color-ink)]">
              {a.title}
            </h3>
            <div className="text-[12px] text-[color:var(--color-ink-3)]">{a.org}</div>
            {a.detail && (
              <div className="mt-1 text-[13px] text-[color:var(--color-ink-2)]">{a.detail}</div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

