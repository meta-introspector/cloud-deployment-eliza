# a7046c18:scripts_debug-cli-delegation.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/debug-cli-delegation.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("NODE_ENV: test");
      expect(stdout).toContain("Test/CI environment detected");
    });

    it("should detect problematic ELIZA_TEST_MODE", async () => {
      mockExistsSync.mockReturnValue(true);
      process.argv = ["bun", "debug-cli-delegation.ts"];

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, ELIZA_TEST_MODE: "true" },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("ELIZA_TEST_MODE: true");
      expect(stdout).toContain("Test/CI environment detected");
    });

    it("should detect CI environment", async () => {
      mockExistsSync.mockReturnValue(true);
      process.argv = ["bun", "debug-cli-delegation.ts"];

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, CI: "true" },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("CI: true");
      expect(stdout).toContain("Test/CI environment detected");
    });
  });

  describe("Process Arguments Detection", () => {
    it("should detect test command", async () => {
      mockExistsSync.mockReturnValue(true);

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts", "test"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain('["test"]');
      expect(stdout).toContain("Problematic arguments");
    });

    it("should detect --test flag", async () => {
      mockExistsSync.mockReturnValue(true);

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts", "--test"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain('["--test"]');
      expect(stdout).toContain("Problematic arguments");
    });

    it("should detect version commands", async () => {
      mockExistsSync.mockReturnValue(true);

      const { spawn } = await import("bun");
      const proc = spawn(
        ["bun", "scripts/debug-cli-delegation.ts", "--version"],
        {
          cwd: "/home/runner/work/eliza/eliza",
          env: { ...process.env, NODE_ENV: undefined },
          stdout: "pipe",
          stderr: "pipe",
        },
      );

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain('["--version"]');
      expect(stdout).toContain("Problematic arguments");
    });
  });

  describe("Package.json Analysis", () => {
    it("should analyze package.json correctly", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockReturnValue(
        JSON.stringify({
          name: "@test/project",
          type: "module",
          dependencies: {
            "@elizaos/core": "^1.0.0",
          },
        }),
      );

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("Package name: @test/project");
      expect(stdout).toContain("Package type: module");
      expect(stdout).toContain("Has elizaos dependency: ✅");
    });

    it("should handle missing package.json", async () => {
      mockExistsSync.mockImplementation((filePath: string) => {
        if (filePath.includes("package.json")) return false;
        return true; // For CLI path
      });

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();
```