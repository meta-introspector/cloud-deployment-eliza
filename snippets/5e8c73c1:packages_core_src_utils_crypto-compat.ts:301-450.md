# 5e8c73c1:packages_core_src_utils_crypto-compat.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/crypto-compat.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        ? result
        : result.toString(outputEncoding as BufferEncoding);
    },
    final(encoding: string): string {
      const result = cipher.final(encoding as BufferEncoding);
      return typeof result === 'string' ? result : result.toString(encoding as BufferEncoding);
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
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return {
    update(data: string, inputEncoding: string, outputEncoding: string): string {
      const result = decipher.update(
        Buffer.from(data, inputEncoding as BufferEncoding),
        undefined,
        outputEncoding as BufferEncoding
      );
      return typeof result === 'string'
        ? result
        : result.toString(outputEncoding as BufferEncoding);
    },
    final(encoding: string): string {
      const result = decipher.final(encoding as BufferEncoding);
      return typeof result === 'string' ? result : result.toString(encoding as BufferEncoding);
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
  data: Uint8Array
): Promise<Uint8Array> {
  if (key.length !== 32) {
    throw new Error(`Invalid key length: ${key.length} bytes. Expected 32 bytes for AES-256.`);
  }

  if (iv.length !== 16) {
    throw new Error(`Invalid IV length: ${iv.length} bytes. Expected 16 bytes for AES-CBC.`);
  }

  if (hasNodeCrypto()) {
    // Use Node.js native crypto for better performance
    const crypto = getCryptoModule();
    const dataBuffer = Buffer.from(data);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const updateResult = cipher.update(dataBuffer);
    const finalResult = cipher.final();
    const updateBuf = Buffer.isBuffer(updateResult)
      ? updateResult
      : typeof updateResult === 'string'
        ? Buffer.from(updateResult, 'utf8')
        : Buffer.from(updateResult as unknown as number[] | Uint8Array);
    const finalBuf = Buffer.isBuffer(finalResult)
      ? finalResult
      : typeof finalResult === 'string'
        ? Buffer.from(finalResult, 'utf8')
        : Buffer.from(finalResult as unknown as number[] | Uint8Array);
    const encrypted = Buffer.concat([updateBuf, finalBuf]);
    return new Uint8Array(encrypted);
  }

  // Use Web Crypto API in browser for async operations
  return webCryptoEncrypt(key, iv, data);
}

/**
 * Decrypt data asynchronously (works in both Node.js and browser)
 *
 * This is the recommended method for cross-platform code as it works in both
 * Node.js and browser environments using AES-256-CBC.
 *
 * @param {Uint8Array} key - 256-bit (32-byte) decryption key
 * @param {Uint8Array} iv - 128-bit (16-byte) initialization vector
 * @param {Uint8Array} data - Data to decrypt
 * @returns {Promise<Uint8Array>} Decrypted data
 * @throws {Error} If key/IV lengths are invalid or Web Crypto API is unavailable
 *
 * @example
 * ```typescript
 * // Works in both Node.js and browser
 * const decrypted = await decryptAsync(key, iv, encryptedData);
 * ```
 */
export async function decryptAsync(
  key: Uint8Array,
  iv: Uint8Array,
  data: Uint8Array
): Promise<Uint8Array> {
  if (key.length !== 32) {
    throw new Error(`Invalid key length: ${key.length} bytes. Expected 32 bytes for AES-256.`);
  }

  if (iv.length !== 16) {
    throw new Error(`Invalid IV length: ${iv.length} bytes. Expected 16 bytes for AES-CBC.`);
  }
```