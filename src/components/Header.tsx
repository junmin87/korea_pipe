"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import HeaderAuth from "@/components/auth/HeaderAuth";

// Short nav labels mapped to their section routes.
const navLinks = [
  { label: "Lessons", href: "/korean" },
  { label: "Expressions", href: "/expressions" },
  { label: "Living", href: "/living-in-korea" },
  { label: "Tools", href: "/tools" },
];

function MenuIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Bottom border only appears once the page is scrolled past 8px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-[8px] transition-colors duration-150 bg-[color-mix(in_srgb,var(--color-bg)_85%,transparent)] ${
        scrolled ? "border-border" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-6 lg:px-20">
        <Link
          href="/"
          className="font-sans text-lg font-medium tracking-tight text-fg"
        >
          HiKorea
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <nav className="flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-150 hover:text-fg ${
                  isActive(link.href) ? "text-fg" : "text-fg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <HeaderAuth />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-fg md:hidden"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="border-t border-border backdrop-blur-[8px] bg-[color-mix(in_srgb,var(--color-bg)_92%,transparent)] md:hidden">
          <nav className="mx-auto flex w-full max-w-content flex-col px-6 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex min-h-[44px] items-center text-base font-medium transition-colors duration-150 hover:text-fg ${
                  isActive(link.href) ? "text-fg" : "text-fg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex min-h-[44px] items-center border-t border-border">
              <HeaderAuth onNavigate={() => setMenuOpen(false)} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
