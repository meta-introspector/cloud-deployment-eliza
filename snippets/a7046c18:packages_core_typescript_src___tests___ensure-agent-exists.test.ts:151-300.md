# a7046c18:packages_core_typescript_src___tests___ensure-agent-exists.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/ensure-agent-exists.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  });

  it("should create a new agent when none exists in DB", async () => {
    const agent: Partial<Agent> = {
      id: agentId,
      name: "TestAgent",
      settings: {
        MODEL: "gpt-4",
      },
    };

    const result = await runtime.ensureAgentExists(agent);

    expect(mockAdapter.getAgent).toHaveBeenCalledWith(agentId);
    expect(mockAdapter.createAgent).toHaveBeenCalled();
    expect(result.id).toBe(agentId);
  });

  it("should merge DB settings with character.json settings on restart", async () => {
    // Simulate DB state with persisted runtime secrets
    const existingAgentInDB: Agent = {
      id: agentId,
      name: "TestAgent",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      bio: [],
      settings: {
        SOLANA_PUBLIC_KEY: "CioDPgLA1o8cuuhXZ7M3Fi1Lzqo2Cr8VudjY6ErtvYp4",
        secrets: {
          SOLANA_PRIVATE_KEY: "4zkwqei5hFqtHvqGTMFC6FDCBSPoJqTqN3v7pNDYrqFY...",
        },
        OLD_SETTING: "should_be_kept",
      },
    } as Agent;

    (
      getAgentMock as BunMockFunction<IDatabaseAdapter["getAgent"]>
    ).mockResolvedValueOnce(existingAgentInDB);
    (
      getAgentMock as BunMockFunction<IDatabaseAdapter["getAgent"]>
    ).mockResolvedValueOnce({
      ...existingAgentInDB,
      settings: {
        SOLANA_PUBLIC_KEY: "CioDPgLA1o8cuuhXZ7M3Fi1Lzqo2Cr8VudjY6ErtvYp4",
        MODEL: "gpt-4",
        TEMPERATURE: "0.7",
        secrets: {
          SOLANA_PRIVATE_KEY: "4zkwqei5hFqtHvqGTMFC6FDCBSPoJqTqN3v7pNDYrqFY...",
        },
        OLD_SETTING: "should_be_kept",
      },
    });

    // Character file has new settings but no wallet keys
    const characterAgent: Partial<Agent> = {
      id: agentId,
      name: "TestAgent",
      settings: {
        MODEL: "gpt-4",
        TEMPERATURE: "0.7",
      },
    };

    const _result = await runtime.ensureAgentExists(characterAgent);

    // Verify updateAgent was called with merged settings
    expect(mockAdapter.updateAgent).toHaveBeenCalled();
    const updateCall = (
      updateAgentMock as BunMockFunction<IDatabaseAdapter["updateAgent"]>
    ).mock.calls[0];
    // updateAgent signature: (agentId: UUID, agent: Partial<Agent>) => Promise<boolean>
    // So updateCall[1] is Partial<Agent>
    const updatedAgent = updateCall[1] as Partial<Agent>;

    // Check that DB settings were preserved
    expect(updatedAgent.settings?.SOLANA_PUBLIC_KEY).toBe(
      "CioDPgLA1o8cuuhXZ7M3Fi1Lzqo2Cr8VudjY6ErtvYp4",
    );
    expect(updatedAgent.settings?.OLD_SETTING).toBe("should_be_kept");

    // Check that character.json settings were applied
    expect(updatedAgent.settings?.MODEL).toBe("gpt-4");
    expect(updatedAgent.settings?.TEMPERATURE).toBe("0.7");

    // Check that secrets were preserved
    expect(
      (updatedAgent.settings?.secrets as Record<string, string>)
        ?.SOLANA_PRIVATE_KEY,
    ).toBe("4zkwqei5hFqtHvqGTMFC6FDCBSPoJqTqN3v7pNDYrqFY...");
  });

  it("should allow character.json to override DB settings", async () => {
    // DB has old MODEL value
    const existingAgentInDB: Agent = {
      id: agentId,
      name: "TestAgent",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      bio: [],
      settings: {
        MODEL: "gpt-3.5-turbo",
        SOLANA_PUBLIC_KEY: "wallet123",
        secrets: {
          SOLANA_PRIVATE_KEY: "4zkwqei5hFqtHvqGTMFC6FDCBSPoJqTqN3v7pNDYrqFY...",
        },
      },
    } as Agent;

    (
      getAgentMock as BunMockFunction<IDatabaseAdapter["getAgent"]>
    ).mockResolvedValueOnce(existingAgentInDB);
    (
      getAgentMock as BunMockFunction<IDatabaseAdapter["getAgent"]>
    ).mockResolvedValueOnce({
      ...existingAgentInDB,
      settings: {
        MODEL: "gpt-4", // Updated by character.json
        SOLANA_PUBLIC_KEY: "wallet123", // Preserved from DB
        secrets: {
          SOLANA_PRIVATE_KEY: "4zkwqei5hFqtHvqGTMFC6FDCBSPoJqTqN3v7pNDYrqFY...",
        },
      },
    });

    // Character file has new MODEL value
    const characterAgent: Partial<Agent> = {
      id: agentId,
      name: "TestAgent",
      settings: {
        MODEL: "gpt-4", // This should override DB value
      },
    };

    await runtime.ensureAgentExists(characterAgent);

    const updateCall = (
      updateAgentMock as BunMockFunction<IDatabaseAdapter["updateAgent"]>
    ).mock.calls[0];
    const updatedAgent = updateCall[1] as Partial<Agent>;

    // MODEL should be overridden by character.json
    expect(updatedAgent.settings?.MODEL).toBe("gpt-4");

    // But SOLANA_PUBLIC_KEY should be preserved from DB
    expect(updatedAgent.settings?.SOLANA_PUBLIC_KEY).toBe("wallet123");
  });

  it("should deep merge secrets from both DB and character.json", async () => {
    const existingAgentInDB: Agent = {
      id: agentId,
```