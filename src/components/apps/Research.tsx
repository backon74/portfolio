"use client";

import { useEffect, useState } from "react";
import { Code2, FileText, Presentation, Copy, X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { research } from "@/content/research";
import { Button, MetricTile, MaybeText } from "@/components/ui/atoms";
import { isTodo } from "@/content/types";
import { cn } from "@/lib/cn";

export default function Research() {
  const [toast, setToast] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const copyCitation = async () => {
    try {
      await navigator.clipboard.writeText(research.citationIEEE);
      setToast("Copied citation");
    } catch {
      setToast("Could not copy");
    }
    setTimeout(() => setToast(null), 2000);
  };

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      else if (e.key === "ArrowLeft") {
        setLightboxIdx((i) =>
          i === null ? null : (i - 1 + research.figures.length) % research.figures.length,
        );
      } else if (e.key === "ArrowRight") {
        setLightboxIdx((i) =>
          i === null ? null : (i + 1) % research.figures.length,
        );
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lightboxIdx]);

  return (
    <div className="flex h-full w-full overflow-hidden" style={{ background: "var(--color-surface)" }}>
      {/* Paper preview */}
      <div className="min-w-0 flex-1 overflow-y-auto p-6">
        <article
          className="mx-auto flex max-w-[640px] flex-col gap-4 bg-white p-8"
          style={{
            border: "1px solid var(--color-hairline)",
            borderRadius: 8,
            boxShadow: "var(--shadow-card)",
          }}
          aria-label="Paper preview"
        >
          <h1 className="text-center text-[18px] leading-6 font-bold tracking-[-0.01em] text-[color:var(--color-ink)]">
            {research.title}
          </h1>
          <p className="text-center text-[13px] text-[color:var(--color-ink-2)]">
            {research.authors.join(", ")}
          </p>
          <p className="text-center text-[12px] text-[color:var(--color-ink-3)]">
            {research.affiliation}
          </p>
          <div className="my-2 h-px" style={{ background: "var(--color-hairline)" }} />
          <h2 className="text-[13px] font-bold tracking-[0.04em] text-[color:var(--color-ink)] uppercase">
            Abstract
          </h2>
          <p className="text-[13px] leading-6 text-[color:var(--color-ink)]">{research.abstract}</p>
          <div className="mt-3">
            <h3 className="mb-2 text-[12px] font-semibold tracking-[0.04em] text-[color:var(--color-ink-3)] uppercase">
              Figures
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {research.figures.map((f, i) => (
                <button
                  key={f.src}
                  type="button"
                  onClick={() => setLightboxIdx(i)}
                  className="relative shrink-0 overflow-hidden rounded-[8px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/60"
                  aria-label={`Open figure: ${f.caption}`}
                  style={{
                    width: 120,
                    height: 80,
                    border: "1px solid var(--color-hairline)",
                    background: "var(--color-surface-2)",
                  }}
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          </div>
        </article>
      </div>

      {/* Right panel */}
      <aside
        className="flex w-[320px] shrink-0 flex-col gap-4 overflow-y-auto p-5"
        style={{
          background: "var(--color-surface-2)",
          borderLeft: "1px solid var(--color-hairline)",
        }}
      >
        <div
          className="rounded-[8px] px-3 py-2 text-[12px] font-medium text-[color:var(--color-accent)]"
          style={{ background: "var(--color-accent-soft)" }}
        >
          {research.status}
        </div>
        <div className="text-[12px] text-[color:var(--color-ink-2)]">
          <div className="font-semibold text-[color:var(--color-ink)]">{research.venueShort}</div>
          <div>{research.location}</div>
          <div>{research.dates}</div>
        </div>

        <div>
          <h3 className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-[color:var(--color-ink-3)] uppercase">
            Key results
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {research.keyResults.map((k) => (
              <MetricTile key={k.label} value={k.value} label={k.label} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-[11px] font-semibold tracking-[0.06em] text-[color:var(--color-ink-3)] uppercase">
            What I did
          </h3>
          <ul className="flex list-disc flex-col gap-1.5 pl-4 text-[13px] leading-5 text-[color:var(--color-ink)]">
            {research.whatIDid.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <Button href={research.links.code} target="_blank" variant="secondary" size="sm">
            <Code2 size={13} />
            Code on GitHub
          </Button>
          <Button href={research.links.certificate} target="_blank" variant="secondary" size="sm">
            <FileText size={13} />
            Certificate
          </Button>
          {research.links.slides && (
            <Button href={research.links.slides} target="_blank" variant="secondary" size="sm">
              <Presentation size={13} />
              Slides
            </Button>
          )}
          <Button onClick={copyCitation} variant="secondary" size="sm">
            <Copy size={13} />
            Copy citation
          </Button>
        </div>
        {!isTodo(research.doi) ? (
          <a
            className="text-[12px] text-[color:var(--color-accent)] hover:underline"
            href={research.doi}
            target="_blank"
            rel="noopener noreferrer"
          >
            {research.doi}
          </a>
        ) : (
          <p className="text-[11px] text-[color:var(--color-ink-3)]">
            DOI: <MaybeText value={research.doi} />
          </p>
        )}
      </aside>

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed bottom-[100px] left-1/2 z-[2000] -translate-x-1/2 rounded-full px-4 py-2 text-[12px] font-medium text-white"
          style={{ background: "#14171FE6" }}
        >
          {toast}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Figure"
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 p-10"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close"
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={18} />
          </button>
          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx(
                (i) => ((i ?? 0) - 1 + research.figures.length) % research.figures.length,
              );
            }}
            className={cn(
              "absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20",
            )}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIdx((i) => ((i ?? 0) + 1) % research.figures.length);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <ChevronRight size={20} />
          </button>
          <figure
            className="flex max-h-full max-w-[90vw] flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative"
              style={{ width: "min(80vw, 900px)", height: "min(70vh, 600px)" }}
            >
              <Image
                src={research.figures[lightboxIdx].src}
                alt={research.figures[lightboxIdx].alt}
                fill
                sizes="80vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <figcaption className="max-w-[80vw] text-center text-[13px] text-white/90">
              {research.figures[lightboxIdx].caption}
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
