"use client";

type Props = {
  payload?: Record<string, unknown>;
  title?: string;
};

/**
 * Phase 1 placeholder rendered inside every window.
 * Real app components replace this one-by-one in Phases 3–4.
 */
export default function PlaceholderApp({ payload, title }: Props) {
  const slug =
    payload && typeof payload.slug === "string" ? (payload.slug as string) : null;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="text-[13px] font-medium tracking-[0.02em] text-[color:var(--color-ink-3)] uppercase">
        Placeholder
      </div>
      <div className="text-[20px] leading-7 font-[650] tracking-[-0.01em] text-[color:var(--color-ink)]">
        {title ?? "App"}
      </div>
      {slug ? (
        <div className="text-[13px] text-[color:var(--color-ink-2)]">
          payload.slug: <code className="font-mono">{slug}</code>
        </div>
      ) : (
        <p className="max-w-[40ch] text-[13px] text-[color:var(--color-ink-2)]">
          Real content lands in a later build phase. The window chrome around
          this is the finished piece for Phase 1.
        </p>
      )}
    </div>
  );
}
