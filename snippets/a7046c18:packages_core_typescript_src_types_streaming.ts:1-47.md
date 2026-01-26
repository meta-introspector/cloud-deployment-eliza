# a7046c18:packages_core_typescript_src_types_streaming.ts:1-47

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/streaming.ts:1-47
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Streaming type definitions.
 *
 * This module defines the interface contract for stream content extractors.
 * Implementations are in utils/streaming.ts.
 */

/**
 * Interface for stream content extractors.
 *
 * Implementations decide HOW to filter LLM output for streaming.
 * Could be XML parsing, JSON parsing, plain text passthrough, or custom logic.
 *
 * The framework doesn't care about format - that's implementation choice.
 *
 * Usage: Create a new instance for each stream. Don't reuse instances.
 *
 * @example
 * ```ts
 * // Simple passthrough - streams everything as-is
 * const extractor = new PassthroughExtractor();
 *
 * // XML tag extraction - extracts content from <text> tag
 * const extractor = new XmlTagExtractor('text');
 *
 * // Action-aware XML (DefaultMessageService)
 * const extractor = new ResponseStreamExtractor();
 *
 * // Custom implementation
 * class MyExtractor implements IStreamExtractor {
 *   private _done = false;
 *   get done() { return this._done; }
 *   push(chunk: string) { return this.myCustomLogic(chunk); }
 * }
 * ```
 */
export interface IStreamExtractor {
  /** Whether extraction is complete (no more content expected from this stream) */
  readonly done: boolean;

  /**
   * Process a chunk from the LLM stream.
   * @param chunk - Raw chunk from LLM
   * @returns Text to stream to client (empty string = nothing to stream yet)
   */
  push(chunk: string): string;
}
```