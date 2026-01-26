# 5e8c73c1:packages_core_src_utils_crypto-compat.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/crypto-compat.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
    ['decrypt']
  );

  const decrypted = await subtle.decrypt(
    { name: 'AES-CBC', iv: iv as BufferSource },
    cryptoKey,
    data as BufferSource
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
  data: string | Uint8Array
): Promise<Uint8Array> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;

  if (hasNodeCrypto()) {
    // Use Node.js native crypto for better performance
    const crypto = getCryptoModule();
    const hash = crypto.createHash(algorithm);
    hash.update(bytes);
    return new Uint8Array(hash.digest());
  }

  // Use Web Crypto API in browser for async operations
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
  iv: Uint8Array
): {
  update(data: string, inputEncoding: string, outputEncoding: string): string;
  final(encoding: string): string;
} {
  if (algorithm !== 'aes-256-cbc') {
    throw new Error(
      `Unsupported algorithm: ${algorithm}. Only 'aes-256-cbc' is currently supported.`
    );
  }

  // Use crypto-browserify in browser, native crypto in Node.js
  const crypto = getCryptoModule();
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return {
    update(data: string, inputEncoding: string, outputEncoding: string): string {
      const result = cipher.update(
        Buffer.from(data, inputEncoding as BufferEncoding),
        undefined,
        outputEncoding as BufferEncoding
      );
      return typeof result === 'string'
```