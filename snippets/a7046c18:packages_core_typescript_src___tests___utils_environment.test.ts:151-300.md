# a7046c18:packages_core_typescript_src___tests___utils_environment.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/utils/environment.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  });

  describe("getBooleanEnv", () => {
    it("should parse true values correctly", () => {
      const trueValues = ["true", "1", "yes", "on"];

      trueValues.forEach((value) => {
        process.env.BOOL_TEST = value;
        expect(getBooleanEnv("BOOL_TEST")).toBe(true);
      });

      delete process.env.BOOL_TEST;
    });

    it("should parse false values correctly", () => {
      const falseValues = ["false", "0", "no", "off", "anything", ""];

      falseValues.forEach((value) => {
        process.env.BOOL_TEST = value;
        expect(getBooleanEnv("BOOL_TEST")).toBe(false);
      });

      delete process.env.BOOL_TEST;
    });

    it("should return default value when not set", () => {
      expect(getBooleanEnv("NOT_SET", true)).toBe(true);
      expect(getBooleanEnv("NOT_SET", false)).toBe(false);
    });
  });

  describe("getNumberEnv", () => {
    it("should parse valid numbers", () => {
      process.env.NUM_TEST = "42";
      getEnvironment().clearCache(); // Clear cache after setting env var
      expect(getNumberEnv("NUM_TEST")).toBe(42);

      process.env.NUM_TEST = "3.14";
      getEnvironment().clearCache(); // Clear cache after setting env var
      expect(getNumberEnv("NUM_TEST")).toBe(3.14);

      process.env.NUM_TEST = "-100";
      getEnvironment().clearCache(); // Clear cache after setting env var
      expect(getNumberEnv("NUM_TEST")).toBe(-100);

      delete process.env.NUM_TEST;
    });

    it("should return undefined for invalid numbers", () => {
      process.env.NUM_TEST = "not a number";
      expect(getNumberEnv("NUM_TEST")).toBeUndefined();
      delete process.env.NUM_TEST;
    });

    it("should return default value when not set or invalid", () => {
      expect(getNumberEnv("NOT_SET", 100)).toBe(100);

      process.env.INVALID_NUM = "abc";
      expect(getNumberEnv("INVALID_NUM", 200)).toBe(200);
      delete process.env.INVALID_NUM;
    });
  });

  describe("Browser Environment", () => {
    it.skip("should initialize browser environment with config", () => {
      // Mock browser environment
      delete (global as typeof globalThis & { process?: typeof process })
        .process;
      (global as typeof globalThis & { window?: typeof window }).window = {
        document: {},
      } as typeof window;

      const {
        Environment,
        initBrowserEnvironment: init,
      } = require("../environment");
      const env = new Environment();

      // Initialize with config
      init({
        API_KEY: "test-key",
        DEBUG: true,
        MAX_RETRIES: 3,
      });

      // Check values were set
      expect(env.get("API_KEY")).toBe("test-key");
      expect(env.get("DEBUG")).toBe("true");
      expect(env.get("MAX_RETRIES")).toBe("3");
    });

    it.skip("should read from window.ENV in browser", () => {
      // Mock browser with window.ENV
      delete (global as typeof globalThis & { process?: typeof process })
        .process;
      (global as typeof globalThis & { window?: typeof window }).window = {
        document: {},
        ENV: {
          PRESET_VAR: "preset_value",
        },
      };

      const { Environment } = require("../environment");
      const env = new Environment();

      expect(env.get("PRESET_VAR")).toBe("preset_value");
    });

    it.skip("should read from globalThis.__ENV__ in browser", () => {
      // Mock browser with globalThis.__ENV__
      delete (global as typeof globalThis & { process?: typeof process })
        .process;
      (global as typeof globalThis & { window?: typeof window }).window = {
        document: {},
      } as typeof window;
      // Cannot reassign globalThis, skip this test

      const { Environment } = require("../environment");
      const env = new Environment();

      expect(env.get("GLOBAL_VAR")).toBe("global_value");
    });
  });

  describe("getEnvironment singleton", () => {
    it("should return the same instance", () => {
      const env1 = getEnvironment();
      const env2 = getEnvironment();
      expect(env1).toBe(env2);
    });
  });

  describe("getAll", () => {
    it("should return all environment variables", () => {
      process.env.TEST1 = "value1";
      process.env.TEST2 = "value2";

      const allVars = getEnvironment().getAll();
      expect(allVars.TEST1).toBe("value1");
      expect(allVars.TEST2).toBe("value2");

      delete process.env.TEST1;
      delete process.env.TEST2;
    });
  });

  describe("Environment Config Functions (.env file loading)", () => {
    let originalEnvSnapshot: NodeJS.ProcessEnv;

    beforeEach(() => {
```