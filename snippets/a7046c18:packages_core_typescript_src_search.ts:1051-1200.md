# a7046c18:packages_core_typescript_src_search.ts:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/search.ts:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  measure(word: string): number {
    let m = 0;
    let vowelSeen = false;
    for (let i = 0; i < word.length; i++) {
      if (this.isConsonant(word, i)) {
        if (vowelSeen) {
          m++;
          vowelSeen = false;
        }
      } else {
        vowelSeen = true;
      }
    }
    return m;
  }
}

/**
 * BM25 Options Interface.
 * Extends TokenizerOptions and adds BM25 specific parameters.
 */
interface BM25Options extends TokenizerOptions {
  /**
   * Term frequency saturation parameter (k1). Controls how quickly term frequency
   * saturates. Higher values mean TF contributes more significantly even for high counts.
   * Typical values are between 1.2 and 2.0. Default: 1.2.
   */
  k1?: number;
  /**
   * Document length normalization parameter (b). Controls the influence of document
   * length. 0 means no length normalization, 1 means full normalization.
   * Typical values are around 0.75. Default: 0.75.
   */
  b?: number;
  /**
   * A dictionary defining boost factors for specific document fields.
   * Terms found in fields with higher boost factors will contribute more to the score.
   * Example: `{ title: 2, body: 1 }`. Default: `{}` (no boosts).
   */
  fieldBoosts?: { [key: string]: number };
}

/**
 * Represents a search result item.
 */
interface SearchResult {
  /** The index of the matching document in the original document array. */
  index: number;
  /** The BM25 relevance score for the document. Higher scores indicate better relevance. */
  score: number;
  /** The actual document object (optional, depends on how results are retrieved). */
  doc?: Record<string, unknown>;
}

/**
 * Implements the Okapi BM25 (Best Matching 25) ranking function for information retrieval.
 *
 * BM25 ranks documents based on the query terms appearing in each document,
 * considering term frequency (TF) and inverse document frequency (IDF).
 * It improves upon basic TF-IDF by incorporating:
 * - Term Frequency Saturation (k1): Prevents overly frequent terms from dominating the score.
 * - Document Length Normalization (b): Penalizes documents that are longer than average,
 *   assuming longer documents are more likely to contain query terms by chance.
 *
 * Key Components:
 * - Tokenizer: Processes text into terms (words), handles stop words and stemming.
 * - Document Indexing: Stores document lengths, term frequencies per document,
 *   and overall document frequency for each term.
 * - IDF Calculation: Measures the informativeness of a term based on how many documents contain it.
 * - Scoring: Combines TF, IDF, document length, and parameters k1/b to calculate relevance.
 */
export class BM25 {
  /** Term frequency saturation parameter (k1). */
  readonly termFrequencySaturation: number; // k1
  /** Document length normalization factor (b). */
  readonly lengthNormalizationFactor: number; // b
  /** Tokenizer instance used for processing text. */
  readonly tokenizer: Tokenizer;
  /** Array storing the length (number of tokens, adjusted by field boosts) of each document. */
  documentLengths: Uint32Array;
  /** Average length of all documents in the index. */
  averageDocLength: number;
  /** Map from term (string) to its unique integer index. */
  termToIndex: Map<string, number>;
  /** Array storing the document frequency (number of docs containing the term) for each term index. */
  documentFrequency: Uint32Array; // DF for each term index
  /** Map from term index to another map storing `docIndex: termFrequencyInDoc`. */
  termFrequencies: Map<number, Map<number, number>>; // TermIndex -> { DocIndex -> TF }
  /** Boost factors for different fields within documents. */
  readonly fieldBoosts: { [key: string]: number };
  /** Array storing the original documents added to the index. */
  documents: Array<Record<string, unknown>>;

  /**
   * Creates a new BM25 search instance.
   * @param docs - Optional array of initial documents (objects with string fields) to index.
   * @param options - Configuration options for BM25 parameters (k1, b), tokenizer (stopWords, stemming, minLength), and field boosts.
   */
  constructor(
    docs?: Array<Record<string, unknown>>,
    options: BM25Options = {},
  ) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    this.termFrequencySaturation = opts.k1!; // Non-null assertion as DEFAULT_OPTIONS provides it
    this.lengthNormalizationFactor = opts.b!; // Non-null assertion
    this.tokenizer = new Tokenizer(opts);
    this.fieldBoosts = opts.fieldBoosts || {};

    // Initialize index structures
    this.documents = [];
    this.documentLengths = new Uint32Array(0);
    this.termToIndex = new Map<string, number>();
    this.documentFrequency = new Uint32Array(0); // Will be sized later
    this.averageDocLength = 0;
    this.termFrequencies = new Map<number, Map<number, number>>(); // TermIndex -> { DocIndex -> TF }

    // Index initial documents if provided
    if (docs && docs.length > 0) {
      this.documents = [...docs]; // Store original documents
      const {
        documentLengths,
        termToIndex,
        documentFrequency,
        averageDocLength,
        termFrequencies,
      } = this.processDocuments(docs);
      // Assign processed data to instance properties
      this.documentLengths = documentLengths;
      this.termToIndex = termToIndex;
      this.documentFrequency = documentFrequency;
      this.averageDocLength = averageDocLength;
      this.termFrequencies = termFrequencies;
    }
  }

  /**
   * Processes an array of documents to build the initial index structures.
   * Calculates document lengths, term frequencies, document frequencies, and average document length.
   * @param docs - Array of documents to process.
   * @returns An object containing the calculated index data.
   * @internal
   */
  private processDocuments(docs: Array<Record<string, unknown>>): {
    documentLengths: Uint32Array;
    termToIndex: Map<string, number>;
    documentFrequency: Uint32Array;
    averageDocLength: number;
    termFrequencies: Map<number, Map<number, number>>;
  } {
    const numDocs = docs.length;
```