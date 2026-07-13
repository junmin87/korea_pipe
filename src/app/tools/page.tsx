import type { Metadata } from "next";
import Link from "next/link";
import { Languages, type LucideIcon } from "lucide-react";
import {
  cardBase,
  headingMedium,
  lead,
  breadcrumb,
  iconChip,
  cx,
  getSectionAccent,
} from "@/lib/design-tokens";

export function generateMetadata(): Metadata {
  return {
    title: "Korean Learning Tools",
    description:
      "Free interactive tools to help you learn Korean — including a Hangul romanization and pronunciation tool.",
  };
}

// 도구별 대표 아이콘은 섹션 아이콘과 별개로 도구 성격에 맞춰 지정한다.
const tools: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/tools/romanization",
    title: "Korean Romanization Tool",
    description:
      "Convert Hangul to Revised Romanization and hear the pronunciation in your browser.",
    icon: Languages,
  },
];

export default function ToolsPage() {
  // Tools 섹션은 violet 컬러 코딩을 공유한다.
  const accent = getSectionAccent("tools");

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <nav className={cx(breadcrumb, "mb-8")}>
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Tools</span>
      </nav>

      <h1 className={cx(headingMedium, "mb-4")}>Korean Learning Tools</h1>
      <p className={cx(lead, "mb-10 max-w-2xl")}>
        Free, interactive tools that make learning Korean a little easier.
        Everything runs right in your browser — no sign-up required.
      </p>

      <div className="grid gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={cx(
                cardBase,
                accent.hoverBorder,
                "flex items-start gap-4"
              )}
            >
              <span className={cx(iconChip, accent.iconWrap, "shrink-0")}>
                <Icon size={20} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <h2 className="mb-1 text-lg font-bold text-slate-900">
                  {tool.title}
                </h2>
                <p className="text-sm text-slate-600">{tool.description}</p>
              </span>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
