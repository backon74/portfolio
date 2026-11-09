"use client";

import { Download, ExternalLink } from "lucide-react";
import { links } from "@/content/site";
import { Button } from "@/components/ui/atoms";
import { track } from "@/lib/analytics";

export default function Resume() {
  const url = links.resumePdf;
  return (
    <div className="flex h-full w-full flex-col" style={{ background: "var(--color-surface)" }}>
      <div
        className="flex shrink-0 items-center gap-2 px-3 py-2"
        style={{
          background: "var(--color-surface-2)",
          borderBottom: "1px solid var(--color-hairline)",
        }}
      >
        <h2 className="text-[14px] font-semibold tracking-[-0.005em] text-[color:var(--color-ink)]">
          Résumé.pdf
        </h2>
        <div className="ml-auto flex items-center gap-2">
          <Button href={url} target="_blank" variant="secondary" size="sm">
            <ExternalLink size={13} />
            Open in new tab
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              track("resume_downloaded", { surface: "resume_app" });
              const a = document.createElement("a");
              a.href = url;
              a.download = "Hamza_Alkhaldi_Resume.pdf";
              a.click();
            }}
          >
            <Download size={13} />
            Download
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 bg-[color:var(--color-surface-3)]">
        <iframe
          src={url}
          title="Résumé — Hamza Alkhaldi"
          className="h-full w-full border-0"
        />
      </div>
      <noscript>
        <a href={url}>Download the résumé PDF</a>
      </noscript>
    </div>
  );
}
