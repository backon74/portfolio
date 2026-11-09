# HamzaOS — Product Requirements

## 1. Goal
One portfolio that is **remembered by engineers** (an interactive desktop) and **scanned in seconds by recruiters** (Recruiter View), on **any screen** (phone home screen).
Primary audience: hiring managers and engineers for graduate mobile/software roles (GCC and international big tech). Secondary: Master's (AI/ML) admissions reviewers.

Research the design rests on (keep these decisions; do not "simplify" them away):
- Recruiters spend ~11 s on a first résumé scan and read single-column layouts longer → Recruiter View, résumé-first, single column.
- Hiring managers open portfolios but rarely explore; a confusing or broken portfolio hurts more than none → Welcome window, always-visible Recruiter toggle, robust fallbacks.
- Projects/GitHub outrank degrees as hiring signals → GitHub link and metrics first in every case study; live GitHub widget.
- ~52% of web traffic is mobile, most LinkedIn time is in-app → a real phone home screen, not a shrunken desktop.
- Jakob's Law → familiar desktop/OS patterns; single click (web users don't double-click).
- Progressive disclosure → detail only inside windows the visitor chooses to open.

## 2. Routes
| Route | Renders |
|---|---|
| `/` | Desktop shell (≥ 768 px) or Phone shell (< 768 px). Decided on the client by `matchMedia`; SSR outputs a neutral wallpaper + menu-bar skeleton so there is no flash of the wrong shell. |
| `/recruiter` | Recruiter View (static). |
| `/?open=<appId>` and `/?open=project:<slug>` | Deep links: open that window on load (desktop) or that app screen (phone). Update the URL with `history.replaceState` as the focused window changes, so links are shareable. |
| `/resume` | 302 → `/resume/Hamza_Alkhaldi_Resume.pdf`. |
| `/api/github`, `/api/weather`, `/api/song`, `/api/contact` | See §8. |

`/recruiter` is the link Hamza pastes into job applications. Its `<title>`: "Hamza Alkhaldi — Software Engineer (Mobile) · Résumé".

## 3. Explore Mode (desktop)

### 3.1 Layout (see DESIGN.md for exact measurements)
- **Menu bar** (top, full width, frosted):
  - Left: HamzaOS logo mark (opens "About HamzaOS" mini window: built with…, version, credits, link to repo), then the **focused app's name** in bold, then 3 menu titles: **File · View · Help**.
    - File: "New window" (disabled), "Close window ⌘W", "Download résumé".
    - View: "Recruiter View", "Arrange windows" (cascade), "Minimise all".
    - Help: "Show welcome", "Keyboard shortcuts", "Contact Hamza".
  - Right: **Recruiter View** pill toggle (always visible, accent coloured, label "Recruiter View"), sound toggle (speaker icon), Muharraq time (e.g. "Mon 2 Nov 11:54", Asia/Bahrain, updates each minute).
- **Desktop icons** — two columns on the left, top-aligned, in this order:
  1. Welcome.txt (file) 2. Projects (folder) 3. Experience (folder) 4. Education (folder) 5. Research (app) 6. Skills (app) 7. Hamza (app) 8. Photos (app) 9. Résumé.pdf (file)
  Icons are fixed (not draggable). Single click opens; keyboard: arrow keys move selection, Enter opens. Hover shows a subtle highlight; selected shows accent-tinted label background.
- **Widgets** — stacked on the right column, top-aligned (see §3.4).
- **Dock** — centred at bottom, frosted. Left group (apps): Files, Projects, Photos, Skills, Hamza. Divider. Right group (links): LinkedIn, GitHub, Mail, Résumé. Running apps show a small dot under the icon. Hover: label tooltip above + gentle magnification (scale 1.0 → 1.25 on the hovered icon, 1.1 on neighbours; off under reduced motion).
- **Wallpaper**: soft abstract gradient (see DESIGN.md), as an optimised image with CSS gradient fallback.

