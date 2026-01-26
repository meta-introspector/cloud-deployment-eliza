# a7046c18:packages_core_typescript_src___tests___elizaos.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const agents = elizaOS.getAgents();
      expect(agents).toHaveLength(2);
    });
  });

  describe("Runtime elizaOS Reference", () => {
    const testCharacter: Character = {
      name: "TestAgent",
      bio: "A test agent",
      system: "You are a test agent",
    };

    it("should assign elizaOS reference to runtime when agent is added", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);

      const runtime = elizaOS.getAgent(agentIds[0]);
      expect(runtime).toBeTruthy();
      expect(runtime?.elizaOS).toBe(elizaOS);
    });

    it("should assign elizaOS reference to runtime when agent is registered", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);
      const runtime = elizaOS.getAgent(agentIds[0]);

      // Remove and re-register
      await elizaOS.deleteAgents(agentIds);
      elizaOS.registerAgent(runtime!);

      expect(runtime?.elizaOS).toBe(elizaOS);
    });

    it("hasElizaOS() should return true when elizaOS is assigned", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);

      const runtime = elizaOS.getAgent(agentIds[0]);
      expect(runtime?.hasElizaOS()).toBe(true);
    });

    it("hasElizaOS() should narrow TypeScript type correctly", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);

      const runtime = elizaOS.getAgent(agentIds[0]);
      if (runtime?.hasElizaOS()) {
        // TypeScript should know elizaOS is defined here
        expect(runtime.elizaOS).toBeDefined();
        expect(runtime.elizaOS.handleMessage).toBeDefined();
        expect(runtime.elizaOS.getAgent).toBeDefined();
      } else {
        throw new Error("hasElizaOS() should return true");
      }
    });

    it("should clear elizaOS reference on runtime.stop()", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);

      const runtime = elizaOS.getAgent(agentIds[0]);
      expect(runtime?.elizaOS).toBe(elizaOS);

      // Stop the runtime
      await runtime?.stop();

      // elizaOS reference should be cleared to prevent memory leak
      expect(runtime?.elizaOS).toBeUndefined();
    });

    it("should prevent memory leaks with bidirectional reference", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);

      const runtime = elizaOS.getAgent(agentIds[0]);

      // Verify bidirectional reference
      expect(runtime?.elizaOS).toBe(elizaOS);
      expect(elizaOS.getAgent(agentIds[0])).toBe(runtime);

      // Stop and verify cleanup
      await runtime?.stop();
      expect(runtime?.elizaOS).toBeUndefined();
    });
  });

  describe("Serverless Mode", () => {
    const testCharacter: Character = {
      name: "TestAgent",
      bio: "A test agent",
      system: "You are a test agent",
    };

    it("should not store runtime in registry when ephemeral is true", async () => {
      const result = await elizaOS.addAgents(
        [{ character: testCharacter, plugins: [mockSqlPlugin] }],
        {
          ephemeral: true,
          returnRuntimes: true,
        },
      );

      // Should return runtimes
      expect(result).toHaveLength(1);
      expect(typeof result[0]).toBe("object");

      const runtime = result[0] as IAgentRuntime;
      expect(runtime.agentId).toBeDefined();

      // Should NOT be in registry
      expect(elizaOS.getAgent(runtime.agentId)).toBeUndefined();
    });

    it("should return UUIDs by default (not runtimes)", async () => {
      const result = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);

      expect(result).toHaveLength(1);
      expect(typeof result[0]).toBe("string");
    });

    it("should return runtimes when returnRuntimes is true", async () => {
      const result = await elizaOS.addAgents(
        [{ character: testCharacter, plugins: [mockSqlPlugin] }],
        {
          returnRuntimes: true,
        },
      );

      expect(result).toHaveLength(1);
      expect(typeof result[0]).toBe("object");
      expect((result[0] as IAgentRuntime).agentId).toBeDefined();
    });

    it("should auto-start when autoStart is true", async () => {
      const result = await elizaOS.addAgents(
        [{ character: testCharacter, plugins: [mockSqlPlugin] }],
        {
          autoStart: true,
          returnRuntimes: true,
        },
      );

```