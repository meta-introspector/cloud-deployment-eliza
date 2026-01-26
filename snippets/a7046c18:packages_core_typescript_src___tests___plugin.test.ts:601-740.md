# a7046c18:packages_core_typescript_src___tests___plugin.test.ts:601-740

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/plugin.test.ts:601-740
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      process.env = { ...originalEnv } as Record<string, string | undefined>;
      process.env.NODE_ENV = "development";
      delete process.env.CI;
      delete process.env.ELIZA_TEST_MODE;
      delete process.env.ELIZA_NO_AUTO_INSTALL;
      delete process.env.ELIZA_NO_PLUGIN_AUTO_INSTALL;
    });

    afterEach(() => {
      (Bun as any).spawn = originalSpawn;
      process.env = { ...originalEnv } as Record<string, string | undefined>;
    });

    test("returns false when auto-install disallowed by ELIZA_NO_PLUGIN_AUTO_INSTALL", async () => {
      process.env.ELIZA_NO_PLUGIN_AUTO_INSTALL = "true";

      let called = 0;
      (Bun as any).spawn = ((_cmd: any[]) => {
        called += 1;
        return { exited: Promise.resolve(0) } as any;
      }) as any;

      const result = await tryInstallPlugin(
        "@elizaos/test-no-plugin-auto-install",
      );
      expect(result).toBe(false);
      expect(called).toBe(0);
    });

    test("returns false when auto-install disallowed by ELIZA_NO_AUTO_INSTALL", async () => {
      process.env.ELIZA_NO_AUTO_INSTALL = "true";

      let called = 0;
      (Bun as any).spawn = ((_cmd: any[]) => {
        called += 1;
        return { exited: Promise.resolve(0) } as any;
      }) as any;

      const result = await tryInstallPlugin("@elizaos/test-no-auto-install");
      expect(result).toBe(false);
      expect(called).toBe(0);
    });

    test("returns false when in CI environment", async () => {
      process.env.CI = "true";

      let called = 0;
      (Bun as any).spawn = ((_cmd: any[]) => {
        called += 1;
        return { exited: Promise.resolve(0) } as any;
      }) as any;

      const result = await tryInstallPlugin("@elizaos/test-ci-env");
      expect(result).toBe(false);
      expect(called).toBe(0);
    });

    test("returns false when in test mode", async () => {
      process.env.NODE_ENV = "test";

      let called = 0;
      (Bun as any).spawn = ((_cmd: any[]) => {
        called += 1;
        return { exited: Promise.resolve(0) } as any;
      }) as any;

      const result = await tryInstallPlugin("@elizaos/test-test-mode");
      expect(result).toBe(false);
      expect(called).toBe(0);
    });

    test("succeeds when bun present and bun add exits 0", async () => {
      const calls: any[] = [];

      (Bun as any).spawn = ((args: any[]) => {
        calls.push(args);
        // First call is bun --version, second is bun add <pkg>
        const isVersion = Array.isArray(args) && args[1] === "--version";
        const exitCode = isVersion ? 0 : 0;
        return { exited: Promise.resolve(exitCode) } as any;
      }) as any;

      const result = await tryInstallPlugin("@elizaos/test-success");
      expect(result).toBe(true);
      expect(calls.length).toBe(2);
      expect(calls[0]).toEqual(["bun", "--version"]);
      expect(calls[1]).toEqual(["bun", "add", "@elizaos/test-success"]);
    });

    test("fails when bun --version exits non-zero", async () => {
      let versionCalls = 0;
      (Bun as any).spawn = ((args: any[]) => {
        if (Array.isArray(args) && args[1] === "--version") {
          versionCalls += 1;
          return { exited: Promise.resolve(1) } as any;
        }
        // would be bun add; should not be called
        return { exited: Promise.resolve(0) } as any;
      }) as any;

      const result = await tryInstallPlugin("@elizaos/test-bun-version-fail");
      expect(result).toBe(false);
      expect(versionCalls).toBe(1);
    });

    test("fails when bun add exits non-zero", async () => {
      const calls: any[] = [];
      (Bun as any).spawn = ((args: any[]) => {
        calls.push(args);
        const isVersion = Array.isArray(args) && args[1] === "--version";
        return { exited: Promise.resolve(isVersion ? 0 : 1) } as any;
      }) as any;

      const result = await tryInstallPlugin("@elizaos/test-bun-add-fail");
      expect(result).toBe(false);
      expect(calls.length).toBe(2);
    });

    test("awaits process completion before returning", async () => {
      let versionResolved = false;
      let addResolved = false;
      (Bun as any).spawn = ((args: any[]) => {
        const isVersion = Array.isArray(args) && args[1] === "--version";
        return {
          exited: (async () => {
            await delay(isVersion ? 25 : 50);
            if (isVersion) versionResolved = true;
            else addResolved = true;
            return 0;
          })(),
        } as any;
      }) as any;

      const result = await tryInstallPlugin("@elizaos/plugin-unique-test");
      expect(result).toBe(true);
      expect(versionResolved).toBe(true);
      expect(addResolved).toBe(true);
    });
  });
});
```