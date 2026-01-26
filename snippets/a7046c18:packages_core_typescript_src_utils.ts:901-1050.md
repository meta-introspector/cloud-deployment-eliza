# a7046c18:packages_core_typescript_src_utils.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  await Promise.all(promises);
}

// Cache for SHA-1 digests to enable synchronous WebCrypto usage
const sha1Cache = new Map<string, Uint8Array>();
let webCryptoAvailable: boolean | null = null;

/**
 * Check if WebCrypto is available for SHA-1
 */
function checkWebCrypto(): boolean {
  if (webCryptoAvailable !== null) return webCryptoAvailable;

  // Check for crypto.subtle (WebCrypto API)
  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    globalThis.crypto.subtle &&
    typeof globalThis.crypto.subtle.digest === "function"
  ) {
    webCryptoAvailable = true;
    return true;
  }

  webCryptoAvailable = false;
  return false;
}

/**
 * Get SHA-1 digest using cache for synchronous operation
 * Uses WebCrypto when available (via background pre-computation), falls back to pure JS
 */
function getCachedSha1(message: string): Uint8Array {
  // Check cache first
  const cached = sha1Cache.get(message);
  if (cached) return cached;

  // Use synchronous pure JS implementation for immediate result
  const digest = sha1Bytes(message);
  sha1Cache.set(message, digest);

  // Asynchronously compute with WebCrypto for next time (if available)
  if (checkWebCrypto()) {
    sha1BytesAsync(message)
      .then((webDigest) => {
        // Update cache with WebCrypto result (should be identical)
        sha1Cache.set(message, webDigest);
      })
      .catch(() => {
        // Ignore errors, we already have the pure JS result
      });
  }

  // Limit cache size to prevent memory leaks
  if (sha1Cache.size > 10000) {
    // Remove oldest entries (first ones in iteration order)
    const keysToDelete = Array.from(sha1Cache.keys()).slice(0, 5000);
    keysToDelete.forEach((key) => sha1Cache.delete(key));
  }

  return digest;
}

/**
 * Async SHA-1 using WebCrypto when available
 * This can be used to pre-warm the cache
 */
async function sha1BytesAsync(message: string): Promise<Uint8Array> {
  if (checkWebCrypto()) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-1", data);
    return new Uint8Array(hashBuffer);
  }

  // Fallback to pure JS implementation
  return sha1Bytes(message);
}

/**
 * Minimal SHA-1 implementation returning raw bytes.
 * Source adapted from public-domain references for portability (browser/Node).
 * Used as fallback when WebCrypto is not available.
 */
function sha1Bytes(message: string): Uint8Array {
  const bytes = utf8Encode(message);
  const ml = bytes.length;

  // Pre-processing (padding)
  const withOne = new Uint8Array(((ml + 9 + 63) >>> 6) << 6); // multiple of 64
  withOne.set(bytes);
  withOne[ml] = 0x80;
  const bitLen = ml * 8;
  // Append length as 64-bit big-endian
  const dv = new DataView(withOne.buffer);
  dv.setUint32(withOne.length - 4, bitLen >>> 0, false);
  dv.setUint32(withOne.length - 8, Math.floor(bitLen / 2 ** 32) >>> 0, false);

  // Initialize hash values
  let h0 = 0x67452301;
  let h1 = 0xefcdab89;
  let h2 = 0x98badcfe;
  let h3 = 0x10325476;
  let h4 = 0xc3d2e1f0;

  const w = new Uint32Array(80);

  for (let i = 0; i < withOne.length; i += 64) {
    // Break chunk into sixteen 32-bit big-endian words
    for (let j = 0; j < 16; j++) {
      w[j] = dv.getUint32(i + j * 4, false);
    }
    // Extend to 80 words
    for (let j = 16; j < 80; j++) {
      const t = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
      w[j] = (t << 1) | (t >>> 31);
    }

    // Initialize working vars
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j < 80; j++) {
      let f: number;
      let k: number;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = 0x5a827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ed9eba1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8f1bbcdc;
      } else {
        f = b ^ c ^ d;
        k = 0xca62c1d6;
      }
      const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[j]) >>> 0;
      e = d;
      d = c;
      c = ((b << 30) | (b >>> 2)) >>> 0;
      b = a;
      a = temp;
    }

    h0 = (h0 + a) >>> 0;
```