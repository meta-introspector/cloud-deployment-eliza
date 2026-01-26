# a7046c18:packages_core_typescript_src___tests___buffer.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/buffer.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const buffer = alloc(0);
      expect(buffer.length).toBe(0);
    });
  });

  describe("concat", () => {
    it("should concatenate multiple buffers", () => {
      const buf1 = fromString("Hello");
      const buf2 = fromString(" ");
      const buf3 = fromString("World");
      const result = concat([buf1, buf2, buf3]);
      expect(toString(result)).toBe("Hello World");
    });

    it("should handle single buffer", () => {
      const buffer = fromString("Hello");
      const result = concat([buffer]);
      expect(toString(result)).toBe("Hello");
    });

    it("should handle empty array", () => {
      const result = concat([]);
      expect(result.length).toBe(0);
    });

    it("should handle mix of buffer types", () => {
      const buf1 = fromString("A");
      const buf2 = new Uint8Array([66]); // 'B'
      const result = concat([buf1, buf2]);
      expect(toString(result)).toBe("AB");
    });
  });

  describe("slice", () => {
    it("should slice buffer from start to end", () => {
      const buffer = fromString("Hello World");
      const sliced = slice(buffer, 0, 5);
      expect(toString(sliced)).toBe("Hello");
    });

    it("should slice from start if no end provided", () => {
      const buffer = fromString("Hello World");
      const sliced = slice(buffer, 6);
      expect(toString(sliced)).toBe("World");
    });

    it("should handle negative indices", () => {
      const buffer = fromString("Hello World");
      const sliced = slice(buffer, -5);
      expect(toString(sliced)).toBe("World");
    });

    it("should return empty buffer for invalid range", () => {
      const buffer = fromString("Hello");
      const sliced = slice(buffer, 10, 15);
      expect(sliced.length).toBe(0);
    });
  });

  describe("equals", () => {
    it("should return true for equal buffers", () => {
      const buf1 = fromString("Hello");
      const buf2 = fromString("Hello");
      expect(equals(buf1, buf2)).toBe(true);
    });

    it("should return false for different buffers", () => {
      const buf1 = fromString("Hello");
      const buf2 = fromString("World");
      expect(equals(buf1, buf2)).toBe(false);
    });

    it("should return false for different lengths", () => {
      const buf1 = fromString("Hi");
      const buf2 = fromString("Hello");
      expect(equals(buf1, buf2)).toBe(false);
    });

    it("should handle empty buffers", () => {
      const buf1 = alloc(0);
      const buf2 = alloc(0);
      expect(equals(buf1, buf2)).toBe(true);
    });
  });

  describe("byteLength", () => {
    it("should return correct byte length", () => {
      const buffer = fromString("Hello");
      expect(byteLength(buffer)).toBe(5);
    });

    it("should handle UTF-8 multi-byte characters", () => {
      const buffer = fromString("世界");
      expect(byteLength(buffer)).toBe(6); // Each character is 3 bytes
    });

    it("should return 0 for empty buffer", () => {
      const buffer = alloc(0);
      expect(byteLength(buffer)).toBe(0);
    });
  });

  describe("randomBytes", () => {
    it("should generate random bytes of specified length", () => {
      const buffer = randomBytes(16);
      expect(buffer.length).toBe(16);
    });

    it("should generate different values on each call", () => {
      const buf1 = randomBytes(16);
      const buf2 = randomBytes(16);

      // It's extremely unlikely these will be equal
      expect(equals(buf1, buf2)).toBe(false);
    });

    it("should handle zero length", () => {
      const buffer = randomBytes(0);
      expect(buffer.length).toBe(0);
    });

    it("should generate bytes in valid range", () => {
      const buffer = randomBytes(100);
      for (let i = 0; i < buffer.length; i++) {
        expect(buffer[i]).toBeGreaterThanOrEqual(0);
        expect(buffer[i]).toBeLessThanOrEqual(255);
      }
    });
  });

  describe("BufferUtils namespace", () => {
    it("should expose all functions through namespace", () => {
      expect(BufferUtils.fromHex).toBe(fromHex);
      expect(BufferUtils.fromString).toBe(fromString);
      expect(BufferUtils.fromBytes).toBe(fromBytes);
      expect(BufferUtils.toHex).toBe(toHex);
      expect(BufferUtils.toString).toBe(toString);
      expect(BufferUtils.isBuffer).toBe(isBuffer);
      expect(BufferUtils.alloc).toBe(alloc);
      expect(BufferUtils.concat).toBe(concat);
      expect(BufferUtils.slice).toBe(slice);
      expect(BufferUtils.equals).toBe(equals);
      expect(BufferUtils.byteLength).toBe(byteLength);
      expect(BufferUtils.randomBytes).toBe(randomBytes);
    });
  });

  describe("Cross-environment compatibility", () => {
    let originalBuffer: typeof Buffer | undefined;
    let originalCrypto: typeof globalThis.crypto | undefined;
```