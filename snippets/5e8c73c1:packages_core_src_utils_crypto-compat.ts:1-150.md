# 5e8c73c1:packages_core_src_utils_crypto-compat.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/crypto-compat.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

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
    typeof require !== 'undefined' &&
    typeof process !== 'undefined' &&
    (process.versions?.node !== undefined || process.versions?.bun !== undefined)
  );
}

/**
 * Get the appropriate crypto module for the current environment
 * @returns Native crypto in Node.js/Bun, crypto-browserify in browser
 */
function getCryptoModule(): {
  createHash: (algorithm: string) => {
    update: (data: string | Uint8Array) => ReturnType<typeof getCryptoModule>['createHash'];
    digest: () => Buffer;
  };
  createCipheriv: (
    algorithm: string,
    key: Uint8Array,
    iv: Uint8Array
  ) => {
    update: (data: Buffer, inputEncoding?: string, outputEncoding?: string) => Buffer | string;
    final: (encoding?: string) => Buffer | string;
  };
  createDecipheriv: (
    algorithm: string,
    key: Uint8Array,
    iv: Uint8Array
  ) => {
    update: (data: Buffer, inputEncoding?: string, outputEncoding?: string) => Buffer | string;
    final: (encoding?: string) => Buffer | string;
  };
} {
  if (hasNodeCrypto()) {
    return require('crypto');
  }
  // Use crypto-browserify for synchronous APIs in browser
  return require('crypto-browserify');
}

/**
 * Hash data using Web Crypto API (browser-compatible)
 * @param {string} algorithm - Hash algorithm ('sha256', 'sha1', 'sha512')
 * @param {Uint8Array} data - Data to hash
 * @returns {Promise<Uint8Array>} Hash result
 * @throws {Error} If Web Crypto API is not available or algorithm is unsupported
 */
async function webCryptoHash(algorithm: string, data: Uint8Array): Promise<Uint8Array> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error(
      'Web Crypto API not available. This browser may not support cryptographic operations.'
    );
  }

  const algoMap: Record<string, string> = {
    sha256: 'SHA-256',
    sha1: 'SHA-1',
    sha512: 'SHA-512',
  };

  const webAlgo = algoMap[algorithm.toLowerCase()];
  if (!webAlgo) {
    throw new Error(
      `Unsupported algorithm: ${algorithm}. Supported algorithms: ${Object.keys(algoMap).join(', ')}`
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
  data: Uint8Array
): Promise<Uint8Array> {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error(
      'Web Crypto API not available. This browser may not support cryptographic operations.'
    );
  }

  if (key.length !== 32) {
    throw new Error(`Invalid key length: ${key.length} bytes. Expected 32 bytes for AES-256.`);
  }

  if (iv.length !== 16) {
    throw new Error(`Invalid IV length: ${iv.length} bytes. Expected 16 bytes for AES-CBC.`);
  }

  const cryptoKey = await subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'AES-CBC', length: 256 },
    false,
    ['encrypt']
  );

  const encrypted = await subtle.encrypt(
    { name: 'AES-CBC', iv: iv as BufferSource },
    cryptoKey,
    data as BufferSource
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
```