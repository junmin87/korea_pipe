import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import RomanizationTool from "@/components/RomanizationTool";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hikorea.io";
const pageUrl = `${siteUrl}/tools/romanization`;

export function generateMetadata(): Metadata {
  return {
    title:
      "Korean Romanization Tool: Hangul to English Letters with Pronunciation",
    description:
      "Free Korean romanization tool. Paste Hangul to get the Revised Romanization instantly, then tap Listen to hear it spoken aloud. Learn how to read Korean fast.",
    keywords: [
      "korean romanization tool",
      "hangul to romanization",
      "korean text to speech",
      "how to read korean",
      "hangul to english letters",
      "revised romanization",
      "korean pronunciation",
    ],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title:
        "Korean Romanization Tool: Hangul to English Letters with Pronunciation",
      description:
        "Paste Hangul to get the Revised Romanization instantly and hear it spoken aloud.",
    },
  };
}

export default function RomanizationToolPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Korean Romanization Tool",
          description:
            "Convert Korean Hangul to Revised Romanization and hear the pronunciation in your browser.",
          url: pageUrl,
          applicationCategory: "EducationalApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/tools" className="hover:underline">
            Tools
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Romanization</span>
        </nav>

        <article className="prose prose-lg max-w-none">
          <h1>Korean Romanization Tool</h1>
          <p>
            This free tool turns Korean <strong>Hangul</strong> into{" "}
            <strong>Revised Romanization</strong> — the official system that
            writes Korean sounds using the Latin alphabet — and lets you hear
            the words spoken aloud. It is built for beginners learning to read
            Korean, travelers who need to sound out signs and menus, and anyone
            who wants a quick, reliable way to check how a Korean word is
            pronounced. Type or paste any Korean text below and the romanization
            updates as you go.
          </p>

          <RomanizationTool />

          <h2>How to use</h2>
          <ul>
            <li>Type or paste Korean (Hangul) into the input box.</li>
            <li>
              Read the romanization that appears underneath — it updates live as
              you type.
            </li>
            <li>
              Press <strong>🔊 Listen</strong> to hear the text pronounced by
              your browser&apos;s built-in voice.
            </li>
            <li>
              No Korean handy? Tap <strong>Try an example</strong> to load a
              common greeting.
            </li>
          </ul>

          <h2>What is Revised Romanization?</h2>
          <p>
            Revised Romanization of Korean is the official romanization standard
            adopted by the South Korean government in 2000. It was designed to
            be typed easily on a standard keyboard, so it avoids the special
            marks used by older systems. You will see it on road signs, subway
            maps, and place names across South Korea.
          </p>
          <p>
            The main alternative you may encounter is{" "}
            <strong>McCune-Reischauer</strong>, a system from 1937 that relies on
            apostrophes and breve marks (for example, <em>ŏ</em> and <em>ŭ</em>,
            and <em>k&apos;</em> for an aspirated consonant). Revised
            Romanization replaces those with plain letters: McCune-Reischauer{" "}
            <em>Pusan</em> and <em>Kimch&apos;i</em> become{" "}
            <em>Busan</em> and <em>Gimchi</em>. Because it needs no diacritics,
            Revised Romanization is the modern default for digital text, and it
            is what this tool produces.
          </p>

          <h2>Tips for using Korean pronunciation</h2>
          <ul>
            <li>
              Korean spelling and sound do not always match one-to-one. Final
              consonants often link into the next syllable — 한국어 is written
              <em> han-guk-eo</em> but pronounced <em>hangugeo</em>.
            </li>
            <li>
              Use the romanization as a bridge, not a destination. The faster you
              can read Hangul directly, the more accurate your pronunciation will
              become.
            </li>
            <li>
              Listen and repeat out loud. Korean has sound changes — like
              consonants softening between vowels — that are easier to absorb by
              ear than by rule.
            </li>
            <li>
              Pay attention to vowels such as <em>eo</em> (어) and <em>eu</em>{" "}
              (으); they have no exact English equivalent and are commonly
              mispronounced by beginners.
            </li>
          </ul>

          <h2>Frequently asked questions</h2>
          <h3>Is romanization the same as pronunciation?</h3>
          <p>
            Not exactly. Romanization is a written approximation of Korean sounds
            using Latin letters, and it cannot capture every detail of how a word
            is actually said. Use the Listen button to hear the real
            pronunciation alongside the text.
          </p>
          <h3>Can I use this for names?</h3>
          <p>
            Yes, you can romanize Korean names, though personal and place names
            sometimes have their own established spellings that differ from a
            strict conversion (for example, the surname 이 is often written{" "}
            <em>Lee</em> rather than <em>I</em>). Treat the output as a starting
            point for names.
          </p>
          <h3>Does the speech sound natural?</h3>
          <p>
            The audio uses your device&apos;s built-in Korean text-to-speech
            voice, so quality depends on your browser and operating system. It is
            clear enough for learning, but it may sound slightly robotic compared
            to a native speaker.
          </p>
          <h3>What is the difference between Revised and McCune-Reischauer?</h3>
          <p>
            Revised Romanization (2000) uses only plain Latin letters and is the
            official standard in South Korea today. McCune-Reischauer (1937) uses
            apostrophes and accent marks and is still common in older academic
            works and in North Korean contexts. This tool produces Revised
            Romanization.
          </p>
        </article>

        <footer className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-600">
          <p className="mb-1">
            New to the alphabet? Start with{" "}
            <Link
              href="/korean/how-to-read-hangul-step-by-step"
              className="font-medium text-gray-900 hover:underline"
            >
              How to Read Hangul Step by Step
            </Link>
            .
          </p>
          <p>
            Want to understand final consonants? Read{" "}
            <Link
              href="/korean/korean-batchim-explained"
              className="font-medium text-gray-900 hover:underline"
            >
              Korean Batchim Explained
            </Link>
            .
          </p>
        </footer>
      </main>
    </>
  );
}
