# a7046c18:packages_core_typescript_src___tests___buffer.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/buffer.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  alloc,
  BufferUtils,
  byteLength,
  concat,
  equals,
  fromBytes,
  fromHex,
  fromString,
  isBuffer,
  randomBytes,
  slice,
  toHex,
  toString,
} from "../utils/buffer";

describe("Buffer Abstraction", () => {
  describe("fromHex and toHex", () => {
    it("should convert hex string to buffer and back", () => {
      const hex = "48656c6c6f20576f726c64";
      const buffer = fromHex(hex);
      const result = toHex(buffer);
      expect(result).toBe(hex.toLowerCase());
    });

    it("should handle empty hex string", () => {
      const buffer = fromHex("");
      expect(buffer.length).toBe(0);
      expect(toHex(buffer)).toBe("");
    });

    it("should handle hex with non-hex characters", () => {
      const hex = "48-65-6c-6c-6f";
      const buffer = fromHex(hex);
      const cleanHex = "48656c6c6f";
      expect(toHex(buffer)).toBe(cleanHex.toLowerCase());
    });

    it("should handle odd-length hex strings", () => {
      const hex = "486";
      const buffer = fromHex(hex);
      expect(buffer.length).toBe(1);
      expect(buffer[0]).toBe(0x48);
    });
  });

  describe("fromString and toString", () => {
    it("should convert UTF-8 string to buffer and back", () => {
      const text = "Hello World";
      const buffer = fromString(text);
      const result = toString(buffer);
      expect(result).toBe(text);
    });

    it("should handle UTF-8 with special characters", () => {
      const text = "Hello 世界 🌍";
      const buffer = fromString(text);
      const result = toString(buffer);
      expect(result).toBe(text);
    });

    it("should handle base64 encoding", () => {
      const text = "Hello World";
      const buffer = fromString(text);
      const base64 = toString(buffer, "base64");
      expect(base64).toBe("SGVsbG8gV29ybGQ=");

      const decoded = fromString(base64, "base64");
      expect(toString(decoded)).toBe(text);
    });

    it("should handle hex encoding in toString", () => {
      const text = "Hello";
      const buffer = fromString(text);
      const hex = toString(buffer, "hex");
      expect(hex).toBe("48656c6c6f");
    });

    it("should handle empty string", () => {
      const buffer = fromString("");
      expect(buffer.length).toBe(0);
      expect(toString(buffer)).toBe("");
    });

    it("should handle utf-8 and utf8 encoding aliases", () => {
      const text = "Test";
      const buffer1 = fromString(text, "utf8");
      const buffer2 = fromString(text, "utf-8");
      expect(equals(buffer1, buffer2)).toBe(true);
    });
  });

  describe("fromBytes", () => {
    it("should create buffer from byte array", () => {
      const bytes = [72, 101, 108, 108, 111]; // "Hello"
      const buffer = fromBytes(bytes);
      expect(toString(buffer)).toBe("Hello");
    });

    it("should create buffer from Uint8Array", () => {
      const bytes = new Uint8Array([72, 101, 108, 108, 111]);
      const buffer = fromBytes(bytes);
      expect(toString(buffer)).toBe("Hello");
    });

    it("should handle empty array", () => {
      const buffer = fromBytes([]);
      expect(buffer.length).toBe(0);
    });
  });

  describe("isBuffer", () => {
    it("should identify buffer-like objects", () => {
      const buffer = fromString("test");
      expect(isBuffer(buffer)).toBe(true);
    });

    it("should identify Uint8Array", () => {
      const arr = new Uint8Array([1, 2, 3]);
      expect(isBuffer(arr)).toBe(true);
    });

    it("should identify ArrayBuffer", () => {
      const buffer = new ArrayBuffer(8);
      expect(isBuffer(buffer)).toBe(true);
    });

    it("should reject non-buffer objects", () => {
      expect(isBuffer("string")).toBe(false);
      expect(isBuffer(123)).toBe(false);
      expect(isBuffer({})).toBe(false);
      expect(isBuffer([])).toBe(false);
      expect(isBuffer(null)).toBe(false);
      expect(isBuffer(undefined)).toBe(false);
    });
  });

  describe("alloc", () => {
    it("should create zero-filled buffer of specified size", () => {
      const buffer = alloc(10);
      expect(buffer.length).toBe(10);

      // Check all bytes are zero
      for (let i = 0; i < buffer.length; i++) {
        expect(buffer[i]).toBe(0);
      }
    });

    it("should create empty buffer for size 0", () => {
```