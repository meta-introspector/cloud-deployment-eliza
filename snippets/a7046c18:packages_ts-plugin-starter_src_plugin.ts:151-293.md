# a7046c18:packages_ts-plugin-starter_src_plugin.ts:151-293

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/plugin.ts:151-293
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  static async start(runtime: IAgentRuntime) {
    logger.info("Starting starter service");
    const service = new StarterService(runtime);
    return service;
  }

  static async stop(runtime: IAgentRuntime) {
    logger.info("Stopping starter service");
    // get the service from the runtime
    const service = runtime.getService(StarterService.serviceType);
    if (!service) {
      throw new Error("Starter service not found");
    }
    service.stop();
  }

  async stop() {
    logger.info("Stopping StarterService");
  }
}

export const starterPlugin: Plugin = {
  name: "plugin-starter",
  description: "Plugin starter for elizaOS",
  config: {
    EXAMPLE_PLUGIN_VARIABLE: process.env.EXAMPLE_PLUGIN_VARIABLE,
  },
  async init(config: Record<string, string>) {
    logger.debug("Plugin initialized");
    try {
      const validatedConfig = await configSchema.parseAsync(config);

      // Set all environment variables at once
      for (const [key, value] of Object.entries(validatedConfig)) {
        if (value) process.env[key] = value;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages =
          error.issues?.map((e) => e.message)?.join(", ") ||
          "Unknown validation error";
        throw new Error(`Invalid plugin configuration: ${errorMessages}`);
      }
      throw new Error(
        `Invalid plugin configuration: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  },
  models: {
    [ModelType.TEXT_SMALL]: async (
      _runtime,
      { prompt, stopSequences = [] }: GenerateTextParams,
    ) => {
      return "Never gonna give you up, never gonna let you down, never gonna run around and desert you...";
    },
    [ModelType.TEXT_LARGE]: async (
      _runtime,
      {
        prompt,
        stopSequences = [],
        maxTokens = 8192,
        temperature = 0.7,
        frequencyPenalty = 0.7,
        presencePenalty = 0.7,
      }: GenerateTextParams,
    ) => {
      return "Never gonna make you cry, never gonna say goodbye, never gonna tell a lie and hurt you...";
    },
  },
  routes: [
    {
      name: "hello-world-route",
      path: "/helloworld",
      type: "GET",
      handler: async (_req: RouteRequest, res: RouteResponse) => {
        // send a response
        res.json({
          message: "Hello World!",
        });
      },
    },
    {
      name: "current-time-route",
      path: "/api/time",
      type: "GET",
      handler: async (_req: RouteRequest, res: RouteResponse) => {
        // Return current time in various formats
        const now = new Date();
        res.json({
          timestamp: now.toISOString(),
          unix: Math.floor(now.getTime() / 1000),
          formatted: now.toLocaleString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      },
    },
  ],
  events: {
    MESSAGE_RECEIVED: [
      async (params) => {
        logger.debug("MESSAGE_RECEIVED event received");
        // print the keys
        logger.debug(
          { keys: Object.keys(params) },
          "MESSAGE_RECEIVED param keys",
        );
      },
    ],
    VOICE_MESSAGE_RECEIVED: [
      async (params) => {
        logger.debug("VOICE_MESSAGE_RECEIVED event received");
        // print the keys
        logger.debug(
          { keys: Object.keys(params) },
          "VOICE_MESSAGE_RECEIVED param keys",
        );
      },
    ],
    WORLD_CONNECTED: [
      async (params) => {
        logger.debug("WORLD_CONNECTED event received");
        // print the keys
        logger.debug(
          { keys: Object.keys(params) },
          "WORLD_CONNECTED param keys",
        );
      },
    ],
    WORLD_JOINED: [
      async (params) => {
        logger.debug("WORLD_JOINED event received");
        // print the keys
        logger.debug({ keys: Object.keys(params) }, "WORLD_JOINED param keys");
      },
    ],
  },
  services: [StarterService],
  actions: [helloWorldAction],
  providers: [helloWorldProvider],
  // dependencies: ['@elizaos/plugin-knowledge'], <--- plugin dependencies go here (if requires another plugin)
};

export default starterPlugin;
```