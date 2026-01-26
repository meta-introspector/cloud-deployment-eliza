# 5e8c73c1:packages_core_src_utils_crypto-compat.ts:451-491

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/crypto-compat.ts:451-491
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

  if (hasNodeCrypto()) {
    // Use Node.js native crypto for better performance
    const crypto = getCryptoModule();
    const dataBuffer = Buffer.from(data);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const updateResult = decipher.update(dataBuffer);
    const finalResult = decipher.final();
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