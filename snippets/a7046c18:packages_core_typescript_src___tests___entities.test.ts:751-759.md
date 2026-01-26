# a7046c18:packages_core_typescript_src___tests___entities.test.ts:751-759

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/entities.test.ts:751-759
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        agentId: "agent-1" as UUID,
      },
    ];
    const text = formatEntities({ entities });
    expect(text).toContain('"A"');
    expect(text).toContain("ID: 1");
    expect(text).toContain("ID: 2");
  });
});
```