import Link from "next/link";

interface TopicCardProps {
  href: string;
  title: string;
  description: string;
}

export default function TopicCard({ href, title, description }: TopicCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-400 hover:bg-gray-50"
    >
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
