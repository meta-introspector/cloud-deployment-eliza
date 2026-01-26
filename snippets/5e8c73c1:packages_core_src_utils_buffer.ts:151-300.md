# 5e8c73c1:packages_core_src_utils_buffer.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/buffer.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    return false;
  }

  if (hasNativeBuffer() && Buffer.isBuffer(obj)) {
    return true;
  }

  // Check for Uint8Array or similar typed arrays
  if (obj instanceof Uint8Array || obj instanceof ArrayBuffer) {
    return true;
  }
  if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
    const typedObj = obj as ArrayBufferViewLike;
    return typedObj.buffer instanceof ArrayBuffer && typeof typedObj.byteLength === 'number';
  }
  return false;
}

/**
 * Create a buffer of a specific size filled with zeros
 * @param size - The size of the buffer
 * @returns A BufferLike object
 */
export function alloc(size: number): BufferLike {
  if (hasNativeBuffer()) {
    return Buffer.alloc(size);
  }

  return new Uint8Array(size);
}

/**
 * Create a buffer from an array of bytes
 * @param bytes - Array of byte values
 * @returns A BufferLike object
 */
export function fromBytes(bytes: number[] | Uint8Array): BufferLike {
  if (hasNativeBuffer()) {
    return Buffer.from(bytes);
  }

  return new Uint8Array(bytes);
}

/**
 * Concatenate multiple buffers
 * @param buffers - Array of buffers to concatenate
 * @returns A new BufferLike object
 */
export function concat(buffers: BufferLike[]): BufferLike {
  if (hasNativeBuffer() && buffers.every((b) => Buffer.isBuffer(b))) {
    return Buffer.concat(buffers as Buffer[]);
  }

  // Calculate total length
  let totalLength = 0;
  for (const buffer of buffers) {
    totalLength += buffer.length;
  }

  // Create result buffer
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const buffer of buffers) {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    result.set(bytes, offset);
    offset += bytes.length;
  }

  return result;
}

/**
 * Slice a buffer to create a new buffer
 * @param buffer - The buffer to slice
 * @param start - Start index
 * @param end - End index (optional)
 * @returns A new BufferLike object
 */
export function slice(buffer: BufferLike, start: number, end?: number): BufferLike {
  if (hasNativeBuffer() && Buffer.isBuffer(buffer)) {
    return buffer.slice(start, end);
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return bytes.slice(start, end);
}

/**
 * Compare two buffers for equality
 * @param a - First buffer
 * @param b - Second buffer
 * @returns True if buffers are equal
 */
export function equals(a: BufferLike, b: BufferLike): boolean {
  if (a.length !== b.length) {
    return false;
  }

  const bytesA = a instanceof Uint8Array ? a : new Uint8Array(a);
  const bytesB = b instanceof Uint8Array ? b : new Uint8Array(b);

  for (let i = 0; i < bytesA.length; i++) {
    if (bytesA[i] !== bytesB[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Get the byte length of a buffer
 * @param buffer - The buffer
 * @returns The byte length
 */
export function byteLength(buffer: BufferLike): number {
  return buffer.length;
}

/**
 * Create a random buffer of specified size
 * @param size - The size of the buffer
 * @returns A BufferLike object filled with random bytes
 */
export function randomBytes(size: number): BufferLike {
  // Prefer Web Crypto API across environments (Node >=18 exposes global crypto)
  const bytes = new Uint8Array(size);

  interface GlobalWithCrypto {
    crypto?: Crypto;
    webcrypto?: Crypto;
  }

  const cryptoGlobal =
    typeof globalThis !== 'undefined'
      ? (globalThis as GlobalWithCrypto).crypto || (globalThis as GlobalWithCrypto).webcrypto
      : undefined;

  if (cryptoGlobal && typeof cryptoGlobal.getRandomValues === 'function') {
    cryptoGlobal.getRandomValues(bytes);
  } else {
    // Fallback: less secure random generation
    for (let i = 0; i < size; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  return bytes;
```