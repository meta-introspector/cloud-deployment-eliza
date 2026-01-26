# 5e8c73c1:packages_cli_src_commands_scenario_index.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/index.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { Command } from 'commander';
import * as yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { logger as elizaLogger } from '@elizaos/core';
import {
  ScenarioSchema,
  Scenario,
  Evaluation,
  EnhancedEvaluationResult,
} from '../scenario/src/schema';
import { LocalEnvironmentProvider } from '../scenario/src/LocalEnvironmentProvider';
import { EnvironmentProvider, ExecutionResult } from '../scenario/src/providers';
import {
  createScenarioServerAndAgent,
  shutdownScenarioServer,
} from '../scenario/src/runtime-factory';
import { UUID, IAgentRuntime } from '@elizaos/core';
import { AgentServer } from '@elizaos/server';

import { MockEngine } from './src/MockEngine';
import { EvaluationEngine } from './src/EvaluationEngine';
import { Reporter } from './src/Reporter';
import { generateRunFilename, generateStepFilename } from './src/file-naming-utils';
import { parseAndValidate, generateSummary } from './src/plugin-parser';
import { RunDataAggregator } from './src/data-aggregator';
import { TrajectoryReconstructor } from './src/TrajectoryReconstructor';

/**
 * Safe evaluation runner with fallback mechanism for ticket #5783
 * Uses enhanced evaluations by default, falls back to original boolean evaluations on any error
 */
async function runEvaluationsWithFallback(
  evaluationEngine: EvaluationEngine,
  evaluations: Array<{ type: string; [key: string]: unknown }>,
  result: ExecutionResult
): Promise<Array<{ success: boolean; message: string; [key: string]: unknown }>> {
  const logger = elizaLogger || console;

  try {
    // Attempt enhanced evaluations (default behavior)
    logger.debug('[Evaluation] Using enhanced evaluations with structured output');
    const enhancedResults = await evaluationEngine.runEnhancedEvaluations(
      evaluations as Evaluation[],
      result
    );

    // Validate that we got proper structured results
    if (Array.isArray(enhancedResults) && enhancedResults.length > 0) {
      const firstResult = enhancedResults[0];
      if (
        firstResult &&
        typeof firstResult.evaluator_type === 'string' &&
        typeof firstResult.success === 'boolean' &&
        typeof firstResult.summary === 'string' &&
        typeof firstResult.details === 'object'
      ) {
        logger.debug(
          `[Evaluation] Enhanced evaluations successful - ${enhancedResults.length} structured results`
        );

        // Convert enhanced results back to legacy format for compatibility
        return enhancedResults.map((enhanced) => ({
          success: enhanced.success,
          message: enhanced.summary,
          // Store enhanced data for future use
          _enhanced: enhanced,
        }));
      }
    }

    // Enhanced results invalid - fall through to legacy
    logger.warn('[Evaluation] Enhanced results invalid, falling back to legacy evaluations');
  } catch (error) {
    // Enhanced evaluations failed - fall back to legacy
    logger.warn(
      `[Evaluation] Enhanced evaluations failed (${error instanceof Error ? error.message : String(error)}), falling back to legacy evaluations`
    );
  }

  // Fallback to original evaluation system
  logger.debug('[Evaluation] Using legacy evaluation system (fallback)');
  const legacyResults = await evaluationEngine.runEvaluations(evaluations as Evaluation[], result);
  // Convert legacy results to enhanced format
  return legacyResults.map((result) => ({
    success: result.success,
    message: result.message,
    evaluator_type: 'legacy',
    summary: result.message,
    details: {},
  }));
}

export const scenario = new Command()
  .name('scenario')
  .description('Manage and execute ElizaOS scenarios')
  .addCommand(
    new Command('run')
      .argument('<filePath>', 'Path to the .scenario.yaml file')
      .option('-l, --live', 'Run scenario in live mode, ignoring mocks', false)
      .description('Execute a scenario from a YAML file')
      .action(async (filePath: string, options: { live: boolean }) => {
        const logger = elizaLogger || console;
        logger.info(`Starting scenario run with args: ${JSON.stringify({ filePath, ...options })}`);
        let provider: EnvironmentProvider | null = null;
        let runtime: IAgentRuntime | null = null;
        let server: AgentServer | null = null;
        let agentId: UUID | null = null;
        let createdServer = false;
        let serverPort = 3000; // Default port
        let mockEngine: MockEngine | null = null;
        let finalStatus = false; // Default to fail
        let reporter: Reporter | null = null;

        // Create unique scenario run identifier
        const scenarioRunId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const logsDir = path.join(__dirname, '_logs_');

        // Initialize RunDataAggregator for centralized data collection (Ticket #5786)
        let dataAggregator: RunDataAggregator | null = null;

        try {
          const fullPath = path.resolve(filePath);
          logger.info(`Attempting to read scenario file from: ${fullPath}`);
          if (!fs.existsSync(fullPath)) {
            logger.error(`Error: File not found at '${fullPath}'`);
            process.exit(1);
          }
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const rawScenario = yaml.load(fileContents);
          // Validate using Zod
          const validationResult = ScenarioSchema.safeParse(rawScenario);
          if (!validationResult.success) {
            logger.error('Scenario file validation failed:');
            console.error(JSON.stringify(validationResult.error.format(), null, 2));
            process.exit(1);
          }
          const scenario: Scenario = validationResult.data;

          // Ensure logs directory exists
          if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
          }

          // Sanitize scenario name for filename

          // Parse and validate plugins if specified
          if (scenario.plugins && scenario.plugins.length > 0) {
            logger.info('Parsing and validating plugins...');
            const pluginResult = await parseAndValidate(scenario.plugins);
```