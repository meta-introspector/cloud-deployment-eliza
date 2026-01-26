# a7046c18:packages_core_typescript_src___tests___plugin.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/plugin.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      const resolved = await resolvePlugins([pluginB, pluginA]);

      expect(resolved).toHaveLength(2);
      // Plugin A should come before Plugin B due to dependency
      const indexA = resolved.findIndex((p) => p.name === "plugin-a");
      const indexB = resolved.findIndex((p) => p.name === "plugin-b");
      expect(indexA).toBeLessThan(indexB);
    });

    test("should handle circular dependencies", async () => {
      const pluginA: Plugin = {
        name: "plugin-a",
        description: "Plugin A",
        dependencies: ["plugin-b"],
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "plugin-b",
        description: "Plugin B",
        dependencies: ["plugin-a"],
        actions: [],
        services: [],
      };

      const resolved = await resolvePlugins([pluginA, pluginB]);

      // Should return plugins even with circular dependencies
      expect(resolved).toHaveLength(2);
    });

    test("should skip invalid plugins", async () => {
      const validPlugin: Plugin = {
        name: "valid-plugin",
        description: "A valid plugin",
        actions: [],
        services: [],
      };

      const invalidPlugin = {
        // Missing name
        description: "Invalid plugin",
      } as any;

      const resolved = await resolvePlugins([validPlugin, invalidPlugin]);

      expect(resolved).toHaveLength(1);
      expect(resolved[0].name).toBe("valid-plugin");
    });

    test("should handle test dependencies in test mode", async () => {
      const pluginA: Plugin = {
        name: "plugin-a",
        description: "Plugin A",
        testDependencies: ["plugin-b"],
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "plugin-b",
        description: "Plugin B",
        actions: [],
        services: [],
      };

      const resolved = await resolvePlugins([pluginA, pluginB], true);

      expect(resolved).toHaveLength(2);
      const indexA = resolved.findIndex((p) => p.name === "plugin-a");
      const indexB = resolved.findIndex((p) => p.name === "plugin-b");
      // In test mode, plugin-b should come before plugin-a due to testDependencies
      expect(indexB).toBeLessThan(indexA);
    });

    test("should handle scoped plugin names with short name dependencies", async () => {
      // Plugin with scoped name
      const pluginDiscord: Plugin = {
        name: "@elizaos/plugin-discord",
        description: "Discord plugin",
        actions: [],
        services: [],
      };

      // Plugin that depends on it using short name
      const pluginBootstrap: Plugin = {
        name: "bootstrap",
        description: "Bootstrap plugin",
        dependencies: ["discord"], // Short name reference
        actions: [],
        services: [],
      };

      // Resolve plugins - discord should be loaded first due to dependency
      const resolved = await resolvePlugins([pluginBootstrap, pluginDiscord]);

      // Should have both plugins
      expect(resolved).toHaveLength(2);

      // Discord should come before bootstrap due to dependency
      const indexDiscord = resolved.findIndex(
        (p) => p.name === "@elizaos/plugin-discord",
      );
      const indexBootstrap = resolved.findIndex((p) => p.name === "bootstrap");
      expect(indexDiscord).toBeLessThan(indexBootstrap);

      // Verify both plugins are present
      expect(resolved.some((p) => p.name === "@elizaos/plugin-discord")).toBe(
        true,
      );
      expect(resolved.some((p) => p.name === "bootstrap")).toBe(true);
    });

    test("should not queue dependency twice when plugin has scoped name", async () => {
      // Plugin with scoped name
      const pluginDiscord: Plugin = {
        name: "@elizaos/plugin-discord",
        description: "Discord plugin",
        actions: [],
        services: [],
      };

      // Plugin that depends on it using short name
      const pluginA: Plugin = {
        name: "plugin-a",
        description: "Plugin A",
        dependencies: ["discord"], // Short name reference
        actions: [],
        services: [],
      };

      // Another plugin that also depends on it using short name
      const pluginB: Plugin = {
        name: "plugin-b",
        description: "Plugin B",
        dependencies: ["discord"], // Short name reference
        actions: [],
        services: [],
      };

      // Resolve plugins - discord should only appear once
      const resolved = await resolvePlugins([pluginA, pluginB, pluginDiscord]);

      // Should have all three plugins, but discord only once
      expect(resolved).toHaveLength(3);

      // Count occurrences of discord plugin
      const discordCount = resolved.filter(
```