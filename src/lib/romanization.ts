/**
 * Hangul → Revised Romanization of Korean (the official 2000 South Korean
 * government standard, romaja). This is the modern default — NOT the older
 * McCune-Reischauer system.
 *
 * APPROACH: implemented directly (no external dependency). A small, well-known
 * romanization library could have been used, but the rule set needed here is
 * compact and hand-rolling it avoids adding a dependency for a single feature.
 *
 * What it handles:
 *  - Unicode Hangul syllable decomposition (initial / medial / final jamo).
 *  - Batchim (final consonant) → next-syllable liaison when the next syllable
 *    begins with a silent ㅇ (e.g. 한국어 → hangugeo, 꽃이 → kkochi).
 *  - Common consonant assimilations across syllable boundaries:
 *      • Nasalization: ㄱ/ㄷ/ㅂ before ㄴ/ㅁ (학년 → hangnyeon, 입니다 → imnida).
 *      • ㅎ aspiration both directions (좋다 → jota, 축하 → chuka).
 *      • Lateralization: ㄴㄹ / ㄹㄴ / ㄹㄹ → ll (신라 → silla, 빨리 → ppalli).
 *      • ㄹ → n after a stop/nasal (독립 → dongnip, 대통령 → daetongnyeong).
 *
 * Following the Revised Romanization spec, tensification (된소리) is NOT
 * reflected: 학교 → hakgyo (not hakkyo). Non-Hangul characters pass through
 * unchanged. Syllables within a word are joined without hyphens, which is the
 * common written form; this can occasionally be ambiguous (e.g. n+g vs ng).
 * Palatalization (ㄷ/ㅌ + 이 → ji/chi) is intentionally not implemented.
 */

const SYLLABLE_BASE = 0xac00;
const SYLLABLE_LAST = 0xd7a3;
const MEDIAL_COUNT = 21;
const FINAL_COUNT = 28;
const VxT = MEDIAL_COUNT * FINAL_COUNT; // 588

// Initial consonants (choseong), indexed 0–18.
const INITIAL: readonly string[] = [
  "g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s",
  "ss", "", "j", "jj", "ch", "k", "t", "p", "h",
];

// Vowels (jungseong), indexed 0–20.
const MEDIAL: readonly string[] = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa",
  "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i",
];

// Final consonants (jongseong) as their representative pronounced sound,
// indexed 0–27 (0 = no final).
const FINAL: readonly string[] = [
  "", "k", "k", "k", "n", "n", "n", "t", "l", "k",
  "m", "l", "l", "l", "p", "l", "m", "p", "p", "t",
  "t", "ng", "t", "t", "k", "t", "p", "t",
];

// Liaison decomposition: when a final moves onto a following silent ㅇ, this
// maps a final index → [remaining final index, moved initial index]. For a
// single final the whole consonant moves (remaining = 0). For a cluster the
// first consonant stays as the final and the second moves. Indices 21 (ㅇ) and
// 27 (ㅎ) are special-cased in applyLiaison and intentionally omitted here.
const LIAISON: Readonly<Record<number, readonly [number, number]>> = {
  1: [0, 0], 2: [0, 1], 3: [1, 9], 4: [0, 2], 5: [4, 12], 6: [0, 2],
  7: [0, 3], 8: [0, 5], 9: [8, 0], 10: [8, 6], 11: [8, 7], 12: [8, 9],
  13: [8, 16], 14: [8, 17], 15: [0, 5], 16: [0, 6], 17: [0, 7], 18: [17, 9],
  19: [0, 9], 20: [0, 10], 22: [0, 12], 23: [0, 14], 24: [0, 15], 25: [0, 16],
  26: [0, 17],
};

interface Syllable {
  type: "syllable";
  initial: number;
  medial: number;
  final: number;
}

interface Passthrough {
  type: "other";
  char: string;
}

type Token = Syllable | Passthrough;

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  for (const char of input) {
    const code = char.codePointAt(0)!;
    if (code >= SYLLABLE_BASE && code <= SYLLABLE_LAST) {
      const offset = code - SYLLABLE_BASE;
      tokens.push({
        type: "syllable",
        initial: Math.floor(offset / VxT),
        medial: Math.floor((offset % VxT) / FINAL_COUNT),
        final: offset % FINAL_COUNT,
      });
    } else {
      tokens.push({ type: "other", char });
    }
  }
  return tokens;
}

/**
 * Converts Hangul text to Revised Romanization.
 */
