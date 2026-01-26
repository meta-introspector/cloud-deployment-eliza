# a7046c18:packages_core_typescript_src_roles.ts:1-80

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/roles.ts:1-80
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
// File: /swarm/shared/ownership/core.ts
// Updated to use world metadata instead of cache

import { createUniqueUuid } from "./entities";
import { logger } from "./logger";
import { type IAgentRuntime, Role, type UUID, type World } from "./types";

/**
 * Interface representing the ownership state of servers.
 * @property {Object.<string, World>} servers - The servers and their corresponding worlds, where the key is the server ID and the value is the World object.
 */
export interface ServerOwnershipState {
  servers: {
    [serverId: string]: World;
  };
}

/**
 * Retrieve the server role of a specified user entity within a given server.
 *
 * @param {IAgentRuntime} runtime - The runtime object containing necessary configurations and services.
 * @param {string} entityId - The unique identifier of the user entity.
 * @param {string} serverId - The unique identifier of the server.
 * @returns {Promise<Role>} The role of the user entity within the server, resolved as a Promise.
 */
export async function getUserServerRole(
  runtime: IAgentRuntime,
  entityId: string,
  serverId: string,
): Promise<Role> {
  const worldId = createUniqueUuid(runtime, serverId);
  const world = await runtime.getWorld(worldId);

  if (!world || !world.metadata?.roles) {
    return Role.NONE;
  }

  if (world.metadata.roles[entityId as UUID]) {
    return world.metadata.roles[entityId as UUID] as Role;
  }

  return Role.NONE;
}

/**
 * Finds a server where the given user is the owner
 */
export async function findWorldsForOwner(
  runtime: IAgentRuntime,
  entityId: string,
): Promise<World[] | null> {
  if (!entityId) {
    logger.error(
      { src: "core:roles", agentId: runtime.agentId },
      "User ID is required to find server",
    );
    return null;
  }

  // Get all worlds for this agent
  const worlds = await runtime.getAllWorlds();

  if (!worlds || worlds.length === 0) {
    logger.debug(
      { src: "core:roles", agentId: runtime.agentId },
      "No worlds found for agent",
    );
    return null;
  }

  const ownerWorlds: World[] = [];
  // Find world where the user is the owner
  for (const world of worlds) {
    if (world.metadata?.ownership?.ownerId === entityId) {
      ownerWorlds.push(world);
    }
  }

  return ownerWorlds.length ? ownerWorlds : null;
}
```