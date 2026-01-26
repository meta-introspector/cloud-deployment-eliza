# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-orchestrator.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-orchestrator.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 * Result of executing a scenario with evaluations.
 */
interface ScenarioExecutionResult {
  success: boolean;
  evaluations: Array<
    | EnhancedEvaluationResult
    | {
        evaluator_type: string;
        success: boolean;
        summary: string;
        details: { step: number; error: string };
      }
  >;
  executionResults: ExecutionResult[];
  tokenCount: number;
  duration: number;
}

/**
 * Executes a scenario with timeout and progress updates using the real scenario runner.
 */
async function executeScenarioWithTimeout(
  scenarioPath: string,
  context: IsolationContext,
  timeout: number,
  onProgress: (progress: number, status: string) => void,
  sharedServer?: { server: AgentServer; port: number }, // Optional shared server for matrix testing
  runId?: string, // Optional run ID for unique agent naming
  dynamicPlugins?: string[] // Plugins extracted from scenario configuration
): Promise<ScenarioExecutionResult> {
  return new Promise(async (resolve, reject) => {
    const scenarioStartTime = Date.now();
    const timeoutHandle = setTimeout(() => {
      reject(new Error(`Scenario execution timed out after ${timeout}ms`));
    }, timeout);

    try {
      onProgress(0.1, 'Loading scenario...');

      // Load and parse the scenario file
      const yaml = await import('js-yaml');
      const scenarioContent = await fs.readFile(scenarioPath, 'utf8');
      const scenario = yaml.load(scenarioContent) as Scenario;

      onProgress(0.2, 'Validating scenario...');

      // Import scenario validation
      const { ScenarioSchema } = await import('./schema');
      const validationResult = ScenarioSchema.safeParse(scenario);
      if (!validationResult.success) {
        throw new Error(`Invalid scenario: ${JSON.stringify(validationResult.error.format())}`);
      }

      onProgress(0.3, 'Setting up environment...');

      // Create isolated environment provider
      const { LocalEnvironmentProvider } = await import('./LocalEnvironmentProvider');
      const { createScenarioServerAndAgent, createScenarioAgent, shutdownScenarioServer } =
        await import('./runtime-factory');

      // Override environment variables for isolation
      const originalEnv = process.env;
      // Set up isolated environment variables
      process.env = {
        ...originalEnv,
        ELIZAOS_DB_PATH: context.dbPath,
        ELIZAOS_LOG_PATH: context.logPath,
        ELIZAOS_TEMP_DIR: context.tempDir,
      };

      try {
        onProgress(0.4, 'Initializing agent runtime...');

        let server: AgentServer;
        let runtime: IAgentRuntime;
        let agentId: UUID;
        let port: number;
        let serverCreated = false;

        if (sharedServer) {
          // Use shared server pattern for matrix testing
          server = sharedServer.server;
          port = sharedServer.port;

          // Ensure SERVER_PORT is set for shared server scenarios
          process.env.SERVER_PORT = port.toString();

          // Create new agent on shared server (with unique ID for isolation)
          const uniqueAgentName = `scenario-agent-${runId}`;
          const agentResult = await createScenarioAgent(
            server,
            uniqueAgentName, // Unique agent name per run
            dynamicPlugins || [
              '@elizaos/plugin-sql',
              '@elizaos/plugin-openai',
              '@elizaos/plugin-bootstrap',
            ] // Use dynamic or fallback plugins
          );
          runtime = agentResult.runtime;
          agentId = agentResult.agentId;
          serverCreated = false; // We didn't create the server, so don't shut it down
        } else {
          // Single scenario pattern (backward compatibility) - use unique agent name
          const uniqueAgentName = `scenario-agent-${runId}`;
          const result = await createScenarioServerAndAgent(
            null,
            3000, // Use fixed port 3000 for MessageBusService compatibility
            dynamicPlugins || [
              '@elizaos/plugin-sql',
              '@elizaos/plugin-openai',
              '@elizaos/plugin-bootstrap',
            ], // Use dynamic or fallback plugins
            uniqueAgentName // Pass unique agent name
          );
          server = result.server;
          runtime = result.runtime;
          agentId = result.agentId;
          port = result.port;
          serverCreated = result.createdServer;
        }

        const provider = new LocalEnvironmentProvider(server, agentId, runtime, port);

        onProgress(0.5, 'Setting up scenario environment...');

        // Setup the scenario environment
        await provider.setup(scenario);

        onProgress(0.7, 'Executing scenario...');

        // Run the scenario
        const executionResults = await provider.run(scenario);

        onProgress(0.8, 'Running evaluations...');

        // Run evaluations for each run step (similar to regular scenario runner)
        const { EvaluationEngine } = await import('./EvaluationEngine');
        const evaluationEngine = new EvaluationEngine(runtime);

        const evaluationResults = [];
        if (scenario.run && Array.isArray(scenario.run)) {
          for (let i = 0; i < scenario.run.length && i < executionResults.length; i++) {
            const step = scenario.run[i];
            const executionResult = executionResults[i];

            if (step.evaluations && step.evaluations.length > 0) {
              try {
                const stepEvaluations = await evaluationEngine.runEnhancedEvaluations(
                  step.evaluations,
                  executionResult
```