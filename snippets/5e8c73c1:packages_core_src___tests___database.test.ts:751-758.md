# 5e8c73c1:packages_core_src___tests___database.test.ts:751-758

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/database.test.ts:751-758
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    expect(result).toBe(true);
  });

  it('should return entities by room ID', async () => {
    const entities = await adapter.getEntities({ roomId });
    expect(entities).toHaveLength(1);
  });
});
```