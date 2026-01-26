# a7046c18:packages_core_typescript_src___tests___plugin.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/plugin.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        (p) => p.name === "@elizaos/plugin-discord",
      ).length;
      expect(discordCount).toBe(1);
    });
  });

  describe("normalizePluginName", () => {
    test("should extract short name from @elizaos scoped packages", () => {
      expect(normalizePluginName("@elizaos/plugin-discord")).toBe("discord");
      expect(normalizePluginName("@elizaos/plugin-sql")).toBe("sql");
      expect(normalizePluginName("@elizaos/plugin-bootstrap")).toBe(
        "bootstrap",
      );
    });

    test("should extract short name from other scoped packages", () => {
      expect(normalizePluginName("@myorg/plugin-custom")).toBe("custom");
      expect(normalizePluginName("@company/plugin-integration")).toBe(
        "integration",
      );
    });

    test("should return original name for non-scoped packages", () => {
      expect(normalizePluginName("discord")).toBe("discord");
      expect(normalizePluginName("bootstrap")).toBe("bootstrap");
      expect(normalizePluginName("my-custom-plugin")).toBe("my-custom-plugin");
    });

    test("should return original name for scoped packages without plugin- prefix", () => {
      expect(normalizePluginName("@elizaos/core")).toBe("@elizaos/core");
      expect(normalizePluginName("@myorg/utils")).toBe("@myorg/utils");
    });
  });

  describe("resolvePluginDependencies with scoped names", () => {
    test("should resolve dependency using scoped package name", () => {
      const pluginA: Plugin = {
        name: "discord",
        description: "Discord plugin",
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "music-player",
        description: "Music player plugin",
        dependencies: ["@elizaos/plugin-discord"], // Scoped name
        actions: [],
        services: [],
      };

      const pluginMap = new Map<string, Plugin>();
      pluginMap.set("discord", pluginA);
      pluginMap.set("music-player", pluginB);

      const resolved = resolvePluginDependencies(pluginMap);

      expect(resolved).toHaveLength(2);
      const indexA = resolved.findIndex((p) => p.name === "discord");
      const indexB = resolved.findIndex((p) => p.name === "music-player");
      // Discord should come before music-player due to dependency
      expect(indexA).toBeLessThan(indexB);
    });

    test("should resolve dependency using short name", () => {
      const pluginA: Plugin = {
        name: "discord",
        description: "Discord plugin",
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "music-player",
        description: "Music player plugin",
        dependencies: ["discord"], // Short name
        actions: [],
        services: [],
      };

      const pluginMap = new Map<string, Plugin>();
      pluginMap.set("discord", pluginA);
      pluginMap.set("music-player", pluginB);

      const resolved = resolvePluginDependencies(pluginMap);

      expect(resolved).toHaveLength(2);
      const indexA = resolved.findIndex((p) => p.name === "discord");
      const indexB = resolved.findIndex((p) => p.name === "music-player");
      expect(indexA).toBeLessThan(indexB);
    });

    test("should handle mixed scoped and short names", () => {
      const pluginA: Plugin = {
        name: "sql",
        description: "SQL plugin",
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "discord",
        description: "Discord plugin",
        dependencies: ["@elizaos/plugin-sql"], // Scoped name
        actions: [],
        services: [],
      };

      const pluginC: Plugin = {
        name: "music-player",
        description: "Music player plugin",
        dependencies: ["discord", "sql"], // Short names
        actions: [],
        services: [],
      };

      const pluginMap = new Map<string, Plugin>();
      pluginMap.set("sql", pluginA);
      pluginMap.set("discord", pluginB);
      pluginMap.set("music-player", pluginC);

      const resolved = resolvePluginDependencies(pluginMap);

      expect(resolved).toHaveLength(3);
      const indexA = resolved.findIndex((p) => p.name === "sql");
      const indexB = resolved.findIndex((p) => p.name === "discord");
      const indexC = resolved.findIndex((p) => p.name === "music-player");
      // SQL should come first, then discord, then music-player
      expect(indexA).toBeLessThan(indexB);
      expect(indexB).toBeLessThan(indexC);
    });

    test("should warn on missing scoped dependency", () => {
      const pluginA: Plugin = {
        name: "music-player",
        description: "Music player plugin",
        dependencies: ["@elizaos/plugin-nonexistent"],
        actions: [],
        services: [],
      };

      const pluginMap = new Map<string, Plugin>();
      pluginMap.set("music-player", pluginA);

      const resolved = resolvePluginDependencies(pluginMap);

      // Should still resolve the plugin even if dependency is missing
      expect(resolved).toHaveLength(1);
      expect(resolved[0].name).toBe("music-player");
    });
```