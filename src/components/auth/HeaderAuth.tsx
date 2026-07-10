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
          className="max-w-[12rem] truncate text-sm text-fg-muted"
          title={user.email}
        >
          {user.email}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm font-medium text-fg-muted transition-colors duration-150 hover:text-fg"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      onClick={onNavigate}
      className="text-sm font-medium text-fg-muted transition-colors duration-150 hover:text-fg"
    >
      Sign in
    </Link>
  );
}
