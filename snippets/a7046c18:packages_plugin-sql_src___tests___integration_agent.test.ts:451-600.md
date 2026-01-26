# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          },
        };

        await adapter.createAgent(newAgent);

        // Update only non-settings fields
        const updateData: Partial<Agent> = {
          bio: "Updated bio only",
          username: "new_username",
        };

        const result = await adapter.updateAgent(newAgent.id, updateData);
        expect(result).toBe(true);

        // Verify the agent was updated correctly
        const updatedAgent = await adapter.getAgent(newAgent.id);
        expect(updatedAgent?.bio).toBe(updateData.bio as string);
        expect(updatedAgent?.username).toBe(updateData.username as string);
        expect(updatedAgent?.settings).toHaveProperty(
          "initialSetting",
          "should remain unchanged",
        );
      });

      it("should update only settings fields", async () => {
        // Create an agent first
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Update Settings Only",
          bio: "Original bio",
        };

        await adapter.createAgent(newAgent);

        // Update only settings
        const updateData: Partial<Agent> = {
          settings: {
            newSetting: "settings only update",
          },
        };

        const result = await adapter.updateAgent(newAgent.id, updateData);
        expect(result).toBe(true);

        // Verify the agent was updated correctly
        const updatedAgent = await adapter.getAgent(newAgent.id);
        expect(updatedAgent?.bio).toBe(newAgent.bio); // Bio should remain unchanged
        expect(updatedAgent?.settings).toHaveProperty(
          "newSetting",
          "settings only update",
        );
        expect(updatedAgent?.settings).toHaveProperty(
          "testSetting",
          "test value",
        ); // Original setting should be kept
      });

      it("should remove top-level and nested secret settings when set to null", async () => {
        // Create an agent with initial settings
        const agentId = uuidv4() as UUID;
        const initialAgent = {
          id: agentId,
          name: "Test Agent Settings Removal",
          username: "test_settings_removal",
          bio: "test bio",
          settings: {
            topLevelToBeRemoved: "keep this for a moment",
            anotherTopLevel: "this should stay",
            secrets: {
              secretKeyToRemove: "secret value to be removed",
              anotherSecret: "this secret should also stay",
            },
            nestedObject: {
              prop1: "value1",
              propToRemove: "will be removed",
            },
          },
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        await adapter.createAgent(initialAgent);

        // Update: set a top-level key, a secret key, and a nested object key to null
        const updateData: Partial<Agent> = {
          settings: {
            topLevelToBeRemoved: null,
            secrets: {
              secretKeyToRemove: null,
            },
            nestedObject: {
              propToRemove: null,
            },
          } as any,
        };

        await adapter.updateAgent(agentId, updateData as any);

        const updatedAgent = await adapter.getAgent(agentId);
        expect(updatedAgent?.settings).not.toHaveProperty(
          "topLevelToBeRemoved",
        );
        expect(updatedAgent?.settings?.anotherTopLevel).toBe(
          "this should stay",
        );
        expect(updatedAgent?.settings?.secrets).not.toHaveProperty(
          "secretKeyToRemove",
        );
        expect(updatedAgent?.settings?.secrets?.anotherSecret).toBe(
          "this secret should also stay",
        );
        expect(updatedAgent?.settings?.nestedObject).not.toHaveProperty(
          "propToRemove",
        );
        expect(updatedAgent?.settings?.nestedObject?.prop1).toBe("value1");
      });

      it("should correctly remove specific secrets from a complex settings object when set to null", async () => {
        const agentId = uuidv4() as UUID;
        const initialAgentSettings = {
          avatar: "data:image/jpeg;base64,short_mock_base64_string",
          secrets: {
            DISCORD_API_TOKEN: "discord_token_old",
            ELEVENLABS_VOICE_ID: "elevenlabs_voice_id_old",
            ELEVENLABS_XI_API_KEY: "elevenlabs_xi_api_key_old",
            DISCORD_APPLICATION_ID: "discord_app_id_old",
            PERPLEXITY_API_KEY: "perplexity_api_key_to_keep",
          },
          someOtherSetting: "should_remain",
        };

        const agentToCreate: Agent = {
          id: agentId,
          name: "Complex Secrets Agent",
          bio: "This is a test agent with complex secrets",
          username: "complex_secrets_agent",
          settings: initialAgentSettings,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const creationResult = await adapter.createAgent(agentToCreate);
        expect(creationResult, "Agent creation failed").toBe(true);

        // Verify agent was created before update
        const agentBeforeUpdate = await adapter.getAgent(agentId);
        expect(
          agentBeforeUpdate,
          "Agent not found after creation, before update",
        ).not.toBeNull();
```