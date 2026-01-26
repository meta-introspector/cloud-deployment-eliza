# a7046c18:packages_core_typescript_src_utils_buffer.ts:301-329

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/buffer.ts:301-329
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    cryptoGlobal.getRandomValues(bytes);
  } else {
    // Fallback: less secure random generation
    for (let i = 0; i < size; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  return bytes;
}

// Export a namespace-like object for compatibility
export const BufferUtils = {
  fromHex,
  fromString,
  fromBytes,
  toHex,
  toString,
  isBuffer,
  alloc,
  concat,
  slice,
  equals,
  byteLength,
  randomBytes,
};

// Export type for use in other modules
export type { BufferLike as Buffer };
```