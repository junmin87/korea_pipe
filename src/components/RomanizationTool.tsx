"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { romanize } from "@/lib/romanization";

const EXAMPLE = "안녕하세요";

// Read speech-synthesis support without triggering a hydration mismatch:
// the server snapshot is `false` and the client resolves the real value.
const subscribeNoop = () => () => {};
const getSpeechSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export default function RomanizationTool() {
  const [input, setInput] = useState("");
  const [debounced, setDebounced] = useState("");
  const speechSupported = useSyncExternalStore(
    subscribeNoop,
    getSpeechSupported,
    () => false,
  );

  // Debounce the input (~150ms) before romanizing.
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input), 150);
    return () => clearTimeout(timer);
  }, [input]);

  const output = useMemo(() => romanize(debounced), [debounced]);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleListen = () => {
    if (!speechSupported || !input.trim()) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(input);
    utterance.lang = "ko-KR";
    synth.speak(utterance);
  };

  const handleExample = () => {
    setInput(EXAMPLE);
    inputRef.current?.focus();
  };

  const hasInput = input.trim().length > 0;

  return (
    <div className="not-prose my-8">
      <label
        htmlFor="hangul-input"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Korean (Hangul)
      </label>
      <textarea
        id="hangul-input"
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={4}
        placeholder="Type or paste Korean here, e.g. 안녕하세요"
        lang="ko"
        className="w-full resize-y rounded-lg border border-gray-300 p-4 text-xl leading-relaxed text-gray-900 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleListen}
          disabled={!speechSupported || !hasInput}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          🔊 Listen
        </button>
        {!speechSupported && (
          <span className="text-sm text-gray-500">
            Speech playback isn&apos;t available in this browser.
          </span>
        )}
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-medium text-gray-700">Romanization</h2>
        <div className="min-h-[4rem] rounded-lg border border-gray-200 bg-gray-50 p-4 text-xl leading-relaxed text-gray-900">
          {hasInput ? (
            <span>{output}</span>
          ) : (
            <span className="text-gray-400">
              Your romanization will appear here.{" "}
              <button
                type="button"
                onClick={handleExample}
                className="font-medium text-gray-600 underline hover:text-gray-900"
              >
                Try an example
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
