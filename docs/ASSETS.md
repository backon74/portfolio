# Assets — where your real files go

Everything below lives in `public/`. Until a file exists, the site shows a clean placeholder tile, so you can add these any time.
**Formats:** photos and screenshots as `.webp` (export at the size listed; Squoosh.app or `cwebp` works). After adding files, run the "content swaps" prompt at the end of `BUILD_PLAN.md`.

## Already provided (copied in Phase 0)
| File | From |
|---|---|
| `public/images/projects/gatekeep/architecture.jpg` | your GateKeep architecture diagram |
| `public/images/projects/gatekeep/workflow.jpg` | your GateKeep workflow diagram |
| `public/images/research/fig-*.png` (5 figures) | extracted from your ETECOM slides |
| `public/research/etecom2026-certificate.pdf` | your certificate |
| `public/research/etecom2026-slides.pdf` | your slides, exported to PDF |
| `public/resume/Hamza_Alkhaldi_Resume.pdf` | your new résumé — **note: it contains your phone number.** If you don't want that public, replace it with a copy without the phone line (same file name). |

## You add
| Slot | Path | Size | Notes |
|---|---|---|---|
| Profile photo | `images/profile/hamza.webp` | 800×800 | Square, face centred, plain/light background. Used in Profile widget, Hamza app, phone widget. |
| Wallpaper | generated in Phase 2 | — | Nothing to do. |
| **Anchor** | `images/projects/anchor/cover.webp`, `01-language.webp`, `02-intake.webp`, `03-results.webp`, `04-chat.webp` | 1600×1000 | Screenshots of the running app (`npm run dev` in the anchor repo). |
| **SmartCool** | `images/projects/smartcool/cover.webp`, `01-prototype.webp`, `02-dashboard.webp`, `03-award.webp` | 1600×1000 | Photo of the board, dashboard screenshot, award photo. |
| **GateKeep** | `images/projects/gatekeep/cover.webp`, `03-dashboard.webp` | 1600×1000 | Cover can be a cropped version of the architecture diagram; dashboard screenshot if you have one. |
| **RouteMate** | `images/projects/routemate/cover.webp`, `01-home.webp` … `04-rating.webp` | cover 1600×1000; screens 1170×2532 (phone) | Phone screenshots look best — the case study shows them in a phone-shaped frame. |
| **Real-Time Forum** | `images/projects/real-time-forum/cover.webp`, `01-feed.webp`, `02-chat.webp`, `03-auth.webp` | 1600×1000 | |
| **Reboot Shooter** | `images/projects/reboot-shooter/cover.webp`, `01-menu.webp`, `02-gameplay.webp`, `03-pause.webp` | 1600×1000 | |
| **GraphQL Profile** | `images/projects/graphql-profile/cover.webp`, `01-login.webp`, `02-profile.webp`, `03-graphs.webp` | 1600×1000 | Blur out personal data if any. |
| **ISCMUN II** | `images/projects/iscmun/cover.webp` | 1600×1000 | Screenshot or photo of the site. |
| Logos | `images/logos/batelco.webp`, `aubh.webp`, `reboot.webp`, `choueifat.webp`, `iscmun.webp`, `devfest.webp`, `toy-drive.webp` | 256×256 | Square, transparent or white background. |
| Hobbies | `images/hobbies/game-design.webp`, `fashion.webp`, `weightlifting.webp`, `mun.webp` | 1200×900 | Optional. |
| Awards | `images/awards/gsr-2026.webp`, `etecom-2026.webp`, `best-delegate.webp`, `best-speaker.webp` | 1200×900 | Photos of certificates/medals. |
| Trips | `images/photos/<album>/cover.webp` and `1.webp`, `2.webp`, … | 1600 on the long side | Rename albums in `src/content/about.ts`; folder name = album `id`. |
| Sounds | `audio/*.mp3` | — | Generated in Phase 6. |
