import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface SectionMeta {
  title: string;
  description: string;
  slug: string;
}

export interface TopicMeta {
  title: string;
  description: string;
  keywords: string[];
  order: number;
  slug: string;
}

export interface Topic extends TopicMeta {
  content: string;
}

export function getSections(): SectionMeta[] {
  const entries = fs.readdirSync(contentDir, { withFileTypes: true });
  const sections: SectionMeta[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const sectionJsonPath = path.join(contentDir, entry.name, "section.json");
    if (!fs.existsSync(sectionJsonPath)) continue;

    const raw = fs.readFileSync(sectionJsonPath, "utf-8");
    const data = JSON.parse(raw) as SectionMeta;
    sections.push(data);
  }

  return sections;
}

export function getTopics(sectionSlug: string): TopicMeta[] {
  const sectionDir = path.join(contentDir, sectionSlug);
  if (!fs.existsSync(sectionDir)) return [];

  const files = fs.readdirSync(sectionDir).filter((f) => f.endsWith(".mdx"));
  const topics: TopicMeta[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(sectionDir, file), "utf-8");
    const { data } = matter(raw);
    topics.push({
      title: data.title ?? "",
      description: data.description ?? "",
      keywords: data.keywords ?? [],
      order: data.order ?? 0,
      slug: file.replace(/\.mdx$/, ""),
    });
  }

  return topics.sort((a, b) => a.order - b.order);
}

export function getTopic(sectionSlug: string, topicSlug: string): Topic | null {
  const filePath = path.join(contentDir, sectionSlug, `${topicSlug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    title: data.title ?? "",
    description: data.description ?? "",
    keywords: data.keywords ?? [],
    order: data.order ?? 0,
    slug: topicSlug,
    content,
  };
}

export function getAllTopicPaths(): { section: string; slug: string }[] {
  const sections = getSections();
  const paths: { section: string; slug: string }[] = [];

  for (const section of sections) {
    const topics = getTopics(section.slug);
    for (const topic of topics) {
      paths.push({ section: section.slug, slug: topic.slug });
    }
  }

  return paths;
}
