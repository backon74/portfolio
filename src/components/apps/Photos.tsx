"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { albums } from "@/content/about";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { ImageSlot as ImageSlotT } from "@/content/types";
import { cn } from "@/lib/cn";

type AlbumId = (typeof albums)[number]["id"];

export default function Photos({ payload }: { payload?: Record<string, unknown> }) {
  const requested =
    payload && typeof payload.albumId === "string" ? (payload.albumId as string) : null;
  const initial = useMemo<AlbumId>(() => {
    const found = albums.find((a) => a.id === requested);
    return (found?.id ?? albums[0]!.id) as AlbumId;
  }, [requested]);

  const [albumId, setAlbumId] = useState<AlbumId>(initial);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const album = albums.find((a) => a.id === albumId) ?? albums[0]!;
  const photos = album.photos;

  return (
    <div
      className="flex h-full w-full overflow-hidden"
      style={{ background: "var(--color-surface)" }}
      data-app-photos
    >
      {/* Sidebar */}
      <aside
        className="flex w-[200px] shrink-0 flex-col gap-1 overflow-y-auto p-3"
        style={{
          borderRight: "1px solid var(--color-hairline)",
          background: "var(--color-surface-2)",
        }}
        aria-label="Albums"
      >
        <h2 className="mb-1 px-2 text-[11px] font-bold tracking-[0.04em] text-[color:var(--color-ink-3)] uppercase">
          Albums
        </h2>
        {albums.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setAlbumId(a.id as AlbumId)}
            aria-current={albumId === a.id ? "true" : undefined}
            className={cn(
              "flex w-full items-center rounded-[8px] px-2 py-1.5 text-left text-[13px]",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/40",
              albumId === a.id
                ? "bg-[color:var(--color-accent-soft)] text-[color:var(--color-accent)]"
                : "text-[color:var(--color-ink)] hover:bg-[color:var(--color-surface-3)]",
            )}
            data-album={a.id}
          >
            {a.title}
          </button>
        ))}
      </aside>

      {/* Grid */}
      <div className="min-w-0 flex-1 overflow-y-auto p-5">
        <header className="mb-4">
          <h1 className="text-[20px] leading-7 font-[650] tracking-[-0.01em] text-[color:var(--color-ink)]">
            {album.title}
          </h1>
          {album.subtitle && (
            <div className="mt-1 text-[12px] text-[color:var(--color-ink-3)]">{album.subtitle}</div>
          )}
        </header>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3" data-photos-grid>
          {photos.map((p, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                className="group block w-full rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]/60"
                aria-label={`Open photo: ${p.alt}`}
                data-photo-thumb={i}
              >
                <ImageSlot slot={p} aspect="4 / 3" rounded={10} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {lightbox !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: readonly ImageSlotT[];
  startIndex: number;
  onClose: () => void;
}) {
  const [i, setI] = useState(startIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocus = useRef<Element | null>(null);

  const next = () => setI((n) => (n + 1) % photos.length);
  const prev = () => setI((n) => (n - 1 + photos.length) % photos.length);

  useEffect(() => {
    prevFocus.current = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Tab") {
        // simple focus trap: keep focus in dialog
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    // move focus into the dialog
    dialogRef.current?.querySelector<HTMLElement>("[data-lightbox-close]")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prevFocus.current instanceof HTMLElement) prevFocus.current.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const photo = photos[i]!;
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${i + 1} of ${photos.length}`}
      className="absolute inset-0 z-[10] flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.78)" }}
      data-lightbox
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="relative flex w-full max-w-[720px] flex-col items-center gap-3 px-4">
        <div className="w-full">
          <ImageSlot slot={photo} aspect="4 / 3" rounded={12} />
        </div>
        {photo.alt && (
          <div className="text-center text-[12px] text-white/90">{photo.alt}</div>
        )}
      </div>
      <button
        type="button"
        onClick={prev}
        aria-label="Previous photo"
        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        data-lightbox-prev
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next photo"
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        data-lightbox-next
      >
        <ChevronRight size={22} />
      </button>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 rounded-full p-2 text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        data-lightbox-close
      >
        <X size={18} />
      </button>
    </div>
  );
}
