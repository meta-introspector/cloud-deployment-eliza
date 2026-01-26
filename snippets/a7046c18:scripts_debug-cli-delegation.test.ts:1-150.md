# a7046c18:scripts_debug-cli-delegation.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/debug-cli-delegation.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
  mock,
} from "bun:test";

// Mock the bun-exec utilities
const mockBunExecInherit = mock();
const mockBunExec = mock();

// Mock fs functions
const mockExistsSync = mock();
const mockStatSync = mock();
const mockReadFileSync = mock();

// Mock modules
mock.module("../packages/cli/src/utils/bun-exec", () => ({
  bunExecInherit: mockBunExecInherit,
  bunExec: mockBunExec,
}));

mock.module("fs", () => ({
  existsSync: mockExistsSync,
  statSync: mockStatSync,
  readFileSync: mockReadFileSync,
}));

// Import the debug script module functions (we'll need to refactor the script to export functions)
// Since the current script is a standalone executable, we'll test it by running it as a subprocess
// For now, let's create a more testable version by extracting the key functions

describe("CLI Delegation Debug Tool", () => {
  let originalEnv: NodeJS.ProcessEnv;
  let originalArgv: string[];
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;
  let logOutput: string[];
  let errorOutput: string[];

  beforeEach(() => {
    // Save original state
    originalEnv = { ...process.env };
    originalArgv = [...process.argv];
    originalConsoleLog = console.log;
    originalConsoleError = console.error;

    // Create mock console functions to capture output
    logOutput = [];
    errorOutput = [];
    console.log = mock((...args: any[]) => {
      logOutput.push(args.join(" "));
    });
    console.error = mock((...args: any[]) => {
      errorOutput.push(args.join(" "));
    });

    // Reset mocks
    mockBunExecInherit.mockReset();
    mockBunExec.mockReset();
    mockExistsSync.mockReset();
    mockStatSync.mockReset();
    mockReadFileSync.mockReset();

    // Mock process.cwd
    jest.spyOn(process, "cwd").mockReturnValue("/test/project");

    // Clear environment variables
    delete process.env.NODE_ENV;
    delete process.env.ELIZA_TEST_MODE;
    delete process.env.BUN_TEST;
    delete process.env.VITEST;
    delete process.env.JEST_WORKER_ID;
    delete process.env.npm_lifecycle_event;
    delete process.env.CI;
    delete process.env.GITHUB_ACTIONS;
  });

  afterEach(() => {
    // Restore original state
    process.env = originalEnv;
    process.argv = originalArgv;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;

    // Restore mocks
    jest.restoreAllMocks();
  });

  describe("Local CLI Detection", () => {
    it("should detect when local CLI exists", async () => {
      // Set up mocks
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({
        size: 1024,
        mtime: new Date("2024-01-01"),
      });
      process.argv = ["bun", "debug-cli-delegation.ts"];

      // Import and run the debug script
      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("Local CLI exists: ✅");
      expect(stdout).toContain("node_modules/@elizaos/cli/dist/index.js");
    });

    it("should detect when local CLI does not exist", async () => {
      mockExistsSync.mockReturnValue(false);
      process.argv = ["bun", "debug-cli-delegation.ts"];

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("Local CLI exists: ❌");
    });
  });

  describe("Environment Variable Detection", () => {
    it("should detect problematic NODE_ENV=test", async () => {
      mockExistsSync.mockReturnValue(true);
      process.argv = ["bun", "debug-cli-delegation.ts"];

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: "test" },
        stdout: "pipe",
        stderr: "pipe",
      });

```