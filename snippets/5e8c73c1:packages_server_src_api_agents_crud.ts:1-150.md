# 5e8c73c1:packages_server_src_api_agents_crud.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/agents/crud.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type { Agent, Character, ElizaOS } from '@elizaos/core';
import { validateUuid, logger, getSalt, encryptObjectValues } from '@elizaos/core';
import express from 'express';
import type { AgentServer } from '../../index';
import { sendError, sendSuccess } from '../shared/response-utils';

/**
 * Agent CRUD operations
 */
export function createAgentCrudRouter(
  elizaOS: ElizaOS,
  serverInstance: AgentServer
): express.Router {
  const router = express.Router();
  const db = serverInstance?.database;

  // List all agents with minimal details
  router.get('/', async (_, res) => {
    try {
      if (!db) {
        return sendError(res, 500, 'DB_ERROR', 'Database not available');
      }
      const allAgents = await db.getAgents();
      const runtimes = elizaOS.getAgents().map((a) => a.agentId);

      // Return only minimal agent data
      const response = allAgents
        .map((agent: Partial<Agent>) => ({
          id: agent.id,
          name: agent.name || '',
          characterName: agent.name || '', // Since Agent extends Character, agent.name is the character name
          bio: agent.bio?.[0] ?? '',
          status: agent.id && runtimes.includes(agent.id) ? 'active' : 'inactive',
        }))
        .filter((agent) => agent.id) // Filter out agents without IDs
        .sort((a: any, b: any) => {
          if (a.status === b.status) {
            return a.name.localeCompare(b.name);
          }
          return a.status === 'active' ? -1 : 1;
        });

      sendSuccess(res, { agents: response });
    } catch (error) {
      logger.error({ src: 'http', error }, 'Error retrieving agents');
      sendError(
        res,
        500,
        '500',
        'Error retrieving agents',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  // Get specific agent details
  router.get('/:agentId', async (req, res) => {
    const agentId = validateUuid(req.params.agentId);
    if (!agentId) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID format');
    }
    if (!db) {
      return sendError(res, 500, 'DB_ERROR', 'Database not available');
    }

    try {
      const agent = await db.getAgent(agentId);
      if (!agent) {
        return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
      }

      const runtime = elizaOS.getAgent(agentId);
      const response = {
        ...agent,
        status: runtime ? 'active' : 'inactive',
      };

      sendSuccess(res, response);
    } catch (error) {
      logger.error({ src: 'http', error, agentId }, 'Error retrieving agent');
      sendError(
        res,
        500,
        '500',
        'Error retrieving agent',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  // Create new agent
  router.post('/', async (req, res) => {
    const { characterPath, characterJson, agent } = req.body;
    if (!db) {
      return sendError(res, 500, 'DB_ERROR', 'Database not available');
    }

    try {
      let character: Character;

      if (characterJson) {
        character = await serverInstance?.jsonToCharacter(characterJson);
      } else if (characterPath) {
        character = await serverInstance?.loadCharacterTryPath(characterPath);
      } else if (agent) {
        character = await serverInstance?.jsonToCharacter(agent);
      } else {
        throw new Error('No character configuration provided');
      }

      if (!character) {
        throw new Error('Failed to create character configuration');
      }

      // Encrypt all secrets before saving to database
      const salt = getSalt();
      if (character.settings?.secrets && typeof character.settings.secrets === 'object') {
        character.settings.secrets = encryptObjectValues(
          character.settings.secrets as Record<string, any>,
          salt
        );
      }
      // Also encrypt character.secrets (root level) if it exists
      if (character.secrets && typeof character.secrets === 'object') {
        character.secrets = encryptObjectValues(character.secrets as Record<string, any>, salt) as {
          [key: string]: string | number | boolean;
        };
      }

      const ensureAgentExists = async (character: Character) => {
        // Ensure character has an ID - if not, it should have been set during loading
        if (!character.id) {
          throw new Error('Character must have an ID');
        }
        const agentId = character.id;
        let agent = await db.getAgent(agentId);
        if (!agent) {
          await db.createAgent({ ...character, id: agentId });
          agent = await db.getAgent(agentId);
        }
        return agent;
      };

      const newAgent = await ensureAgentExists(character);

      if (!newAgent) {
        throw new Error(`Failed to create agent ${character.name}`);
      }

      res.status(201).json({
```