import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-900">
          HiKorea
        </Link>
        <nav>
          <Link
            href="/korean"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Korean
          </Link>
        </nav>
      </div>
    </header>
  );
}
