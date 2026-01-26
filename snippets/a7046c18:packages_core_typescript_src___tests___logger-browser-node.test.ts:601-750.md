# a7046c18:packages_core_typescript_src___tests___logger-browser-node.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger-browser-node.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      // Create circular references
      obj1.self = obj1; // Self reference
      obj2.ref = obj3; // Cross reference
      obj3.ref = obj2; // Cross reference back
      obj1.others = [obj2, obj3]; // Array with circular refs

      // Should handle all without throwing
      expect(() =>
        browserLogger.info("Multiple circulars:", obj1, obj2, obj3),
      ).not.toThrow();
    });

    it("should handle deeply nested circular references with arrays", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      const deepObj: any = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  items: [],
                },
              },
            },
          },
        },
      };

      // Create complex circular structure
      deepObj.level1.level2.level3.level4.level5.items.push(deepObj);
      deepObj.level1.level2.level3.level4.level5.backToLevel2 =
        deepObj.level1.level2;
      deepObj.level1.array = [deepObj, deepObj.level1, deepObj.level1.level2];

      expect(() => browserLogger.info("Deep circular:", deepObj)).not.toThrow();
    });

    it("should handle circular references in error objects with nested arguments", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      const error: any = new Error("Test error");
      const context: any = { errorRef: error, data: {} };
      const metadata: any = { context, timestamp: Date.now() };

      // Create circular references
      error.context = context;
      context.data.metadata = metadata;
      metadata.error = error;

      // Multiple arguments with circular references
      expect(() =>
        browserLogger.error("Complex error:", error, context, metadata),
      ).not.toThrow();
    });

    it("should handle circular references with symbols and special properties", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      const sym = Symbol("test");
      const obj: any = {
        [sym]: "symbol value",
        normalProp: "normal",
        nested: {},
      };

      // Add various types of circular references
      obj.nested.parent = obj;
      obj[Symbol.for("circular")] = obj;
      Object.defineProperty(obj, "hiddenCircular", {
        value: obj,
        enumerable: false,
      });

      expect(() => browserLogger.info("Symbol circular:", obj)).not.toThrow();
    });

    it("should handle circular references in mixed argument types", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      const arr: any[] = [1, 2, 3];
      const obj: any = { arr, name: "test" };
      const map = new Map();
      const set = new Set();

      // Create complex circular structure
      arr.push(obj);
      obj.self = obj;
      map.set("obj", obj);
      map.set("arr", arr);
      set.add(obj);
      set.add(arr);
      obj.map = map;
      obj.set = set;

      // Test with multiple mixed-type arguments
      expect(() =>
        browserLogger.info("Mixed types:", obj, arr, "string", 123, map, set),
      ).not.toThrow();
    });

    it("should handle circular references in function properties", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      const obj: any = {
        name: "function container",
        callback: () => obj,
      };

      // Add circular reference through function
      obj.callback.parent = obj;
      obj.methods = {
        get: () => obj,
        set: (value: any) => {
          obj.value = value;
          return obj;
        },
      };
      obj.methods.container = obj;

      expect(() => browserLogger.info("Function circular:", obj)).not.toThrow();
    });

    it("should handle circular references with prototype chain manipulation", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      class CustomClass {
        constructor(public name: string) {}
      }

      const instance: any = new CustomClass("test");
      const proto: any = Object.getPrototypeOf(instance);

      // Create circular through prototype
      instance.proto = proto;
      proto.instance = instance;
      instance.self = instance;

      expect(() =>
        browserLogger.info("Prototype circular:", instance),
      ).not.toThrow();
    });

    it("should handle maximum recursion depth with circular references", () => {
      const browserLogger = createLogger({ __forceType: "browser" });

      // Create a chain of objects with circular reference at the end
      let current: any = { level: 0 };
      const root = current;
```