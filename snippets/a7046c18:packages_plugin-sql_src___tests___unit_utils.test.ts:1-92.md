# a7046c18:packages_plugin-sql_src___tests___unit_utils.test.ts:1-92

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/utils.test.ts:1-92
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import * as path from "node:path";
import { expandTildePath, resolveEnvFile, resolvePgliteDir } from "../../utils";

// Mock dotenv to prevent loading actual .env file
// In bun:test, module mocking is handled differently, but this test doesn't need it

describe("Utils", () => {
  describe("expandTildePath", () => {
    it("should expand paths starting with ~", () => {
      const result = expandTildePath("~/test/path");
      expect(result).toBe(path.join(process.cwd(), "test/path"));
    });

    it("should return unchanged paths not starting with ~", () => {
      const result = expandTildePath("/absolute/path");
      expect(result).toBe("/absolute/path");
    });

    it("should handle empty strings", () => {
      const result = expandTildePath("");
      expect(result).toBe("");
    });

    it("should handle just tilde", () => {
      const result = expandTildePath("~");
      expect(result).toBe(process.cwd());
    });
  });

  describe("resolveEnvFile", () => {
    it("should find .env in current directory if it exists", () => {
      // This test will work with actual file system
      const result = resolveEnvFile();
      expect(result).toMatch(/\.env$/);
    });

    it("should return .env path even if not found", () => {
      const testDir = "/some/nonexistent/path";
      const result = resolveEnvFile(testDir);
      expect(result).toBe(path.join(testDir, ".env"));
    });
  });

  describe("resolvePgliteDir", () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
      originalEnv = process.env.PGLITE_DATA_DIR;
      delete process.env.PGLITE_DATA_DIR;
      // No need to clear all mocks in bun:test
    });

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env.PGLITE_DATA_DIR;
      } else {
        process.env.PGLITE_DATA_DIR = originalEnv;
      }
    });

    it("should prioritize dir argument", () => {
      const result = resolvePgliteDir("/custom/dir");
      expect(result).toBe("/custom/dir");
    });

    it("should use PGLITE_DATA_DIR env var if no dir provided", () => {
      process.env.PGLITE_DATA_DIR = "/env/pglite/dir";
      const result = resolvePgliteDir();
      expect(result).toBe("/env/pglite/dir");
    });

    it("should use default .eliza/.elizadb dir if no dir or env var", () => {
      delete process.env.PGLITE_DATA_DIR;
      const result = resolvePgliteDir();
      const projectRoot = path.resolve(process.cwd(), "..", "..");
      expect(result).toBe(path.join(projectRoot, ".eliza", ".elizadb"));
    });

    it("should use default path if no arguments or env var", () => {
      delete process.env.PGLITE_DATA_DIR;
      const result = resolvePgliteDir();
      const projectRoot = path.resolve(process.cwd(), "..", "..");
      expect(result).toBe(path.join(projectRoot, ".eliza", ".elizadb"));
    });

    it("should expand tilde paths", () => {
      const result = resolvePgliteDir("~/data/pglite");
      expect(result).toBe(path.join(process.cwd(), "data/pglite"));
    });
  });
});
```