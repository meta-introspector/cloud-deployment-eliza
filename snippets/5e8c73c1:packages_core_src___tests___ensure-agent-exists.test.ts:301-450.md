# 5e8c73c1:packages_core_src___tests___ensure-agent-exists.test.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/ensure-agent-exists.test.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    (getAgentMock as BunMockFunction<IDatabaseAdapter['getAgent']>).mockResolvedValueOnce({
      ...existingAgentInDB,
      settings: {
        secrets: {
          RUNTIME_SECRET: 'from_db',
          WALLET_KEY: 'wallet_key_from_db',
          API_KEY: 'from_character',
        },
      },
    });

    const characterAgent: Partial<Agent> = {
      id: agentId,
      name: 'TestAgent',
      settings: {
        secrets: {
          API_KEY: 'from_character',
        },
      },
    };

    await runtime.ensureAgentExists(characterAgent);

    const updateCall = (updateAgentMock as BunMockFunction<IDatabaseAdapter['updateAgent']>).mock
      .calls[0];
    const updatedAgent = updateCall[1] as Partial<Agent>;

    // Both DB and character secrets should be present
    const secrets = updatedAgent.settings?.secrets as Record<string, string> | undefined;
    expect(secrets?.RUNTIME_SECRET).toBe('from_db');
    expect(secrets?.WALLET_KEY).toBe('wallet_key_from_db');
    expect(secrets?.API_KEY).toBe('from_character');
  });

  it('should handle agent with no settings in DB', async () => {
    const existingAgentInDB: Agent = {
      id: agentId,
      name: 'TestAgent',
      // No settings field
    } as Agent;

    (getAgentMock as BunMockFunction<IDatabaseAdapter['getAgent']>).mockResolvedValueOnce(
      existingAgentInDB
    );
    (getAgentMock as BunMockFunction<IDatabaseAdapter['getAgent']>).mockResolvedValueOnce({
      ...existingAgentInDB,
      settings: {
        MODEL: 'gpt-4',
      },
    });

    const characterAgent: Partial<Agent> = {
      id: agentId,
      name: 'TestAgent',
      settings: {
        MODEL: 'gpt-4',
      },
    };

    await runtime.ensureAgentExists(characterAgent);

    const updateCall = (updateAgentMock as BunMockFunction<IDatabaseAdapter['updateAgent']>).mock
      .calls[0];
    const updatedAgent = updateCall[1] as Partial<Agent>;

    // Should have character settings even though DB had none
    expect(updatedAgent.settings?.MODEL).toBe('gpt-4');
  });

  it('should handle character with no settings', async () => {
    const existingAgentInDB: Agent = {
      id: agentId,
      name: 'TestAgent',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      bio: [],
      settings: {
        DB_SETTING: 'value',
      },
    } as Agent;

    (getAgentMock as BunMockFunction<IDatabaseAdapter['getAgent']>).mockResolvedValueOnce(
      existingAgentInDB
    );
    (getAgentMock as BunMockFunction<IDatabaseAdapter['getAgent']>).mockResolvedValueOnce(
      existingAgentInDB
    );

    const characterAgent: Partial<Agent> = {
      id: agentId,
      name: 'TestAgent',
      // No settings
    };

    await runtime.ensureAgentExists(characterAgent);

    const updateCall = (updateAgentMock as BunMockFunction<IDatabaseAdapter['updateAgent']>).mock
      .calls[0];
    const updatedAgent = updateCall[1] as Partial<Agent>;

    // Should preserve DB settings
    expect(updatedAgent.settings?.DB_SETTING).toBe('value');
  });

  it('should throw error if agent id is not provided', async () => {
    const agent: Partial<Agent> = {
      name: 'TestAgent',
    };

    await expect(runtime.ensureAgentExists(agent)).rejects.toThrow('Agent id is required');
  });

  describe('runtime.initialize() integration', () => {
    it('should load DB-persisted settings into runtime.character after initialization', async () => {
      // Simulate DB with persisted wallet keys
      const dbAgent = {
        id: agentId,
        name: 'TestAgent',
        bio: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        settings: {
          SOLANA_PUBLIC_KEY: 'wallet_from_db',
          RUNTIME_SETTING: 'from_previous_run',
          secrets: {
            SOLANA_PRIVATE_KEY: 'secret_from_db',
          },
        },
      } as Agent;

      // Mock getAgent to return DB agent on first call (ensureAgentExists)
      // and updated agent on second call (after update)
      (getAgentMock as BunMockFunction<IDatabaseAdapter['getAgent']>)
        .mockResolvedValueOnce(dbAgent)
        .mockResolvedValueOnce({
          ...dbAgent,
          settings: {
            ...dbAgent.settings,
            MODEL: 'gpt-4', // Added from character file
          },
        });

      // Character file has different settings
      const character: Character = {
        id: agentId,
        name: 'TestAgent',
        username: 'test',
        bio: [],
        messageExamples: [],
        postExamples: [],
```