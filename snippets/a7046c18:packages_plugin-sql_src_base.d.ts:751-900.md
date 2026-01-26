# a7046c18:packages_plugin-sql_src_base.d.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.d.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @param id The UUID of the task to update
   * @param task Partial Task object containing the fields to update
   * @returns Promise resolving when the update is complete
   */
  updateTask(id: UUID, task: Partial<Task>): Promise<void>;
  /**
   * Asynchronously deletes a task from the database.
   * @param id The UUID of the task to delete
   * @returns Promise resolving when the deletion is complete
   */
  deleteTask(id: UUID): Promise<void>;
  getMemoriesByWorldId(params: {
    worldId: UUID;
    count?: number;
    tableName?: string;
  }): Promise<Memory[]>;
  deleteRoomsByWorldId(worldId: UUID): Promise<void>;
  /**
   * Creates a new message server in the central database
   */
  createMessageServer(data: {
    id?: UUID;
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Metadata;
  }): Promise<{
    id: UUID;
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  }>;
  /**
   * Gets all message servers
   */
  getMessageServers(): Promise<
    Array<{
      id: UUID;
      name: string;
      sourceType: string;
      sourceId?: string;
      metadata?: Metadata;
      createdAt: Date;
      updatedAt: Date;
    }>
  >;
  /**
   * Gets a message server by ID
   */
  getMessageServerById(serverId: UUID): Promise<{
    id: UUID;
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
  /**
   * Gets a message server by RLS server_id
   * Note: server_id column only exists when RLS is enabled (added dynamically by RLS setup)
   * This is used to find the message_server linked to a specific RLS server instance
   */
  getMessageServerByRlsServerId(rlsServerId: UUID): Promise<{
    id: UUID;
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
  /**
   * Creates a new channel
   */
  createChannel(
    data: {
      id?: UUID;
      messageServerId: UUID;
      name: string;
      type: string;
      sourceType?: string;
      sourceId?: string;
      topic?: string;
      metadata?: Metadata;
    },
    participantIds?: UUID[],
  ): Promise<{
    id: UUID;
    messageServerId: UUID;
    name: string;
    type: string;
    sourceType?: string;
    sourceId?: string;
    topic?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  }>;
  /**
   * Gets channels for a message server
   */
  getChannelsForMessageServer(messageServerId: UUID): Promise<
    Array<{
      id: UUID;
      messageServerId: UUID;
      name: string;
      type: string;
      sourceType?: string;
      sourceId?: string;
      topic?: string;
      metadata?: Metadata;
      createdAt: Date;
      updatedAt: Date;
    }>
  >;
  /**
   * Gets channel details
   */
  getChannelDetails(channelId: UUID): Promise<{
    id: UUID;
    messageServerId: UUID;
    name: string;
    type: string;
    sourceType?: string;
    sourceId?: string;
    topic?: string;
    metadata?: Metadata;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
  /**
   * Creates a message
   */
  createMessage(data: {
    channelId: UUID;
    authorId: UUID;
    content: string;
    rawMessage?: Record<string, unknown>;
    sourceType?: string;
    sourceId?: string;
    metadata?: Metadata;
    inReplyToRootMessageId?: UUID;
    messageId?: UUID;
  }): Promise<{
    id: UUID;
    channelId: UUID;
```