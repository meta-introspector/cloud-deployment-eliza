# 5e8c73c1:packages_cli_src_commands_scenario_src_runtime-factory.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/runtime-factory.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
}> {
  const character: Character = {
    name: agentName,
    id: stringToUuid(agentName),
    bio: 'A test agent for scenario execution',
    plugins: pluginNames,
    settings: {
      // Let ConfigManager populate minimal, file-scoped secrets.
      secrets: {},
    },
    // Always respond: set system prompt and template to ensure reply
    system:
      'Always respond to every message, even if the input is unclear or empty. Never ignore a user message.',
    // Add minimal required fields for Character type
    topics: ['testing', 'scenarios', 'automation'],
    adjectives: ['responsive', 'reliable', 'test-oriented'],
    style: {
      all: ['Always reply', 'Be concise and clear'],
      chat: ['Direct', 'Helpful'],
    },
  };

  // Pass raw character; encryption and secrets are handled inside startAgents
  const [runtime] = await server.startAgents([{ character }]);
  if (!runtime) {
    throw new Error(`Failed to start agent: ${character.name}`);
  }
  const agentId = runtime.character.id as UUID;

  return { runtime, agentId };
}

/**
 * Creates a configured AgentServer and starts an agent (backward compatible wrapper)
 * @deprecated Consider using createScenarioServer() + createScenarioAgent() for better flexibility
 */
export async function createScenarioServerAndAgent(
  existingServer: AgentServer | null = null,
  desiredPort: number = 3000,
  pluginNames: string[] = [
    '@elizaos/plugin-sql',
    '@elizaos/plugin-openai',
    '@elizaos/plugin-bootstrap',
  ],
  agentName: string = 'scenario-agent'
): Promise<{
  server: AgentServer;
  runtime: IAgentRuntime;
  agentId: UUID;
  port: number;
  createdServer: boolean;
}> {
  // Step 1: Create/configure the server
  const { server, port, createdServer } = await createScenarioServer(existingServer, desiredPort);

  // Step 2: Create the agent on the server
  const { runtime, agentId } = await createScenarioAgent(server, agentName, pluginNames);

  return { server, runtime, agentId, port, createdServer };
}

/**
 * Properly shutdown an AgentServer instance
 */
export async function shutdownScenarioServer(server: AgentServer, port: number): Promise<void> {
  try {
    // Stop the server
    if (server && typeof server.stop === 'function') {
      await server.stop();
    }

    // Unregister from process manager
    const runId = `agent-server-${port}`;
    processManager.unregisterProcess(runId);
  } catch {
    // Force terminate the process if graceful shutdown failed
    if (processManager.isProcessRunning(process.pid)) {
      const runId = `agent-server-${port}`;
      processManager.terminateProcess(runId);
    }
  }
}

/**
 * Ask an already running agent to respond to input.
 * @param server - The AgentServer instance
 * @param agentId - UUID of the agent
 * @param input - User input message
 * @param timeoutMs - Timeout in milliseconds (default: 60000)
 * @param serverPort - Server port (optional)
 * @param existingChannelId - Optional channel ID to reuse for multi-turn conversations
 * @returns Promise with agent response and channel/room ID
 */
export async function askAgentViaApi(
  _server: AgentServer,
  agentId: UUID,
  input: string,
  timeoutMs: number = 60000,
  serverPort?: number | null,
  existingChannelId?: UUID
): Promise<{ response: string; roomId: UUID }> {
  try {
    // Use provided port or get from environment, fallback to 3000
    const port =
      serverPort ??
      (process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : undefined) ??
      3000;
    const client = ElizaClient.create({ baseUrl: `http://localhost:${port}` });

    const { messageServers } = await client.messaging.listMessageServers();
    if (messageServers.length === 0) throw new Error('No servers found');
    const defaultMessageServer = messageServers[0];

    const testUserId = stringToUuidCore('11111111-1111-1111-1111-111111111111');

    let channel;
    if (existingChannelId) {
      try {
        channel = { id: existingChannelId };

        const channelDetailsResponse = await fetch(
          `http://localhost:${port}/api/messaging/central-channels/${existingChannelId}/details`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (!channelDetailsResponse.ok) {
          throw new Error(`Channel validation failed: ${channelDetailsResponse.status}`);
        }

        const channelDetails = await channelDetailsResponse.json();
        channel = channelDetails.data;
      } catch {
        channel = null;
      }
    }

    if (!channel) {
      const channelResponse = await fetch(
        `http://localhost:${port}/api/messaging/central-channels`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'scenario-test-channel',
            message_server_id: defaultMessageServer.id,
            participantCentralUserIds: [testUserId],
            type: ChannelType.GROUP,
```