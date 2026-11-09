"use client";

export type AppIconKind =
  | "files"
  | "projects"
  | "experience"
  | "education"
  | "research"
  | "skills"
  | "hamza"
  | "photos"
  | "mail"
  | "linkedin"
  | "github"
  | "resume"
  | "welcome";

/* Folder palette — gradient top→bottom + accent for tab */
const FOLDER_PALETTE: Record<
  "files" | "projects" | "experience" | "education",
  { top: string; bot: string; accent: string; glyphPath?: React.ReactNode }
> = {
  files: { top: "#8FB7F1", bot: "#4879C9", accent: "#CBDCF6" },
  projects: {
    top: "#4EC9FA",
    bot: "#1A86D3",
    accent: "#C4EEFF",
    glyphPath: (
      <g transform="translate(34 46) scale(1.1)" fill="rgba(255,255,255,.75)">
        <rect width="10" height="10" rx="2" />
        <rect x="14" width="10" height="10" rx="2" />
        <rect y="14" width="10" height="10" rx="2" />
        <rect x="14" y="14" width="10" height="10" rx="2" />
      </g>
    ),
  },
  experience: {
    top: "#F6B46A",
    bot: "#D08020",
    accent: "#FDE0B5",
    glyphPath: (
      <g transform="translate(32 48)" fill="none" stroke="rgba(255,255,255,.85)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="32" height="22" rx="3" />
        <path d="M14 6 V2 H24 V6" />
        <path d="M2 16 H34" />
      </g>
    ),
  },
  education: {
    top: "#B195F4",
    bot: "#7149D0",
    accent: "#DFD1FB",
    glyphPath: (
      <g transform="translate(32 48)" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10 L18 2 L34 10 L18 18 Z" fill="rgba(255,255,255,.2)" />
        <path d="M8 13 V22 Q18 28 28 22 V13" />
      </g>
    ),
  },
};

/* iOS-style flat folder: single-color body + lighter tab + white glyph */
function Folder({ size, kind }: { size: number; kind: keyof typeof FOLDER_PALETTE }) {
  const p = FOLDER_PALETTE[kind];
  const id = `fld-${kind}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 5px 14px rgba(10,30,60,.25))" }}
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.top} />
          <stop offset="100%" stopColor={p.bot} />
        </linearGradient>
      </defs>
      {/* Back tab */}
      <path
        d="M10 24 Q10 20 14 20 L36 20 L42 28 L86 28 Q90 28 90 32 L90 38 L10 38 Z"
        fill={p.accent}
      />
      {/* Body */}
      <path
        d="M8 32 Q8 28 12 28 L88 28 Q92 28 92 32 L92 78 Q92 86 84 86 L16 86 Q8 86 8 78 Z"
        fill={`url(#${id}-body)`}
      />
      {/* Tab-body seam */}
      <path d="M8 35 L92 35" stroke="rgba(10,20,40,.15)" strokeWidth="1" fill="none" />
      {/* Highlight line */}
      <path d="M12 30 L88 30" stroke="rgba(255,255,255,.35)" strokeWidth="1" fill="none" />
      {/* Glyph */}
      {p.glyphPath}
    </svg>
  );
}

/* Hamza: holographic disc w/ monogram */
function HamzaSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 5px 14px rgba(10,30,60,.28))" }}>
      <defs>
        <linearGradient id="hz-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4FA8E0" />
          <stop offset="50%" stopColor="#7A6BE8" />
          <stop offset="100%" stopColor="#D06AA6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#hz-bg)" />
      <rect x="2.5" y="2.5" width="95" height="95" rx="21.5" fill="none" stroke="rgba(255,255,255,.3)" />
      {/* clean H monogram, Space Grotesk feel */}
      <text x="50" y="68" textAnchor="middle" fontSize="54" fontWeight="700" fill="#FFFFFF" fontFamily="var(--font-display), system-ui" style={{ letterSpacing: "-0.08em" }}>
        H
      </text>
    </svg>
  );
}

function GithubSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,.45))" }}>
      <defs>
        <linearGradient id="gh-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#24292F" />
          <stop offset="100%" stopColor="#0D1117" />
        </linearGradient>
        <linearGradient id="gh-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#gh-fill)" />
      {/* top gloss */}
      <rect x="2" y="2" width="96" height="48" rx="22" fill="url(#gh-gloss)" />
      {/* rim */}
      <rect x="2.5" y="2.5" width="95" height="95" rx="21.5" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
      <rect x="3.5" y="3.5" width="93" height="93" rx="20.5" fill="none" stroke="rgba(0,0,0,.4)" strokeWidth="0.5" />
      {/* Octocat — centered, big */}
      <g transform="translate(18 18) scale(2.75)" fill="#FFFFFF">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.653 1.653.242 2.873.12 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.37.823 1.102.823 2.222 0 1.606-.014 2.896-.014 3.293 0 .322.218.694.825.577C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </g>
    </svg>
  );
}

function LinkedInSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 6px 14px rgba(10,30,60,.4))" }}>
      <defs>
        <linearGradient id="li-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A66C2" />
          <stop offset="100%" stopColor="#004182" />
        </linearGradient>
        <linearGradient id="li-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,.28)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="96" height="96" rx="22" fill="url(#li-fill)" />
      <rect x="2" y="2" width="96" height="48" rx="22" fill="url(#li-gloss)" />
      <rect x="2.5" y="2.5" width="95" height="95" rx="21.5" fill="none" stroke="rgba(255,255,255,.5)" strokeWidth="1" />
      <rect x="3.5" y="3.5" width="93" height="93" rx="20.5" fill="none" stroke="rgba(0,0,0,.25)" strokeWidth="0.5" />
      {/* "in" mark — centered, big */}
      <g transform="translate(18 18) scale(2.75)" fill="#FFFFFF">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.602 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </g>
    </svg>
  );
}

function MailSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 4px 10px rgba(10,30,60,.3))" }}>
      <defs>
        <linearGradient id="ml-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8AC8FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#ml-g)" />
      <rect x="4" y="4" width="92" height="46" rx="22" fill="rgba(255,255,255,.2)" />
      <rect x="4" y="4" width="92" height="92" rx="22" fill="none" stroke="rgba(255,255,255,.55)" />
      {/* envelope */}
      <rect x="22" y="32" width="56" height="38" rx="5" fill="#fff" />
      <path d="M22 36 L50 56 L78 36" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinejoin="round" />
      <rect x="22" y="32" width="56" height="38" rx="5" fill="none" stroke="rgba(10,30,60,.2)" />
    </svg>
  );
}

function PhotosSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 4px 10px rgba(10,30,60,.28))" }}>
      <defs>
        <radialGradient id="ph-g" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0%" stopColor="#FFF4F0" />
          <stop offset="100%" stopColor="#F4E6E0" />
        </radialGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#ph-g)" />
      <rect x="4" y="4" width="92" height="92" rx="22" fill="none" stroke="rgba(10,30,60,.2)" />
      {/* photo petals */}
      {[
        { c: "#FF5F6D", a: 0 },
        { c: "#FFC371", a: 60 },
        { c: "#45E6B0", a: 120 },
        { c: "#22D3FF", a: 180 },
        { c: "#8A5CF0", a: 240 },
        { c: "#FF4FA6", a: 300 },
      ].map((p, i) => (
        <circle
          key={i}
          cx={50 + Math.cos((p.a * Math.PI) / 180) * 20}
          cy={50 + Math.sin((p.a * Math.PI) / 180) * 20}
          r="16"
          fill={p.c}
          opacity="0.9"
        />
      ))}
      <circle cx="50" cy="50" r="14" fill="#fff" />
    </svg>
  );
}

function ResumeSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 4px 10px rgba(10,30,60,.25))" }}>
      <defs>
        <linearGradient id="rs-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E7EEF7" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="22" fill="rgba(220,232,255,.5)" />
      {/* paper */}
      <path d="M22 16 L66 16 L82 32 L82 84 Q82 86 80 86 L22 86 Q20 86 20 84 L20 18 Q20 16 22 16 Z" fill="url(#rs-paper)" />
      <path d="M66 16 L66 32 L82 32" fill="rgba(34,211,255,.25)" stroke="rgba(34,211,255,.6)" strokeWidth="1" />
      <rect x="4" y="4" width="92" height="92" rx="22" fill="none" stroke="rgba(10,30,60,.18)" />
      {/* lines */}
      <rect x="28" y="40" width="40" height="3" rx="1" fill="#22D3FF" />
      <rect x="28" y="50" width="48" height="2" rx="1" fill="#6B7E9C" />
      <rect x="28" y="56" width="36" height="2" rx="1" fill="#6B7E9C" />
      <rect x="28" y="66" width="48" height="2" rx="1" fill="#6B7E9C" />
      <rect x="28" y="72" width="30" height="2" rx="1" fill="#6B7E9C" />
      <text x="51" y="16" textAnchor="middle" fontSize="6" fill="#0B1A33" fontFamily="var(--font-mono), monospace" opacity="0.6">PDF</text>
    </svg>
  );
}

function WelcomeSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 5px 12px rgba(10,30,60,.2))" }}>
      <defs>
        <linearGradient id="wl-paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0F5FD" />
        </linearGradient>
      </defs>
      {/* paper */}
      <path d="M22 10 L70 10 L84 24 L84 88 Q84 90 82 90 L22 90 Q20 90 20 88 L20 12 Q20 10 22 10 Z" fill="url(#wl-paper)" />
      <path d="M70 10 L70 24 L84 24" fill="rgba(34,211,255,.12)" stroke="rgba(34,211,255,.55)" strokeWidth="1" />
      <path d="M22 10 L70 10 L84 24 L84 88 Q84 90 82 90 L22 90 Q20 90 20 88 L20 12 Q20 10 22 10 Z" fill="none" stroke="rgba(10,30,60,.18)" />
      {/* lines of text */}
      <rect x="30" y="38" width="30" height="3.5" rx="1" fill="#22D3FF" />
      <rect x="30" y="48" width="40" height="2.5" rx="1" fill="#6B7E9C" />
      <rect x="30" y="54" width="36" height="2.5" rx="1" fill="#6B7E9C" />
      <rect x="30" y="60" width="42" height="2.5" rx="1" fill="#6B7E9C" />
      <rect x="30" y="66" width="24" height="2.5" rx="1" fill="#6B7E9C" />
      <text x="26" y="20" fontSize="5" fill="#0B1A33" fontFamily="var(--font-mono), monospace" opacity="0.6">TXT</text>
    </svg>
  );
}

function ResearchSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 4px 10px rgba(10,30,60,.28))" }}>
      <defs>
        <linearGradient id="rsh-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#56E8D0" />
          <stop offset="100%" stopColor="#0A9183" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#rsh-g)" />
      <rect x="4" y="4" width="92" height="46" rx="22" fill="rgba(255,255,255,.18)" />
      <rect x="4" y="4" width="92" height="92" rx="22" fill="none" stroke="rgba(255,255,255,.4)" />
      {/* open book */}
      <path d="M18 34 L50 40 L82 34 L82 72 L50 78 L18 72 Z" fill="#fff" opacity="0.95" />
      <path d="M50 40 L50 78" stroke="rgba(10,30,60,.25)" />
      <rect x="24" y="48" width="18" height="2" fill="#22D3FF" />
      <rect x="24" y="54" width="22" height="1.5" fill="#6B7E9C" />
      <rect x="58" y="48" width="18" height="2" fill="#22D3FF" />
      <rect x="58" y="54" width="22" height="1.5" fill="#6B7E9C" />
      {/* bookmark */}
      <path d="M64 30 L72 30 L72 44 L68 40 L64 44 Z" fill="#FF4FA6" />
    </svg>
  );
}

function SkillsSticker({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ filter: "drop-shadow(0 4px 10px rgba(10,30,60,.3))" }}>
      <defs>
        <linearGradient id="sk-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A5768" />
          <stop offset="100%" stopColor="#1A2232" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="22" fill="url(#sk-g)" />
      <rect x="4" y="4" width="92" height="46" rx="22" fill="rgba(255,255,255,.1)" />
      <rect x="4" y="4" width="92" height="92" rx="22" fill="none" stroke="rgba(34,211,255,.3)" />
      {/* CPU chip */}
      <rect x="28" y="28" width="44" height="44" rx="4" fill="#0E1A2F" stroke="#22D3FF" strokeWidth="1" />
      <rect x="36" y="36" width="28" height="28" rx="2" fill="#2E3E55" stroke="rgba(34,211,255,.5)" />
      {/* pins */}
      {[34, 42, 50, 58, 66].map((y) => (
        <g key={y}>
          <rect x="20" y={y} width="8" height="2" fill="#B0C4DE" />
          <rect x="72" y={y} width="8" height="2" fill="#B0C4DE" />
        </g>
      ))}
      {[34, 42, 50, 58, 66].map((x) => (
        <g key={x}>
          <rect x={x} y="20" width="2" height="8" fill="#B0C4DE" />
          <rect x={x} y="72" width="2" height="8" fill="#B0C4DE" />
        </g>
      ))}
      <text x="50" y="54" textAnchor="middle" fontSize="8" fill="#22D3FF" fontFamily="var(--font-mono), monospace" fontWeight="700">CPU</text>
    </svg>
  );
}

export function AppIcon({ kind, size = 72 }: { kind: AppIconKind; size?: number }) {
  switch (kind) {
    case "files":
    case "projects":
    case "experience":
    case "education":
      return <Folder size={size} kind={kind} />;
    case "hamza":
      return <HamzaSticker size={size} />;
    case "github":
      return <GithubSticker size={size} />;
    case "linkedin":
      return <LinkedInSticker size={size} />;
    case "mail":
      return <MailSticker size={size} />;
    case "photos":
      return <PhotosSticker size={size} />;
    case "resume":
      return <ResumeSticker size={size} />;
    case "welcome":
      return <WelcomeSticker size={size} />;
    case "research":
      return <ResearchSticker size={size} />;
    case "skills":
      return <SkillsSticker size={size} />;
    default:
      return <Folder size={size} kind="files" />;
  }
}
