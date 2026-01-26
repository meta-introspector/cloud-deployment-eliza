# 5e8c73c1:packages_cli_src_commands_scenario_src_runtime-factory.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/runtime-factory.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { Character, UUID, IAgentRuntime, stringToUuid } from '@elizaos/core';
import { AgentServer } from '@elizaos/server';
import { ElizaClient } from '@elizaos/api-client';
import type { Message } from '@elizaos/api-client';
import { ChannelType, stringToUuid as stringToUuidCore } from '@elizaos/core';
import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'node:net';
import { processManager } from './process-manager';

/**
 * Find an available port in the given range
 */
async function findAvailablePort(
  startPort: number,
  endPort: number,
  host?: string
): Promise<number> {
  const serverHost = host || process.env.SERVER_HOST || '0.0.0.0';

  // Try ports in random order to avoid conflicts
  const ports = Array.from({ length: endPort - startPort + 1 }, (_, i) => startPort + i);
  for (let i = ports.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ports[i], ports[j]] = [ports[j], ports[i]];
  }

  for (const port of ports) {
    try {
      const server = createServer();
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          server.close();
          reject(new Error('Port check timeout'));
        }, 500);

        server.listen(port, serverHost, () => {
          clearTimeout(timeout);
          server.close();
          resolve();
        });
        server.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
      return port;
    } catch {
      continue;
    }
  }
  throw new Error(`No available ports found in range ${startPort}-${endPort}`);
}

/**
 * Creates and initializes a properly configured AgentServer for scenario testing
 * @param existingServer - Optional existing server to reuse
 * @param desiredPort - Port to run on (0 for auto-find)
 * @returns Configured and started AgentServer with port info
 */
export async function createScenarioServer(
  existingServer: AgentServer | null = null,
  desiredPort: number = 3000
): Promise<{
  server: AgentServer;
  port: number;
  createdServer: boolean;
}> {
  let server: AgentServer | undefined;
  let createdServer = false;
  let port = desiredPort;

  // If port is 0, find an available port
  if (port === 0) {
    port = await findAvailablePort(3001, 4000);
  }

  // Try to start the server with retry logic
  let retryCount = 0;
  const maxRetries = 3;

  while (retryCount < maxRetries) {
    try {
      if (existingServer) {
        server = existingServer;
      } else {
        server = new AgentServer();
        // Prefer unique directory per scenario run under PGLite root (env or default .eliza/.elizadb)
        const pgliteRoot =
          process.env.PGLITE_DATA_DIR || path.join(process.cwd(), '.eliza', '.elizadb');
        const uniqueDataDir = path.join(
          pgliteRoot,
          `scenario-${Date.now()}-${Math.random().toString(36).slice(2)}`
        );
        try {
          fs.mkdirSync(uniqueDataDir, { recursive: true });
        } catch {
          // Best-effort; initialization will surface errors if any
        }
        // Persist the chosen directory for downstream consumers
        process.env.PGLITE_DATA_DIR = uniqueDataDir;
        await server.start({ port, dataDir: uniqueDataDir });
        createdServer = true;

        // Set SERVER_PORT environment variable so MessageBusService uses the correct URL
        // This is critical for scenario testing when the server starts on a different port
        process.env.SERVER_PORT = port.toString();

        // Register the server process for cleanup
        const runId = `agent-server-${port}`;
        processManager.registerProcess(runId, process.pid, 'agent-server', port);
      }
      break; // Success, exit retry loop
    } catch (error) {
      retryCount++;
      if (retryCount >= maxRetries) {
        throw error;
      }

      // Try a different port
      port = await findAvailablePort(port + 1, 3100);
    }
  }

  // Ensure server is defined
  if (!server) {
    throw new Error('Failed to create or initialize server after retries');
  }

  return { server, port, createdServer };
}

/**
 * Creates and starts an agent on an existing AgentServer
 * @param server - The AgentServer to create agent on
 * @param agentName - Unique name for the agent (defaults to 'scenario-agent')
 * @param pluginNames - Plugins to load for the agent
 * @returns Started agent runtime and ID
 */
export async function createScenarioAgent(
  server: AgentServer,
  agentName: string = 'scenario-agent',
  pluginNames: string[] = [
    '@elizaos/plugin-sql',
    '@elizaos/plugin-openai',
    '@elizaos/plugin-bootstrap',
  ]
): Promise<{
  runtime: IAgentRuntime;
  agentId: UUID;
```