# a7046c18:packages_core_typescript_src_search.ts:1501-1631

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:1501-1631
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        if (!this.termToIndex.has(term)) {
          termIndexVal = this.termToIndex.size;
          this.termToIndex.set(term, termIndexVal);

          // Ensure documentFrequency array is large enough
          if (this.documentFrequency.length <= termIndexVal) {
            const oldDf = this.documentFrequency;
            // Grow exponentially, ensure it's at least termIndex + 1
            const newSize = Math.max(termIndexVal + 1, oldDf.length * 2 || 1); // Ensure newSize is at least 1 if oldDf.length is 0
            this.documentFrequency = new Uint32Array(newSize);
            this.documentFrequency.set(oldDf, 0);
          }
          // Initialize DF for new term (will be incremented below)
          this.documentFrequency[termIndexVal] = 0;
        } else {
          termIndexVal = this.termToIndex.get(term)!;
        }

        // Increment frequency for this term in this new document
        const currentFreq = docTermFrequencies.get(termIndexVal) || 0;
        docTermFrequencies.set(termIndexVal, currentFreq + fieldBoost); // Weighted TF
      });
    });

    // --- Update Global Structures ---
    // Set the calculated length for the new document
    this.documentLengths[docIndex] = currentDocLength;

    // Add this document's term frequencies to the main map and update DF
    docTermFrequencies.forEach((freq, termIndexVal) => {
      // Add TF entry
      if (!this.termFrequencies.has(termIndexVal)) {
        this.termFrequencies.set(termIndexVal, new Map<number, number>());
      }
      this.termFrequencies.get(termIndexVal)?.set(docIndex, freq);

      // Increment document frequency for the term
      // Ensure termIndexVal is within bounds of documentFrequency before incrementing
      if (termIndexVal < this.documentFrequency.length) {
        this.documentFrequency[termIndexVal]++;
      }
    });

    // Recalculate average document length
    this.recalculateAverageLength(); // Efficiently update average
  }

  /**
   * Calculates the Inverse Document Frequency (IDF) for a given term index.
   * Uses the BM25 IDF formula: log(1 + (N - n + 0.5) / (n + 0.5))
   * where N is the total number of documents and n is the number of documents
   * containing the term. The +1 smooths the logarithm.
   *
   * @param termIndex - The integer index of the term.
   * @returns The IDF score for the term. Returns 0 if the term is not found or has 0 DF.
   */
  calculateIdf(termIndex: number): number {
    // Ensure termIndex is valid
    if (termIndex < 0 || termIndex >= this.documentFrequency.length) {
      return 0; // Term not in index or index out of bounds
    }

    const docFreq = this.documentFrequency[termIndex]; // n: number of docs containing the term
    // If term appears in 0 documents or more docs than exist (error state), return 0 IDF.
    if (docFreq <= 0 || docFreq > this.documentLengths.length) {
      return 0;
    }

    const N = this.documentLengths.length; // Total number of documents
    const numerator = N - docFreq + 0.5;
    const denominator = docFreq + 0.5;

    // Adding 1 inside the log ensures IDF is always non-negative.
    return Math.log(1 + numerator / denominator);
  }

  /**
   * Retrieves the term frequency (TF) for a specific term in a specific document.
   * @param termIndex - The integer index of the term.
   * @param docIndex - The index of the document.
   * @returns The term frequency, or 0 if the term is not in the document or indices are invalid.
   */
  getTermFrequency(termIndex: number, docIndex: number): number {
    return this.termFrequencies.get(termIndex)?.get(docIndex) || 0;
  }

  /**
   * Retrieves the original document object stored at a given index.
   * @param index - The index of the document to retrieve.
   * @returns The document object.
   * @throws {Error} If the index is out of bounds.
   */
  getDocument(index: number): Record<string, unknown> {
    // Consider using a generic <T>
    if (index < 0 || index >= this.documents.length) {
      throw new Error(
        `Document index ${index} out of bounds (0-${this.documents.length - 1})`,
      );
    }
    return this.documents[index];
  }

  /**
   * Clears all indexed documents and resets the BM25 instance to its initial state.
   */
  clearDocuments(): void {
    this.documents = [];
    this.documentLengths = new Uint32Array(0);
    this.termToIndex.clear();
    this.documentFrequency = new Uint32Array(0);
    this.averageDocLength = 0;
    this.termFrequencies.clear();
  }

  /**
   * Gets the total number of documents currently indexed.
   * @returns The document count.
   */
  getDocumentCount(): number {
    return this.documents.length;
  }

  /**
   * Adds multiple documents sequentially by calling `addDocument` for each.
   * This method processes documents sequentially in the main thread.
   * @param docs - An array of documents to add.
   */
  async addDocuments(docs: Array<Record<string, unknown>>): Promise<void[]> {
    return Promise.all(docs.map((doc) => this.addDocument(doc)));
  }
}
```