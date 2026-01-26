# 5e8c73c1:packages_server_src___tests___unit_api_crud-uuid.test.ts:151-205

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/api/crud-uuid.test.ts:151-205
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    const agent1 = await mockDb.getAgent(id1);
    expect(agent1).toBeTruthy();
    expect(agent1?.id).toBe(id1);
    expect(agent1?.bio).toContain('First bio');

    // Get second agent by ID
    const agent2 = await mockDb.getAgent(id2);
    expect(agent2).toBeTruthy();
    expect(agent2?.id).toBe(id2);
    expect(agent2?.bio).toContain('Second bio');
  });

  it('should update specific agent by UUID without affecting agents with same name', async () => {
    const sharedName = 'TestAgent';
    const id1 = stringToUuid(uuidv4());
    const id2 = stringToUuid(uuidv4());

    await mockDb.createAgent({ id: id1, name: sharedName, bio: ['First'] });
    await mockDb.createAgent({ id: id2, name: sharedName, bio: ['Second'] });

    // Update first agent only
    const updates = { bio: ['Updated first agent'] };
    await mockDb.updateAgent(id1, updates);

    // Verify only first agent was updated
    const agent1 = await mockDb.getAgent(id1);
    const agent2 = await mockDb.getAgent(id2);

    expect(agent1?.bio).toContain('Updated first agent');
    expect(agent2?.bio).toContain('Second'); // Unchanged
  });

  it('should delete specific agent by UUID without affecting agents with same name', async () => {
    const sharedName = 'TestAgent';
    const id1 = stringToUuid(uuidv4());
    const id2 = stringToUuid(uuidv4());

    await mockDb.createAgent({ id: id1, name: sharedName, bio: ['First'] });
    await mockDb.createAgent({ id: id2, name: sharedName, bio: ['Second'] });

    // Delete first agent
    await mockDb.deleteAgent(id1);

    // Verify only first agent was deleted
    const agent1 = await mockDb.getAgent(id1);
    const agent2 = await mockDb.getAgent(id2);

    expect(agent1).toBeNull();
    expect(agent2).toBeTruthy();
    expect(agent2?.name).toBe(sharedName);

    const allAgents = await mockDb.getAgents();
    expect(allAgents).toHaveLength(1);
  });
});
```