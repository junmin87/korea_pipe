import Link from "next/link";
import { getSections } from "@/lib/content";

export default function Header() {
  const sections = getSections();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          HiKorea
        </Link>
        <nav className="flex gap-4">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/${section.slug}`}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {section.title}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
