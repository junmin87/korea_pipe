# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**HiKorea** is a Korean content SEO platform targeting English-speaking foreigners, Korean language learners, and expats in Korea. It serves as a top-of-funnel SEO engine with 33+ statically generated content pages.

- **Live**: korea-pipe.vercel.app (target custom domain: `hikorea.io`)
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, MDX (next-mdx-remote/rsc), Vercel, Firebase Analytics

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
- When done, stop and report. Do not continue with extra improvements.
- Report back with: files modified, commands run, lint/typecheck results, anything noticed but not touched.

## Engineering Principles

- Consider side effects before modifying code.
- Prefer extension over modification — design for new content/features without changing existing ones.
- Keep changes isolated. Avoid cross-cutting edits unless the task explicitly requires them.
- Avoid adding new dependencies unless they provide clear value.
- Favor simple, maintainable solutions over clever ones.

## Before Reporting Done

- Run `npm run lint` — must pass with 0 errors.
- Run `npx tsc --noEmit` — must pass with 0 errors.
- Run `npm run build` if the task touched routing, metadata, or content loading.

## Notes

- Code comments may be in Korean or English. Keep them as-is unless asked to translate.