### 3.2 Window manager
- Multiple windows open at once; each app is **single-instance** except `CaseStudy` (one per project, max 4 open; opening a 5th closes the oldest case study).
- Click anywhere on a window → focus + bring to front. Focused window has stronger shadow; unfocused title text is muted.
- **Title bar**: three traffic-light buttons on the left (close / minimise / maximise — use HamzaOS colours from DESIGN.md, glyphs appear on hover of the group), centred title, optional toolbar slot on the right.
- **Drag** by the title bar (pointer events, `setPointerCapture`). Constrain so at least 80 px of the title bar always stays on screen and never under the menu bar.
- **Resize** from all edges and corners (8 handles, 6 px hit area, invisible). Respect each app's `minSize`.
- **Minimise**: window animates (scale + translate) toward its dock icon and hides; clicking the dock icon restores it to its previous rect.
- **Maximise**: fills the area between menu bar and dock with a 12 px margin; click again restores. Double-click on title bar toggles maximise too.
- **Close**: scale-down fade, removed from store.
- New windows open centred, cascading by 28 px for each already open window; clamp to viewport.
- Keyboard: `Esc` closes the focused window (unless a form field inside has focus), `⌘/Ctrl + W` closes, `⌘/Ctrl + M` minimises, `⌘/Ctrl + \`` cycles windows. Focus moves into a window when it opens and returns to the opener on close.
- On viewport resize, keep every window inside the viewport.
- State persists across reloads in `sessionStorage` (open windows + rects), try/catch guarded.

### 3.3 First visit
1. **Boot screen** (first visit in a browser only; flag in `localStorage`): white screen, HamzaOS logo mark, thin progress bar, 1.2 s total, then fades to the desktop. Click or any key skips. Never shown on `/recruiter`, on deep links, or when `prefers-reduced-motion` is set. The boot is silent (browsers block audio before a user gesture). A short chime plays the first time the visitor turns sound on.
2. **Welcome.txt** opens automatically (centred, 560×420) on the first visit and whenever `?welcome=1` is present. Content in `content/welcome.ts`. Two buttons: **Explore the desktop** (closes window) and **Open Recruiter View** (navigates to `/recruiter`). A small hint line: "Tip: everything opens with a single click."

### 3.4 Widgets (right column, 340 px wide, 16 px gaps)
All widgets reserve their final size immediately (skeleton shimmer while loading, no layout shift). All are clickable as described.
1. **Profile** (340×180): photo (rounded 20 px), "Hamza Alkhaldi", "Software Engineer · Mobile", small location line "Muharraq, Bahrain 🇧🇭 · Moroccan roots 🇲🇦". Click → opens Hamza app.
2. **Now Playing** (340×120): album art, "Workin' Day and Night", "Michael Jackson", play/pause button, thin progress bar. Plays the official 30-second iTunes preview fetched via `/api/song`. Never autoplays. Shows "Preview · Apple Music" small attribution and links the title to the track's Apple Music page. If the lookup fails, show the static title/artist with the button disabled.
3. **Weather** (340×150): two cities side by side — **Muharraq** and **Marrakech** — each with city name, flag, current temperature °C, condition icon, high/low, and local time. Data from `/api/weather` (Open-Meteo). Click toggles a 3-day mini forecast for both.
4. **GitHub activity** (340×170): last ~20 weeks of the contribution calendar as a squares grid (accent-green scale), total contributions in the last year, "@backon74" link. Data from `/api/github`. Hover a square → tooltip "N contributions on 2 Nov 2026". Fallback: a static "View my GitHub" card.

On viewports narrower than 1180 px, hide Now Playing; narrower than 1024 px, also hide Weather (keep Profile + GitHub).

### 3.5 Apps
Default sizes are for a 1440×900 viewport; clamp to 92% of viewport.

