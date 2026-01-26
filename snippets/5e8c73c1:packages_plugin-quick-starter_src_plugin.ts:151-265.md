# 5e8c73c1:packages_plugin-quick-starter_src_plugin.ts:151-265

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-quick-starter/src/plugin.ts:151-265
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    super(runtime);
  }

  static override async start(runtime: IAgentRuntime): Promise<Service> {
    logger.info('Starting starter service');
    const service = new StarterService(runtime);
    return service;
  }

  static override async stop(runtime: IAgentRuntime): Promise<void> {
    logger.info('Stopping starter service');
    const service = runtime.getService(StarterService.serviceType);
    if (!service) {
      throw new Error('Starter service not found');
    }
    if ('stop' in service && typeof service.stop === 'function') {
      await service.stop();
    }
  }

  override async stop(): Promise<void> {
    logger.info('Starter service stopped');
  }
}

export const starterPlugin: Plugin = {
  name: 'plugin-quick-starter',
  description: 'Quick backend-only plugin template for elizaOS',
  config: {
    EXAMPLE_PLUGIN_VARIABLE: process.env.EXAMPLE_PLUGIN_VARIABLE,
  },
  async init(config: Record<string, string>) {
    logger.info('Initializing plugin-quick-starter');
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages =
          error.issues?.map((e) => e.message)?.join(', ') || 'Unknown validation error';
        throw new Error(`Invalid plugin configuration: ${errorMessages}`);
      }
      throw new Error(
        `Invalid plugin configuration: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  },
  models: {
    [ModelType.TEXT_SMALL]: async (_runtime: IAgentRuntime, params: unknown) => {
      const { prompt, stopSequences = [] } = params as GenerateTextParams;
      return 'Never gonna give you up, never gonna let you down, never gonna run around and desert you...';
    },
    [ModelType.TEXT_LARGE]: async (_runtime: IAgentRuntime, params: unknown) => {
      const {
        prompt,
        stopSequences = [],
        maxTokens = 8192,
        temperature = 0.7,
        frequencyPenalty = 0.7,
        presencePenalty = 0.7,
      } = params as GenerateTextParams;
      return 'Never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you...';
    },
  },
  routes: [
    {
      name: 'api-status',
      path: '/api/status',
      type: 'GET',
      handler: async (_req: RouteRequest, res: RouteResponse) => {
        res.json({
          status: 'ok',
          plugin: 'quick-starter',
          timestamp: new Date().toISOString(),
        });
      },
    },
  ],
  events: {
    [EventType.MESSAGE_RECEIVED]: [
      async (params: MessagePayload) => {
        logger.debug('MESSAGE_RECEIVED event received');
        logger.debug({ message: params.message }, 'Message:');
      },
    ],
    [EventType.VOICE_MESSAGE_RECEIVED]: [
      async (params: MessagePayload) => {
        logger.debug('VOICE_MESSAGE_RECEIVED event received');
        logger.debug({ message: params.message }, 'Message:');
      },
    ],
    [EventType.WORLD_CONNECTED]: [
      async (params: WorldPayload) => {
        logger.debug('WORLD_CONNECTED event received');
        logger.debug({ world: params.world }, 'World:');
      },
    ],
    [EventType.WORLD_JOINED]: [
      async (params: WorldPayload) => {
        logger.debug('WORLD_JOINED event received');
        logger.debug({ world: params.world }, 'World:');
      },
    ],
  },
  services: [StarterService],
  actions: [quickAction],
  providers: [quickProvider],
  // dependencies: ['@elizaos/plugin-knowledge'], <--- plugin dependencies go here (if requires another plugin)
};

export default starterPlugin;
```