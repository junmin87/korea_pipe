import type { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  return {
    title: "Korean Learning Tools",
    description:
      "Free interactive tools to help you learn Korean — including a Hangul romanization and pronunciation tool.",
  };
}

const tools = [
  {
    href: "/tools/romanization",
    title: "Korean Romanization Tool",
    description:
      "Convert Hangul to Revised Romanization and hear the pronunciation in your browser.",
  },
];

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Tools</span>
      </nav>

      <h1 className="mb-4 text-3xl font-bold text-gray-900">
        Korean Learning Tools
      </h1>
      <p className="mb-10 max-w-2xl text-gray-600">
        Free, interactive tools that make learning Korean a little easier.
        Everything runs right in your browser — no sign-up required.
      </p>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-400 hover:bg-gray-50"
          >
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-600">{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
