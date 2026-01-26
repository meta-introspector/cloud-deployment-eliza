# a7046c18:scripts_debug-cli-delegation.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/debug-cli-delegation.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      expect(stdout).toContain("No package.json found");
    });

    it("should handle package.json read errors", async () => {
      mockExistsSync.mockReturnValue(true);
      mockReadFileSync.mockImplementation((filePath: string) => {
        if (filePath.includes("package.json")) {
          throw new Error("Permission denied");
        }
        return "{}";
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

      expect(stdout).toContain("Error reading package.json: Permission denied");
    });
  });

  describe("Help Display", () => {
    it("should display help with --help flag", async () => {
      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts", "--help"], {
        cwd: "/home/runner/work/eliza/eliza",
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("elizaOS CLI Delegation Debug Tool");
      expect(stdout).toContain("Usage:");
      expect(stdout).toContain("--fix");
      expect(stdout).toContain("--help");
    });

    it("should display help with -h flag", async () => {
      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts", "-h"], {
        cwd: "/home/runner/work/eliza/eliza",
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("elizaOS CLI Delegation Debug Tool");
      expect(stdout).toContain("Usage:");
    });
  });

  describe("Auto-fix Mode", () => {
    it("should attempt to install CLI when --fix is used", async () => {
      mockExistsSync.mockReturnValue(false); // No local CLI exists

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts", "--fix"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("Auto-Fix Mode");
      expect(stdout).toContain("Installing @elizaos/cli locally");
    });
  });

  describe("Delegation Analysis", () => {
    it("should report successful delegation when conditions are met", async () => {
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockReturnValue({
        size: 1024,
        mtime: new Date("2024-01-01"),
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

      expect(stdout).toContain("Delegation Analysis");
      // Should succeed when local CLI exists and no problematic env vars/args
      expect(stdout).toContain("Delegation should SUCCEED");
    });

    it("should report delegation failure when no local CLI", async () => {
      mockExistsSync.mockReturnValue(false);

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("Delegation would FAIL: No local CLI found");
    });
  });

  describe("Recommendations", () => {
    it("should recommend bun install when no local CLI", async () => {
      mockExistsSync.mockReturnValue(false);

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: undefined },
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("💡 Recommendations");
      expect(stdout).toContain("bun install @elizaos/cli");
    });

    it("should recommend clearing env vars when problematic ones detected", async () => {
      mockExistsSync.mockReturnValue(true);

      const { spawn } = await import("bun");
      const proc = spawn(["bun", "scripts/debug-cli-delegation.ts"], {
        cwd: "/home/runner/work/eliza/eliza",
        env: { ...process.env, NODE_ENV: "test" },
```