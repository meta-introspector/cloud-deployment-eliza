# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:1201-1287

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:1201-1287
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          bio: ["Updated bio for agent 1"],
          settings: { updated: true },
        });

        // Verify only agent1 was updated
        const retrieved1 = await adapter.getAgent(agent1.id);
        const retrieved2 = await adapter.getAgent(agent2.id);

        expect(retrieved1?.bio).toContain("Updated bio for agent 1");
        expect(retrieved1?.settings?.updated).toBe(true);

        // Agent 2 should be unchanged
        expect(retrieved2?.bio).toContain("Original bio 2");
        expect(retrieved2?.settings?.updated).toBeUndefined();
      });

      it("should delete only the targeted agent when multiple have the same name", async () => {
        const sharedName = "DeleteTest-Duplicate";

        const agent1 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "delete_user1",
        };

        const agent2 = {
          ...testAgent,
          id: uuidv4() as UUID,
          name: sharedName,
          username: "delete_user2",
        };

        await adapter.createAgent(agent1);
        await adapter.createAgent(agent2);

        // Delete only agent1
        const deleteResult = await adapter.deleteAgent(agent1.id);
        expect(deleteResult).toBe(true);

        // Verify only agent1 was deleted
        const retrieved1 = await adapter.getAgent(agent1.id);
        const retrieved2 = await adapter.getAgent(agent2.id);

        expect(retrieved1).toBeNull();
        expect(retrieved2).not.toBeNull();
        expect(retrieved2?.name).toBe(sharedName);
      });

      it("should handle 10+ agents with the same name", async () => {
        const sharedName = "ManyAgents-SameName";
        const agentIds: UUID[] = [];

        // Create 10 agents with the same name
        for (let i = 0; i < 10; i++) {
          const agent = {
            ...testAgent,
            id: uuidv4() as UUID,
            name: sharedName,
            username: `many_user_${i}`,
            bio: [`Agent number ${i}`],
          };

          const result = await adapter.createAgent(agent);
          expect(result).toBe(true);
          agentIds.push(agent.id);
        }

        // Verify all exist
        for (const id of agentIds) {
          const retrieved = await adapter.getAgent(id);
          expect(retrieved).not.toBeNull();
          expect(retrieved?.name).toBe(sharedName);
        }

        // Verify they all have unique IDs
        const uniqueIds = new Set(agentIds);
        expect(uniqueIds.size).toBe(10);

        // Get all agents and verify our 10 are in there
        const allAgents = await adapter.getAgents();
        const ourAgents = allAgents.filter((a) => agentIds.includes(a.id!));
        expect(ourAgents.length).toBe(10);
      });
    });
  });
});
```