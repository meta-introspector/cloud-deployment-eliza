# 5e8c73c1:packages_cli_src_commands_agent_actions_lifecycle.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/agent/actions/lifecycle.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { logger, asUUID } from '@elizaos/core';
import type { OptionValues } from 'commander';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { checkServer, handleError } from '@/src/utils';
import type { ApiResponse } from '../../shared';
import { createApiClientConfig } from '../../shared';
import { AgentsService } from '@elizaos/api-client';
import type { AgentStartPayload } from '../types';
import { getAgents, resolveAgentId } from '../utils';

/**
 * Start command implementation - starts an agent with character configuration
 */
export async function startAgent(options: OptionValues): Promise<void> {
  const config = createApiClientConfig(options);
  const agentsService = new AgentsService(config);
  try {
    // Consolidated error handling for missing/invalid inputs
    // First check if we have enough info to start an agent
    const hasValidInput =
      options.path ||
      options.remoteCharacter ||
      (options.name && options.name !== true && options.name !== '');

    if (!hasValidInput) {
      // Show error and use commander's built-in help
      console.error('\nError: No character configuration provided.');

      // Try to show available agents
      try {
        const agents = await getAgents(options);
        if (agents.length > 0) {
          console.error('\nAvailable agents in your project:');
          agents.forEach((agent, index) => {
            console.error(`  ${index}. ${agent.name}`);
          });
        }
      } catch (error) {
        await checkServer(options);
        handleError(error);
      }

      throw new Error('MISSING_CHARACTER_CONFIG');
    }

    // API Endpoint: POST /agents
    const response: Response = await (async () => {
      const payload: AgentStartPayload = {};
      let characterName = null;

      async function createCharacter(payload: AgentStartPayload) {
        try {
          const agent = await agentsService.createAgent(payload);
          return agent.name || agent.id;
        } catch (error) {
          logger.error(
            {
              src: 'cli',
              command: 'agent-start',
              error: error instanceof Error ? error.message : String(error),
            },
            'Failed to create agent'
          );
          return null;
        }
      }

      // Handle the path option first
      if (options.path) {
        try {
          const filePath = path.resolve(process.cwd(), options.path);
          if (!existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
          }
          const fileContent = readFileSync(filePath, 'utf8');
          payload.characterJson = JSON.parse(fileContent);
          characterName = await createCharacter(payload);
          if (!characterName) {
            logger.error(
              { src: 'cli', command: 'agent-start' },
              'Failed to create character from file. Check server logs for details'
            );
          }
        } catch (error) {
          console.error('Error reading or parsing local JSON file:', error);
          throw new Error(
            `Failed to read or parse local JSON file: ${error instanceof Error ? error.message : String(error)}`
          );
        }
      }

      if (options.remoteCharacter) {
        if (
          !options.remoteCharacter.startsWith('http://') &&
          !options.remoteCharacter.startsWith('https://')
        ) {
          console.error('Invalid remote URL:', options.remoteCharacter);
          throw new Error('Remote URL must start with http:// or https://');
        }
        payload.characterPath = options.remoteCharacter;
        characterName = await createCharacter(payload);
        if (!characterName) {
          logger.error(
            { src: 'cli', command: 'agent-start' },
            'Failed to create character from remote URL. Check server logs for details'
          );
        }
      }

      if (options.name) {
        characterName = options.name;
      }

      if (characterName) {
        try {
          const agentId = await resolveAgentId(characterName, options);
          const result = await agentsService.startAgent(asUUID(agentId));
          // Convert to Response-like object for consistency with existing code
          return { ok: true, json: async () => ({ data: result }) } as Response;
        } catch (error) {
          // If agent resolution fails, throw to the outer error handler
          throw error;
        }
      }

      // Default behavior: Start a default agent if no specific option is provided
      try {
        const agent = await agentsService.createAgent({});
        return { ok: true, json: async () => ({ data: agent }) } as Response;
      } catch (error) {
        throw error;
      }
    })();

    if (!response.ok) {
      let errorData: ApiResponse<unknown> | null = null;
      try {
        errorData = (await response.json()) as ApiResponse<unknown>;
      } catch (jsonError) {
        console.error('Failed to parse error response as JSON:', jsonError);
        // Use status text if JSON parsing fails
        throw new Error(`Failed to start agent: ${response.statusText}`);
      }

      throw new Error(errorData?.error?.message || `Failed to start agent: ${response.statusText}`);
    }

    // Type assertion to handle the specific structure returned by the start endpoint
    const data = (await response.json()) as ApiResponse<{
```