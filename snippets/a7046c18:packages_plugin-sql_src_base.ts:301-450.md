# a7046c18:packages_plugin-sql_src_base.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        DIMENSION_MAP[dimension as keyof typeof DIMENSION_MAP];
    });
  }

  /**
   * Asynchronously retrieves an agent by their ID from the database.
   * @param {UUID} agentId - The ID of the agent to retrieve.
   * @returns {Promise<Agent | null>} A promise that resolves to the retrieved agent or null if not found.
   */
  async getAgent(agentId: UUID): Promise<Agent | null> {
    return this.withDatabase(async () => {
      const rows = await this.db
        .select()
        .from(agentTable)
        .where(eq(agentTable.id, agentId))
        .limit(1);

      if (rows.length === 0) return null;

      const row = rows[0];
      return {
        ...row,
        username: row.username || "",
        id: row.id as UUID,
        system: !row.system ? undefined : row.system,
        bio: !row.bio ? "" : row.bio,
        createdAt: row.createdAt.getTime(),
        updatedAt: row.updatedAt.getTime(),
      };
    });
  }

  /**
   * Asynchronously retrieves a list of agents from the database.
   *
   * @returns {Promise<Partial<Agent>[]>} A Promise that resolves to an array of Agent objects.
   */
  async getAgents(): Promise<Partial<Agent>[]> {
    const result = await this.withDatabase(async () => {
      const rows = await this.db
        .select({
          id: agentTable.id,
          name: agentTable.name,
          bio: agentTable.bio,
        })
        .from(agentTable);
      return rows.map((row) => ({
        ...row,
        id: row.id as UUID,
        bio: row.bio === null ? "" : row.bio,
      }));
    });
    // Guard against null return
    return result || [];
  }
  /**
   * Asynchronously creates a new agent record in the database.
   *
   * @param {Partial<Agent>} agent The agent object to be created.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating the success of the operation.
   */
  async createAgent(agent: Agent): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        // Check for existing agent with the same ID only (names can be duplicated)
        if (agent.id) {
          const existing = await this.db
            .select({ id: agentTable.id })
            .from(agentTable)
            .where(eq(agentTable.id, agent.id))
            .limit(1);

          if (existing.length > 0) {
            logger.warn(
              { src: "plugin:sql", agentId: agent.id },
              "Attempted to create agent with duplicate ID",
            );
            return false;
          }
        }

        await this.db.transaction(async (tx) => {
          await tx.insert(agentTable).values({
            ...agent,
            createdAt: new Date(agent.createdAt || Date.now()),
            updatedAt: new Date(agent.updatedAt || Date.now()),
          });
        });

        return true;
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            agentId: agent.id,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to create agent",
        );
        return false;
      }
    });
  }

  /**
   * Updates an agent in the database with the provided agent ID and data.
   * @param {UUID} agentId - The unique identifier of the agent to update.
   * @param {Partial<Agent>} agent - The partial agent object containing the fields to update.
   * @returns {Promise<boolean>} - A boolean indicating if the agent was successfully updated.
   */
  async updateAgent(agentId: UUID, agent: Partial<Agent>): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        if (!agentId) {
          throw new Error("Agent ID is required for update");
        }

        await this.db.transaction(async (tx) => {
          // Handle settings update if present
          if (agent?.settings) {
            agent.settings = await this.mergeAgentSettings(
              tx,
              agentId,
              agent.settings,
            );
          }

          // Convert numeric timestamps to Date objects for database storage
          // The Agent interface uses numbers, but the database schema expects Date objects
          const updateData: Record<string, unknown> = { ...agent };

          if (updateData.createdAt) {
            if (typeof updateData.createdAt === "number") {
              updateData.createdAt = new Date(updateData.createdAt);
            } else {
              delete updateData.createdAt; // Don't update createdAt if it's not a valid timestamp
            }
          }
          if (updateData.updatedAt) {
            if (typeof updateData.updatedAt === "number") {
              updateData.updatedAt = new Date(updateData.updatedAt);
            } else {
              updateData.updatedAt = new Date(); // Use current time if invalid
            }
          } else {
            updateData.updatedAt = new Date(); // Always set updatedAt to current time
          }

          await tx
            .update(agentTable)
```