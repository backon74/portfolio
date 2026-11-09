# HamzaOS

Hamza Alkhaldi's portfolio, built as a small macOS-inspired operating system in the browser.

Three experiences from one content source:

- **Explore Mode** (`/` at ≥ 768 px): a desktop with windows, a dock, widgets and a menu bar.
- **Phone mode** (`/` at < 768 px): an iOS-style home screen with full-screen apps.
- **Recruiter View** (`/recruiter`): a static, single-page résumé for anyone with ~11 seconds.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **Motion**, **Zustand** and **Lucide**. Server data via Route Handlers (GitHub contributions, Open-Meteo weather, iTunes song preview). Contact form via **Resend** with a `mailto:` fallback.

See `CLAUDE.md`, `docs/PRD.md`, `docs/DESIGN.md`, `docs/BUILD_PLAN.md` and `START_HERE.md` for the full story.

## Scripts

```bash
npm run dev          # local dev at http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (unit)
npm run e2e          # Playwright (uses the dev server, 60 tests across 3 projects)
npm run privacy-check  # fails the build if anything in .private-terms leaks
```

## Environment variables

Copy `.env.example` if present, otherwise create `.env.local` with:

```
NEXT_PUBLIC_SITE_URL=https://your-url.vercel.app   # used by sitemap, robots, canonical and OG
GITHUB_TOKEN=ghp_...                               # fine-grained token, public-repo read, for the GitHub widget
RESEND_API_KEY=re_...                              # for the Mail app contact form
CONTACT_TO_EMAIL=alkhaldihamza06@gmail.com         # inbox the contact form delivers to
NEXT_PUBLIC_ENABLE_ANALYTICS=1                     # optional, set to 0 to disable Vercel Analytics in prod
```

All widgets and the contact form degrade gracefully if their keys are missing.

## Screenshots

Full-page captures live under `screenshots/` (git-ignored). Regenerate them with:

```bash
npm run e2e -- --project=screens
```

That writes captures of `/` and `/recruiter` at 1440×900, 1280×800, 1024×768 and 390×844, plus each app window.

## Deploying

Vercel click-path is in **`START_HERE.md` §5**. Short version:

1. Import the repo on vercel.com → Deploy.
2. Project → Settings → Environment Variables: add `NEXT_PUBLIC_SITE_URL`, `GITHUB_TOKEN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`. Redeploy.
3. Project → Analytics → Enable. Vercel Analytics is already wired and fires `recruiter_view_opened`, `resume_downloaded`, `project_opened` and `contact_sent`.
4. Share `https://<your-url>/recruiter` with recruiters.
