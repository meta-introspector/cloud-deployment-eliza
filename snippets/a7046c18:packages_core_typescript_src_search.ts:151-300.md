# a7046c18:packages_core_typescript_src_search.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    isV(w[len - 2]) &&
    ((len === 2 && !isV(w[len - 1])) ||
      (len >= 3 && !isV(w[len - 3]) && !isWxy(w[len - 1])))
  );
};

// #endregion Porter2 Stemmer Helper Functions

// #region Porter2 Stemmer Algorithm

/**
 * Stems a given word using the Porter2 (Snowball English) stemming algorithm.
 *
 * The algorithm works in several steps, applying suffix stripping rules based on
 * regions R1 and R2 within the word.
 * - R1: The region after the first non-vowel following a vowel.
 * - R2: The region after the first non-vowel following a vowel in R1.
 *
 * The steps generally involve:
 * 1. Handling plurals and past participles (-s, -es, -ed, -ing).
 * 2. Turning terminal 'y' to 'i' if there is another vowel in the stem.
 * 3. Mapping double suffixes to single ones (e.g., -ization to -ize).
 * 4. Dealing with suffixes like -full, -ness, etc.
 * 5. Removing suffixes like -ant, -ence, etc.
 * 6. Removing a final -e.
 *
 * @param word - The word to be stemmed.
 * @returns The stemmed version of the word.
 */
const stem = (word: string): string => {
  if (word.length < 3) return word;
  // exception1
  if (word.length <= 6) {
    switch (word) {
      case "ski":
        return "ski";
      case "skies":
        return "sky";
      case "dying":
        return "die";
      case "lying":
        return "lie";
      case "tying":
        return "tie";
      // special -LY cases
      case "idly":
        return "idl";
      case "gently":
        return "gentl";
      case "ugly":
        return "ugli";
      case "early":
        return "earli";
      case "only":
        return "onli";
      case "singly":
        return "singl";
      // invariant forms
      case "sky":
      case "news":
      case "howe":
      // not plural forms
      case "atlas":
      case "cosmos":
      case "bias":
      case "andes":
        return word;
    }
  }
  const initialOffset = word.charCodeAt(0) === 39 /* ' */ ? 1 : 0;
  let l = word.length - initialOffset;
  const w = new Array<number>(l);
  let yFound = false;
  for (let i = 0; i < l; ++i) {
    const ch = word.charCodeAt(i + initialOffset);
    if (ch === 121 && (i === 0 || isV(w[i - 1]))) {
      yFound = true;
      w[i] = 89;
      continue;
    }
    w[i] = ch;
  }
  if (w[l - 1] === 39 /* ' */) --l;
  if (l >= 2 && w[l - 2] === 39 /* ' */ && w[l - 1] === 115 /* s */) l -= 2;
  // mark_regions
  let rv = 0;
  // rv is the position after the first vowel
  while (rv < l && !isV(w[rv])) ++rv;
  if (rv < l) ++rv;
  let r1 = rv;
  if (
    l >= 5 &&
    ((w[0] === 103 &&
      w[1] === 101 &&
      w[2] === 110 &&
      w[3] === 101 &&
      w[4] === 114) || // gener
      (w[0] === 97 &&
        w[1] === 114 &&
        w[2] === 115 &&
        w[3] === 101 &&
        w[4] === 110)) // arsen
  )
    r1 = 5;
  else if (
    l >= 6 &&
    w[0] === 99 && // c
    w[1] === 111 && // o
    w[2] === 109 && // m
    w[3] === 109 && // m
    w[4] === 117 && // u
    w[5] === 110 // n
  )
    // commun
    r1 = 6;
  else {
    // > R1 is the region after the first non-vowel following a vowel,
    // > or the end of the word if there is no such non-vowel.
    while (r1 < l && isV(w[r1])) ++r1;
    if (r1 < l) ++r1;
  }
  // > R2 is the region after the first non-vowel following a vowel in R1,
  // > or the end of the word if there is no such non-vowel.
  let r2 = r1;
  while (r2 < l && !isV(w[r2])) ++r2;
  while (r2 < l && isV(w[r2])) ++r2;
  if (r2 < l) ++r2;
  // Step_1a
  if (l >= 3) {
    if (w[l - 1] === 115) {
      // s
      if (l >= 4 && w[l - 2] === 101 && w[l - 3] === 115 && w[l - 4] === 115)
        // sses
        l -= 2; // sses -> ss
      else if (w[l - 2] === 101 && w[l - 3] === 105)
        // ies
        l -= l >= 5 ? 2 : 1; // ies
      else if (w[l - 2] !== 117 && w[l - 2] !== 115 && rv < l - 1)
        // us ss -> <nothing>; s -> "delete if the preceding word part
        // contains a vowel not immediately before the s"
        l -= 1;
    } else if (w[l - 1] === 100 && w[l - 2] === 101 && w[l - 3] === 105)
      l -= l >= 5 ? 2 : 1; // ied
  }
  // exception2
  if (
    (l === 6 &&
      ((w[0] === 105 && // i
        w[1] === 110 && // n
        w[2] === 110 && // n
```