# HamzaOS — Build plan

Ten phases (0–9). Each one ends in something you can open in the browser, a passing build and a git commit.
**How to run a phase:** start a fresh Claude Code conversation (`/clear`), press **Shift+Tab** until you're in **plan mode**, paste the phase prompt, read the plan it proposes, then approve it. When it finishes, check the "You check" list yourself before moving on.

> Model: Opus 5.5, medium effort. If a phase struggles (e.g. the window manager), re-run it on high effort.

---

## Phase 0 — Scaffold & tooling
**Prompt**
```
Read CLAUDE.md and docs/BUILD_PLAN.md (Phase 0 only for now).

Set up the project in this repo:
1. create-next-app refuses a non-empty folder, so scaffold into ./_scaffold with: npx create-next-app@latest _scaffold --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes (check `--help` first if a flag is rejected), then move its contents into the repo root (merge .gitignore, keep our README/CLAUDE.md/docs) and delete _scaffold.
2. Install: motion zustand lucide-react simple-icons zod resend clsx tailwind-merge @vercel/analytics; dev: vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test prettier prettier-plugin-tailwindcss.
3. Add scripts: typecheck, test, e2e. Configure Vitest (jsdom) and Playwright (projects: "e2e" desktop Chromium 1440x900, "phone" 390x844, and "screens" that saves screenshots of / and /recruiter at 1440x900, 1280x800, 1024x768, 390x844 into ./screenshots, git-ignored). webServer: npm run dev.
4. Move docs/content/*.ts to src/content/ and make it compile under strict TS. Add src/content/index.ts re-exporting everything. Add a unit test that every project slug is unique, every skills.usedIn id resolves or is "portfolio", and add `npm run privacy-check`: a small script that reads the git-ignored `.private-terms` file (one term per line; skip silently if absent) and fails if any term appears in src/, public/ text files or .next/. Add `.private-terms` to .gitignore. Never write the terms themselves into any committed file.
5. Copy kit assets: assets/images/** -> public/images/**, assets/research/* -> public/research/, assets/resume/* -> public/resume/. Delete the now-empty assets/ folder.
6. Keep the existing .env.example (make sure .env.local is git-ignored) and create docs/DECISIONS.md.
7. Fonts: Inter + JetBrains Mono with next/font. Put all tokens from docs/DESIGN.md §2 into src/app/globals.css under @theme. Light theme only.
8. Replace the starter page with a temporary page that renders the wallpaper gradient and "HamzaOS" so we can see the tokens work.
Run build, lint, typecheck, test. Commit "chore: scaffold HamzaOS".
```
**You check:** `npm run dev` → soft gradient page at localhost:3000. `npm run test` passes.

---

