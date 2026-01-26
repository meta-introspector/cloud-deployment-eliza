# a7046c18:packages_plugin-sql_src_pglite_adapter.ts:151-163

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/pglite/adapter.ts:151-163
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  async close() {
    await this.manager.close();
  }

  /**
   * Asynchronously retrieves the connection from the client.
   *
   * @returns {Promise<PGlite>} A Promise that resolves with the connection.
   */
  async getConnection() {
    return this.manager.getConnection();
  }
}
```