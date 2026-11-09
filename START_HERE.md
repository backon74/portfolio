# Start here (for Hamza — Claude Code doesn't need this file)

## 1. What's in this kit
| File | What it's for |
|---|---|
| `CLAUDE.md` | Claude Code reads this automatically every session: stack, rules, architecture. |
| `docs/PRD.md` | Every screen, window, widget and route, with acceptance criteria. |
| `docs/DESIGN.md` | The high-fidelity look: colours, type, spacing, icons, motion. |
| `docs/BUILD_PLAN.md` | 10 phases with a copy-paste prompt for each. |
| `docs/ASSETS.md` | Where each photo/screenshot goes. |
| `docs/content/*.ts` | All your content, already written from your CVs, report, paper and repos. |
| `assets/` | Files you gave me (GateKeep diagrams, certificate, slides PDF, résumé, paper figures). |

## 2. Before Phase 0 (5 minutes)
1. Make sure this kit is at the root of your `portfolio` repo (CLAUDE.md next to README.md).
2. Node 20+ (`node -v`). You have Node via nvm already.
3. Create a file called `.private-terms` in the repo root with one item per line: your phone number, your street/villa, your date of birth. It's already in the kit's `.gitignore`, so it never gets committed. The build fails if any of them ever appear on the site.
4. Commit the kit: `git add -A && git commit -m "docs: HamzaOS build kit"`.

## 3. Keys you'll need (you can do these when the phase comes up)
- **GitHub token (Phase 5):** GitHub → Settings → Developer settings → Fine-grained tokens → Generate. Repository access: *Public repositories (read-only)*. No other permissions. Put it in `.env.local` as `GITHUB_TOKEN=...`.
- **Resend (Phase 4):** sign up at resend.com with **alkhaldihamza06@gmail.com** → API Keys → Create. Put `RESEND_API_KEY=...` and `CONTACT_TO_EMAIL=alkhaldihamza06@gmail.com` in `.env.local`. Without your own domain, Resend can only deliver to the email you signed up with, which is exactly what a contact form needs.
- Weather and the song preview need no keys.

## 4. Running the build

**One command (recommended):** open Claude Code in the repo, press Shift+Tab until the mode says **auto** (or **accept edits** if auto isn't offered), then type:

```
/build-hamzaos
```

It runs Phases 0–9 by itself. Each phase gets its own fresh helper, and it builds, tests, screenshots and commits as it goes. Progress is tracked in `docs/PROGRESS.md`. If it stops (usage limit, laptop sleeps, a blocked phase), run `/build-hamzaos` again and it resumes. Use `/build-hamzaos from 3 to 5` to run just some phases. It never pushes or deploys.

**Phase by phase (if you want to review between phases):**
For each phase in `docs/BUILD_PLAN.md`:
1. `/clear` in Claude Code.
2. Shift+Tab into **plan mode**.
3. Paste the phase prompt. Read the plan; approve.
4. When it's done, do the "You check" items. If something's off, tell it what you saw (a screenshot helps).

## 5. Deploying (after Phase 9)
1. vercel.com → sign in with GitHub → **Add New → Project** → import `backon74/portfolio` → Deploy.
2. Project → Settings → Environment Variables: add `GITHUB_TOKEN`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `NEXT_PUBLIC_SITE_URL` (your `https://….vercel.app` URL). Redeploy.
3. Project → Analytics → Enable.
4. Paste `https://<your-url>/recruiter` into job applications and your LinkedIn "Website" field.

## 6. Things I need you to confirm or fill in
I wrote every project and your bio from your materials. Everything is marked `status: "draft"`. These are the gaps and conflicts I found — the site will build without them (they show as placeholders), but fix them before you share the link:

**Conflicts between your documents**
1. **Paper author order.** The paper, slides and code README list *Hana Wahban, Hamza Alkhaldi, Maqbool Khan*; your résumé lists you first. I used the paper's order on the site. Make your résumé match whatever IEEE publishes.
2. **Batelco bug count.** Your résumé says **60** P1/P2 bugs; your internship report says **51** (29 resolved, 22 in QA retest). I used 60 as you asked me to treat the new résumé as the source of truth. Make sure you can back up 60 in an interview.
3. **Dean's List.** Your old CV says Dean's List every semester; the new résumé doesn't mention it. I left it out. Tell me if it's still true.

**Missing details** (search `todo:` in `docs/content/`)
- Expected graduation month/year.
- **Anchor:** third teammate's name; hackathon result (placed? finalist?); live demo or video link.
- **SmartCool:** your role, team size, month, GitHub link; "250+" teams or participants?
- **GateKeep:** your part of the work; GitHub link (or private).
- **RouteMate:** year/semester, team size, GitHub link, any outcome; Expo link if it runs.
- **Real-Time Forum / Reboot Shooter:** public GitHub mirrors? (The originals are on Reboot's private Gitea.) Your part of Reboot Shooter — git shows only one of your commits there, so tell me what you built.
- **ISCMUN II website:** tech used, solo or team, date.
- **Peer tutor / ISCMUN:** start dates.
- **Languages you speak** (French? Darija?).
- **Paper:** your exact contribution (I drafted four bullets in `research.ts`); were you in Paris in person?
- **Trips:** real album names.

**Privacy:** the site never shows your phone number, address or date of birth. Your résumé PDF does include your phone number — swap it for a version without it if you prefer.
