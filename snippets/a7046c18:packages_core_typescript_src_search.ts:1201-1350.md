# a7046c18:packages_core_typescript_src_search.ts:1201-1350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:1201-1350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const documentLengths = new Uint32Array(numDocs);
    const termToIndex = new Map<string, number>();
    const termDocs = new Map<string, Set<number>>(); // Temp map: Term -> Set<DocIndex>
    const termFrequencies = new Map<number, Map<number, number>>(); // TermIndex -> { DocIndex -> TF }
    let totalDocLength = 0;
    let nextTermIndex = 0;

    docs.forEach((doc, docIndex) => {
      let currentDocLength = 0;
      const docTermFrequencies = new Map<number, number>(); // TermIndex -> TF for this doc

      // Iterate through fields of the document
      Object.entries(doc).forEach(([field, content]) => {
        if (typeof content !== "string") return; // Skip non-string fields

        const fieldBoost = this.fieldBoosts[field] || 1;
        const { tokens } = this.tokenizer.tokenize(content);
        const fieldLength = tokens.length * fieldBoost;
        currentDocLength += fieldLength;

        // Calculate term frequencies within this field/doc
        tokens.forEach((term) => {
          // Assign index to new terms
          if (!termToIndex.has(term)) {
            termToIndex.set(term, nextTermIndex++);
          }
          const termIndexVal = termToIndex.get(term)!;

          // Track which documents contain the term
          if (!termDocs.has(term)) {
            termDocs.set(term, new Set<number>());
          }
          termDocs.get(term)?.add(docIndex);

          // Increment frequency for this term in this document
          const currentFreq = docTermFrequencies.get(termIndexVal) || 0;
          docTermFrequencies.set(termIndexVal, currentFreq + fieldBoost); // TF weighted by boost
        });
      });

      // Store the calculated length for this document
      documentLengths[docIndex] = currentDocLength;
      totalDocLength += currentDocLength;

      // Merge this document's term frequencies into the main structure
      docTermFrequencies.forEach((freq, termIndexVal) => {
        if (!termFrequencies.has(termIndexVal)) {
          termFrequencies.set(termIndexVal, new Map<number, number>());
        }
        termFrequencies.get(termIndexVal)?.set(docIndex, freq);
      });
    });

    // Calculate document frequency (DF) for each term
    const documentFrequency = new Uint32Array(termToIndex.size);
    termDocs.forEach((docsSet, term) => {
      const termIndexVal = termToIndex.get(term)!;
      documentFrequency[termIndexVal] = docsSet.size;
    });

    return {
      documentLengths,
      termToIndex,
      documentFrequency,
      averageDocLength: numDocs > 0 ? totalDocLength / numDocs : 0,
      termFrequencies,
    };
  }

  /**
   * Recalculates the average document length based on the current `documentLengths`.
   * @internal
   */
  private recalculateAverageLength(): void {
    if (this.documentLengths.length === 0) {
      this.averageDocLength = 0;
      return;
    }
    // Use the typed array's reduce method for type safety and performance
    const totalLength = this.documentLengths.reduce((sum, len) => sum + len, 0);
    this.averageDocLength = totalLength / this.documentLengths.length;
  }

  /**
   * Searches the indexed documents for a given query string using the BM25 ranking formula.
   *
   * @param query - The search query text.
   * @param topK - The maximum number of top-scoring results to return. Defaults to 10.
   * @returns An array of `SearchResult` objects, sorted by descending BM25 score.
   */
  search(query: string, topK = 10): SearchResult[] {
    const { tokens: queryTokens } = this.tokenizer.tokenize(query); // Tokenize the query
    const scores = new Float32Array(this.documentLengths.length).fill(0); // Initialize scores to 0

    // Accumulate scores for each document based on query terms
    queryTokens.forEach((term) => {
      const termIndex = this.termToIndex.get(term);
      // Ignore terms not found in the index
      if (termIndex === undefined) return;

      const idf = this.calculateIdf(termIndex);
      // Skip terms with non-positive IDF (e.g., term in all docs)
      if (idf <= 0) return;

      const termFreqsInDocs = this.termFrequencies.get(termIndex); // Map<DocIndex, TF>
      if (!termFreqsInDocs) return; // Should not happen if termIndex exists, but check anyway

      // Iterate over documents containing this term
      termFreqsInDocs.forEach((tf, docIndex) => {
        const docLength = this.documentLengths[docIndex];

        // --- BM25 Term Score Calculation ---
        // Normalizes TF based on document length and saturation parameters.
        const numerator = tf * (this.termFrequencySaturation + 1);
        const denominator =
          tf +
          this.termFrequencySaturation *
            (1 -
              this.lengthNormalizationFactor +
              (this.lengthNormalizationFactor * docLength) /
                this.averageDocLength);

        // Add the weighted score (IDF * normalized TF) for this term to the document's total score
        scores[docIndex] += idf * (numerator / denominator);
      });
    });

    // --- Result Generation ---
    // Create result objects, filter out zero scores, sort, and take top K
    return Array.from({ length: scores.length }, (_, i) => ({
      index: i,
      score: scores[i],
      // Optionally add: doc: this.getDocument(i) // If you want the full doc in results
    }))
      .filter((result) => result.score > 0) // Keep only documents with positive scores
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, topK); // Limit to topK results
  }

  /**
   * Searches for an exact phrase within the indexed documents.
   * Ranks documents containing the exact sequence of tokens higher.
   * Note: This is a basic implementation. More sophisticated phrase search might consider proximity.
   *
   * @param phrase - The exact phrase to search for.
   * @param topK - The maximum number of results to return. Defaults to 10.
   * @returns An array of `SearchResult` objects, sorted by score, for documents containing the phrase.
   */
  searchPhrase(phrase: string, topK = 10): SearchResult[] {
    const { tokens: phraseTokens } = this.tokenizer.tokenize(phrase); // Tokenize the phrase
```