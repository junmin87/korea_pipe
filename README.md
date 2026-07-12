# HiKorea Web

영어권 학습자용 한국어 SEO 사이트에 AI 학습 기능(구글 로그인, 튜터 챗, 문장 첨삭)을 얹은 프로젝트. 기존 HiKorea 앱 백엔드를 재사용하고, Next.js를 BFF로 두어 세션/OAuth/프록시를 담당.

**Live**: [korea-pipe.vercel.app](https://korea-pipe.vercel.app)

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · MDX · TanStack Query · Vercel
Backend (재사용): Express + Supabase (pgvector) + JWT, GCP App Engine

## 아키텍처

```
Browser → Next.js (BFF, Vercel) → Express (GCP) → Supabase
```

클라이언트는 백엔드를 직접 호출하지 않음. `app/api/*`가 OAuth 교환, httpOnly 쿠키 관리, 백엔드 프록시를 담당.

## Features

- ✅ Google 로그인 (OAuth 2.0, httpOnly 세션, CSRF state)
- 🚧 튜터 챗 (RAG: pgvector + text-embedding-3-small + GPT-4o-mini)
- 🚧 문장 첨삭 (6개 언어 프롬프트 라우팅)
- ✅ 정적 콘텐츠 33+ MDX 페이지, 로마자 변환 도구

## 설계 결정

**BFF**: httpOnly 쿠키를 same-origin으로 유지하고 CORS/백엔드 URL 노출을 회피.
**기존 사이트 확장**: SEO/Analytics/MDX 파이프라인 재활용, 하나의 프로덕트로 통합.
**웹 전용 백엔드 라우트 신설**: 앱용 로직을 건드리지 않고 사이드이펙트 격리.

## Related

Backend: [`hikorea_server_2026`](https://github.com/junmin87/hikorea_server_2026) · Mobile: HiKorea (Flutter)