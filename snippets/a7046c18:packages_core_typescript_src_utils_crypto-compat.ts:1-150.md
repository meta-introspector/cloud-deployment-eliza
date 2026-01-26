# a7046c18:packages_core_typescript_src_utils_crypto-compat.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/crypto-compat.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Browser and Node.js compatible crypto abstraction
 * Provides unified interface for cryptographic operations
 *
 * @module crypto-compat
 *
 * This module provides both synchronous (Node.js only) and asynchronous (cross-platform)
 * APIs for cryptographic operations. Use async methods for browser compatibility.
 *
 * @example
 * ```typescript
 * // Node.js synchronous API
 * const hash = createHash('sha256').update('data').digest();
 *
 * // Cross-platform async API
 * const hash = await createHashAsync('sha256', 'data');
 * ```
 */

/**
 * Check if we're in Node.js or Bun with native crypto module available
 * @returns {boolean} True if Node.js or Bun crypto is available
 */
function hasNodeCrypto(): boolean {
  return (
    typeof require !== "undefined" &&
    typeof process !== "undefined" &&
    (process.versions?.node !== undefined ||
      process.versions?.bun !== undefined)
  );
}

/**
 * Get the appropriate crypto module for the current environment
 * @returns Native crypto in Node.js/Bun, crypto-browserify in browser
 */
/** Possible return types from cipher update/final methods */
type CipherResult = Buffer | string | Uint8Array | ArrayBuffer;

/**
 * Convert a cipher result to Buffer
 * Handles all possible return types from Node crypto and crypto-browserify
 */
function cipherResultToBuffer(result: CipherResult): Buffer {
  if (Buffer.isBuffer(result)) {
    return result;
  }
  if (typeof result === "string") {
    return Buffer.from(result, "utf8");
  }
  if (result instanceof Uint8Array) {
    return Buffer.from(result);
  }
  if (result instanceof ArrayBuffer) {
    return Buffer.from(new Uint8Array(result));
  }
  // This should never happen if types are correct, but provides safety
  throw new Error("Unexpected cipher result type");
}

function getCryptoModule(): {
  createHash: (algorithm: string) => {
    update: (
      data: string | Uint8Array,
    ) => ReturnType<typeof getCryptoModule>["createHash"];
    digest: () => Buffer;
  };
  createCipheriv: (
    algorithm: string,
    key: Uint8Array,
    iv: Uint8Array,
  ) => {
    update: (
      data: Buffer,
      inputEncoding?: string,
      outputEncoding?: string,
    ) => CipherResult;
    final: (encoding?: string) => CipherResult;
  };
  createDecipheriv: (
    algorithm: string,
    key: Uint8Array,
    iv: Uint8Array,
  ) => {
    update: (
      data: Buffer,
      inputEncoding?: string,
      outputEncoding?: string,
    ) => CipherResult;
    final: (encoding?: string) => CipherResult;
  };
} {
  if (hasNodeCrypto()) {
    return require("node:crypto");
  }
  // Use crypto-browserify for synchronous APIs in browser
  return require("crypto-browserify");
}

/**
 * Hash data using Web Crypto API (browser-compatible)
 * @param {string} algorithm - Hash algorithm ('sha256', 'sha1', 'sha512')
 * @param {Uint8Array} data - Data to hash
 * @returns {Promise<Uint8Array>} Hash result
 * @throws {Error} If Web Crypto API is not available or algorithm is unsupported
 */
async function webCryptoHash(
  algorithm: string,
  data: Uint8Array,
): Promise<Uint8Array> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error(
      "Web Crypto API not available. This browser may not support cryptographic operations.",
    );
  }

  const algoMap: Record<string, string> = {
    sha256: "SHA-256",
    sha1: "SHA-1",
    sha512: "SHA-512",
  };

  const webAlgo = algoMap[algorithm.toLowerCase()];
  if (!webAlgo) {
    throw new Error(
      `Unsupported algorithm: ${algorithm}. Supported algorithms: ${Object.keys(algoMap).join(", ")}`,
    );
  }

  const hashBuffer = await subtle.digest(webAlgo, data as BufferSource);
  return new Uint8Array(hashBuffer);
}

/**
 * Encrypt data using AES-256-CBC with Web Crypto API (browser-compatible)
 * @param {Uint8Array} key - 256-bit (32-byte) encryption key
 * @param {Uint8Array} iv - 128-bit (16-byte) initialization vector
 * @param {Uint8Array} data - Data to encrypt
 * @returns {Promise<Uint8Array>} Encrypted data
 * @throws {Error} If Web Crypto API is not available or key/IV lengths are invalid
 */
async function webCryptoEncrypt(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error(
```