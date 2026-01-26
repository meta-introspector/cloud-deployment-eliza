# 5e8c73c1:packages_core_src___tests___database.test.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/database.test.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  }
  /**
   * Get the list of participants for a specific room.
   *
   * @param {_roomId} UUID - The UUID of the room for which participants need to be retrieved.
   * @returns {Promise<UUID[]>} - A Promise that resolves to an array of UUIDs representing the participants of the room.
   * @throws {Error} - If the method is not implemented.
   */
  getParticipantsForRoom(_roomId: UUID): Promise<UUID[]> {
    throw new Error('Method not implemented.');
  }
  /**
   * Get the state of a participant user in a specific room.
   * @param {UUID} _roomId - The ID of the room.
   * @param {UUID} _entityId - The ID of the user.
   * @returns {Promise<"FOLLOWED" | "MUTED" | null>} The state of the participant user (FOLLOWED, MUTED, or null).
   */
  getParticipantUserState(_roomId: UUID, _entityId: UUID): Promise<'FOLLOWED' | 'MUTED' | null> {
    throw new Error('Method not implemented.');
  }
  /**
   * Set the state of a participant in a room.
   *
   * @param {UUID} _roomId - The unique identifier of the room.
   * @param {UUID} _entityId - The unique identifier of the user.
   * @param {UUID} _agentId - The unique identifier of the agent.
   * @param {"FOLLOWED" | "MUTED" | null} _state - The state to set for the participant (FOLLOWED, MUTED, or null).
   * @returns {Promise<void>} - A promise that resolves when the state is set.
   */
  setParticipantUserState(
    _roomId: UUID,
    _entityId: UUID,
    _state: 'FOLLOWED' | 'MUTED' | null
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /**
   * Creates a relationship between two users.
   *
   * @param {Object} _params - The parameters for creating the relationship.
   * @param {UUID} _params.sourceEntityId - The UUID of the first user.
   * @param {UUID} _params.targetEntityId - The UUID of the second user.
   * @returns {Promise<boolean>} - A promise that resolves to true if the relationship was successfully created.
   */
  createRelationship(_params: { sourceEntityId: UUID; targetEntityId: UUID }): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  /**
   * Retrieves the relationship between two users.
   * @param {object} _params The parameters for which relationship to get.
   * @param {UUID} _params.sourceEntityId The UUID of the first user.
   * @param {UUID} _params.targetEntityId The UUID of the second user.
   * @returns {Promise<Relationship | null>} A Promise that resolves with the relationship between the two users, or null if no relationship exists.
   */
  getRelationship(_params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
  }): Promise<Relationship | null> {
    throw new Error('Method not implemented.');
  }
  /**
   * Retrieves relationships for a specific user based on the provided user ID.
   * @param {Object} _params - The parameters object containing the user ID.
   * @param {string} _params.entityId - The unique identifier for the user to retrieve relationships for.
   * @returns {Promise<Relationship[]>} - A promise that resolves to an array of Relationship objects.
   */
  getRelationships(_params: { entityId: UUID }): Promise<Relationship[]> {
    throw new Error('Method not implemented.');
  }
  db: Record<string, unknown> = {};

  // Mock method for getting memories by room IDs
  /**
   *
   * Retrieves memories based on given roomIds and optional agentId.
   *
   * @param {Object} params - The parameters for fetching memories.
   * @param {string[]} params.roomIds - An array of roomIds to filter memories by.
   * @param {string} [params.agentId] - An optional agentId to further filter memories by.
   * @param {string} params.tableName - The name of the table storing memories.
   * @returns {Promise<Memory[]>} - The Promise that resolves to an array of Memory objects.
   */
  async getMemoriesByRoomIds(params: {
    roomIds: `${string}-${string}-${string}-${string}-${string}`[];
    agentId?: `${string}-${string}-${string}-${string}-${string}`;
    tableName: string;
  }): Promise<Memory[]> {
    return [
      {
        id: 'memory-id' as UUID,
        content: { text: 'Test Memory' },
        roomId: params.roomIds[0],
        entityId: 'user-id' as UUID,
        agentId: params.agentId ?? ('agent-id' as UUID),
      },
    ];
  }

  // Mock method for getting cached embeddings
  /**
   * Fetch cached embeddings based on the query parameters.
   *
   * @param {Object} _params - The parameters used to query the cached embeddings.
   * @param {string} _params.query_table_name - The name of the table used for the query.
   * @param {number} _params.query_threshold - The threshold value for the query.
   * @param {string} _params.query_input - The input string for the query.
   * @param {string} _params.query_field_name - The name of the field used in the query.
   * @param {string} _params.query_field_sub_name - The subfield name used in the query.
   * @param {number} _params.query_match_count - The number of matches for the query.
   * @return {Promise<{embedding: number[], levenshtein_score: number}[]>} The cached embeddings with their Levenshtein scores.
   */

  async getCachedEmbeddings(_params: {
    query_table_name: string;
    query_threshold: number;
    query_input: string;
    query_field_name: string;
    query_field_sub_name: string;
    query_match_count: number;
  }): Promise<
    {
      embedding: number[];
      levenshtein_score: number;
    }[]
  > {
    return [
      {
        embedding: [0.1, 0.2, 0.3],
        levenshtein_score: 0.4,
      },
    ];
  }

  // Mock method for searching memories
  /**
   * Asynchronously searches for memories based on the provided parameters.
   *
   * @param {Object} params - The parameters for the memory search.
   * @param {string} params.tableName - The name of the table to search memories in.
   * @param {string} params.roomId - The room ID to search memories related to.
   * @param {number[]} params.embedding - The memory embedding for similarity matching.
   * @param {number} params.match_threshold - The threshold for match similarity.
   * @param {number} params.count - The number of memories to retrieve.
   * @param {boolean} params.unique - Flag to retrieve unique memories only.
   * @returns {Promise<Array<Memory>>} The list of memories that match the search criteria.
   */
  async searchMemories(params: {
    tableName: string;
    roomId: `${string}-${string}-${string}-${string}-${string}`;
    embedding: number[];
```