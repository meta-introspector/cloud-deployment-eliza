# a7046c18:packages_core_typescript_src___tests___utils_crypto-compat.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/crypto-compat.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Tests for crypto-compat utilities
 * Verifies cross-platform cryptographic operations work correctly
 */

import { describe, expect, it } from "bun:test";
import { BufferUtils } from "../../utils/buffer";
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHashAsync,
  decryptAsync,
  encryptAsync,
  webCrypto,
} from "../../utils/crypto-compat";

describe("crypto-compat", () => {
  describe("createHashAsync (cross-platform)", () => {
    it("should hash string data with SHA-256", async () => {
      const data = "hello world";
      const hash = await createHashAsync("sha256", data);

      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32); // SHA-256 produces 32 bytes

      // Verify against known hash
      const expected = new Uint8Array([
        0xb9, 0x4d, 0x27, 0xb9, 0x93, 0x4d, 0x3e, 0x08, 0xa5, 0x2e, 0x52, 0xd7,
        0xda, 0x7d, 0xab, 0xfa, 0xc4, 0x84, 0xef, 0xe3, 0x7a, 0x53, 0x80, 0xee,
        0x90, 0x88, 0xf7, 0xac, 0xe2, 0xef, 0xcd, 0xe9,
      ]);
      expect(hash).toEqual(expected);
    });

    it("should hash Uint8Array data with SHA-256", async () => {
      const data = new TextEncoder().encode("hello world");
      const hash = await createHashAsync("sha256", data);

      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(32);
    });

    it("should support SHA-1", async () => {
      const data = "test";
      const hash = await createHashAsync("sha1", data);

      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(20); // SHA-1 produces 20 bytes
    });

    it("should support SHA-512", async () => {
      const data = "test";
      const hash = await createHashAsync("sha512", data);

      expect(hash).toBeInstanceOf(Uint8Array);
      expect(hash.length).toBe(64); // SHA-512 produces 64 bytes
    });

    it("should throw on unsupported algorithm", async () => {
      // Test with invalid algorithm - function accepts string but will throw at runtime
      await expect(
        createHashAsync("invalid-hash-algo" as string, "data"),
      ).rejects.toThrow(); // Node.js and browser throw different messages, just verify it throws
    });

    it("should produce consistent results", async () => {
      const data = "consistent test data";
      const hash1 = await createHashAsync("sha256", data);
      const hash2 = await createHashAsync("sha256", data);

      expect(hash1).toEqual(hash2);
    });
  });

  describe("createHash (Node.js synchronous)", () => {
    it("should hash data incrementally", () => {
      const hash = createHash("sha256")
        .update("hello")
        .update(" ")
        .update("world");

      const result = hash.digest();

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(32);

      // Should match single-call hash
      const expected = new Uint8Array([
        0xb9, 0x4d, 0x27, 0xb9, 0x93, 0x4d, 0x3e, 0x08, 0xa5, 0x2e, 0x52, 0xd7,
        0xda, 0x7d, 0xab, 0xfa, 0xc4, 0x84, 0xef, 0xe3, 0x7a, 0x53, 0x80, 0xee,
        0x90, 0x88, 0xf7, 0xac, 0xe2, 0xef, 0xcd, 0xe9,
      ]);
      expect(result).toEqual(expected);
    });

    it("should support Uint8Array updates", () => {
      const data = new TextEncoder().encode("test data");
      const hash = createHash("sha256").update(data);
      const result = hash.digest();

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBe(32);
    });

    it("should allow method chaining", () => {
      const result = createHash("sha256")
        .update("part1")
        .update("part2")
        .update("part3")
        .digest();

      expect(result).toBeInstanceOf(Uint8Array);
    });
  });

  describe("encryptAsync / decryptAsync (cross-platform)", () => {
    const createTestKey = async (): Promise<Uint8Array> => {
      // Create a deterministic 32-byte key from hash
      return await createHashAsync("sha256", "test-key-seed");
    };

    const createTestIV = (): Uint8Array => {
      // Create a 16-byte IV
      const iv = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        iv[i] = i;
      }
      return iv;
    };

    it("should encrypt and decrypt data successfully", async () => {
      const key = await createTestKey();
      const iv = createTestIV();
      const plaintext = new TextEncoder().encode("Secret message");

      const encrypted = await encryptAsync(key, iv, plaintext);
      expect(encrypted).toBeInstanceOf(Uint8Array);
      expect(encrypted.length).toBeGreaterThan(0);
      expect(encrypted).not.toEqual(plaintext);

      const decrypted = await decryptAsync(key, iv, encrypted);
      expect(decrypted).toEqual(plaintext);

      const decryptedText = new TextDecoder().decode(decrypted);
      expect(decryptedText).toBe("Secret message");
    });

    it("should handle empty data", async () => {
      const key = await createTestKey();
```