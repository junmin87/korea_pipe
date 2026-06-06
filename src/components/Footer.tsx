export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} HiKorea. All rights reserved.
      </div>
    </footer>
  );
}
