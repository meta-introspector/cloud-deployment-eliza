# 5e8c73c1:packages_cli_src_commands_scenario_src_LocalEnvironmentProvider.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/LocalEnvironmentProvider.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { EnvironmentProvider, ExecutionResult } from './providers';
import { Scenario } from './schema';
import { AgentServer } from '@elizaos/server';
import { UUID, IAgentRuntime } from '@elizaos/core';
import { askAgentViaApi } from './runtime-factory';
import { TrajectoryReconstructor } from './TrajectoryReconstructor';
import { ConversationManager } from './ConversationManager';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { bunExec } from '../../../utils/bun-exec';

interface ConversationMetadata {
  turnCount: number;
  terminatedEarly?: boolean;
  terminationReason?: string;
  finalEvaluations?: unknown;
}

export class LocalEnvironmentProvider implements EnvironmentProvider {
  private tempDir: string | null = null;
  private server: AgentServer | null = null;
  private agentId: UUID | null = null;
  private runtime: IAgentRuntime | null = null; // FIXED: needed for ConversationManager
  private serverPort: number | null = null;
  private trajectoryReconstructor: TrajectoryReconstructor | null = null;
  private conversationManager: ConversationManager | null = null;

  constructor(server?: AgentServer, agentId?: UUID, _runtime?: IAgentRuntime, serverPort?: number) {
    this.server = server ?? null;
    this.agentId = agentId ?? null;
    this.runtime = _runtime ?? null; // FIXED: needed for ConversationManager
    this.serverPort = serverPort ?? null;
    this.trajectoryReconstructor = _runtime ? new TrajectoryReconstructor(_runtime) : null;
  }

  async setup(scenario: Scenario): Promise<void> {
    const tempDirPrefix = path.join(os.tmpdir(), 'eliza-scenario-run-');
    this.tempDir = await fs.mkdtemp(tempDirPrefix);

    const virtualFs = scenario.setup?.virtual_fs;
    if (virtualFs) {
      for (const [filePath, content] of Object.entries(virtualFs)) {
        const fullPath = path.join(this.tempDir, filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content);
      }
    }
  }

  private async captureFileSystem(): Promise<Record<string, string>> {
    if (!this.tempDir) {
      return {};
    }

    const files: Record<string, string> = {};

    try {
      // Recursively read all files in the temp directory
      const readDirRecursive = async (dirPath: string, basePath: string = '') => {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);
          const relativePath = path.join(basePath, entry.name);

          if (entry.isDirectory()) {
            await readDirRecursive(fullPath, relativePath);
          } else if (entry.isFile()) {
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              files[relativePath] = content;
            } catch (error) {
              files[relativePath] = '[binary or unreadable]';
            }
          }
        }
      };

      await readDirRecursive(this.tempDir);
      return files;
    } catch (error) {
      console.warn('Failed to capture file system state:', error);
      return {};
    }
  }

  async run(scenario: Scenario): Promise<ExecutionResult[]> {
    if (!this.tempDir) {
      throw new Error('Setup must be called before run.');
    }

    const results: ExecutionResult[] = [];
    for (const step of scenario.run) {
      const startedAtMs = Date.now();

      // NEW: Check if this is a conversation step
      if (step.conversation) {
        if (!this.server || !this.agentId) {
          throw new Error(
            'LocalEnvironmentProvider requires a pre-created server and agent for conversation steps'
          );
        }

        // Initialize conversation manager if needed
        if (!this.conversationManager) {
          this.conversationManager = new ConversationManager(
            this.runtime!,
            this.server,
            this.agentId,
            this.serverPort!,
            this.trajectoryReconstructor!
          );
        }

        console.log(
          `🗣️  [LocalEnvironmentProvider] Executing conversation step: ${step.name || 'unnamed'}`
        );

        const conversationResult = await this.conversationManager.executeConversation(
          step.input || 'Hello, I need help.',
          step.conversation
        );

        // Convert conversation result to ExecutionResult format
        const endedAtMs = Date.now();
        const durationMs = endedAtMs - startedAtMs;

        const executionResult: ExecutionResult = {
          exitCode: conversationResult.success ? 0 : 1,
          stdout: conversationResult.conversationTranscript,
          stderr: conversationResult.success ? '' : 'Conversation failed',
          files: await this.captureFileSystem(),
          startedAtMs,
          endedAtMs,
          durationMs,
          trajectory: conversationResult.turns.flatMap((turn) => turn.trajectory),
        };

        // Add conversation metadata to result for conversation evaluators
        (
          executionResult as ExecutionResult & { conversationMetadata?: ConversationMetadata }
        ).conversationMetadata = {
          turnCount: conversationResult.turns.length,
          terminatedEarly: conversationResult.terminatedEarly,
          terminationReason: conversationResult.terminationReason ?? undefined,
          finalEvaluations: conversationResult.finalEvaluations,
        };

        results.push(executionResult);
```