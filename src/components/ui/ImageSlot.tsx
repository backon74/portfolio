"use client";

import Image from "next/image";
import type { ImageSlot as ImageSlotT } from "@/content/types";

/**
 * Image slot that renders the real image if available, or a tasteful neutral
 * tile with the alt text as caption while `placeholder: true`.
 */
export function ImageSlot({
  slot,
  aspect = "16 / 10",
  className,
  rounded = 10,
}: {
  slot: ImageSlotT;
  aspect?: string;
  className?: string;
  rounded?: number;
}) {
  if (slot.placeholder) {
    return (
      <div
        className={className}
        style={{
          aspectRatio: aspect,
          background:
            "linear-gradient(135deg, var(--color-surface-2), var(--color-surface-3))",
          borderRadius: rounded,
          border: "1px solid var(--color-hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 12,
          textAlign: "center",
          color: "var(--color-ink-3)",
          fontSize: 12,
          lineHeight: "16px",
          letterSpacing: "0.01em",
          overflow: "hidden",
        }}
        role="img"
        aria-label={slot.alt}
      >
        <span>{slot.alt}</span>
      </div>
    );
  }
  return (
    <div
      className={className}
      style={{
        position: "relative",
        aspectRatio: aspect,
        borderRadius: rounded,
        overflow: "hidden",
        border: "1px solid var(--color-hairline)",
        background: "var(--color-surface-2)",
      }}
    >
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        sizes="(max-width: 960px) 100vw, 60vw"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
