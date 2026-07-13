"use client";

// Header auth control: shows a "Sign in" link when logged out, or the user's
// email with a "Log out" button when logged in. Session state comes from the
// AuthProvider (which bootstraps from the BFF); this component only renders it.

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function HeaderAuth({
  onNavigate,
}: {
  /** Called after a link click or logout — used to close the mobile menu. */
  onNavigate?: () => void;
}) {
  const { user, status, logout } = useAuth();

  // Avoid a flash of the wrong state during the initial session lookup.
  if (status === "loading") {
    return null;
  }

  if (status === "authenticated" && user) {
    const handleLogout = async () => {
      await logout();
      onNavigate?.();
    };

    return (
      <div className="flex items-center gap-3">
        <span
          className="max-w-[12rem] truncate text-sm text-slate-600"
          title={user.email}
        >
          {user.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900"
        >
          Log out
        </button>
      </div>
    );
  }

  // Sign in은 primary CTA이므로 amber 액센트 필(pill)로 강조한다.
  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className="inline-flex items-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition-colors duration-150 hover:bg-amber-300"
    >
      Sign in
    </Link>
  );
}
