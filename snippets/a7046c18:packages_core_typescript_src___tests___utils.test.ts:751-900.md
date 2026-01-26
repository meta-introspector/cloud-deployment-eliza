# a7046c18:packages_core_typescript_src___tests___utils.test.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils.test.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        roomId: null;
      }
      const malformedMessage: MalformedMemory = {
        id: stringToUuid("msg-1"),
        entityId: stringToUuid("entity-1"),
        roomId: null,
        createdAt: Date.now(),
        content: {
          text: "Message without room",
          source: "chat",
        } as Content,
      };

      const messages: Memory[] = [malformedMessage as Memory];

      const result = formatPosts({ messages, entities: mockEntities });

      // Messages without roomId should be filtered out
      expect(result).toBe("");
    });
  });

  describe("validateUuid", () => {
    it("should validate correct UUID format", () => {
      const validUuid = "123e4567-e89b-12d3-a456-426614174000";
      const result = validateUuid(validUuid);
      expect(result).toBe(validUuid);
    });

    it("should return null for invalid UUID format", () => {
      expect(validateUuid("not-a-uuid")).toBeNull();
      expect(validateUuid("123")).toBeNull();
      expect(validateUuid("")).toBeNull();
      expect(validateUuid(null)).toBeNull();
      expect(validateUuid(undefined)).toBeNull();
      expect(validateUuid(123)).toBeNull();
      expect(validateUuid({})).toBeNull();
    });

    it("should handle UUID-like strings that are invalid", () => {
      // Wrong format variations
      expect(validateUuid("123e4567-e89b-12d3-a456")).toBeNull(); // Too short
      expect(
        validateUuid("123e4567-e89b-12d3-a456-426614174000-extra"),
      ).toBeNull(); // Too long
      expect(validateUuid("123e4567e89b12d3a456426614174000")).toBeNull(); // No dashes
      expect(validateUuid("XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX")).toBeNull(); // Invalid chars
    });
  });

  describe("stringToUuid", () => {
    it("should convert string to UUID", () => {
      const result = stringToUuid("test-string");
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      // Should be in UUID format
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should convert number to UUID", () => {
      const result = stringToUuid(12345);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should throw TypeError for non-string/non-number input", () => {
      // These are intentional type errors to test error handling
      // We use a helper type to safely test runtime error handling of invalid inputs
      type InvalidInput = null | undefined | object | unknown[] | boolean;
      const callWithInvalid = (val: InvalidInput) => {
        // Force runtime to handle invalid types that shouldn't occur in typed code
        return stringToUuid(val as string | number);
      };

      expect(() => callWithInvalid(null)).toThrow(TypeError);
      expect(() => callWithInvalid(undefined)).toThrow(TypeError);
      expect(() => callWithInvalid({})).toThrow(TypeError);
      expect(() => callWithInvalid([])).toThrow(TypeError);
      expect(() => callWithInvalid(true)).toThrow(TypeError);
    });

    it("should generate consistent UUID for same input", () => {
      const input = "consistent-input";
      const uuid1 = stringToUuid(input);
      const uuid2 = stringToUuid(input);
      expect(uuid1).toBe(uuid2);
    });

    it("should generate different UUIDs for different inputs", () => {
      const uuid1 = stringToUuid("input1");
      const uuid2 = stringToUuid("input2");
      expect(uuid1).not.toBe(uuid2);
    });

    it("should handle special characters in string input", () => {
      const specialChars = "test@#$%^&*()_+-=[]{}|;':\",./<>?";
      const result = stringToUuid(specialChars);
      expect(result).toBeDefined();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should handle empty string", () => {
      const result = stringToUuid("");
      expect(result).toBeDefined();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(1000);
      const result = stringToUuid(longString);
      expect(result).toBeDefined();
      expect(result).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
    });
  });

  describe("safeReplacer", () => {
    it("should handle circular references", () => {
      interface CircularObject {
        a: number;
        b: { c: number; parent?: CircularObject };
        circular?: CircularObject;
      }
      const obj: CircularObject = { a: 1, b: { c: 2 } };
      obj.circular = obj; // Create circular reference
      obj.b.parent = obj; // Another circular reference

      const replacer = safeReplacer();
      const result = JSON.stringify(obj, replacer);

      expect(result).toContain("[Circular]");
      expect(result).toContain('"a":1');
      expect(result).toContain('"c":2');

      // Should not throw error
      expect(() => JSON.stringify(obj, replacer)).not.toThrow();
    });

    it("should handle non-circular objects normally", () => {
      const obj = {
```