---
name: build-hamzaos
description: Build the whole HamzaOS portfolio end to end by running every phase in docs/BUILD_PLAN.md in order, verifying and committing each one. Resumable.
argument-hint: "[from <phase>] [to <phase>]"
disable-model-invocation: true
---

# Build HamzaOS — orchestrator

You are the **orchestrator**. Your job is to drive `docs/BUILD_PLAN.md` from start to finish without the user having to paste prompts. You do not write the app code yourself: each phase is done by a **fresh subagent** so every phase starts with a clean context. You plan, delegate, verify, record and continue.

Arguments (optional): `$ARGUMENTS` — e.g. `from 3`, `to 5`, `from 4 to 6`. Default: from the first phase not marked done in `docs/PROGRESS.md`, to Phase 9.

## 0. Before the first phase
1. Read `CLAUDE.md`, `docs/BUILD_PLAN.md`, `docs/PRD.md` §11, and `docs/PROGRESS.md` if it exists.
2. If `docs/PROGRESS.md` doesn't exist, create it with one row per phase (0–9): `| Phase | Status | Commit | Notes |`, all `todo`.
3. Check `git status`. If there are uncommitted changes you didn't make, stop and ask the user what to do with them. Otherwise continue.
4. Check `node -v` is ≥ 20. If not, stop and tell the user.

## 1. Loop over phases
For each phase N in range, in order:

### a. Delegate
Spawn one **general-purpose subagent** with this task (fill in N and the phase title):

> You are implementing **Phase N — <title>** of the HamzaOS portfolio in this repo.
> 1. Read `CLAUDE.md` (rules you must follow), then `docs/BUILD_PLAN.md` — only the Phase N section — and every doc that prompt tells you to read. Also read `docs/PROGRESS.md` and `docs/DECISIONS.md` for what earlier phases did.
> 2. Before coding, write a short plan for yourself (files to create/change, tests to add). Then carry out the Phase N prompt **completely and exactly**.
> 3. Verify: run `npm run build`, `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run e2e` (once Playwright exists). For UI phases also run the screenshot project, open the PNGs with the Read tool, and fix anything that doesn't match `docs/DESIGN.md`. Fix every failure; don't skip or weaken tests to make them pass.
> 4. If something genuinely can't be done (e.g. a missing API key), implement the documented fallback, record it in `docs/DECISIONS.md`, and carry on. Never invent facts about Hamza; leave content TODOs as they are.
> 5. Commit with a clear conventional message. Do not push.
> 6. Reply with: what you built (5–10 bullets), test/build results, the commit hash, anything left undone, and anything the user must do by hand.

### b. Verify the subagent's work yourself
Don't trust the report blindly:
- `git log -1` shows a new commit for this phase; `git status` is clean.
- Run `npm run build` and `npm run test` yourself. If either fails, spawn a **new** subagent to fix it ("Phase N left the build/tests failing: <errors>. Fix them without weakening tests, verify, commit.").
- For UI phases (1, 2, 3, 4, 5, 7, 8): check that the screenshots in `./screenshots` are newer than the commit started, and look at 2–3 of them yourself. If something is clearly broken (blank page, overlapping windows, unstyled UI), spawn a fix subagent with precise notes.
- Allow at most **2 fix rounds** per phase. If it still fails, mark the phase `blocked` in PROGRESS.md with the reason and **stop**, explaining to the user exactly what's wrong.

### c. Record
Update the phase's row in `docs/PROGRESS.md` to `done`, with the commit hash and a one-line note (include anything the user must do by hand, e.g. "set GITHUB_TOKEN to see real data"). Commit `docs: progress phase N`.

### d. Continue
Go straight to the next phase. Don't ask the user for permission between phases. Give the user only a one-line status between phases ("✅ Phase 3 done — content apps. Starting Phase 4…").

## 2. When all phases are done
Spawn one last **fresh subagent** as an independent reviewer that hasn't seen the work. Ask it to: run the full PRD §11 acceptance checklist and the privacy check, open the screenshots for `/`, `/recruiter` and phone mode, and report a pass/fail table with specific issues. Fix any failures with one more subagent.

Then give the user a short final report:
- what's built, and the local URL to try (`npm run dev` → http://localhost:3000 and /recruiter)
- what they need to do by hand: keys in `.env.local`, real photos (docs/ASSETS.md), content TODOs (`grep -rn "todo:" src/content`), and the Vercel deploy steps from START_HERE.md
- anything that was blocked or deferred.

## Rules for the orchestrator
- Never push, never deploy, never edit `.env.local`, never read `.private-terms` aloud or write its contents anywhere.
- Never skip a phase or reorder them. Phases build on each other.
- Keep your own context lean: don't read source files yourself unless verifying a specific failure. Subagents do the work.
- Stop and ask the user only for: a blocked phase after 2 fix rounds, uncommitted changes that aren't yours, or anything destructive outside this repo.
- If the session gets interrupted, the user re-runs `/build-hamzaos` and you resume from PROGRESS.md.
