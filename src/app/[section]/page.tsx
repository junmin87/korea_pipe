import { notFound } from "next/navigation";
import { getSections, getTopics } from "@/lib/content";
import TopicCard from "@/components/TopicCard";
import JsonLd from "@/components/JsonLd";
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
        <nav className="mb-8 text-sm text-gray-500">
          <a href="/" className="hover:underline">
            Home
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{sectionMeta.title}</span>
        </nav>

        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          {sectionMeta.title}
        </h1>
        <p className="mb-10 max-w-2xl text-gray-600">
          {sectionMeta.description}
        </p>

        <div className="grid gap-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic.slug}
              href={`/${section}/${topic.slug}`}
              title={topic.title}
              description={topic.description}
            />
          ))}
        </div>
      </main>
    </>
  );
}
