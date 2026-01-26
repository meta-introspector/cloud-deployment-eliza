# a7046c18:packages_core_typescript_src_search.ts:1351-1500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:1351-1500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    if (phraseTokens.length === 0) return []; // Cannot search for empty phrase

    // --- Find Candidate Documents ---
    // Start with documents containing the *first* term, then intersect with subsequent terms.
    let candidateDocs: Set<number> | null = null;

    for (const term of phraseTokens) {
      const termIndex = this.termToIndex.get(term);
      if (termIndex === undefined) return []; // Phrase cannot exist if any term is missing

      const docsContainingTermIter = this.termFrequencies
        .get(termIndex)
        ?.keys();
      if (!docsContainingTermIter) return []; // Should not happen, but check

      const currentTermDocs = new Set(docsContainingTermIter);

      if (candidateDocs === null) {
        // First term initializes the candidates
        candidateDocs = currentTermDocs;
      } else {
        // Intersect: Keep only documents present in both sets
        candidateDocs = new Set(
          [...candidateDocs].filter((docIdx: number) =>
            currentTermDocs.has(docIdx),
          ),
        );
      }

      // If intersection becomes empty, the phrase cannot exist
      if (candidateDocs.size === 0) return [];
    }

    if (candidateDocs === null || candidateDocs.size === 0) return []; // No candidates found

    // --- Verify Phrase Occurrence and Score ---
    const scores = new Map<number, number>(); // Map<DocIndex, Score>

    candidateDocs.forEach((docIndex) => {
      const doc = this.getDocument(docIndex); // Get the original document content
      let phraseFoundInDoc = false;

      // Check each field for the phrase
      Object.entries(doc).forEach(([field, content]) => {
        if (typeof content !== "string" || phraseFoundInDoc) return; // Skip non-strings or if already found

        const fieldBoost = this.fieldBoosts[field] || 1;
        // Tokenize the field content using the same settings
        const { tokens: docTokens } = this.tokenizer.tokenize(content);

        // Simple sliding window check for the exact phrase sequence
        for (let i = 0; i <= docTokens.length - phraseTokens.length; i++) {
          let match = true;
          for (let j = 0; j < phraseTokens.length; j++) {
            if (docTokens[i + j] !== phraseTokens[j]) {
              match = false;
              break;
            }
          }
          if (match) {
            // Phrase found! Calculate score for this document based on the phrase terms
            const phraseScoreVal =
              this.calculatePhraseScore(phraseTokens, docIndex) * fieldBoost;
            scores.set(docIndex, (scores.get(docIndex) || 0) + phraseScoreVal);
            phraseFoundInDoc = true; // Only score once per doc even if phrase repeats
            break; // Move to next document once found in this one
          }
        }
      });
    });

    // --- Format and Sort Results ---
    return Array.from(scores.entries())
      .map(([index, score]) => ({ index, score }))
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, topK); // Limit results
  }

  /**
   * Calculates a BM25-like score for a sequence of phrase tokens within a specific document.
   * Sums the individual BM25 scores of the terms in the phrase for that document.
   * @param phraseTokens - The tokenized phrase.
   * @param docIndex - The index of the document to score against.
   * @returns The calculated phrase score for the document.
   * @internal
   */
  private calculatePhraseScore(
    phraseTokens: string[],
    docIndex: number,
  ): number {
    return phraseTokens.reduce((currentScore, term) => {
      const termIndex = this.termToIndex.get(term);
      // Ignore terms not in index (shouldn't happen if candidate selection worked)
      if (termIndex === undefined) return currentScore;

      const idf = this.calculateIdf(termIndex);
      const tf = this.termFrequencies.get(termIndex)?.get(docIndex) || 0;
      const docLength = this.documentLengths[docIndex];

      // Calculate the BM25 contribution of this single term
      const numerator = tf * (this.termFrequencySaturation + 1);
      const denominator =
        tf +
        this.termFrequencySaturation *
          (1 -
            this.lengthNormalizationFactor +
            (this.lengthNormalizationFactor * docLength) /
              this.averageDocLength);

      // Add IDF * normalized TF to the total phrase score
      return currentScore + idf * (numerator / denominator);
    }, 0); // Start score at 0
  }

  /**
   * Adds a single new document to the index.
   * Updates all internal index structures incrementally.
   * Note: For adding many documents, `addDocumentsParallel` is generally more efficient.
   *
   * @param doc - The document object (with string fields) to add.
   * @throws {Error} If the document is null or undefined.
   */
  async addDocument(doc: Record<string, unknown>): Promise<void> {
    if (!doc) throw new Error("Document cannot be null");

    const docIndex = this.documentLengths.length; // Index for the new document

    // --- Update Document List and Lengths ---
    this.documents.push(doc);
    // Resize documentLengths array (simple append)
    const newDocLengths = new Uint32Array(docIndex + 1);
    newDocLengths.set(this.documentLengths, 0); // Copy old lengths
    // Calculate length later...
    this.documentLengths = newDocLengths; // Assign temporarily

    let currentDocLength = 0;
    const docTermFrequencies = new Map<number, number>(); // TermIndex -> TF for this new doc

    // --- Process Fields and Tokens ---
    Object.entries(doc).forEach(([field, content]) => {
      if (typeof content !== "string") return;

      const fieldBoost = this.fieldBoosts[field] || 1;
      const { tokens } = this.tokenizer.tokenize(content);
      currentDocLength += tokens.length * fieldBoost;

      // Process each token in the field
      tokens.forEach((term) => {
        let termIndexVal: number;
        // Add term to index if new
```