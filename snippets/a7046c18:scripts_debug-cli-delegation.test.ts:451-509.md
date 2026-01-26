# a7046c18:scripts_debug-cli-delegation.test.ts:451-509

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/debug-cli-delegation.test.ts:451-509
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        stdout: "pipe",
        stderr: "pipe",
      });

      await proc.exited;
      const stdout = await new Response(proc.stdout).text();

      expect(stdout).toContain("Clear these environment variables");
      expect(stdout).toContain("unset");
    });
  });

  describe("Quick Test", () => {
    it("should show quick test when delegation should work", async () => {
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

      expect(stdout).toContain("🧪 Quick Test");
      expect(stdout).toContain("elizaos --help");
      expect(stdout).toContain("Using local @elizaos/cli installation");
    });
  });

  describe("Error Handling", () => {
    it("should handle file stat errors gracefully", async () => {
      mockExistsSync.mockReturnValue(true);
      mockStatSync.mockImplementation(() => {
        throw new Error("File access denied");
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

      expect(stdout).toContain("Error reading file: File access denied");
    });
  });
});
```