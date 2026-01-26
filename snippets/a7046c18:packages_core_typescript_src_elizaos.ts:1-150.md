# a7046c18:packages_core_typescript_src_elizaos.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/elizaos.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { v4 as uuidv4 } from "uuid";
import { resolvePlugins } from "./plugin";
import { AgentRuntime } from "./runtime";
import { setDefaultSecretsFromEnv } from "./secrets";
import type {
  MessageProcessingOptions,
  MessageProcessingResult,
} from "./services/message-service";
import { encryptObjectValues, getSalt } from "./settings";
import type {
  Character,
  Content,
  HandleMessageOptions,
  HandleMessageResult,
  HealthStatus,
  IAgentRuntime,
  IDatabaseAdapter,
  IElizaOS,
  Memory,
  Plugin,
  ReadonlyRuntime,
  RuntimeSettings,
  State,
  UUID,
} from "./types";

/**
 * elizaOS - Multi-agent orchestration framework
 */
export class elizaOS extends EventTarget implements IElizaOS {
  private runtimes: Map<UUID, IAgentRuntime> = new Map();
  private initFunctions: Map<UUID, (runtime: IAgentRuntime) => Promise<void>> =
    new Map();
  private editableMode = false;

  // Overload: returns UUID[] when returnRuntimes is false/undefined
  async addAgents(
    agents: Array<{
      character: Character;
      plugins?: (Plugin | string)[];
      settings?: RuntimeSettings;
      init?: (runtime: IAgentRuntime) => Promise<void>;
      databaseAdapter?: IDatabaseAdapter;
    }>,
    options?: {
      isTestMode?: boolean;
      ephemeral?: boolean;
      skipMigrations?: boolean;
      autoStart?: boolean;
      returnRuntimes?: false;
    },
  ): Promise<UUID[]>;

  // Overload: returns IAgentRuntime[] when returnRuntimes is true
  async addAgents(
    agents: Array<{
      character: Character;
      plugins?: (Plugin | string)[];
      settings?: RuntimeSettings;
      init?: (runtime: IAgentRuntime) => Promise<void>;
      databaseAdapter?: IDatabaseAdapter;
    }>,
    options: {
      isTestMode?: boolean;
      ephemeral?: boolean;
      skipMigrations?: boolean;
      autoStart?: boolean;
      returnRuntimes: true;
    },
  ): Promise<IAgentRuntime[]>;

  /**
   * Add multiple agents (batch operation)
   * Handles config and plugin resolution automatically
   *
   * Supports both persistent (Node.js server) and ephemeral (serverless) modes:
   * - Persistent: runtime stored in registry, accessed via getAgent()
   * - Ephemeral: runtime returned but not stored, for per-request usage
   *
   * @example
   * // Node.js server (persistent)
   * const ids = await elizaOS.addAgents([{ character, plugins }]);
   * await elizaOS.startAgents(ids);
   *
   * @example
   * // Serverless (ephemeral, with pre-cached DB adapter)
   * const runtimes = await elizaOS.addAgents([{
   *   character,
   *   plugins,
   *   databaseAdapter: cachedAdapter,
   * }], {
   *   ephemeral: true,
   *   skipMigrations: true,
   *   autoStart: true,
   *   returnRuntimes: true,
   * });
   */
  async addAgents(
    agents: Array<{
      character: Character;
      plugins?: (Plugin | string)[];
      settings?: RuntimeSettings;
      init?: (runtime: IAgentRuntime) => Promise<void>;
      /** Pre-initialized database adapter (skips plugin-sql) */
      databaseAdapter?: IDatabaseAdapter;
    }>,
    options?: {
      isTestMode?: boolean;
      /** If true, runtimes are NOT stored in registry (for serverless) */
      ephemeral?: boolean;
      /** If true, skip database migrations during initialize */
      skipMigrations?: boolean;
      /** If true, automatically call initialize() after creation */
      autoStart?: boolean;
      /** If true, return IAgentRuntime[] instead of UUID[] */
      returnRuntimes?: boolean;
    },
  ): Promise<UUID[] | IAgentRuntime[]> {
    const createdRuntimes: IAgentRuntime[] = [];

    const promises = agents.map(async (agent) => {
      const character: Character = JSON.parse(JSON.stringify(agent.character));

      // Merge environment secrets with character secrets
      // Priority: .env < character.json (character overrides)
      // In test mode, skip env merge to avoid database bloat from system variables
      await setDefaultSecretsFromEnv(character, {
        skipEnvMerge: options?.isTestMode,
      });

      // Encrypt all secrets after merging env vars
      const salt = getSalt();
      if (
        character.settings?.secrets &&
        typeof character.settings.secrets === "object"
      ) {
        character.settings.secrets = encryptObjectValues(
          character.settings.secrets as Record<string, string>,
          salt,
        );
      }
      // Also encrypt character.secrets (root level) if it exists
      if (character.secrets && typeof character.secrets === "object") {
        character.secrets = encryptObjectValues(
          character.secrets as Record<string, string>,
          salt,
        ) as { [key: string]: string | boolean | number };
      }

      let resolvedPlugins = agent.plugins
```