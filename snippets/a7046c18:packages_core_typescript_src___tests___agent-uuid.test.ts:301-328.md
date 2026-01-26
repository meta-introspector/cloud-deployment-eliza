# a7046c18:packages_core_typescript_src___tests___agent-uuid.test.ts:301-328

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/agent-uuid.test.ts:301-328
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      agentId: agentId1,
      character: { name: sharedName, bio: ["First"] } as Character,
      adapter: mockAdapter,
    });

    const runtime2 = new AgentRuntime({
      agentId: agentId2,
      character: { name: sharedName, bio: ["Second"] } as Character,
      adapter: mockAdapter,
    });

    await runtime1.initialize();
    await runtime2.initialize();

    // Both should exist
    const agent1 = await mockAdapter.getAgent(agentId1);
    const agent2 = await mockAdapter.getAgent(agentId2);

    expect(agent1).toBeTruthy();
    expect(agent2).toBeTruthy();
    expect(agent1?.name).toBe(sharedName);
    expect(agent2?.name).toBe(sharedName);
    expect(agent1?.id).not.toBe(agent2?.id);

    const allAgents = await mockAdapter.getAgents();
    expect(allAgents).toHaveLength(2);
  });
});
```