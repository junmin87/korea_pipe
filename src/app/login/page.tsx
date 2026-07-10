import type { Metadata } from "next";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to HiKorea to access interactive learning features.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-content flex-1 flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Sign in to HiKorea
        </h1>
        <p className="mt-3 text-sm text-fg-muted">
          Access interactive tutoring and personalized learning features.
        </p>
        <div className="mt-8 flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </main>
  );
}
