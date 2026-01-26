# 5e8c73c1:packages_core_src_utils_buffer.ts:301-320

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/buffer.ts:301-320
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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