# a7046c18:packages_core_typescript_src_database.ts:601-628

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/database.ts:601-628
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @param name The name of the task to retrieve
   * @returns Promise resolving to the Task object if found, null otherwise
   */
  abstract getTasksByName(name: string): Promise<Task[]>;

  /**
   * Updates an existing task in the database.
   * @param id The UUID of the task to update
   * @param task Partial Task object containing the fields to update
   * @returns Promise resolving when the update is complete
   */
  abstract updateTask(id: UUID, task: Partial<Task>): Promise<void>;

  /**
   * Deletes a task from the database.
   * @param id The UUID of the task to delete
   * @returns Promise resolving when the deletion is complete
   */
  abstract deleteTask(id: UUID): Promise<void>;

  abstract getMemoriesByWorldId(params: {
    worldId: UUID;
    count?: number;
    tableName?: string;
  }): Promise<Memory[]>;

  abstract deleteRoomsByWorldId(worldId: UUID): Promise<void>;
}
```