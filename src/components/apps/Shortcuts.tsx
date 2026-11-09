"use client";

const ROWS: { keys: string; action: string }[] = [
  { keys: "Esc", action: "Close focused window" },
  { keys: "⌘ / Ctrl + W", action: "Close focused window" },
  { keys: "⌘ / Ctrl + M", action: "Minimise focused window" },
  { keys: "⌘ / Ctrl + `", action: "Cycle through open windows" },
  { keys: "Click", action: "Open an app or file (single click)" },
  { keys: "Tab", action: "Move focus between controls" },
  { keys: "Enter", action: "Activate focused control" },
];

export default function Shortcuts() {
  return (
    <div
      className="flex h-full w-full flex-col overflow-y-auto px-5 py-5"
      style={{ background: "var(--color-surface)" }}
      data-app-shortcuts
    >
      <h1 className="text-[16px] font-[650] tracking-[-0.01em] text-[color:var(--color-ink)]">
        Keyboard shortcuts
      </h1>
      <p className="mt-1 text-[12px] text-[color:var(--color-ink-3)]">
        A short list — HamzaOS works just as well with the mouse.
      </p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[13px]">
        {ROWS.map((r) => (
          <div key={r.keys} className="contents">
            <dt>
              <kbd
                className="inline-flex items-center rounded-[6px] px-2 py-0.5 font-mono text-[12px] text-[color:var(--color-ink)]"
                style={{
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-hairline-strong)",
                }}
              >
                {r.keys}
              </kbd>
            </dt>
            <dd className="text-[color:var(--color-ink-2)]">{r.action}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
