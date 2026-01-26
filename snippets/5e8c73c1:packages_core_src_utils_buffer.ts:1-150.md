# 5e8c73c1:packages_core_src_utils_buffer.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/utils/buffer.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Browser and Node.js compatible buffer abstraction
 * This module provides a unified interface for buffer operations
 * that works in both browser and Node.js environments.
 *
 * In browsers, we use Uint8Array as a Buffer replacement.
 * In Node.js, we use the native Buffer.
 */

/**
 * Type representing a buffer-like object that works in both environments
 */
export type BufferLike = Buffer | Uint8Array;

/**
 * Interface for objects that look like ArrayBuffer views (TypedArrays)
 */
interface ArrayBufferViewLike {
  buffer?: unknown;
  byteLength?: unknown;
}

/**
 * Check if we're in a Node.js environment with Buffer support
 */
function hasNativeBuffer(): boolean {
  return typeof Buffer !== 'undefined' && typeof Buffer.from === 'function';
}

/**
 * Convert a hex string to a buffer-like object
 * @param hex - The hexadecimal string to convert
 * @returns A BufferLike object
 */
export function fromHex(hex: string): BufferLike {
  // Clean the hex string to remove non-hex characters
  const cleanHex = hex.replace(/[^0-9a-fA-F]/g, '');

  if (hasNativeBuffer()) {
    // Use native Buffer in Node.js
    return Buffer.from(cleanHex, 'hex');
  }

  // Browser implementation using Uint8Array
  const bytes = new Uint8Array(cleanHex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }

  return bytes;
}

/**
 * Convert a string to a buffer-like object
 * @param str - The string to convert
 * @param encoding - The encoding to use (default: 'utf8')
 * @returns A BufferLike object
 */
export function fromString(
  str: string,
  encoding: 'utf8' | 'utf-8' | 'base64' = 'utf8'
): BufferLike {
  if (hasNativeBuffer()) {
    // Use native Buffer in Node.js
    const enc = encoding === 'utf-8' ? 'utf8' : encoding;
    return Buffer.from(str, enc as BufferEncoding);
  }

  // Browser implementation
  if (encoding === 'base64') {
    // Decode base64 string
    const binaryString = atob(str);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  // UTF-8 encoding using TextEncoder (standard browser API)
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Convert a buffer-like object to a hexadecimal string
 * @param buffer - The buffer to convert
 * @returns A hexadecimal string
 */
export function toHex(buffer: BufferLike): string {
  if (hasNativeBuffer() && Buffer.isBuffer(buffer)) {
    // Use native Buffer method in Node.js
    return buffer.toString('hex');
  }

  // Browser implementation
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i].toString(16);
    hex += byte.length === 1 ? '0' + byte : byte;
  }
  return hex;
}

/**
 * Convert a buffer-like object to a string
 * @param buffer - The buffer to convert
 * @param encoding - The encoding to use (default: 'utf8')
 * @returns A string
 */
export function toString(
  buffer: BufferLike,
  encoding: 'utf8' | 'utf-8' | 'base64' | 'hex' = 'utf8'
): string {
  if (hasNativeBuffer() && Buffer.isBuffer(buffer)) {
    // Use native Buffer method in Node.js
    const enc = encoding === 'utf-8' ? 'utf8' : encoding;
    return buffer.toString(enc as BufferEncoding);
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  // Handle different encodings
  if (encoding === 'hex') {
    return toHex(bytes);
  }

  if (encoding === 'base64') {
    // Convert to base64
    let binaryString = '';
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
  }

  // UTF-8 decoding using TextDecoder (standard browser API)
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

/**
 * Check if an object is a Buffer or buffer-like object
 * @param obj - The object to check
 * @returns True if the object is buffer-like
 */
export function isBuffer(obj: unknown): obj is BufferLike {
  if (!obj) {
```