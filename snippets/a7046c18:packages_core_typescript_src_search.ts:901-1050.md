# a7046c18:packages_core_typescript_src_search.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   *
   * @param text - The input text string to tokenize.
   * @param includeStats - If true, returns tokenization statistics along with tokens. Defaults to false.
   * @returns A `TokenizationResult` object containing the array of tokens and optional stats.
   * @throws {Error} If the input text is null, undefined, or empty.
   */
  tokenize(text: string, includeStats = false): TokenizationResult {
    if (!text) {
      throw new Error("Input text cannot be null or empty");
    }
    const startTime = Date.now();
    const originalWords = text.split(/\s+/).filter((word) => word.length > 0);
    const cleaned = this.cleanText(text);
    const tokens = cleaned
      .split(/\s+/)
      .filter((token) => this.isValidToken(token))
      .map((token) => (this.stemming ? this.stemWord(token) : token));
    const stats: TokenizationStats = includeStats
      ? {
          originalWordCount: originalWords.length,
          stopWordsRemoved: originalWords.length - tokens.length, // This might be incorrect if stemming changes token count
          stemmedWords: this.stemming ? tokens.length : 0,
          processingTimeMs: Date.now() - startTime,
        }
      : {
          originalWordCount: 0,
          stopWordsRemoved: 0,
          stemmedWords: 0,
          processingTimeMs: 0,
        };
    return { tokens, stats };
  }

  /**
   * Cleans and normalizes text for tokenization.
   * - Converts to lowercase.
   * - Normalizes Unicode characters (NFKD).
   * - Removes control characters and zero-width spaces.
   * - Removes diacritical marks (accents).
   * - Removes emojis and pictographs.
   * - Removes common symbols (™, ®, ©, ℠, ‼).
   * - Replaces Unicode punctuation with spaces.
   * - Removes characters not matching basic Latin, CJK, Hangul, or whitespace.
   * - Collapses multiple spaces into single spaces.
   * - Trims leading/trailing whitespace.
   *
   * @param text - Input text to clean.
   * @returns Cleaned and normalized text, ready for splitting into tokens.
   *
   * @example
   * cleanText("Hello, World™!") // "hello world"
   * cleanText("héllo 👋") // "hello"
   * cleanText("Hello 世界!") // "hello 世界"
   * cleanText("I'm don't") // "i'm don't" (apostrophes kept by replacing punctuation with space)
   * cleanText("test©2023") // "test 2023"
   */
  cleanText(text: string): string {
    return text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "") // Control characters & zero-width spaces
      .replace(/[\u0300-\u036f]/g, "") // Diacritical marks
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "") // Emojis and pictographs
      .replace(/[™®©℠‼]/g, "") // Common symbols
      .replace(/[\p{P}]/gu, " ") // Unicode punctuation to space
      .replace(
        /[^a-z0-9\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\s]/gu,
        " ",
      ) // Keep only latin, cjk, hangul, numbers, whitespace
      .replace(/\s+/g, " ") // Collapse multiple spaces
      .trim();
  }

  /**
   * Checks if a token is valid (meets `minLength` criteria and is not a stop word).
   * Numeric tokens are always considered valid regardless of length.
   * @param token - The token string to validate.
   * @returns `true` if the token is valid, `false` otherwise.
   */
  isValidToken(token: string): boolean {
    const isNumeric = /^\d+$/.test(token);
    return (
      (token.length >= this.minLength || isNumeric) &&
      !this.stopWords.has(token)
    );
  }

  /**
   * Applies stemming to a single word.
   * First, tries to apply custom stemming rules defined in `stemmingRules`.
   * If no custom rule matches, applies the default Porter2 stemming algorithm.
   * Words shorter than 3 characters are not stemmed.
   * @param word - The word to stem.
   * @returns The stemmed word.
   */
  stemWord(word: string): string {
    if (word.length < 3) return word;
    let customRuleApplied = false;
    let stemmed = word;
    for (const rule of this.stemmingRules) {
      const match = stemmed.match(rule.pattern);
      if (match) {
        if (
          !rule.minMeasure ||
          this.measure(stemmed.substring(0, match.index)) >= rule.minMeasure
        ) {
          // Apply replacement
          if (typeof rule.replacement === "string") {
            stemmed = stemmed.replace(rule.pattern, rule.replacement);
          } else {
            // If replacement is a function, it might need more specific arguments based on its definition.
            // Assuming it takes the matched substring and potentially other match groups.
            stemmed = stemmed.replace(rule.pattern, (...args) =>
              (rule.replacement as Function)(...args),
            );
          }
          customRuleApplied = true; // Mark that a custom rule was (potentially) applied
          // Depending on stemming strategy, might want to break or continue applying rules
        }
      }
    }
    // If a custom rule was applied and modified the word, return it.
    // Otherwise, or if custom rules are meant to precede default stemming, apply Porter2.
    if (customRuleApplied && stemmed !== word) return stemmed; // Return if custom rule changed the word

    // Fallback to Porter2 if no custom rule applied or if custom rules are pre-processing
    return stem(stemmed); // Apply Porter2 to the (potentially already custom-stemmed) word
  }

  /**
   * Checks if the character at a given index in a word is a consonant.
   * Treats 'y' as a consonant if it's the first letter or follows a consonant.
   * @param word - The word string.
   * @param i - The index of the character to check.
   * @returns `true` if the character is a consonant, `false` otherwise.
   */
  isConsonant(word: string, i: number): boolean {
    const char = word[i];
    if ("aeiou".includes(char)) return false;
    return char !== "y" || (i === 0 ? true : !this.isConsonant(word, i - 1));
  }

  /**
   * Calculates the "measure" of a word stem (approximates syllable count).
   * The measure (m) is the number of times a sequence of vowels is followed by a
   * sequence of consonants (VC). Used in some stemming rules.
   * Example: measure("tree") = 0, measure("trouble") = 1, measure("private") = 2
   * @param word - The word (or stem) to measure.
   * @returns The measure (m) of the word.
   */
```