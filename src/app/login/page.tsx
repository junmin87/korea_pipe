import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import { cardBase, iconChip, cx } from "@/lib/design-tokens";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to HiKorea to access interactive learning features.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col items-center justify-center px-6 py-24">
      {/* 로그인 카드: 공통 cardBase 위에 Primary(sky) 아이콘 앵커를 얹는다. */}
      <div className={cx(cardBase, "w-full max-w-sm text-center")}>
        <span className={cx(iconChip, "bg-sky-100 text-sky-600 mb-5")}>
          <GraduationCap size={22} aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to HiKorea
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Access interactive tutoring and personalized learning features.
        </p>
        <div className="mt-8 flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </main>
  );
}
