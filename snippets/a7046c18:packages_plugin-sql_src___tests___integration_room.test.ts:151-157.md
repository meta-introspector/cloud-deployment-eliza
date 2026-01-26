# a7046c18:packages_plugin-sql_src___tests___integration_room.test.ts:151-157

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/room.test.ts:151-157
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(retrieved).toHaveLength(1);
      expect(retrieved?.[0]?.messageServerId).toBe(messageServerId);
      // Verify backward compatibility: serverId should be mapped to messageServerId
      expect(retrieved?.[0]?.serverId).toBe(messageServerId);
    });
  });
});
```