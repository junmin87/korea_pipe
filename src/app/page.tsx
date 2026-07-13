import Link from "next/link";
import { getSections } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { siteUrl } from "@/lib/site";
import {
  cardBase,
  headingLarge,
  lead,
  iconChip,
  cx,
  getSectionAccent,
} from "@/lib/design-tokens";

export default function HomePage() {
  const sections = getSections();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "HiKorea",
          url: siteUrl,
          description:
            "Free Korean learning materials for English speakers.",
        }}
      />
      <main className="relative mx-auto max-w-5xl px-4 py-16">
        {/* 히어로 시각 앵커: 옅은 대형 한글 워터마크. 콘텐츠 뒤(-z-10)에 두고
            pointer-events/aria 로 상호작용·접근성에서 제외해 가독성을 해치지 않는다.
            오른쪽 상단으로 흘려 본문 텍스트(왼쪽 정렬)와 겹치지 않게 배치. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-2 right-0 -z-10 select-none text-[6rem] font-extrabold leading-none text-sky-100 sm:text-[9rem]"
        >
          안녕하세요
        </div>

        <h1 className={cx(headingLarge, "mb-4")}>Learn Korean, Step by Step</h1>
        <p className={cx(lead, "mb-12 max-w-2xl")}>
          Free, structured Korean learning materials designed for English
          speakers. Start from the alphabet and build your way up.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map((section) => {
            const accent = getSectionAccent(section.slug);
            const Icon = accent.icon;
            return (
              <Link
                key={section.slug}
                href={`/${section.slug}`}
                className={cx(cardBase, accent.hoverBorder, "block")}
              >
                <span className={cx(iconChip, accent.iconWrap, "mb-4")}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h2 className="mb-2 text-xl font-bold text-slate-900">
                  {section.title}
                </h2>
                <p className="text-sm text-slate-600">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