**Files (Projects / Experience / Education)** — one Finder-like component, three "locations" in its sidebar (Projects, Experience, Education, plus "Research" and "Résumé" shortcuts that open those apps). Opening the Projects icon opens Files at Projects, etc. Default 960×620.
- Toolbar: back/forward, location title, grid/list toggle, search field (filters by name, stack, tags).
- **Projects** location: filter chips — **All · Mobile · AI/ML · Cloud · Web · Systems** (Mobile selected-first order but "All" is default). Grid tiles show: cover thumbnail (16:10), name, one-line pitch, up to 3 stack chips, one proof badge (e.g. "🏆 2nd / 250+"). List view: table columns Name · Category · Stack · Year · Proof. Order: `featured` order from content. Click a tile → opens **CaseStudy** window for that project.
- **Experience** location: vertical list of roles (logo tile, role, org, dates, location); selecting one shows its detail on the right pane (bullets, skills chips, link). Default selection: Batelco.
- **Education** location: same master–detail pattern (AUBH, Reboot, school).

**CaseStudy** (per project) — default 860×700, scrollable body. Order is fixed:
1. Header: project icon/cover, name, one-line pitch, proof badge, buttons **GitHub** and **Live demo** (each only if the URL exists; open in new tab).
2. Media carousel (screenshots/diagrams/video), keyboard arrows, captions.
3. Metric tiles (1–3) — big number + label.
4. Sections: **Problem → What I built → Impact** (short paragraphs or bullets).
5. Facts panel (right column on wide windows, below on narrow): Role, Team, Timeline, Context (course / hackathon / program), Stack chips.
6. Footer: "‹ Previous project" / "Next project ›".

**Research** — paper viewer. Default 900×700. Left: paper "page" preview (title, authors, affiliation, abstract) styled like a PDF page. Below the abstract, a figure strip shows `research.figures` (click → lightbox with caption). Right panel: venue + status badge ("Accepted · Oral presentation · IEEE ETECOM 2026, Paris"), key results (4 metric tiles), "What I did" bullets, buttons **Code on GitHub**, **Certificate** (opens image/PDF), **Slides** (if provided), **Copy citation** (copies the IEEE-style citation, shows "Copied" toast). Note "To appear in IEEE Xplore" until a DOI is added in content.

**Skills** — "System Information" style. (`usedIn` ids that match a project slug or role id become links; anything else, e.g. `portfolio`, renders as plain text "this site".) Default 720×560. Left sidebar of categories (Languages, Mobile, AI/ML, Cloud & DevOps, Web & Backend, Tools). Right: a spec-sheet table — skill, a 1–3 dot "used in" indicator, and the projects it was used in (links that open the case study). Top summary card styled like "About this machine": "HamzaOS 1.0 — Hamza Alkhaldi", Processor: "B.S. Computer Science, AUBH", Memory: "6 shipped projects · 1 paper", etc. (values from content).

**Hamza** — personal app. Default 820×620. Header: photo, name, role, short bio, buttons **Say hi** (opens Mail) and **Résumé**. Tabs: **About · Beyond code · Awards · Trips**.
- About: bio paragraphs, quick facts list (based in, heritage, languages, studying, looking for).
- Beyond code: cards for game design & scripting, fashion design & sewing, weightlifting, MUN & debate (icon, title, 1–2 lines, optional photo).
- Awards: list with optional photo per award.
- Trips: grid of trip cards; click opens Photos at that album.

**Photos** — gallery. Default 900×620. Sidebar of albums (from content), grid of thumbnails, click → lightbox with arrows/Esc and caption. Placeholder tiles until real photos exist.

**Résumé.pdf** — preview window. Default 760×860 (clamped). Renders the PDF with the browser's built-in viewer in an `<iframe>` (fallback: link). Toolbar: **Download** and **Open in new tab**. Dock "Résumé" icon downloads directly.

**Mail** — contact composer. Default 600×520. Fields: Your name, Your email, Subject (prefilled "Hello from your portfolio"), Message. Send → `POST /api/contact`. States: idle, sending, sent (success check + "Thanks — I'll reply within a couple of days"), error (message + "Email me directly instead" mailto button). Honeypot field hidden from humans. Client validation (required, email format, message 10–2000 chars).

