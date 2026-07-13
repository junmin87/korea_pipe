import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTopic, getAllTopicPaths, getSections } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { breadcrumb, cx, getSectionAccent } from "@/lib/design-tokens";
import type { Metadata } from "next";

type Params = { section: string; slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllTopicPaths();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { section, slug } = await params;
  const topic = getTopic(section, slug);
  if (!topic) return {};

  return {
    title: topic.title,
    description: topic.description,
    keywords: topic.keywords,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { section, slug } = await params;
  const topic = getTopic(section, slug);
  if (!topic) notFound();

  const sectionMeta = getSections().find((s) => s.slug === section);
  const accent = getSectionAccent(section);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: topic.title,
          description: topic.description,
          url: `${siteUrl}/${section}/${slug}`,
          dateModified: topic.updatedAt.toISOString(),
          publisher: {
            "@type": "Organization",
            name: "HiKorea",
          },
        }}
      />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <nav className={cx(breadcrumb, "mb-8")}>
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link
            href={`/${section}`}
            className={cx(accent.text, "hover:underline")}
          >
            {sectionMeta?.title ?? section}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900">{topic.title}</span>
        </nav>
        <article className="prose prose-lg max-w-none">
          <MDXRemote source={topic.content} />
        </article>
      </main>
    </>
  );
}
