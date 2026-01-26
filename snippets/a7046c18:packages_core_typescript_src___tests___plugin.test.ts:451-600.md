# a7046c18:packages_core_typescript_src___tests___plugin.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/plugin.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    test("should not create double-scoped names in lookup map", () => {
      // Plugin with scoped name - this should not create '@elizaos/plugin-@elizaos/plugin-discord'
      const pluginDiscord: Plugin = {
        name: "@elizaos/plugin-discord",
        description: "Discord plugin",
        actions: [],
        services: [],
      };

      const pluginBootstrap: Plugin = {
        name: "bootstrap",
        description: "Bootstrap plugin",
        dependencies: ["discord"], // Short name reference
        actions: [],
        services: [],
      };

      const pluginMap = new Map<string, Plugin>();
      pluginMap.set("@elizaos/plugin-discord", pluginDiscord);
      pluginMap.set("bootstrap", pluginBootstrap);

      const resolved = resolvePluginDependencies(pluginMap);

      // Should resolve correctly without creating double-scoped names
      expect(resolved).toHaveLength(2);
      const indexDiscord = resolved.findIndex(
        (p) => p.name === "@elizaos/plugin-discord",
      );
      const indexBootstrap = resolved.findIndex((p) => p.name === "bootstrap");
      // Discord should come before bootstrap due to dependency
      expect(indexDiscord).toBeLessThan(indexBootstrap);

      // Verify the plugin is found correctly
      expect(resolved.some((p) => p.name === "@elizaos/plugin-discord")).toBe(
        true,
      );
    });

    test("should handle complex dependency chains with scoped names", () => {
      const pluginA: Plugin = {
        name: "sql",
        description: "SQL plugin",
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "bootstrap",
        description: "Bootstrap plugin",
        dependencies: ["@elizaos/plugin-sql"],
        actions: [],
        services: [],
      };

      const pluginC: Plugin = {
        name: "discord",
        description: "Discord plugin",
        dependencies: ["bootstrap"],
        actions: [],
        services: [],
      };

      const pluginD: Plugin = {
        name: "music-player",
        description: "Music player plugin",
        dependencies: ["@elizaos/plugin-discord", "@elizaos/plugin-bootstrap"],
        actions: [],
        services: [],
      };

      const pluginMap = new Map<string, Plugin>();
      pluginMap.set("sql", pluginA);
      pluginMap.set("bootstrap", pluginB);
      pluginMap.set("discord", pluginC);
      pluginMap.set("music-player", pluginD);

      const resolved = resolvePluginDependencies(pluginMap);

      expect(resolved).toHaveLength(4);
      const indexSql = resolved.findIndex((p) => p.name === "sql");
      const indexBootstrap = resolved.findIndex((p) => p.name === "bootstrap");
      const indexDiscord = resolved.findIndex((p) => p.name === "discord");
      const indexMusicPlayer = resolved.findIndex(
        (p) => p.name === "music-player",
      );

      // Verify dependency order
      expect(indexSql).toBeLessThan(indexBootstrap);
      expect(indexBootstrap).toBeLessThan(indexDiscord);
      expect(indexDiscord).toBeLessThan(indexMusicPlayer);
    });
  });

  describe("resolvePlugins with scoped dependencies", () => {
    test("should resolve plugins with scoped dependencies", async () => {
      const pluginA: Plugin = {
        name: "sql",
        description: "SQL plugin",
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "test-plugin",
        description: "Test plugin",
        dependencies: ["@elizaos/plugin-sql"],
        actions: [],
        services: [],
      };

      const resolved = await resolvePlugins([pluginB, pluginA]);

      expect(resolved).toHaveLength(2);
      const indexA = resolved.findIndex((p) => p.name === "sql");
      const indexB = resolved.findIndex((p) => p.name === "test-plugin");
      expect(indexA).toBeLessThan(indexB);
    });

    test("should handle test dependencies with scoped names", async () => {
      const pluginA: Plugin = {
        name: "sql",
        description: "SQL plugin",
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "test-plugin",
        description: "Test plugin",
        testDependencies: ["@elizaos/plugin-sql"],
        actions: [],
        services: [],
      };

      const resolved = await resolvePlugins([pluginB, pluginA], true);

      expect(resolved).toHaveLength(2);
      const indexA = resolved.findIndex((p) => p.name === "sql");
      const indexB = resolved.findIndex((p) => p.name === "test-plugin");
      expect(indexA).toBeLessThan(indexB);
    });
  });

  describe("tryInstallPlugin (auto-install)", () => {
    const originalSpawn = (Bun as any).spawn;
    const originalEnv = { ...process.env } as Record<string, string>;

    beforeEach(() => {
      // Reset environment to allow auto-install
```