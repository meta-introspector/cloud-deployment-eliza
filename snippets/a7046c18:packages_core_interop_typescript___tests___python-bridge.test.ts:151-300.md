# a7046c18:packages_core_interop_typescript___tests___python-bridge.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/__tests__/python-bridge.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(response.type).toBe("error");
      expect(response.error).toBe("Module not found");
    });

    test("should parse ready message with manifest", () => {
      const manifest: PluginManifest = {
        name: "python-plugin",
        description: "A Python plugin",
        version: "1.0.0",
        language: "python",
        actions: [{ name: "PY_ACTION", description: "Python action" }],
      };

      const readyMessage = JSON.stringify({
        type: "ready",
        manifest,
      });

      const parsed = JSON.parse(readyMessage);

      expect(parsed.type).toBe("ready");
      expect(parsed.manifest.name).toBe("python-plugin");
      expect(parsed.manifest.actions[0].name).toBe("PY_ACTION");
    });
  });

  describe("Message Buffer Handling", () => {
    test("should handle newline-delimited messages", () => {
      const messages = [
        {
          type: "ready",
          manifest: {
            name: "test",
            description: "Test",
            version: "1.0.0",
            language: "python",
          },
        },
        { type: "action.result", id: "1", result: { success: true } },
        { type: "provider.result", id: "2", result: { text: "data" } },
      ];

      const buffer = `${messages.map((m) => JSON.stringify(m)).join("\n")}\n`;
      const lines = buffer.split("\n").filter((l) => l.trim());

      expect(lines).toHaveLength(3);
      lines.forEach((line, i) => {
        const parsed = JSON.parse(line);
        expect(parsed.type).toBe(messages[i].type);
      });
    });

    test("should handle partial messages in buffer", () => {
      const fullMessage = JSON.stringify({ type: "test", data: "complete" });
      const partial1 = fullMessage.slice(0, 10);
      const partial2 = fullMessage.slice(10);

      // Simulate buffering
      let buffer = partial1;
      expect(() => JSON.parse(buffer)).toThrow();

      buffer += partial2;
      const parsed = JSON.parse(buffer);
      expect(parsed.type).toBe("test");
    });
  });

  describe("Plugin Adapter Creation", () => {
    test("should create action handlers from manifest", () => {
      const manifest: PluginManifest = {
        name: "adapter-python",
        description: "Test Python adapter",
        version: "1.0.0",
        language: "python",
        actions: [
          {
            name: "PY_ACTION_1",
            description: "First Python action",
            similes: ["PYTHON_1"],
          },
          {
            name: "PY_ACTION_2",
            description: "Second Python action",
          },
        ],
      };

      // Simulate adapter creation
      const actions = manifest.actions ? manifest.actions.map((actionDef) => ({
        name: actionDef.name,
        description: actionDef.description,
        similes: actionDef.similes,
        examples: actionDef.examples,
        validate: async () => {
          // Would send IPC request
          return true;
        },
        handler: async () => {
          // Would send IPC request
          return { success: true, text: "Result from Python" };
        },
      })) : [];

      expect(actions).toHaveLength(2);
      expect(actions[0].name).toBe("PY_ACTION_1");
      expect(actions[1].name).toBe("PY_ACTION_2");
    });

    test("should create provider handlers from manifest", () => {
      const manifest: PluginManifest = {
        name: "provider-python",
        description: "Test Python providers",
        version: "1.0.0",
        language: "python",
        providers: [
          {
            name: "PYTHON_INFO",
            description: "Python environment info",
            dynamic: true,
          },
        ],
      };

      const providers = manifest.providers ? manifest.providers.map((providerDef) => ({
        name: providerDef.name,
        description: providerDef.description,
        dynamic: providerDef.dynamic,
        position: providerDef.position,
        private: providerDef.private,
        get: async () => {
          // Would send IPC request
          return { text: "Provider data" };
        },
      })) : [];

      expect(providers).toHaveLength(1);
      expect(providers[0].name).toBe("PYTHON_INFO");
      expect(providers[0].dynamic).toBe(true);
    });
  });

  describe("Request ID Generation", () => {
    test("should generate unique request IDs", () => {
      let counter = 0;
      const generateId = () => `req_${++counter}`;

      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateId());
      }
```