# a7046c18:examples_standalone-cli-chat.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/standalone-cli-chat.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    agentId: UUID,
  ): Promise<IDatabaseAdapter> {
    const adapter = createDatabaseAdapter(
      {
        dataDir: config.pgliteDataDir,
        postgresUrl: config.postgresUrl || undefined,
      },
      agentId,
    );

    await adapter.init();

    const migrator = new DatabaseMigrationService();
    // @ts-expect-error getDatabase is available on the adapter base class
    await migrator.initializeWithDatabase(adapter.getDatabase());
    migrator.discoverAndRegisterPluginSchemas([sqlPlugin]);
    await migrator.runAllPluginMigrations();

    return adapter;
  }

  private static createRuntime(
    character: Character,
    config: AppConfiguration,
  ): AgentRuntime {
    return new AgentRuntime({
      character,
      plugins: [sqlPlugin, bootstrapPlugin, openaiPlugin],
      settings: {
        OPENAI_API_KEY: config.openaiApiKey,
        POSTGRES_URL: config.postgresUrl || undefined,
        PGLITE_DATA_DIR: config.pgliteDataDir,
      },
    });
  }

  private static async setupConversationContext(
    runtime: AgentRuntime,
  ): Promise<{
    userId: UUID;
    roomId: UUID;
    worldId: UUID;
  }> {
    const userId = uuidv4() as UUID;
    const worldId = stringToUuid(CONSTANTS.CHAT_IDENTIFIERS.WORLD);
    const roomId = stringToUuid(CONSTANTS.CHAT_IDENTIFIERS.ROOM);
    const messageServerId = stringToUuid(CONSTANTS.CHAT_IDENTIFIERS.SERVER);

    await runtime.ensureConnection({
      entityId: userId,
      roomId,
      worldId,
      name: "User",
      source: CONSTANTS.CHAT_IDENTIFIERS.SOURCE,
      channelId: CONSTANTS.CHAT_IDENTIFIERS.CHANNEL,
      messageServerId,
      type: ChannelType.DM,
    });

    return { userId, roomId, worldId };
  }

  static async initialize(): Promise<ChatSession> {
    const task = clack.spinner();

    try {
      task.start("Initializing elizaOS...");

      const config = Configuration.load();
      const character = AgentInitializer.createCharacter();

      task.message("Setting up database...");
      const agentId = stringToUuid(character.name);
      const adapter = await AgentInitializer.setupDatabase(config, agentId);

      task.message("Creating agent runtime...");
      const runtime = AgentInitializer.createRuntime(character, config);
      runtime.registerDatabaseAdapter(adapter);
      await runtime.initialize();

      task.message("Setting up conversation...");
      const { userId, roomId, worldId } =
        await AgentInitializer.setupConversationContext(runtime);

      task.stop("✅ elizaOS initialized successfully");

      return {
        runtime,
        userId,
        roomId,
        worldId,
        character,
      };
    } catch (error) {
      task.stop(`❌ Initialization failed: ${error}`);
      throw error;
    }
  }
}

// ============================================================================
// MESSAGE PROCESSING
// ============================================================================

class MessageProcessor {
  constructor(private session: ChatSession) {}

  private createMessageMemory(userInput: string): Memory {
    return createMessageMemory({
      id: uuidv4() as UUID,
      entityId: this.session.userId,
      roomId: this.session.roomId,
      content: {
        text: userInput,
        source: CONSTANTS.CHAT_IDENTIFIERS.SOURCE,
        channelType: ChannelType.DM,
      },
    });
  }

  async processMessage(userInput: string): Promise<MessageProcessingResult> {
    const message = this.createMessageMemory(userInput);
    const startTime = Date.now();

    // Verify messageService is initialized
    if (!this.session.runtime.messageService) {
      throw new Error(
        "MessageService not initialized - runtime may not be fully configured",
      );
    }

    let response = "";

    // Use the messageService.handleMessage() API instead of deprecated MESSAGE_RECEIVED event
    const result = await this.session.runtime.messageService.handleMessage(
      this.session.runtime,
      message,
      async (content: Content): Promise<Memory[]> => {
        if (content && content.text) {
          response += content.text;
        }
        return []; // Return empty array as we're only capturing text for display
      },
    );

    const thinkingTimeMs = Date.now() - startTime;

    return {
      response:
        response ||
```