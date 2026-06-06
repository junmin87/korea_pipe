import type { MetadataRoute } from "next";
import { getSections, getTopics } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hikorea.io";

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  const sections = getSections();

  for (const section of sections) {
    entries.push({
      url: `${siteUrl}/${section.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    const topics = getTopics(section.slug);
    for (const topic of topics) {
      entries.push({
        url: `${siteUrl}/${section.slug}/${topic.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
