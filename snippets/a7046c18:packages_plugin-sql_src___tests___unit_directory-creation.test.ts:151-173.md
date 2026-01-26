# a7046c18:packages_plugin-sql_src___tests___unit_directory-creation.test.ts:151-173

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/directory-creation.test.ts:151-173
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  });

  it("should not create directory when using PostgreSQL", () => {
    const dataDir = path.join(tempDir, ".eliza", ".elizadb");
    const agentId = stringToUuid("test-agent");

    // Directory should not exist yet
    expect(existsSync(dataDir)).toBe(false);

    // Create adapter with postgresUrl - should NOT create directory
    const adapter = createDatabaseAdapter(
      {
        dataDir,
        postgresUrl: "postgresql://user:pass@localhost:5432/testdb",
      },
      agentId,
    );

    // Directory should NOT be created when using PostgreSQL
    expect(existsSync(dataDir)).toBe(false);
    expect(adapter).toBeDefined();
  });
});
```