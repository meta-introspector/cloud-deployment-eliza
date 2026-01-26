# 5e8c73c1:packages_core_src___tests___utils.test.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/utils.test.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should convert number to UUID', () => {
      const result = stringToUuid(12345);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should throw TypeError for non-string/non-number input', () => {
      // These are intentional type errors to test error handling
      expect(() => stringToUuid(null as unknown as string | number)).toThrow(TypeError);
      expect(() => stringToUuid(undefined as unknown as string | number)).toThrow(TypeError);
      expect(() => stringToUuid({} as string | number)).toThrow(TypeError);
      expect(() => stringToUuid([] as unknown as string | number)).toThrow(TypeError);
      expect(() => stringToUuid(true as unknown as string | number)).toThrow(TypeError);
    });

    it('should generate consistent UUID for same input', () => {
      const input = 'consistent-input';
      const uuid1 = stringToUuid(input);
      const uuid2 = stringToUuid(input);
      expect(uuid1).toBe(uuid2);
    });

    it('should generate different UUIDs for different inputs', () => {
      const uuid1 = stringToUuid('input1');
      const uuid2 = stringToUuid('input2');
      expect(uuid1).not.toBe(uuid2);
    });

    it('should handle special characters in string input', () => {
      const specialChars = 'test@#$%^&*()_+-=[]{}|;\':",./<>?';
      const result = stringToUuid(specialChars);
      expect(result).toBeDefined();
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should handle empty string', () => {
      const result = stringToUuid('');
      expect(result).toBeDefined();
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });

    it('should handle very long strings', () => {
      const longString = 'a'.repeat(1000);
      const result = stringToUuid(longString);
      expect(result).toBeDefined();
      expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  describe('safeReplacer', () => {
    it('should handle circular references', () => {
      const obj: any = { a: 1, b: { c: 2 } };
      obj.circular = obj; // Create circular reference
      obj.b.parent = obj; // Another circular reference

      const replacer = safeReplacer();
      const result = JSON.stringify(obj, replacer);

      expect(result).toContain('[Circular]');
      expect(result).toContain('"a":1');
      expect(result).toContain('"c":2');

      // Should not throw error
      expect(() => JSON.stringify(obj, replacer)).not.toThrow();
    });

    it('should handle non-circular objects normally', () => {
      const obj = {
        a: 1,
        b: { c: 2 },
        d: [1, 2, 3],
        e: null,
        f: 'string',
      };

      const replacer = safeReplacer();
      const result = JSON.stringify(obj, replacer);

      expect(result).toBe(JSON.stringify(obj)); // Should be identical
      expect(result).not.toContain('[Circular]');
    });

    it('should handle nested circular references', () => {
      const obj: any = {
        level1: {
          level2: {
            level3: {},
          },
        },
      };
      obj.level1.level2.level3.back = obj.level1; // Circular reference

      const replacer = safeReplacer();
      const result = JSON.stringify(obj, replacer);

      expect(result).toContain('[Circular]');
      expect(() => JSON.stringify(obj, replacer)).not.toThrow();
    });

    it('should handle arrays with circular references', () => {
      const arr: any[] = [1, 2, 3];
      const obj = { arr, value: 'test' };
      arr.push(obj); // Circular reference through array

      const replacer = safeReplacer();
      const result = JSON.stringify({ data: arr }, replacer);

      expect(result).toContain('[Circular]');
      expect(result).toContain('1');
      expect(result).toContain('2');
      expect(result).toContain('3');
    });
  });

  describe('composePrompt', () => {
    it('should compose prompt with state values', () => {
      const state = {
        name: 'Alice',
        role: 'developer',
        task: 'write tests',
      };
      const template = 'Hello {{name}}, as a {{role}}, please {{task}}.';

      const result = composePrompt({ state, template });

      expect(result).toBe('Hello Alice, as a developer, please write tests.');
    });

    it('should handle missing state values', () => {
      const state = {
        name: 'Bob',
      };
      const template = 'Hello {{name}}, your role is {{role}}.';

      const result = composePrompt({ state, template });

      // Handlebars replaces missing values with empty string
      expect(result).toBe('Hello Bob, your role is .');
    });

    it('should handle empty state', () => {
      const state = {};
      const template = 'Template with {{placeholder}}.';

      const result = composePrompt({ state, template });

```