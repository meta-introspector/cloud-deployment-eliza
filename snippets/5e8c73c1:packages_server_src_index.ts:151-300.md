# 5e8c73c1:packages_server_src_index.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/index.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  getAgentsForMessageServer(messageServerId: UUID): Promise<UUID[]>;
  getDatabase?(): unknown;
  db: { execute: (query: unknown) => Promise<unknown> };
};

/**
 * Represents an agent server which handles agents, database, and server functionalities.
 */
export class AgentServer {
  public app!: express.Application;
  public server!: http.Server;
  public socketIO!: SocketIOServer;
  public isInitialized: boolean = false; // Flag to prevent double initialization
  private isWebUIEnabled: boolean = true; // Default to enabled until initialized
  private clientPath?: string; // Optional path to client dist files
  public elizaOS?: ElizaOS; // Core ElizaOS instance (public for direct access)

  public database!: DatabaseAdapterWithMessaging;
  private rlsServerId?: UUID;
  public messageServerId: UUID = DEFAULT_SERVER_ID;

  public loadCharacterTryPath!: (characterPath: string) => Promise<Character>;
  public jsonToCharacter!: (character: unknown) => Promise<Character>;

  /**
   * Start multiple agents in batch (true parallel)
   * @param agents - Array of agent configurations (character + optional plugins/init)
   * @param options - Optional configuration (e.g., isTestMode for test dependencies)
   * @returns Array of started agent runtimes
   */
  public async startAgents(
    agents: Array<{
      character: Character;
      plugins?: (Plugin | string)[];
      init?: (runtime: IAgentRuntime) => Promise<void>;
    }>,
    options?: { isTestMode?: boolean }
  ): Promise<IAgentRuntime[]> {
    if (!this.elizaOS) {
      throw new Error('Server not properly initialized');
    }

    // Prepare agent configurations with server-specific setup
    const agentConfigs = agents.map((agent) => {
      agent.character.id ??= stringToUuid(agent.character.name);

      // Merge character plugins with provided plugins and add server-required plugins
      const allPlugins = [...(agent.character.plugins || []), ...(agent.plugins || []), sqlPlugin];

      return {
        character: agent.character,
        plugins: allPlugins,
        init: agent.init,
      };
    });

    // Delegate to ElizaOS for config/plugin resolution and agent creation
    const agentIds = await this.elizaOS.addAgents(agentConfigs, options);

    // Start all agents
    await this.elizaOS.startAgents(agentIds);

    // Register agents with server and persist to database
    const runtimes: IAgentRuntime[] = [];
    for (const id of agentIds) {
      const runtime = this.elizaOS.getAgent(id);
      if (runtime) {
        if (this.database) {
          try {
            const existingAgent = await this.database.getAgent(runtime.agentId);
            if (!existingAgent) {
              await this.database.createAgent({
                ...runtime.character,
                id: runtime.agentId,
              });
              logger.debug(
                { src: 'db', agentId: runtime.agentId, agentName: runtime.character.name },
                'Agent persisted to database'
              );
            }

            // Assign agent to server if RLS is enabled
            if (this.rlsServerId) {
              await assignAgentToServer(this.database, runtime.agentId, this.rlsServerId);
            }
          } catch (error) {
            logger.error(
              { src: 'db', error, agentId: runtime.agentId },
              'Failed to persist agent to database'
            );
          }
        }
        await this.registerAgent(runtime);

        runtimes.push(runtime);
      }
    }

    return runtimes;
  }

  /**
   * Stop multiple agents in batch
   * @param agentIds - Array of agent IDs to stop
   */
  public async stopAgents(agentIds: UUID[]): Promise<void> {
    if (!this.elizaOS) {
      throw new Error('ElizaOS not initialized');
    }

    // Delegate to ElizaOS for batch stop
    await this.elizaOS.stopAgents(agentIds);
  }

  /**
   * Get all agents from the ElizaOS instance
   * @returns Array of agent runtimes
   */
  public getAllAgents(): IAgentRuntime[] {
    if (!this.elizaOS) {
      return [];
    }
    return this.elizaOS.getAgents();
  }

  /**
   * Get an agent by ID from the ElizaOS instance
   * @param agentId - The agent ID
   * @returns The agent runtime or undefined
   */
  public getAgent(agentId: UUID): IAgentRuntime | undefined {
    if (!this.elizaOS) {
      return undefined;
    }
    return this.elizaOS.getAgent(agentId);
  }

  /**
   * Constructor for AgentServer class.
   *
   * @constructor
   */
  constructor() {
    try {
      logger.debug({ src: 'http' }, 'Initializing AgentServer');

      // Initialize character loading functions
      this.loadCharacterTryPath = loadCharacterTryPath;
      this.jsonToCharacter = jsonToCharacter;

```