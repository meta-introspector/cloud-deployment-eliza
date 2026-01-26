# a7046c18:packages_core_typescript_src___tests___agent-uuid.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/agent-uuid.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    const runtime1 = new AgentRuntime({
      character: character1,
      adapter: mockAdapter,
    });

    await runtime1.initialize();

    // Create second agent with same name but different ID
    const character2: Character = {
      id: agentId2,
      name: sharedName,
      bio: ["Second agent with this name"],
    };

    const runtime2 = new AgentRuntime({
      character: character2,
      adapter: mockAdapter,
    });

    await runtime2.initialize();

    // Verify both agents exist in the store
    const allAgents = await mockAdapter.getAgents();
    expect(allAgents).toHaveLength(2);

    // Verify they have different IDs
    const ids = allAgents.map((a) => a.id);
    expect(ids).toContain(agentId1);
    expect(ids).toContain(agentId2);
    expect(ids[0]).not.toBe(ids[1]);

    // Verify they have the same name
    const names = allAgents.map((a) => a.name);
    expect(names[0]).toBe(sharedName);
    expect(names[1]).toBe(sharedName);

    // Verify we can retrieve each agent by their unique ID
    const agent1 = await mockAdapter.getAgent(agentId1);
    const agent2 = await mockAdapter.getAgent(agentId2);

    expect(agent1).toBeTruthy();
    expect(agent2).toBeTruthy();
    expect(agent1?.id).toBe(agentId1);
    expect(agent2?.id).toBe(agentId2);
    expect(agent1?.name).toBe(sharedName);
    expect(agent2?.name).toBe(sharedName);
  });

  it("should generate deterministic UUIDs from character names for backward compatibility", async () => {
    const sharedName = "TestAgent";

    // Simulate what happens when a character without ID is processed
    const character1: Character = {
      name: sharedName,
      bio: ["First agent"],
    };

    const character2: Character = {
      name: sharedName,
      bio: ["Second agent"],
    };

    // Create runtimes - constructor should generate deterministic UUIDs from name
    const runtime1 = new AgentRuntime({
      character: character1,
      adapter: mockAdapter,
    });

    const runtime2 = new AgentRuntime({
      character: character2,
      adapter: mockAdapter,
    });

    // Verify same UUIDs were generated for same name (backward compatibility)
    expect(runtime1.agentId).toBe(runtime2.agentId);

    await runtime1.initialize();

    // Second runtime will update the existing agent since it has the same ID
    await runtime2.initialize();

    // Verify only one agent exists (same ID means same agent)
    const allAgents = await mockAdapter.getAgents();
    expect(allAgents).toHaveLength(1);
    expect(allAgents[0].name).toBe(sharedName);
  });

  it("should use character ID if provided, ignoring name-based generation", async () => {
    const explicitId = stringToUuid(uuidv4());
    const character: Character = {
      id: explicitId,
      name: "TestAgent",
      bio: ["Agent with explicit ID"],
    };

    const runtime = new AgentRuntime({
      character,
      adapter: mockAdapter,
    });

    // Verify runtime uses the explicit ID
    expect(runtime.agentId).toBe(explicitId);

    await runtime.initialize();

    // Verify agent created with the explicit ID
    const agent = await mockAdapter.getAgent(explicitId);
    expect(agent).toBeTruthy();
    expect(agent?.id).toBe(explicitId);
  });

  it("should update agent by UUID, not by name", async () => {
    const agentId = stringToUuid(uuidv4());
    const initialName = "OriginalName";
    const updatedName = "UpdatedName";

    // Create agent with initial name
    const character: Character = {
      id: agentId,
      name: initialName,
      bio: ["Initial bio"],
    };

    const runtime = new AgentRuntime({
      character,
      adapter: mockAdapter,
    });

    await runtime.initialize();

    // Update agent name
    await mockAdapter.updateAgent(agentId, { name: updatedName });

    // Verify agent still has same ID but updated name
    const agent = await mockAdapter.getAgent(agentId);
    expect(agent?.id).toBe(agentId);
    expect(agent?.name).toBe(updatedName);

    // Verify no duplicate was created
    const allAgents = await mockAdapter.getAgents();
    expect(allAgents).toHaveLength(1);
  });

  it("should allow creating multiple agents with same name via ensureAgentExists", async () => {
    const sharedName = "SharedName";
    const agentId1 = stringToUuid(uuidv4());
    const agentId2 = stringToUuid(uuidv4());

    const runtime1 = new AgentRuntime({
```