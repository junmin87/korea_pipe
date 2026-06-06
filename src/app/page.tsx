import Link from "next/link";
import { getSections } from "@/lib/content";
import JsonLd from "@/components/JsonLd";

export default function HomePage() {
  const sections = getSections();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "HiKorea",
          url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hikorea.io",
          description:
            "Free Korean learning materials for English speakers.",
        }}
      />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Learn Korean, Step by Step
        </h1>
        <p className="mb-12 max-w-2xl text-lg text-gray-600">
          Free, structured Korean learning materials designed for English
          speakers. Start from the alphabet and build your way up.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/${section.slug}`}
              className="rounded-lg border border-gray-200 p-8 transition-colors hover:border-gray-400 hover:bg-gray-50"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="text-sm text-gray-600">{section.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
