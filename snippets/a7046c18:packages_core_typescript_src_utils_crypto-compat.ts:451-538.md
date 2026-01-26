# a7046c18:packages_core_typescript_src_utils_crypto-compat.ts:451-538

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils/crypto-compat.ts:451-538
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }

  if (iv.length !== 16) {
    throw new Error(
      `Invalid IV length: ${iv.length} bytes. Expected 16 bytes for AES-CBC.`,
    );
  }

  if (hasNodeCrypto()) {
    // Use Node.js native crypto for better performance
    const crypto = getCryptoModule();
    const dataBuffer = Buffer.from(data);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const updateBuf = cipherResultToBuffer(cipher.update(dataBuffer));
    const finalBuf = cipherResultToBuffer(cipher.final());
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
  data: Uint8Array,
): Promise<Uint8Array> {
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

  if (hasNodeCrypto()) {
    // Use Node.js native crypto for better performance
    const crypto = getCryptoModule();
    const dataBuffer = Buffer.from(data);
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    const updateBuf = cipherResultToBuffer(decipher.update(dataBuffer));
    const finalBuf = cipherResultToBuffer(decipher.final());
    const decrypted = Buffer.concat([updateBuf, finalBuf]);
    return new Uint8Array(decrypted);
  }

  // Use Web Crypto API in browser for async operations
  return webCryptoDecrypt(key, iv, data);
}

/**
 * Legacy Web Crypto API export for backward compatibility
 *
 * **Deprecated:** Use the top-level async functions instead:
 * - `createHashAsync()` instead of `webCrypto.hash()`
 * - `encryptAsync()` instead of `webCrypto.encrypt()`
 * - `decryptAsync()` instead of `webCrypto.decrypt()`
 *
 * @deprecated Use top-level async functions for better cross-platform support
 */
export const webCrypto = {
  hash: webCryptoHash,
  encrypt: webCryptoEncrypt,
  decrypt: webCryptoDecrypt,
};
```