**About HamzaOS** — tiny window 420×300: logo, "HamzaOS 1.0", "Designed and built by Hamza Alkhaldi with Next.js", link to source repo, credits for weather (Open-Meteo), music preview (Apple), icons.

**Keyboard shortcuts** — tiny window listing shortcuts.

Dock link icons: LinkedIn and GitHub open in new tabs; Mail opens the Mail app; Résumé downloads the PDF.

## 4. Recruiter View (`/recruiter`)
Same HamzaOS menu bar (logo + "Recruiter View" + a **Back to desktop** pill on the right), then a single centred column (max 760 px), white "paper" card on the wallpaper-tinted background. No widgets, no Motion, no audio.
Section order (fixed):
1. **Header**: name (H1), "Software Engineer · Mobile (Android / iOS)", location line, availability line ("Graduating <month year> — open to graduate roles in the GCC and abroad"), buttons: **Download résumé** (primary), Email, LinkedIn, GitHub.
2. **At a glance** — 4 tiles in a row (2×2 on phone): Degree (B.S. CS, AUBH · cGPA 3.5), Internship (Batelco by Beyon · Android), Publication (IEEE ETECOM 2026 · oral), Award (2nd / 250+ · GSR Hackathon).
3. **Experience** — Batelco first; role, org, dates, 3 bullets each.
4. **Featured projects** — 4 cards (Anchor, SmartCool, GateKeep, RouteMate — order from content `recruiterFeatured`), each: name, pitch, stack, 1 proof, GitHub/demo links, "Case study ↗" link to `/?open=project:<slug>`.
5. **Research** — citation + 1-line result + link.
6. **Skills** — grouped comma lists (no bars, no ratings).
7. **Education** — AUBH, Reboot.
8. **Leadership & activities** — compact bullets.
9. Footer: "Prefer the full experience? Open HamzaOS →".
Must print cleanly (`@media print`: hide menu bar, black text, page breaks between sections avoided inside cards).
The menu-bar toggle on `/` navigates here; "Back to desktop" navigates to `/` (no boot screen).

## 5. Phone mode (< 768 px)
iOS-inspired home screen (not a copy of iOS):
- **Status bar**: Muharraq time (left), small HamzaOS mark + "Recruiter View" pill (right).
- **Widgets** at top: Profile widget (full width, 2×2 size), then GitHub widget (full width) — weather and music are available as a second page (horizontal swipe with page dots) to keep the first screen fast.
- **App grid** (4 columns): Projects, Experience, Education, Research, Skills, Hamza, Photos, Résumé.
- **Dock** (4): LinkedIn, GitHub, Mail, Welcome.
- Tapping an app: it zooms open full-screen from its icon (Motion `layoutId`), with a top bar: "‹ Home" back button, title. Inside, apps use iOS-style patterns: grouped lists, push navigation (e.g. Projects list → case study screen with "‹ Projects"). Swipe from left edge or the back button goes back. Android/system back button works (history entries per screen).
- Welcome appears as a bottom sheet on first visit (same copy, same two buttons).
- No boot screen on phones.

## 6. Content model
All content is typed in `src/content/` (types in `src/content/types.ts`). Components never contain copy except UI labels. See the files for the data; fields marked `TODO(hamza)` are pending from Hamza.

## 7. SEO & sharing
- Metadata: title "Hamza Alkhaldi — Software Engineer (Mobile)", description from profile.tagline, canonical URL from `NEXT_PUBLIC_SITE_URL`.
- Open Graph image generated with `next/og` (1200×630): wallpaper gradient, name, role, small desktop silhouette.
- `sitemap.xml`, `robots.txt`. JSON-LD `Person` on `/recruiter` (name, jobTitle, alumniOf, sameAs LinkedIn/GitHub — no phone/address).
- `/` stays lean: it does not duplicate the résumé content. The menu-bar "Recruiter View" toggle is a real `<a href="/recruiter">`, so crawlers and no-JS visitors reach the indexable `/recruiter` page.

