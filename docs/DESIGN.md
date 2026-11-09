# HamzaOS — Design System

The low-fi wireframes defined the structure. This file defines the high-fidelity look: **calm, precise, airy, light-only** — the polish of a modern desktop OS, with HamzaOS's own identity. When in doubt: more whitespace, fewer borders, softer shadows, one accent.

## 1. Personality
- **Clean**: neutral surfaces, a single accent, no gradients on UI chrome except glass.
- **Personal**: the wallpaper blends a Gulf-morning blue (Bahrain) with a warm terracotta dusk (Marrakech) — Hamza's two homes. This is the only "loud" surface.
- **Crafted**: crisp 1 px hairlines, consistent radii, optical alignment, real depth via layered shadows.

## 2. Tokens (put these in `globals.css` under `@theme`)
### Colour
| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#F6F5F2` | page background behind everything (Recruiter View backdrop) |
| `--color-surface` | `#FFFFFF` | window bodies, cards |
| `--color-surface-2` | `#F8F8F7` | sidebars, toolbars, inset panels |
| `--color-surface-3` | `#EFEFED` | hover fills, chips |
| `--color-hairline` | `rgba(17, 24, 39, 0.08)` | 1 px borders/dividers |
| `--color-hairline-strong` | `rgba(17, 24, 39, 0.14)` | input borders |
| `--color-ink` | `#14171F` | primary text |
| `--color-ink-2` | `#4A5160` | secondary text |
| `--color-ink-3` | `#8A909C` | tertiary text, placeholders |
| `--color-accent` | `#2F5FE0` | links, selected states, primary buttons, Recruiter pill |
| `--color-accent-hover` | `#2551C7` | |
| `--color-accent-soft` | `#E8EEFD` | selected backgrounds, accent chips |
| `--color-success` | `#1E9E5A` | sent states |
| `--color-warning` | `#C98A12` | dev-only TODO dot |
| `--color-danger` | `#D64545` | errors |
| `--color-tl-close` | `#EE5D58` | traffic light |
| `--color-tl-min` | `#F3B53F` | traffic light |
| `--color-tl-max` | `#41BE62` | traffic light |
| `--color-gh-0…4` | `#EBEDF0, #C6E9D2, #8FD3A8, #4DB27A, #23824F` | GitHub squares |
| `--color-glass` | `rgba(255, 255, 255, 0.62)` | menu bar, dock, widgets |
| `--color-glass-border` | `rgba(255, 255, 255, 0.55)` | inner highlight on glass |

### Wallpaper (`public/images/wallpaper/hamzaos.webp` + CSS fallback)
CSS fallback (also the art direction for the generated image):
```css
background:
  radial-gradient(1200px 800px at 12% 18%, #CFE4F6 0%, transparent 60%),   /* Gulf morning blue */
  radial-gradient(900px 700px at 88% 22%, #F6D8C4 0%, transparent 62%),     /* Marrakech terracotta glow */
  radial-gradient(1000px 900px at 70% 95%, #E9D6EE 0%, transparent 60%),    /* soft lilac */
  radial-gradient(800px 700px at 18% 92%, #D7EFE6 0%, transparent 60%),     /* mint */
  #F4F1EC;
```
Add a very subtle grain overlay (SVG `feTurbulence`, opacity 0.035) for richness. Generate the `.webp` by rendering this CSS at 2880×1800 with Playwright in Phase 2 (script in `scripts/render-wallpaper.ts`) so no external asset is needed.

### Typography (Inter via `next/font`, `font-feature-settings: "cv11", "ss01"`; JetBrains Mono for code/citations)
| Token | Size / line | Weight | Tracking | Use |
|---|---|---|---|---|
| `display` | 40 / 44 | 700 | -0.02em | Recruiter H1, Hamza app name |
| `title-1` | 28 / 34 | 700 | -0.015em | case-study title |
| `title-2` | 20 / 26 | 650 | -0.01em | section headings |
| `title-3` | 15 / 20 | 600 | -0.005em | card titles, window titles |
| `body` | 14 / 21 | 400 | 0 | default in windows |
| `body-lg` | 16 / 25 | 400 | 0 | Recruiter View body, phone body |
| `caption` | 12 / 16 | 500 | 0.01em | labels, metadata, menu bar |
| `micro` | 11 / 14 | 500 | 0.02em | dock tooltips, badges |
| `metric` | 32 / 36 | 700 | -0.02em, tabular-nums | metric tiles |

