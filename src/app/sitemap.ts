import type { MetadataRoute } from "next";
import { getSections, getTopics, getSourceLastModified } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: getSourceLastModified("src/app/page.tsx"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  entries.push(
    {
      url: `${siteUrl}/tools`,
      lastModified: getSourceLastModified("src/app/tools/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/tools/romanization`,
      lastModified: getSourceLastModified("src/app/tools/romanization/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  );

  const sections = getSections();

  for (const section of sections) {
    entries.push({
      url: `${siteUrl}/${section.slug}`,
      lastModified: section.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    const topics = getTopics(section.slug);
    for (const topic of topics) {
      entries.push({
        url: `${siteUrl}/${section.slug}/${topic.slug}`,
        lastModified: topic.updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