## 8. Server routes
| Route | Source | Cache | Response shape | Fallback |
|---|---|---|---|---|
| `GET /api/github` | GitHub GraphQL `user(login:"backon74"){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount color}}}}}` with `GITHUB_TOKEN` (fine-grained, public read only) | `revalidate = 21600` | `{ total, weeks: {date,count,level}[][] }` | `{ total: null, weeks: [] }` + 200 |
| `GET /api/weather` | Open-Meteo forecast for Muharraq (26.2572, 50.6119, `Asia/Bahrain`) and Marrakech (31.6295, -7.9811, `Africa/Casablanca`): current temp + weather_code, daily max/min/weather_code for 3 days | `revalidate = 1800` | `{ cities: [{ id, name, flag, tz, temp, code, hi, lo, daily: [...] }] }` | last good or `{ cities: [] }` |
| `GET /api/song` | iTunes Search API `https://itunes.apple.com/search?term=workin+day+and+night+michael+jackson&entity=song&limit=5`, pick the Off the Wall track | `revalidate = 604800` | `{ title, artist, artworkUrl, previewUrl, trackUrl }` | `{ title, artist }` only |
| `POST /api/contact` | Resend (`from: "HamzaOS <onboarding@resend.dev>"`, `to: CONTACT_TO_EMAIL`, `replyTo: visitor`) | none | `{ ok: true }` / `{ ok:false, error }` | 4xx/5xx JSON; client shows mailto fallback |

Contact route: validate with **zod**, reject honeypot, rate-limit 3 requests / 10 min per IP (in-memory Map is acceptable; note in DECISIONS.md), strip HTML, max body 10 KB.
Weather code → icon/label mapping lives in `src/lib/weather.ts` (WMO codes).

## 9. Sound
Small set in `public/audio/` (each < 30 KB, generate or source CC0 and credit in About): `boot.mp3`, `open.mp3`, `close.mp3`, `minimise.mp3`, `click.mp3`. Default **off**; the speaker toggle in the menu bar turns it on. Volume 0.35. No sounds on phone except the music preview.

## 10. Analytics
Vercel Web Analytics (privacy-friendly, no cookies). Track custom events: `recruiter_view_opened`, `resume_downloaded`, `project_opened` (slug), `contact_sent`.

## 11. Acceptance checklist (whole site)
- [ ] `/` at 1440×900 shows menu bar, 9 desktop icons, 4 widgets, dock, Welcome window on first visit — matching DESIGN.md.
- [ ] Every desktop icon and dock icon opens the right thing with one click and with the keyboard.
- [ ] Windows: drag, resize (8 handles), minimise to dock, restore, maximise, close, focus/z-order all work; nothing can be lost off-screen.
- [ ] `/recruiter` renders all 9 sections from content, prints cleanly, Lighthouse Perf ≥ 95 / A11y 100 / Best Practices 100 / SEO 100.
- [ ] `/` at 390×844 shows the phone home screen; every app opens full-screen and back navigation works (button, edge swipe, browser back).
- [ ] Deep links `/?open=project:anchor`, `/?open=research` work on desktop and phone.
- [ ] All widgets show real data with `.env.local` set, and graceful fallbacks with network blocked.
- [ ] Contact form sends a real email to Hamza (and fails gracefully without the key).
- [ ] No phone number, address or DOB in the built output: `npm run privacy-check` (scans `src/` and `.next/` for every line in the git-ignored `.private-terms` file) passes.
- [ ] `npm run build`, `lint`, `typecheck`, `test`, `e2e` all pass.

## 12. Backlog (do NOT build now)
- **Simulator** app: run RouteMate in a phone frame (React Native Web / Expo Snack) with a guided walkthrough.
- Arabic (RTL) version of Recruiter View.
- Custom domain.
- Blog / notes app.
