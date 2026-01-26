# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        // Update: set some secrets to null, and update one
        const updatePayload: Partial<Agent> = {
          settings: {
            secrets: {
              DISCORD_API_TOKEN: null, // Remove
              ELEVENLABS_VOICE_ID: null, // Remove
              ELEVENLABS_XI_API_KEY: "elevenlabs_xi_api_key_new", // Update
            },
          },
        };

        const updateResult = await adapter.updateAgent(
          agentId,
          updatePayload as any,
        );
        expect(updateResult, "Agent update failed").toBe(true);

        const updatedAgent = await adapter.getAgent(agentId);
        expect(updatedAgent, "Agent not found after update").not.toBeNull();
        expect(updatedAgent?.settings).toBeDefined();

        // Check avatar and other settings are preserved
        expect(updatedAgent?.settings?.avatar).toBe(
          initialAgentSettings.avatar,
        );
        expect(updatedAgent?.settings?.someOtherSetting).toBe("should_remain");

        // Check secrets
        const updatedSecrets = updatedAgent?.settings?.secrets;
        expect(updatedSecrets).toBeDefined();
        expect(updatedSecrets).not.toHaveProperty("DISCORD_API_TOKEN");
        expect(updatedSecrets).not.toHaveProperty("ELEVENLABS_VOICE_ID");
        expect(updatedSecrets?.ELEVENLABS_XI_API_KEY).toBe(
          "elevenlabs_xi_api_key_new",
        );
        expect(updatedSecrets?.DISCORD_APPLICATION_ID).toBe(
          initialAgentSettings.secrets.DISCORD_APPLICATION_ID,
        );
        expect(updatedSecrets?.PERPLEXITY_API_KEY).toBe(
          initialAgentSettings.secrets.PERPLEXITY_API_KEY,
        );
      });

      it("should handle updating with empty object", async () => {
        // Create an agent first
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Empty Update",
        };

        await adapter.createAgent(newAgent);

        // Update with empty object
        const updateData: Partial<Agent> = {};

        const result = await adapter.updateAgent(newAgent.id, updateData);
        expect(result).toBe(true);

        // Verify the agent was not modified
        const updatedAgent = await adapter.getAgent(newAgent.id);
        expect(updatedAgent?.name).toBe(newAgent.name);
        expect(updatedAgent?.bio).toBe(newAgent.bio);
      });

      it("should handle deep nested settings objects", async () => {
        // Create an agent with nested settings
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Deep Nested Settings",
          settings: {
            level1: {
              level2: {
                level3: "deep value",
                toKeep: true,
              },
              sibling: "sibling value",
            },
          },
        };

        await adapter.createAgent(newAgent);

        // Update with deeply nested settings
        const updateData: Partial<Agent> = {
          settings: {
            level1: {
              level2: {
                level3: "updated deep value",
                newProperty: "new nested value",
              },
            },
          },
        };

        await adapter.updateAgent(newAgent.id, updateData);

        // Verify the deep settings were properly merged
        const updatedAgent = await adapter.getAgent(newAgent.id);
        if (updatedAgent?.settings?.level1) {
          const level1 = updatedAgent.settings.level1 as any;
          expect(level1.sibling).toBe("sibling value"); // Should be kept

          if (level1.level2) {
            expect(level1.level2.level3).toBe("updated deep value"); // Should be updated
            expect(level1.level2.newProperty).toBe("new nested value"); // Should be added
            expect(level1.level2.toKeep).toBe(true); // Should be kept
          }
        }
      });

      it("should handle array values in settings", async () => {
        // Create an agent with array in settings
        const newAgent = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: "Integration Test Array Settings",
          settings: {
            tags: ["tag1", "tag2", "tag3"],
            config: {
              options: [1, 2, 3],
            },
          },
        };

        await adapter.createAgent(newAgent);

        // Update arrays in settings
        const updateData: Partial<Agent> = {
          settings: {
            tags: ["new-tag1", "new-tag2"], // Replace entire array
            config: {
              options: [4, 5, 6, 7], // Replace nested array
            },
          },
        };

        await adapter.updateAgent(newAgent.id, updateData);

        // Verify arrays were properly updated
        const updatedAgent = await adapter.getAgent(newAgent.id);
        expect(updatedAgent?.settings?.tags).toEqual(["new-tag1", "new-tag2"]);
        if (updatedAgent?.settings?.config) {
          expect((updatedAgent.settings.config as any).options).toEqual([
            4, 5, 6, 7,
          ]);
        }
      });
```