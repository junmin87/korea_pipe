import Link from "next/link";
import { notFound } from "next/navigation";
import { getSections, getTopics } from "@/lib/content";
import TopicCard from "@/components/TopicCard";
import JsonLd from "@/components/JsonLd";
import {
  headingMedium,
  lead,
  breadcrumb,
  iconChip,
  cx,
  getSectionAccent,
} from "@/lib/design-tokens";
import type { Metadata } from "next";

type Params = { section: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getSections().map((s) => ({ section: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { section } = await params;
  const meta = getSections().find((s) => s.slug === section);
  if (!meta) return {};

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { section } = await params;
  const sectionMeta = getSections().find((s) => s.slug === section);
  if (!sectionMeta) notFound();

  const topics = getTopics(section);
  const accent = getSectionAccent(section);
  const Icon = accent.icon;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: sectionMeta.title,
          description: sectionMeta.description,
        }}
      />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <nav className={cx(breadcrumb, "mb-8")}>
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{sectionMeta.title}</span>
        </nav>

        {/* 섹션 대표 아이콘을 제목 위에 두어 컬러 코딩을 즉시 인지시킨다. */}
        <span className={cx(iconChip, accent.iconWrap, "mb-4")}>
          <Icon size={22} aria-hidden="true" />
        </span>
        <h1 className={cx(headingMedium, "mb-4")}>{sectionMeta.title}</h1>
        <p className={cx(lead, "mb-10 max-w-2xl")}>{sectionMeta.description}</p>

        <div className="grid gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              href={`/${section}/${topic.slug}`}
              title={topic.title}
              description={topic.description}
              sectionSlug={section}
            />
          ))}
        </div>
      </main>
    </>
  );
}
