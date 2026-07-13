/**
 * 디자인 토큰 — 사이트 전역의 시각 표현을 한 곳에서 관리한다.
 * 섹션별 색상 매핑과 공통 스타일 프리셋(Tailwind 클래스 문자열)을 모아,
 * 페이지/컴포넌트가 색상·여백·그림자 값을 직접 하드코딩하지 않도록 한다.
 * (언어 학습 앱 톤: 순백 배경 + 파스텔 카드 + 섹션별 컬러 코딩)
 */

import type { LucideIcon } from "lucide-react";
import { GraduationCap, MessageCircle, Home, Wrench } from "lucide-react";

/** 한 섹션의 시각 아이덴티티: 아이콘 + 색상 클래스 묶음. */
export interface SectionAccent {
  /** 카드/헤더에 얹는 대표 아이콘 (lucide-react). */
  icon: LucideIcon;
  /** 아이콘 칩 배경 + 글자색. */
  iconWrap: string;
  /** 카드 호버 시 강조되는 테두리색. */
  hoverBorder: string;
  /** 포인트 바/구분선 등에 쓰는 채움색. */
  bar: string;
  /** 브레드크럼·링크 강조에 쓰는 텍스트색. */
  text: string;
}

/*
 * 섹션 성격에 맞춰 색을 직관적으로 매핑한다.
 *  - korean(Lessons)  = sky     : 학습의 기본 톤(Primary)
 *  - expressions      = amber   : 말·표현의 강조 톤(Accent)
 *  - living-in-korea  = emerald : 생활·정착의 안정 톤
 *  - tools            = violet  : 도구·유틸의 구분 톤
 */
export const sectionAccents: Record<string, SectionAccent> = {
  korean: {
    icon: GraduationCap,
    iconWrap: "bg-sky-100 text-sky-600",
    hoverBorder: "hover:border-sky-300",
    bar: "bg-sky-500",
    text: "text-sky-600",
  },
  expressions: {
    icon: MessageCircle,
    iconWrap: "bg-amber-100 text-amber-600",
    hoverBorder: "hover:border-amber-300",
    bar: "bg-amber-400",
    text: "text-amber-600",
  },
  "living-in-korea": {
    icon: Home,
    iconWrap: "bg-emerald-100 text-emerald-600",
    hoverBorder: "hover:border-emerald-300",
    bar: "bg-emerald-500",
    text: "text-emerald-600",
  },
  tools: {
    icon: Wrench,
    iconWrap: "bg-violet-100 text-violet-600",
    hoverBorder: "hover:border-violet-300",
    bar: "bg-violet-500",
    text: "text-violet-600",
  },
};

/** 매핑에 없는 슬러그를 위한 기본 액센트(Primary인 sky 계열). */
export const defaultAccent: SectionAccent = sectionAccents.korean;

/** 섹션 슬러그로 액센트를 조회한다. 미등록 슬러그는 기본값으로 폴백. */
export function getSectionAccent(slug: string): SectionAccent {
  return sectionAccents[slug] ?? defaultAccent;
}

/*
 * 공통 스타일 프리셋 — 3회 이상 반복되는 Tailwind 클래스 조합을 상수화한다.
 * 클래스는 layout → spacing → color → typography → effects 순으로 정렬.
 */

/** 카드 공통 골격. display(block/flex)는 사용처에서 지정한다. */
export const cardBase =
  "rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md";

/** 페이지 최상단 대형 헤딩(extrabold). */
export const headingLarge =
  "text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl";

/** 섹션·페이지 제목(bold). */
export const headingMedium = "text-3xl font-bold tracking-tight text-slate-900";

/** 헤딩 아래 리드 문단. */
export const lead = "text-lg text-slate-600";

/** 아이콘 칩(정사각 라운드 박스). 색은 SectionAccent.iconWrap과 조합. */
export const iconChip =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl";

/** 브레드크럼 내비게이션 텍스트. */
export const breadcrumb = "text-sm text-slate-500";

/*
 * clsx 대체용 초경량 클래스 결합 헬퍼.
 * (외부 의존성 추가 금지 원칙에 따라 clsx를 새로 도입하지 않고 직접 정의)
 */
export function cx(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