export function romanize(hangul: string): string {
  if (!hangul) return "";

  const tokens = tokenize(hangul);
  const n = tokens.length;

  // Per-syllable overrides produced by boundary rules. `null` means "use the
  // syllable's own value".
  const initialOverride: (string | null)[] = new Array(n).fill(null);
  const finalOverride: (number | null)[] = new Array(n).fill(null);

  const currentFinal = (i: number): number => {
    const token = tokens[i];
    if (token.type !== "syllable") return 0;
    return finalOverride[i] !== null ? (finalOverride[i] as number) : token.final;
  };

  for (let i = 0; i < n; i++) {
    const token = tokens[i];
    if (token.type !== "syllable") continue;
    const next = tokens[i + 1];
    if (!next || next.type !== "syllable") continue;

    const fin = currentFinal(i);
    if (fin === 0) continue;
    const nextInitial = next.initial;

    if (nextInitial === 11) {
      applyLiaison(i, fin, initialOverride, finalOverride);
    } else {
      applyAssimilation(i, fin, nextInitial, initialOverride, finalOverride);
    }
  }

  let result = "";
  for (let i = 0; i < n; i++) {
    const token = tokens[i];
    if (token.type !== "syllable") {
      result += token.char;
      continue;
    }
    const initial =
      initialOverride[i] !== null
        ? (initialOverride[i] as string)
        : INITIAL[token.initial];
    const finalIdx =
      finalOverride[i] !== null ? (finalOverride[i] as number) : token.final;
    result += initial + MEDIAL[token.medial] + FINAL[finalIdx];
  }
  return result;
}

function applyLiaison(
  i: number,
  fin: number,
  initialOverride: (string | null)[],
  finalOverride: (number | null)[],
): void {
  // ㅇ final keeps its "ng" sound and does not move (강아지 → gangaji).
  if (fin === 21) return;
  // ㅎ final goes silent before a vowel (좋아 → joa).
  if (fin === 27) {
    finalOverride[i] = 0;
    return;
  }
  const decomp = LIAISON[fin];
  if (!decomp) return;
  const [remaining, moved] = decomp;
  finalOverride[i] = remaining;
  initialOverride[i + 1] = INITIAL[moved];
}

function applyAssimilation(
  i: number,
  fin: number,
  nextInitial: number,
  initialOverride: (string | null)[],
  finalOverride: (number | null)[],
): void {
  const repr = FINAL[fin];
  const j = i + 1;

  // 1. ㅎ-final aspiration before ㄱ/ㄷ/ㅈ/ㅅ (좋고 → joko, 많다 → manta).
  const hasH = fin === 27 || fin === 6 || fin === 15;
  if (hasH && (nextInitial === 0 || nextInitial === 3 || nextInitial === 12 || nextInitial === 9)) {
    finalOverride[i] = fin === 6 ? 4 : fin === 15 ? 8 : 0;
    initialOverride[j] =
      nextInitial === 0 ? "k" : nextInitial === 3 ? "t" : nextInitial === 12 ? "ch" : "ss";
    return;
  }

  // 2. Stop + ㅎ aspiration (축하 → chuka, 입학 → ipak).
  if (nextInitial === 18 && (repr === "k" || repr === "t" || repr === "p")) {
    finalOverride[i] = 0;
    initialOverride[j] = repr;
    return;
  }

  // 3. ㄹ-initial interactions.
  if (nextInitial === 5) {
    if (repr === "n") {
      finalOverride[i] = 8; // ㄴㄹ → ll (신라 → silla)
      initialOverride[j] = "l";
      return;
    }
    if (repr === "l") {
      initialOverride[j] = "l"; // ㄹㄹ → ll (빨리 → ppalli)
      return;
    }
    // Stop/nasal + ㄹ → n, nasalizing a preceding stop (독립 → dongnip).
    initialOverride[j] = "n";
    if (repr === "k") finalOverride[i] = 21;
    else if (repr === "t") finalOverride[i] = 4;
    else if (repr === "p") finalOverride[i] = 16;
    return;
  }

  // 4. ㄹ-final + ㄴ → ll (칼날 → kallal).
  if (repr === "l" && nextInitial === 2) {
    initialOverride[j] = "l";
    return;
  }

  // 5. Nasalization: stop before ㄴ/ㅁ (학년 → hangnyeon, 입니다 → imnida).
  if ((repr === "k" || repr === "t" || repr === "p") && (nextInitial === 2 || nextInitial === 6)) {
    finalOverride[i] = repr === "k" ? 21 : repr === "t" ? 4 : 16;
    return;
  }
}
