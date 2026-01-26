# a7046c18:packages_core_typescript_src_utils_crypto-compat.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/crypto-compat.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  return webCryptoHash(algorithm, bytes);
}

/**
 * Create a cipher for encryption (cross-platform - synchronous)
 *
 * This function works in both Node.js and browser environments. In browsers, it uses
 * crypto-browserify to provide synchronous encryption compatible with Node.js crypto API.
 *
 * @param {string} algorithm - Cipher algorithm (currently only 'aes-256-cbc' is supported)
 * @param {Uint8Array} key - 256-bit (32-byte) encryption key
 * @param {Uint8Array} iv - 128-bit (16-byte) initialization vector
 * @returns {object} Cipher object with update() and final() methods
 * @throws {Error} If algorithm is unsupported
 *
 * @example
 * ```typescript
 * const cipher = createCipheriv('aes-256-cbc', key, iv);
 * let encrypted = cipher.update('data', 'utf8', 'hex');
 * encrypted += cipher.final('hex');
 * ```
 */
export function createCipheriv(
  algorithm: string,
  key: Uint8Array,
  iv: Uint8Array,
): {
  update(data: string, inputEncoding: string, outputEncoding: string): string;
  final(encoding: string): string;
} {
  if (algorithm !== "aes-256-cbc") {
    throw new Error(
      `Unsupported algorithm: ${algorithm}. Only 'aes-256-cbc' is currently supported.`,
    );
  }

  // Use crypto-browserify in browser, native crypto in Node.js
  const crypto = getCryptoModule();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return {
    update(
      data: string,
      inputEncoding: string,
      outputEncoding: string,
    ): string {
      const result = cipher.update(
        Buffer.from(data, inputEncoding as BufferEncoding),
        undefined,
        outputEncoding as BufferEncoding,
      );
      return typeof result === "string"
        ? result
        : result.toString(outputEncoding as BufferEncoding);
    },
    final(encoding: string): string {
      const result = cipher.final(encoding as BufferEncoding);
      return typeof result === "string"
        ? result
        : result.toString(encoding as BufferEncoding);
    },
  };
}

/**
 * Create a decipher for decryption (cross-platform - synchronous)
 *
 * This function works in both Node.js and browser environments. In browsers, it uses
 * crypto-browserify to provide synchronous decryption compatible with Node.js crypto API.
 *
 * @param {string} algorithm - Cipher algorithm (currently only 'aes-256-cbc' is supported)
 * @param {Uint8Array} key - 256-bit (32-byte) decryption key
 * @param {Uint8Array} iv - 128-bit (16-byte) initialization vector
 * @returns {object} Decipher object with update() and final() methods
 * @throws {Error} If algorithm is unsupported
 *
 * @example
 * ```typescript
 * const decipher = createDecipheriv('aes-256-cbc', key, iv);
 * let decrypted = decipher.update(encrypted, 'hex', 'utf8');
 * decrypted += decipher.final('utf8');
 * ```
 */
export function createDecipheriv(
  algorithm: string,
  key: Uint8Array,
  iv: Uint8Array,
): {
  update(data: string, inputEncoding: string, outputEncoding: string): string;
  final(encoding: string): string;
} {
  if (algorithm !== "aes-256-cbc") {
    throw new Error(
      `Unsupported algorithm: ${algorithm}. Only 'aes-256-cbc' is currently supported.`,
    );
  }

  // Use crypto-browserify in browser, native crypto in Node.js
  const crypto = getCryptoModule();
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return {
    update(
      data: string,
      inputEncoding: string,
      outputEncoding: string,
    ): string {
      const result = decipher.update(
        Buffer.from(data, inputEncoding as BufferEncoding),
        undefined,
        outputEncoding as BufferEncoding,
      );
      return typeof result === "string"
        ? result
        : result.toString(outputEncoding as BufferEncoding);
    },
    final(encoding: string): string {
      const result = decipher.final(encoding as BufferEncoding);
      return typeof result === "string"
        ? result
        : result.toString(encoding as BufferEncoding);
    },
  };
}

/**
 * Encrypt data asynchronously (works in both Node.js and browser)
 *
 * This is the recommended method for cross-platform code as it works in both
 * Node.js and browser environments using AES-256-CBC.
 *
 * @param {Uint8Array} key - 256-bit (32-byte) encryption key
 * @param {Uint8Array} iv - 128-bit (16-byte) initialization vector
 * @param {Uint8Array} data - Data to encrypt
 * @returns {Promise<Uint8Array>} Encrypted data
 * @throws {Error} If key/IV lengths are invalid or Web Crypto API is unavailable
 *
 * @example
 * ```typescript
 * // Works in both Node.js and browser
 * const encrypted = await encryptAsync(key, iv, data);
 * ```
 */
export async function encryptAsync(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array,
): Promise<Uint8Array> {
  if (key.length !== 32) {
    throw new Error(
      `Invalid key length: ${key.length} bytes. Expected 32 bytes for AES-256.`,
    );
```