import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTopic, getAllTopicPaths, getSections } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hikorea.io";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: topic.title,
          description: topic.description,
          url: `${siteUrl}/${section}/${slug}`,
          publisher: {
            "@type": "Organization",
            name: "HiKorea",
          },
        }}
      />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-8 text-sm text-gray-500">
          <a href="/" className="hover:underline">Home</a>
          <span className="mx-2">/</span>
          <a href={`/${section}`} className="hover:underline">
            {sectionMeta?.title ?? section}
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{topic.title}</span>
        </nav>
        <article className="prose prose-lg max-w-none">
          <MDXRemote source={topic.content} />
        </article>
      </main>
    </>
  );
}
