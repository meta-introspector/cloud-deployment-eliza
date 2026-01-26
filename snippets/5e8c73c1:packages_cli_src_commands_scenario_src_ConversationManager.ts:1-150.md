# 5e8c73c1:packages_cli_src_commands_scenario_src_ConversationManager.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/ConversationManager.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
// File: packages/cli/src/commands/scenario/src/ConversationManager.ts
// Orchestrates multi-turn conversations with user simulation and evaluation

import { IAgentRuntime, UUID, ModelType } from '@elizaos/core';
import { AgentServer } from '@elizaos/server';
import { askAgentViaApi } from './runtime-factory';
import { UserSimulator } from './UserSimulator';
import { EvaluationEngine } from './EvaluationEngine';
import {
  ConversationConfig,
  ConversationResult,
  ConversationTurn,
  TerminationCondition,
  SimulationContext,
} from './conversation-types';
import { TrajectoryReconstructor } from './TrajectoryReconstructor';
import { EnhancedEvaluationResult, Evaluation } from './schema';

/**
 * ConversationManager orchestrates multi-turn conversations between agents and simulated users
 * Handles turn execution, termination conditions, and evaluation
 */
export class ConversationManager {
  private runtime: IAgentRuntime;
  private server: AgentServer;
  private agentId: UUID;
  private serverPort: number;
  private conversationChannelId: UUID | null = null; // NEW: Track conversation channel
  private userSimulator: UserSimulator | null = null;
  private evaluationEngine: EvaluationEngine;
  private trajectoryReconstructor: TrajectoryReconstructor;

  constructor(
    runtime: IAgentRuntime,
    server: AgentServer,
    agentId: UUID,
    serverPort: number,
    trajectoryReconstructor: TrajectoryReconstructor
  ) {
    this.runtime = runtime;
    this.server = server;
    this.agentId = agentId;
    this.serverPort = serverPort;
    this.evaluationEngine = new EvaluationEngine(runtime);
    this.trajectoryReconstructor = trajectoryReconstructor;
  }

  /**
   * Create a conversation channel for multi-turn conversation
   * @private
   */
  private async createConversationChannel(): Promise<UUID> {
    console.log(`🗣️  [ConversationManager] Creating conversation channel...`);

    // Create channel directly without sending messages to avoid timeout issues
    const channelId = await this.createChannelDirectly();

    this.conversationChannelId = channelId;
    console.log(`🗣️  [ConversationManager] ✅ Created conversation channel: ${channelId}`);
    return channelId;
  }

  /**
   * Create a channel directly without sending messages
   * @private
   */
  private async createChannelDirectly(): Promise<UUID> {
    const { ElizaClient } = await import('@elizaos/api-client');
    const { ChannelType, stringToUuid: stringToUuidCore } = await import('@elizaos/core');

    const port = this.serverPort;
    const client = new ElizaClient({ baseUrl: `http://localhost:${port}` });

    // Get default server
    const messageServers = await client.messaging.listMessageServers();
    const defaultMessageServer = messageServers.messageServers.find(
      (s: { name: string }) => s.name === 'Default Message Server'
    );
    if (!defaultMessageServer) throw new Error('Default message server not found');

    // Create test user ID
    const testUserId = stringToUuidCore('11111111-1111-1111-1111-111111111111');

    // Create channel via API
    const channelResponse = await fetch(`http://localhost:${port}/api/messaging/central-channels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'scenario-conversation-channel',
        message_server_id: defaultMessageServer.id,
        participantCentralUserIds: [testUserId],
        type: ChannelType.GROUP,
        metadata: { scenario: true, conversation: true },
      }),
    });

    if (!channelResponse.ok) {
      throw new Error(`Channel creation failed: ${channelResponse.status}`);
    }

    const channelResult = await channelResponse.json();
    const channel = channelResult.data;

    // Add agent to channel
    await client.messaging.addAgentToChannel(channel.id, this.agentId as UUID);
    console.log(`🗣️  [ConversationManager] Agent added to channel: ${channel.id}`);

    return channel.id;
  }

  /**
   * Cleanup conversation channel at end of conversation
   * @private
   */
  private async cleanupConversationChannel(): Promise<void> {
    if (this.conversationChannelId) {
      console.log(
        `🗣️  [ConversationManager] Cleaning up conversation channel: ${this.conversationChannelId}`
      );
      // Channel cleanup will be handled by server/agent lifecycle
      this.conversationChannelId = null;
    }
  }

  /**
   * Execute a complete conversation scenario
   * @param initialInput - The first user message to start the conversation
   * @param config - Complete conversation configuration
   * @returns Detailed conversation result with all turns and evaluations
   */
  async executeConversation(
    initialInput: string,
    config: ConversationConfig
  ): Promise<ConversationResult> {
    const startTime = Date.now();
    const turns: ConversationTurn[] = [];
    let currentInput = initialInput;

    console.log(`🗣️  [ConversationManager] Starting conversation: max_turns=${config.max_turns}`);
    console.log(`🗣️  [ConversationManager] User persona: ${config.user_simulator.persona}`);
    console.log(`🗣️  [ConversationManager] User objective: ${config.user_simulator.objective}`);

    try {
      // NEW: Create conversation channel at start
      await this.createConversationChannel();

      // Initialize user simulator
      this.userSimulator = new UserSimulator(this.runtime, config.user_simulator);

      // Execute conversation turns
```