# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HiKorea** is a Korean content SEO platform targeting English-speaking foreigners, Korean language learners, and expats in Korea. It serves as a top-of-funnel SEO engine with 33+ statically generated content pages.

- **Live**: korea-pipe.vercel.app (target custom domain: `hikorea.io`)
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, MDX (next-mdx-remote/rsc), Vercel, Firebase Analytics

The site is being extended with authenticated interactive features (Google login, RAG-based tutor chat, sentence refinement) that proxy to a separate backend server (Express + Supabase, JWT auth) via a BFF layer in `app/api/*`. Static content pages remain unchanged.

## Common Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Run production build locally
npm run lint         # Run ESLint
npx tsc --noEmit     # Type-check without emitting
```

## Working with Claude Code

- Do NOT run any git commands (add, commit, push, branch, etc.). I handle git myself.
- Do NOT run deployment commands. I handle deployment myself.
- Do NOT modify existing architecture or refactor code not explicitly listed in the task.
- Do NOT fix bugs you discover outside the task scope. Report them at the end instead.
- Do NOT add new dependencies unless absolutely required and explicitly approved.
- Do NOT modify `.env` or `.env.local`. Update `.env.example` instead.
- Do NOT introduce new architectural patterns (state libraries, DI containers, event buses, etc.) without explicit approval.
- Do NOT couple UI components directly to the backend server. All backend calls MUST go through `app/api/*` (BFF layer).
- Do NOT put business logic in components. Extract it into hooks under `src/hooks/*`.
- Do NOT read or write `document.cookie` from client code. Session cookies are httpOnly by design.
- When done, stop and report. Do not continue with extra improvements.
- Report back with: files modified, commands run, lint/typecheck results, anything noticed but not touched.

## Engineering Principles

- Consider side effects before modifying code.
- Prefer extension over modification — design for new content/features without changing existing ones.
- Keep changes isolated. Avoid cross-cutting edits unless the task explicitly requires them.
- Avoid adding new dependencies unless they provide clear value.
- Favor simple, maintainable solutions over clever ones.

## Architecture Boundaries

The project uses a layered structure. Respect these boundaries:

- `app/` — routing and page composition only. No business logic.
- `app/api/*` — BFF layer. Proxies to the backend server. Handles cookies, session verification, and rate limiting. Never exposes backend URLs or JWTs to the client.
- `components/` — presentational UI. Receives data via props or hooks. No direct `fetch` to backend endpoints.
- `hooks/` — stateful logic and API orchestration (via `/api/*`). Acts as the ViewModel layer.
- `lib/` — pure functions and shared utilities. No React, no state.
- `providers/` — React Context providers for cross-cutting concerns (auth, query client).

Client components must call `/api/*` (same-origin), never the backend server directly. This is non-negotiable — it protects the JWT and avoids CORS entanglement.

## Change Discipline

- Touch only files required by the task. If a file is not in scope, do not open it "just to check."
- When adding a feature, prefer creating new files over editing shared/existing ones. Extension over modification.
- Do not "improve" code adjacent to your change. Note it in the final report instead.
- If a task requires changing a shared module, stop and confirm before proceeding.
- Prefer loose coupling: new features should be removable by deleting their own files, without leaving orphans elsewhere.
- No premature abstraction. Duplicate first, extract only when a third use case appears.

## Before Reporting Done

- Run `npm run lint` — must pass with 0 errors.
- Run `npx tsc --noEmit` — must pass with 0 errors.
- Run `npm run build` if the task touched routing, metadata, or content loading.

## Notes

- Code comments may be in Korean or English. Keep them as-is unless asked to translate.