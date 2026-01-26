# a7046c18:packages_core_typescript_src_runtime.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  public initPromise: Promise<void>;
  private initResolver:
    | ((value?: void | PromiseLike<void>) => void)
    | undefined;
  private currentRunId?: UUID; // Track the current run ID
  private currentRoomId?: UUID; // Track the current room for logging
  private currentActionContext?: {
    // Track current action execution context
    actionName: string;
    actionId: UUID;
    prompts: Array<{
      modelType: string;
      prompt: string;
      timestamp: number;
    }>;
  };
  private maxWorkingMemoryEntries: number = 50; // Default value, can be overridden
  public messageService: IMessageService | null = null; // Lazily initialized

  constructor(opts: {
    conversationLength?: number;
    agentId?: UUID;
    character: Character;
    plugins?: Plugin[];
    fetch?: typeof fetch;
    adapter?: IDatabaseAdapter;
    settings?: RuntimeSettings;
    allAvailablePlugins?: Plugin[];
  }) {
    // Generate deterministic UUID from character name for backward compatibility
    // Falls back to random UUID only if no character name is provided
    this.agentId =
      opts.character.id ??
      opts.agentId ??
      stringToUuid(opts.character.name ?? uuidv4());
    this.character = opts.character;

    this.initPromise = new Promise((resolve) => {
      this.initResolver = resolve;
    });

    // Create the logger with namespace only - level is handled globally from env
    this.logger = createLogger({
      namespace: this.character.name,
    });

    this.#conversationLength =
      opts.conversationLength ?? this.#conversationLength;
    if (opts.adapter) {
      this.registerDatabaseAdapter(opts.adapter);
    }
    this.fetch = (opts.fetch as typeof fetch) ?? this.fetch;
    this.settings = opts.settings ?? environmentSettings;

    this.plugins = []; // Initialize plugins as an empty array
    this.characterPlugins = opts.plugins ?? []; // Store the original character plugins

    if (opts.allAvailablePlugins) {
      for (const plugin of opts.allAvailablePlugins) {
        if (plugin.name) {
          this.allAvailablePlugins.set(plugin.name, plugin);
        }
      }
    }

    this.logger.debug(
      { src: "agent", agentId: this.agentId, agentName: this.character.name },
      "Initialized",
    );
    this.currentRunId = undefined; // Initialize run ID tracker

    // Set max working memory entries from settings or environment
    if (opts.settings?.MAX_WORKING_MEMORY_ENTRIES) {
      this.maxWorkingMemoryEntries =
        parseInt(opts.settings.MAX_WORKING_MEMORY_ENTRIES, 10) || 50;
    } else {
      this.maxWorkingMemoryEntries = getNumberEnv(
        "MAX_WORKING_MEMORY_ENTRIES",
        50,
      ) as number;
    }
  }

  /**
   * Create a new run ID for tracking a sequence of model calls
   */
  createRunId(): UUID {
    return uuidv4() as UUID;
  }

  /**
   * Start a new run for tracking prompts
   * @param roomId Optional room ID to associate logs with this conversation
   */
  startRun(roomId?: UUID): UUID {
    this.currentRunId = this.createRunId();
    this.currentRoomId = roomId;
    return this.currentRunId;
  }

  /**
   * End the current run
   */
  endRun(): void {
    this.currentRunId = undefined;
    this.currentRoomId = undefined;
  }

  /**
   * Get the current run ID (creates one if it doesn't exist)
   */
  getCurrentRunId(): UUID {
    if (!this.currentRunId) {
      this.currentRunId = this.createRunId();
    }
    return this.currentRunId;
  }

  async registerPlugin(plugin: Plugin): Promise<void> {
    if (!plugin.name) {
      // Ensure plugin.name is defined
      const errorMsg = "Plugin or plugin name is undefined";
      this.logger.error(
        { src: "agent", agentId: this.agentId, error: errorMsg },
        "Plugin registration failed",
      );
      throw new Error(`registerPlugin: ${errorMsg}`);
    }

    // Check if a plugin with the same name is already registered.
    const existingPlugin = this.plugins.find((p) => p.name === plugin.name);
    if (existingPlugin) {
      this.logger.warn(
        { src: "agent", agentId: this.agentId, plugin: plugin.name },
        "Plugin already registered, skipping",
      );
      return;
    }

    (this.plugins as Plugin[]).push(plugin);
    this.logger.debug(
      { src: "agent", agentId: this.agentId, plugin: plugin.name },
      "Plugin added",
    );

    if (plugin.init) {
      const config: Record<string, string> = {};
      if (plugin.config) {
        for (const [key, value] of Object.entries(plugin.config)) {
          if (value !== null && value !== undefined) {
```