### Radius
`--radius-xs 6px` (chips, inputs) · `--radius-sm 10px` (buttons, tiles) · `--radius-md 14px` (windows, cards) · `--radius-lg 20px` (widgets, dock) · `--radius-icon 22.5%` (app-icon squircle; use an SVG squircle path, not border-radius, for the icon tiles).

### Shadows
```
--shadow-window: 0 0 0 0.5px rgba(17,24,39,.12), 0 2px 6px rgba(17,24,39,.06), 0 18px 40px -8px rgba(17,24,39,.22), 0 40px 80px -24px rgba(17,24,39,.18);
--shadow-window-inactive: 0 0 0 0.5px rgba(17,24,39,.10), 0 8px 24px -8px rgba(17,24,39,.14);
--shadow-glass: 0 0 0 0.5px rgba(17,24,39,.08), 0 8px 30px -6px rgba(17,24,39,.16), inset 0 1px 0 rgba(255,255,255,.6);
--shadow-card: 0 0 0 1px rgba(17,24,39,.06), 0 1px 2px rgba(17,24,39,.04);
--shadow-pop: 0 10px 30px -10px rgba(17,24,39,.25);
```
### Glass recipe
`background: var(--color-glass); backdrop-filter: blur(28px) saturate(180%); box-shadow: var(--shadow-glass);` Provide a solid fallback (`#FFFFFFE6`) under `@supports not (backdrop-filter: blur(1px))`.

### Spacing
4-px base: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. Window inner padding 24. Card padding 16–20.

## 3. Layout measurements (desktop, at 1440×900)
- **Menu bar**: height 30, glass, items `caption` size, 14 px horizontal padding, 18 px gaps. Logo mark 16 px. Recruiter pill: height 22, padding 0 10, `accent` bg, white text, radius 11, with a tiny "⚡" or Lucide `Zap` glyph.
- **Desktop icons**: grid starting at (24, 54); cell 92 × 100; icon 60 px; label `caption` 2 lines max, centred, white-ish label chip on selection (`accent-soft`, radius 5). Labels get a soft text-shadow `0 1px 2px rgba(255,255,255,.6)` for legibility on the light wallpaper (ink text, not white).
- **Widgets column**: right 24, top 54, width 340, gap 16. Widget radius 20, glass, padding 16.
- **Dock**: bottom 10, centred, height 68, padding 8 10, icon 52, gap 8, radius 22, glass. Divider 1 × 40 hairline. Running dot 4 px under icon. Tooltip: dark pill (`#14171FE6`, white `micro` text) 10 px above.
- **Windows**: radius 14, `surface` body, shadow-window. Title bar 44 tall, `surface-2` → `surface` vertical subtle gradient, hairline bottom. Traffic lights 12 px circles, 8 px gap, 16 px from left. Title `title-3`, centred, `ink` (focused) / `ink-3` (unfocused). Sidebar width 200, `surface-2`, hairline right.
- Safe area for windows: top 38 (below menu bar), bottom 92 (above dock), left/right 12.

## 4. Components
- **Button**: height 32 (36 in Recruiter/phone). Primary = accent bg / white. Secondary = white bg, hairline-strong border, ink text. Ghost = transparent, hover `surface-3`. Radius 10. Icon + label gap 6. Focus ring: `0 0 0 3px rgba(47,95,224,.35)`.
- **Chip**: height 24, `surface-3`, `caption`, radius 6; selected = `accent-soft` + accent text.
- **Proof badge**: height 22, white bg, hairline, `micro` bold, leading emoji/glyph (🏆 award, 📄 paper, 🌐 live, 🏢 industry).
- **Metric tile**: `surface-2`, radius 12, padding 16; number `metric`, label `caption ink-2`.
- **Tabs** (Hamza app): segmented control, `surface-3` track, white selected thumb with shadow-card, animated thumb (Motion `layoutId`).
- **List rows** (Files list view, Experience): 40 px rows, hairline separators, hover `surface-3`, selected `accent-soft`.
- **Tooltip**: dark pill (see dock), 120 ms fade.
- **Toast**: bottom-centre above dock, dark pill, 2 s.
- **Skeleton**: `surface-3` with a 1.2 s shimmer (disabled under reduced motion).

