# a7046c18:packages_core_typescript_src___tests___type-guards.test.ts:1-133

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/type-guards.test.ts:1-133
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import { fromString } from "../utils/buffer";
import { isPlainObject } from "../utils/type-guards";

describe("Type Guards", () => {
  describe("isPlainObject", () => {
    // Should return true for plain objects
    it("should return true for empty object", () => {
      expect(isPlainObject({})).toBe(true);
    });

    it("should return true for object with properties", () => {
      expect(isPlainObject({ name: "test", value: 123 })).toBe(true);
    });

    it("should return true for nested objects", () => {
      expect(isPlainObject({ nested: { deep: { value: true } } })).toBe(true);
    });

    it("should return true for Object.create(null)", () => {
      expect(isPlainObject(Object.create(null))).toBe(true);
    });

    // Should return false for null and undefined
    it("should return false for null", () => {
      expect(isPlainObject(null)).toBe(false);
    });

    it("should return false for undefined", () => {
      expect(isPlainObject(undefined)).toBe(false);
    });

    // Should return false for primitives
    it("should return false for string", () => {
      expect(isPlainObject("hello")).toBe(false);
    });

    it("should return false for number", () => {
      expect(isPlainObject(42)).toBe(false);
    });

    it("should return false for boolean", () => {
      expect(isPlainObject(true)).toBe(false);
    });

    it("should return false for symbol", () => {
      expect(isPlainObject(Symbol("test"))).toBe(false);
    });

    it("should return false for bigint", () => {
      expect(isPlainObject(BigInt(123))).toBe(false);
    });

    // Should return false for arrays
    it("should return false for empty array", () => {
      expect(isPlainObject([])).toBe(false);
    });

    it("should return false for array with elements", () => {
      expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    // Should return false for built-in object types
    it("should return false for Date", () => {
      expect(isPlainObject(new Date())).toBe(false);
    });

    it("should return false for RegExp", () => {
      expect(isPlainObject(/test/)).toBe(false);
    });

    it("should return false for RegExp constructor", () => {
      expect(isPlainObject(/test/)).toBe(false);
    });

    it("should return false for Map", () => {
      expect(isPlainObject(new Map())).toBe(false);
    });

    it("should return false for Set", () => {
      expect(isPlainObject(new Set())).toBe(false);
    });

    it("should return false for WeakMap", () => {
      expect(isPlainObject(new WeakMap())).toBe(false);
    });

    it("should return false for WeakSet", () => {
      expect(isPlainObject(new WeakSet())).toBe(false);
    });

    it("should return false for Error", () => {
      expect(isPlainObject(new Error("test"))).toBe(false);
    });

    it("should return false for Promise", () => {
      expect(isPlainObject(Promise.resolve())).toBe(false);
    });

    // Should return false for Buffer/Uint8Array
    it("should return false for Buffer", () => {
      expect(isPlainObject(Buffer.from("test"))).toBe(false);
    });

    it("should return false for Uint8Array", () => {
      expect(isPlainObject(new Uint8Array([1, 2, 3]))).toBe(false);
    });

    it("should return false for BufferUtils buffer", () => {
      expect(isPlainObject(fromString("test"))).toBe(false);
    });

    // Should return false for functions
    it("should return false for function", () => {
      expect(isPlainObject(() => {})).toBe(false);
    });

    it("should return false for arrow function", () => {
      const fn = () => "test";
      expect(isPlainObject(fn)).toBe(false);
    });

    // Type narrowing verification
    it("should narrow type to Record<string, unknown>", () => {
      const data: unknown = { name: "test", count: 42 };
      if (isPlainObject(data)) {
        // TypeScript should allow accessing properties
        expect(data.name).toBe("test");
        expect(data.count).toBe(42);
      }
    });
  });
});
```