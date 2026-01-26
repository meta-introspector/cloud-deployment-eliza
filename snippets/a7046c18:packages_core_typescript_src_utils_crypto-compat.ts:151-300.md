# a7046c18:packages_core_typescript_src_utils_crypto-compat.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/crypto-compat.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      "Web Crypto API not available. This browser may not support cryptographic operations.",
    );
  }

  if (key.length !== 32) {
    throw new Error(
      `Invalid key length: ${key.length} bytes. Expected 32 bytes for AES-256.`,
    );
  }

  if (iv.length !== 16) {
    throw new Error(
      `Invalid IV length: ${iv.length} bytes. Expected 16 bytes for AES-CBC.`,
    );
  }

  const cryptoKey = await subtle.importKey(
    "raw",
    key as BufferSource,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"],
  );

  const encrypted = await subtle.encrypt(
    { name: "AES-CBC", iv: iv as BufferSource },
    cryptoKey,
    data as BufferSource,
  );

  return new Uint8Array(encrypted);
}

/**
 * Decrypt data using AES-256-CBC with Web Crypto API (browser-compatible)
 * @param {Uint8Array} key - 256-bit (32-byte) decryption key
 * @param {Uint8Array} iv - 128-bit (16-byte) initialization vector
 * @param {Uint8Array} data - Data to decrypt
 * @returns {Promise<Uint8Array>} Decrypted data
 * @throws {Error} If Web Crypto API is not available or key/IV lengths are invalid
 */
async function webCryptoDecrypt(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error(
      "Web Crypto API not available. This browser may not support cryptographic operations.",
    );
  }

  if (key.length !== 32) {
    throw new Error(
      `Invalid key length: ${key.length} bytes. Expected 32 bytes for AES-256.`,
    );
  }

  if (iv.length !== 16) {
    throw new Error(
      `Invalid IV length: ${iv.length} bytes. Expected 16 bytes for AES-CBC.`,
    );
  }

  const cryptoKey = await subtle.importKey(
    "raw",
    key as BufferSource,
    { name: "AES-CBC", length: 256 },
    false,
    ["decrypt"],
  );

  const decrypted = await subtle.decrypt(
    { name: "AES-CBC", iv: iv as BufferSource },
    cryptoKey,
    data as BufferSource,
  );

  return new Uint8Array(decrypted);
}

/**
 * Create a hash object for incremental hashing (cross-platform - synchronous)
 *
 * This function works in both Node.js and browser environments. In browsers, it uses
 * crypto-browserify to provide synchronous hashing compatible with Node.js crypto API.
 *
 * @param {string} algorithm - Hash algorithm ('sha256', 'sha1', 'sha512')
 * @returns {object} Hash object with update() and digest() methods
 *
 * @example
 * ```typescript
 * const hash = createHash('sha256')
 *   .update('hello')
 *   .update('world')
 *   .digest();
 * ```
 */
export function createHash(algorithm: string): {
  update(data: string | Uint8Array): ReturnType<typeof createHash>;
  digest(): Uint8Array;
} {
  // Use crypto-browserify in browser, native crypto in Node.js
  const crypto = getCryptoModule();
  const hash = crypto.createHash(algorithm);
  return {
    update(data: string | Uint8Array) {
      hash.update(data);
      return this;
    },
    digest() {
      return new Uint8Array(hash.digest());
    },
  };
}

/**
 * Create a hash asynchronously (works in both Node.js and browser)
 *
 * This is the recommended method for cross-platform code as it works in both
 * Node.js and browser environments.
 *
 * @param {string} algorithm - Hash algorithm ('sha256', 'sha1', 'sha512')
 * @param {string | Uint8Array} data - Data to hash
 * @returns {Promise<Uint8Array>} Hash result
 * @throws {Error} If algorithm is unsupported or Web Crypto API is unavailable
 *
 * @example
 * ```typescript
 * // Works in both Node.js and browser
 * const hash = await createHashAsync('sha256', 'hello world');
 * ```
 */
export async function createHashAsync(
  algorithm: string,
  data: string | Uint8Array,
): Promise<Uint8Array> {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;

  if (hasNodeCrypto()) {
    // Use Node.js native crypto for better performance
    const crypto = getCryptoModule();
    const hash = crypto.createHash(algorithm);
    hash.update(bytes);
    return new Uint8Array(hash.digest());
  }

  // Use Web Crypto API in browser for async operations
```