## 5. Icons
Custom HamzaOS app icons — one consistent family. Build them as React SVG components in `src/components/ui/icons/`.
- Shape: squircle tile (SVG path), subtle top-to-bottom gradient of the tile colour (+6% lightness at top), inner 1 px white highlight at 30%, white Lucide glyph at 52% of tile size, stroke 2.
- Folder icons (Projects, Experience, Education): a custom folder silhouette (tab on the back sheet), body in accent-blue gradient `#6E93F5 → #3E6BE6`, small white glyph embossed in the centre (Projects `LayoutGrid`, Experience `Briefcase`, Education `GraduationCap`).
- File icons (Welcome.txt, Résumé.pdf): white page with folded corner, hairline border, a coloured label strip at the bottom ("TXT" grey, "PDF" `#D64545`).
- App tile colours & glyphs:
  | App | Tile gradient | Lucide glyph |
  |---|---|---|
  | Files | `#5B8DEF → #2F5FE0` | `FolderOpen` |
  | Research | `#7C6CF2 → #5B49D6` | `FileText` |
  | Skills | `#59616F → #2E3440` | `Cpu` |
  | Hamza | `#F29A6B → #E0703C` (terracotta) | `Smile` |
  | Photos | `#F7C55A → #E89A2C` | `Images` |
  | Mail | `#4FB3F6 → #1D8BE0` | `Mail` |
  | LinkedIn | `#2F6FB5 → #1B4F8A` | simple-icons LinkedIn glyph (white) |
  | GitHub | `#2B2F36 → #111317` | simple-icons GitHub glyph (white) |
  | Résumé | `#FFFFFF` page style | `FileDown` in danger red |
  | Welcome | `#E9ECF2 → #D5DAE3` | `Sparkles` in accent |
- HamzaOS logo mark: a rounded "H" monogram built from two vertical bars and a crossbar shaped like a small window title bar (three dots). Provide as SVG; used in menu bar, boot screen, favicon (`icon.tsx`), OG image.

## 6. Motion (Motion library; all disabled/shortened under `prefers-reduced-motion`)
| Interaction | Spec |
|---|---|
| Window open | from icon origin if known: scale 0.92 → 1, opacity 0 → 1, spring `{ stiffness: 420, damping: 34, mass: 0.9 }` (~220 ms) |
| Window close | scale 1 → 0.96, opacity → 0, 140 ms ease-in |
| Minimise | to dock icon centre: scale → 0.15, opacity → 0, 300 ms `easeInOut` cubic-bezier(.4,0,.2,1); restore = reverse |
| Maximise/restore | animate rect, spring stiffness 380 damping 36 |
| Focus change | shadow cross-fade 120 ms |
| Dock magnification | scale via spring stiffness 500 damping 30 |
| Widgets on load | stagger fade-up 6 px, 40 ms apart, only on first boot |
| Boot | logo fade-in 200 ms, progress bar 900 ms, cross-fade to desktop 250 ms |
| Phone app open | shared-layout zoom from the icon (`layoutId`), 300 ms spring |
| Hard rule | nothing longer than 400 ms; no motion on `/recruiter` |

## 7. Phone (390×844 reference)
- Wallpaper same gradient, portrait crop.
- Status bar 44 tall: time `caption` semibold left; right: logo mark + "Recruiter" pill.
- Widget page 1: Profile (full width, 170 tall), GitHub (full width, 150 tall). Page 2: Weather, Now Playing. 16 px side margins, 14 px gaps.
- App grid: 4 columns, icon 60, label `micro`, row gap 22.
- Dock: glass, radius 28, 4 icons, bottom 12 + safe-area inset.
- App screens: white, large title (`title-1`) that collapses into a 44 px nav bar on scroll, grouped inset lists (radius 12, `surface-2` background behind groups).
- Minimum tap target 44×44.

## 8. Recruiter View
- Background `--color-bg`; centred paper card max-width 760, radius 16, shadow-card, padding 48 (24 on phone).
- `display` name, `body-lg` text, section headings `title-2` with a small accent bar (3×16) to the left.
- At-a-glance tiles: 4 in a row, `surface-2`, radius 12, label `caption ink-3` over value `title-3`.
- Links are accent, underlined on hover. No icons except small inline Lucide icons on contact buttons.

## 9. Quality bar ("does it look finished?")
Before calling a UI phase done, compare screenshots against this list:
- Nothing touches an edge without intended padding; text never sits on the wallpaper without legibility treatment.
- All radii, shadows and colours come from tokens.
- Vertical rhythm on a 4-px grid; icon labels and dock icons perfectly centred.
- Hover, focus, active and disabled states exist for every control.
- Empty/loading/error states designed for every widget and form.
- At 1024×768 nothing overlaps (widgets collapse as specified).
