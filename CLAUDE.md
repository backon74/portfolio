# HamzaOS — Hamza Alkhaldi's portfolio

A personal portfolio that looks and behaves like a clean, macOS-inspired desktop called **HamzaOS**.
It has three experiences that share one content source:

| Experience | Where | Who it is for |
|---|---|---|
| **Explore Mode** (default) | `/` at ≥ 768 px wide | Engineers and curious visitors: desktop, windows, dock, widgets |
| **Phone mode** | `/` at < 768 px wide | Mobile visitors (LinkedIn app): iOS-style home screen, full-screen apps |
| **Recruiter View** | `/recruiter` (also toggled from the menu bar) | Recruiters with ~11 seconds: single-column, résumé-first, no animation |

Owner: Hamza Alkhaldi, senior B.S. Computer Science student at AUBH (Bahrain), targeting graduate **mobile / software engineering** roles and a later Master's in AI/ML.

## Read these before writing code
- `docs/PRD.md` — every screen, window, widget, route and behaviour, with acceptance criteria. **The source of truth for what to build.**
- `docs/DESIGN.md` — design tokens, layout measurements, components, motion, icons. **The source of truth for how it looks.**
- `docs/BUILD_PLAN.md` — the phase you are on and its checklist.
- `docs/ASSETS.md` — every image/audio slot, its path and its placeholder.
- `docs/content/*.ts` — all copy and data. Moved to `src/content/` in Phase 0.

## Stack
- **Next.js (App Router) + React + TypeScript (strict)**, latest stable at scaffold time. Deployed on **Vercel** (free `*.vercel.app` URL).
- **Tailwind CSS v4** with tokens from `docs/DESIGN.md` defined in `src/app/globals.css` via `@theme`.
- **Motion** (`motion` package, `import { motion } from "motion/react"`) for open/close/minimise and home-screen transitions.
- **Zustand** for the window manager and OS state (one store: `src/os/store.ts`).
- **Lucide React** for UI glyphs only (not for app icons — those are custom SVGs).
- Fonts via `next/font`: **Inter** (UI) and **JetBrains Mono** (code/terminal accents).
- Server data in **Route Handlers** with ISR caching: GitHub contributions (GraphQL API), weather (Open-Meteo, no key), song preview (iTunes Search API, no key).
- Contact form: **Resend** via a Route Handler, honeypot + simple rate limit, with `mailto:` fallback.
- Testing: **Vitest** + Testing Library for store/logic, **Playwright** for E2E and screenshots (Chromium is already installed via `npx playwright install chromium` if missing).
- Package manager: **npm**. Do not add other UI kits (no shadcn, MUI, Chakra) — the OS chrome is bespoke.

## Commands
```bash
npm run dev          # local dev at http://localhost:3000
npm run build        # production build — must pass with zero errors and zero type errors
npm run lint         # ESLint — must pass
npm run typecheck    # tsc --noEmit
npm run test         # Vitest
npm run e2e          # Playwright (starts the dev server itself)
```

## Architecture (target)
```
src/
  app/
    layout.tsx                 # fonts, metadata, <body> bg
    page.tsx                   # chooses Desktop or Phone shell (client) — SSR renders a light skeleton
    recruiter/page.tsx         # Recruiter View — Server Component, static, no client JS beyond toggle
    api/github/route.ts        # contributions calendar (revalidate 6h)
    api/weather/route.ts       # Muharraq + Marrakech (revalidate 30 min)
    api/song/route.ts          # iTunes preview lookup (revalidate 7 days)
    api/contact/route.ts       # Resend
    opengraph-image.tsx, icon.tsx, sitemap.ts, robots.ts
  content/                     # typed content — the ONLY place copy lives
  os/
    store.ts                   # Zustand: windows, z-order, focus, minimised, maximised, mode, sound, firstVisit
    apps.ts                    # app registry: id, title, icon, default size, component, singleInstance
    hooks/                     # useDrag, useResize, useHotkeys, useMediaQuery, useReducedMotion, useSound
  components/
    desktop/                   # MenuBar, Desktop, DesktopIcon, Dock, Window, WindowFrame, Widgets/*
    phone/                     # HomeScreen, AppScreen, StatusBar, PhoneDock
    apps/                      # Finder(Projects/Experience/Education), CaseStudy, Research, Skills, Hamza, Photos, Resume, Mail, Welcome
    recruiter/                 # RecruiterPage sections
    ui/                        # Button, Chip, Tabs, Badge, Tooltip, Icon (custom SVG set)
  lib/                         # github.ts, weather.ts, itunes.ts, rateLimit.ts, cn.ts
public/
  images/…  audio/…  resume/Hamza_Alkhaldi_Resume.pdf
```
Each app component receives no props except an optional `payload` (e.g. which project to open). Apps read from `src/content`. Windows are rendered by one `<WindowLayer>` from store state; apps never position themselves.