## Phase 1 — OS store & window manager (desktop core)
**Prompt**
```
Read CLAUDE.md, docs/PRD.md §3.1–3.2 and docs/DESIGN.md §3, §6. Build the desktop core with placeholder app contents:
- src/os/store.ts (Zustand): windows map {id, appId, payload, rect, prevRect, z, minimised, maximised}, focusedId, open/close/focus/minimise/restore/toggleMaximise/move/resize/cascade/minimiseAll, sessionStorage persistence (try/catch). Unit-test the store thoroughly (focus/z-order, single-instance, case-study cap of 4, clamping).
- src/os/apps.ts registry with every app id from the PRD (welcome, files, caseStudy, research, skills, hamza, photos, resume, mail, aboutOs, shortcuts), title, icon, default/min size, singleInstance, lazy component via next/dynamic. For now each app renders a simple placeholder with its name.
- Components: MenuBar (logo, focused app name, File/View/Help menus with keyboard-accessible dropdowns, Recruiter View pill as a real <a href="/recruiter">, sound toggle, Muharraq clock), Desktop + DesktopIcon (9 icons, 2 columns, single click, arrow-key navigation), Dock (two groups, running dots, tooltips, magnification), Window/WindowFrame (traffic lights, drag via pointer events, 8 resize handles, maximise, minimise animation to the dock icon, close), WindowLayer.
- Keyboard shortcuts from the PRD. Focus management (focus moves into a window on open, back to the opener on close).
- Custom HamzaOS icon set per DESIGN.md §5 (SVG squircle tiles, folder and file icons, logo mark).
- Deep links ?open=<appId> and ?open=project:<slug>, and replaceState as focus changes.
Use the wallpaper from DESIGN.md. Then run the "screens" Playwright project and look at every screenshot; fix anything that doesn't match DESIGN.md. Add Playwright e2e tests: open/drag/resize/minimise/restore/maximise/close, keyboard open from desktop icon, deep link. Commit.
```
**You check:** open 3–4 windows, drag them around, resize from corners, minimise into the dock and bring back, maximise, press Esc. Try to lose a window off-screen (you shouldn't be able to).

---

## Phase 2 — Visual polish pass on the shell
**Prompt**
```
Read docs/DESIGN.md fully. Do a high-fidelity polish pass on the desktop shell only (menu bar, icons, dock, windows, wallpaper):
- Write scripts/render-wallpaper.ts that renders the DESIGN.md wallpaper CSS + grain with Playwright at 2880x1800 and saves public/images/wallpaper/hamzaos.webp (and a 1170x2532 portrait version for phones). Use it with next/image (priority) and keep the CSS gradient as fallback.
- Check every item in DESIGN.md §9 against fresh screenshots at all four sizes. Compare spacing against §3 measurements with the browser's computed styles (use Playwright to read boundingBox values and assert key ones in a test: menu bar 30px, dock icon 52px, window radius 14px, title bar 44px).
- Make sure hover/focus/active states exist for menu items, desktop icons, dock icons and traffic lights; reduced motion works (test with emulateMedia).
Show me a short list of what you changed. Commit.
```
**You check:** it should now look like a finished, calm, premium desktop even with empty windows.

---

## Phase 3 — Content apps (Files, Case study, Research, Skills, Résumé)
**Prompt**
```
Read CLAUDE.md, docs/PRD.md §3.5 and §6, docs/DESIGN.md §4, and everything in src/content. Build these apps for real, reading only from src/content:
1. Files (Projects / Experience / Education locations, sidebar, back/forward, grid/list toggle, search, filter chips All·Mobile·AI/ML·Cloud·Web·Systems; master–detail for Experience and Education).
2. CaseStudy (fixed section order from the PRD, media carousel with placeholders, metric tiles, facts panel, prev/next). Project tiles with opensApp:"research" open the Research app instead.
3. Research (paper-page preview, figure strip + lightbox, key results, what I did, Code/Certificate/Slides buttons, Copy citation with toast).
4. Skills (System Information layout, category sidebar, usedIn links that open the right case study or Experience entry).
5. Résumé.pdf (iframe preview + Download + Open in new tab); /resume redirect route.
Implement placeholder rendering: ImageSlot with placeholder:true renders a tasteful neutral tile with the alt text in small caption type (no broken images). TODO values render as an em dash in production and an amber dot + tooltip with the todo text in development. Hide GitHub/Demo buttons when the value is null or TODO.
Add e2e tests that open each app from the desktop and that every project opens a case study (or Research). Screenshot each app at 1440x900 and polish against DESIGN.md. Commit.
```
**You check:** read every case study — this is where wrong facts would show. Note anything to change in `src/content/projects.ts`.

---

## Phase 4 — Personal apps (Welcome, Hamza, Photos, Mail) + contact API
**Prompt**
```
Read docs/PRD.md §3.3, §3.5 (Hamza, Photos, Mail, About HamzaOS, Keyboard shortcuts) and §8 (contact). Build:
- Welcome.txt auto-open on first visit (localStorage flag, try/catch) and with ?welcome=1; buttons per PRD.
- Hamza app with segmented tabs About · Beyond code · Awards · Trips (Trips open Photos at that album).
- Photos app: albums sidebar, grid, accessible lightbox (focus trap, arrows, Esc).
- Mail app + POST /api/contact with zod validation, honeypot, in-memory rate limit (3 per 10 min per IP), Resend send (from "HamzaOS <onboarding@resend.dev>", to CONTACT_TO_EMAIL, replyTo visitor). All UI states. If RESEND_API_KEY is missing, the route returns 503 and the UI shows the mailto fallback. Build the mailto address at runtime from links.emailParts.
- About HamzaOS and Keyboard shortcuts windows; Help menu items wired.
Unit-test the contact route (valid, invalid, honeypot, rate limit, missing key). Commit.
```
**You check:** put your Resend key in `.env.local` (see START_HERE) and send yourself a test message.

---

## Phase 5 — Widgets + data routes
**Prompt**
```
Read docs/PRD.md §3.4 and §8. Build the four widgets and their route handlers:
- /api/github (GraphQL contributionsCollection for backon74, GITHUB_TOKEN, revalidate 21600, 4s timeout, fallback) + GitHub widget (last ~20 weeks grid, 5-level green scale from tokens, tooltips, total).
- /api/weather (Open-Meteo for Muharraq and Marrakech with their own time zones, revalidate 1800) + Weather widget (two cities side by side, WMO code → Lucide icon + label in src/lib/weather.ts, click toggles 3-day forecast).
- /api/song (iTunes Search API, pick the "Off the Wall" track, revalidate 604800) + Now Playing widget (play/pause the 30-second preview with an <audio> element, progress bar, artwork via next/image with the itunes domain allowed in next.config, "Preview · Apple Music" attribution linking to trackUrl). Never autoplay.
- Profile widget (photo slot, name, role, location line) → opens Hamza app.
All widgets reserve their size (skeletons), handle errors, and collapse at the breakpoints in the PRD. Unit-test the three lib parsers with recorded fixture JSON (save fixtures under src/lib/__fixtures__). Commit.
```
**You check:** with `GITHUB_TOKEN` set you see your real green squares; weather shows both cities; the song plays when you press play.

---

## Phase 6 — Boot, sound, motion finish
**Prompt**
```
Read docs/PRD.md §3.3 and §9 and docs/DESIGN.md §6. Add:
- Boot screen (first visit only, 1.2s, skippable, never on /recruiter, deep links, phones, or reduced motion).
- Sound system: useSound hook, sounds in public/audio (generate tiny, clean UI sounds with a small Node script using raw PCM → WAV → encode with ffmpeg if available, otherwise WAV under 30 KB each; or use CC0 files and credit them in About HamzaOS). Default off; speaker toggle persists; chime on first enable.
- Verify every Motion spec in DESIGN.md §6 (durations ≤ 400 ms) and that prefers-reduced-motion reduces everything to quick fades.
- Widget stagger on first boot.
Commit.
```

---

## Phase 7 — Recruiter View
**Prompt**
```
Read docs/PRD.md §4 and docs/DESIGN.md §8. Build /recruiter as a static Server Component with zero Motion and no client data fetching. Section order exactly as the PRD. Featured project cards link to /?open=project:<slug>. Add print styles, JSON-LD Person (no phone/address), metadata. Menu-bar toggle on / navigates here; "Back to desktop" returns without the boot screen.
Then run Lighthouse on a production build (npx lighthouse http://localhost:3000/recruiter --preset=desktop and the mobile default) and fix until Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100. Report the scores. Commit.
```
**You check:** open `/recruiter` on your phone and laptop; try printing it to PDF.

---

## Phase 8 — Phone mode
**Prompt**
```
Read docs/PRD.md §5 and docs/DESIGN.md §7. Build the phone shell for viewports < 768px: status bar, two widget pages with page dots (swipe), 4-column app grid, glass dock, full-screen app screens with layoutId zoom from the icon, large-title nav bars that collapse on scroll, push navigation inside apps (Projects list → case study), back via button, edge swipe and browser history. Reuse the same app content components where possible, with phone layouts (grouped inset lists). Welcome as a bottom sheet on first visit. No boot screen, no UI sounds. Tap targets ≥ 44px.
Add Playwright "phone" tests for opening every app and navigating back. Screenshot at 390x844 and 360x780, polish, commit.
```
**You check:** open the dev URL on your actual phone (same Wi-Fi: `npm run dev -- -H 0.0.0.0`, then your Mac's IP:3000).

---

## Phase 9 — SEO, analytics, QA, deploy
**Prompt**
```
Read docs/PRD.md §7, §10, §11. Add metadata, the next/og Open Graph image, icon.tsx favicon from the logo mark, sitemap, robots, Vercel Analytics with the four custom events. Then run the full acceptance checklist in PRD §11 item by item, fix failures, and report a table of results. Run an accessibility pass with @axe-core/playwright on /, each app window, /recruiter and phone mode; fix all serious/critical issues. Make sure the production build contains no phone number/address/DOB. Update README.md with a short project description, screenshots and run instructions. Commit "chore: release v1.0".
Then tell me exactly what to click in Vercel to deploy and which env vars to set.
```
**You check:** deploy on Vercel (START_HERE.md step 5), then open the live URL on your phone and laptop.

---

## After v1: content swaps (any time)
```
I've added real images to public/images (see docs/ASSETS.md) and updated src/content. Set placeholder:false for every ImageSlot whose file now exists (check the filesystem), remove resolved TODOs, flip approved projects to status "approved", run the tests and screenshots, and commit.
```
