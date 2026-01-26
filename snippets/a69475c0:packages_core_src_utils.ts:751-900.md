# a69475c0:packages_core_src_utils.ts:751-900

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils.ts:751-900
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```

  const affirmative = ['YES', 'Y', 'TRUE', 'T', '1', 'ON', 'ENABLE'];
  const negative = ['NO', 'N', 'FALSE', 'F', '0', 'OFF', 'DISABLE'];

  const normalizedText = value.trim().toUpperCase();

  if (affirmative.includes(normalizedText)) {
    return true;
  }
  if (negative.includes(normalizedText)) {
    return false;
  }

  // For environment variables, we'll treat unrecognized values as false
  return false;
}

// UUID Utils

const uuidSchema = z
  .string()
  .regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    'Invalid UUID format'
  ) as z.ZodType<UUID>;

/**
 * Validates a UUID value.
 *
 * @param {unknown} value - The value to validate.
 * @returns {UUID | null} Returns the validated UUID value or null if validation fails.
 */
export function validateUuid(value: unknown): UUID | null {
  const result = uuidSchema.safeParse(value);
  return result.success ? result.data : null;
}

/**
 * Converts a string or number to a UUID.
 *
 * @param {string | number} target - The string or number to convert to a UUID.
 * @returns {UUID} The UUID generated from the input target.
 * @throws {TypeError} Throws an error if the input target is not a string.
 */
export function stringToUuid(target: string | number): UUID {
  if (typeof target === 'number') {
    target = (target as number).toString();
  }

  if (typeof target !== 'string') {
    throw TypeError('Value must be string');
  }

  // If already a UUID, return as-is to avoid re-hashing
  const maybeUuid = validateUuid(target);
  if (maybeUuid) return maybeUuid;

  const escapedStr = encodeURIComponent(target);

  // Deterministic UUID derived from SHA-1(escapedStr)
  // Use WebCrypto if available (sync via cache), otherwise pure JS
  const digest = getCachedSha1(escapedStr); // 20 bytes
  const bytes = digest.slice(0, 16);

  // Set RFC4122 variant bits: 10xxxxxx
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  // Set custom version nibble to 0x0 to indicate legacy/custom (matches prior tests expecting '0')
  bytes[6] = (bytes[6] & 0x0f) | 0x00;

  return bytesToUuid(bytes) as UUID;
}

/**
 * Pre-warm the SHA-1 cache with common values using WebCrypto
 * Call this during initialization to improve performance
 */
export async function prewarmUuidCache(values: string[]): Promise<void> {
  if (!checkWebCrypto()) return;

  const promises = values.map(async (value) => {
    const escapedStr = encodeURIComponent(value);
    const digest = await sha1BytesAsync(escapedStr);
    sha1Cache.set(escapedStr, digest);
  });

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
    typeof globalThis !== 'undefined' &&
    globalThis.crypto &&
    globalThis.crypto.subtle &&
    typeof globalThis.crypto.subtle.digest === 'function'
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
```