## Non-negotiable rules
1. **Never invent facts about Hamza.** All names, dates, numbers, links and claims come from `src/content`. If something is missing, render the placeholder defined there and add it to the TODO list in your summary — do not make up metrics, employers, links or awards. Fields marked `TODO(hamza)` stay visibly marked in dev only (`process.env.NODE_ENV !== "production"` shows a small amber dot), never in production copy.
2. **Privacy:** never render Hamza's phone number, home address or date of birth anywhere. Email is only reachable through the Mail app/contact form and a `mailto:` link built at runtime (not plain text in HTML).
3. **Not Apple:** HamzaOS is inspired by macOS but must not copy Apple assets — no Apple logo, no SF Pro font files, no copied Apple icons or wallpapers, no "macOS"/"Finder" wording in the UI. Use our own icon set and names (e.g. the folder app is called "Files"). App icons for LinkedIn/GitHub/Gmail use simple monochrome glyphs inside our own rounded-square tiles (from `simple-icons` or Lucide), not the companies' full-colour logos.
4. **Recruiter View must stay fast and boring:** no Motion, no widgets, no audio, no client-side data fetching. Server Component, static at build time. Lighthouse Performance ≥ 95 and Accessibility = 100 on `/recruiter`.
5. **Accessibility:** every interactive element is keyboard reachable with a visible focus ring; windows are `role="dialog"` with `aria-labelledby`; desktop icons are buttons; single click opens (no double-click requirement); honour `prefers-reduced-motion` (all transitions become 0–80 ms fades); colour contrast WCAG AA; all images have meaningful `alt`.
6. **Performance budgets:** Explore Mode first-load JS ≤ 200 KB gzipped; LCP ≤ 2.5 s on a mid-range phone; no layout shift from widgets (reserve their boxes). Lazy-load every app component with `next/dynamic` and images with `next/image`.
7. **Light theme only.** No dark mode.
8. **Sound is opt-in-safe:** UI sounds are tiny, play only after the first user gesture, and the menu-bar speaker toggle mutes everything (persisted in `localStorage`, wrapped in try/catch).
9. **External APIs never break the page:** every Route Handler has a timeout (4 s), returns cached/fallback data on failure, and widgets render a graceful placeholder state.
10. **Secrets** live only in `.env.local` / Vercel env (`GITHUB_TOKEN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`). Never commit them. Keep `.env.example` up to date.

## Working conventions
- `/build-hamzaos` (in `.claude/skills/`) runs every phase automatically and tracks status in `docs/PROGRESS.md`. Whether run that way or manually, work one phase of `docs/BUILD_PLAN.md` at a time. Start each phase in plan mode, then implement, then run its **Verify** steps before saying it is done.
- After UI work, **look at it**: run Playwright screenshots at 1440×900, 1280×800, 1024×768 and 390×844 (`npm run e2e -- --project=screens` once that project exists) and inspect them. Fix what looks off before reporting.
- Keep components small (< ~200 lines). Co-locate component styles in Tailwind classes; shared values come from tokens, never hard-coded hex values in components.
- TypeScript strict, no `any`, no non-null assertions on content.
- Commit at the end of each phase with a clear message (`feat(os): window manager with drag/resize/minimise`). Do not push unless asked.
- When a decision is not covered by the docs, choose the option that keeps the site simpler and faster for a recruiter, note it in `docs/DECISIONS.md` (create it), and continue.
- Do not build the Simulator app, a terminal, an AI chat, or dark mode — they are out of scope (see PRD "Backlog").
