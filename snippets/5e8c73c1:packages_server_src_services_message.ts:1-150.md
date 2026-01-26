# 5e8c73c1:packages_server_src_services_message.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/services/message.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import {
  ChannelType,
  ContentType,
  Service,
  createUniqueUuid,
  logger,
  validateUuid,
  type Content,
  type IAgentRuntime,
  type Plugin,
  type UUID,
  ElizaOS,
} from '@elizaos/core';
import type { AgentServer } from '../index.js';
import type {
  ServerAgentUpdatePayload,
  MessageDeletedPayload,
  ChannelClearedPayload,
  MessageServiceStructure,
} from '../types/server';
import internalMessageBus from './message-bus';

/**
 * Global ElizaOS instance for MessageBusService
 * Set by AgentServer during initialization
 */
let globalElizaOS: ElizaOS | null = null;

/**
 * Global AgentServer instance for MessageBusService
 * Set by AgentServer during initialization
 */
let globalAgentServer: AgentServer | null = null;

/**
 * Set the global ElizaOS instance
 * Should be called by AgentServer during initialization
 */
export function setGlobalElizaOS(elizaOS: ElizaOS): void {
  globalElizaOS = elizaOS;
  logger.info({ src: 'service:message-bus' }, 'Global ElizaOS instance set');
}

/**
 * Set the global AgentServer instance
 * Should be called by AgentServer during initialization
 */
export function setGlobalAgentServer(agentServer: AgentServer): void {
  globalAgentServer = agentServer;
  logger.info({ src: 'service:message-bus' }, 'Global AgentServer instance set');
}

/**
 * Get the global ElizaOS instance
 */
function getGlobalElizaOS(): ElizaOS {
  if (!globalElizaOS) {
    throw new Error(
      'ElizaOS not initialized. Call setGlobalElizaOS() before using MessageBusService.'
    );
  }
  return globalElizaOS;
}

/**
 * Get the global AgentServer instance
 */
function getGlobalAgentServer(): AgentServer {
  if (!globalAgentServer) {
    throw new Error(
      'AgentServer not initialized. Call setGlobalAgentServer() before using MessageBusService.'
    );
  }
  return globalAgentServer;
}

// Re-export for backward compatibility
export type MessageServiceMessage = MessageServiceStructure;

export class MessageBusService extends Service {
  static serviceType = 'message-bus-service';
  capabilityDescription = 'Manages connection and message synchronization with the message server.';

  private boundHandleIncomingMessage: (data: unknown) => void;
  private boundHandleServerAgentUpdate: (data: ServerAgentUpdatePayload) => Promise<void>;
  private boundHandleMessageDeleted: (data: MessageDeletedPayload) => Promise<void>;
  private boundHandleChannelCleared: (data: ChannelClearedPayload) => Promise<void>;
  private subscribedMessageServers: Set<UUID> = new Set();
  private serverInstance: AgentServer;

  constructor(runtime: IAgentRuntime) {
    super(runtime);
    this.serverInstance = getGlobalAgentServer();
    this.boundHandleIncomingMessage = (data: unknown) => {
      this.handleIncomingMessage(data).catch((error) => {
        logger.error(
          {
            src: 'service:message-bus',
            agentName: this.runtime.character.name,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error handling incoming message'
        );
      });
    };
    this.boundHandleServerAgentUpdate = this.handleServerAgentUpdate.bind(this);
    this.boundHandleMessageDeleted = this.handleMessageDeleted.bind(this);
    this.boundHandleChannelCleared = this.handleChannelCleared.bind(this);
    // Don't connect here - let start() handle it
  }

  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new MessageBusService(runtime);
    await service.connectToMessageBus();
    return service;
  }

  static async stop(runtime: IAgentRuntime): Promise<void> {
    const service = new MessageBusService(runtime);
    await service.stop();
  }

  private async connectToMessageBus() {
    logger.info(
      { src: 'service:message-bus', agentId: this.runtime.agentId },
      'Subscribing to internal message bus'
    );
    internalMessageBus.on('new_message', this.boundHandleIncomingMessage);
    internalMessageBus.on('server_agent_update', this.boundHandleServerAgentUpdate);
    internalMessageBus.on('message_deleted', this.boundHandleMessageDeleted);
    internalMessageBus.on('channel_cleared', this.boundHandleChannelCleared);

    // Initialize by fetching servers this agent belongs to
    await this.fetchAgentMessageServers();
    // Then fetch valid channels for those servers
    await this.fetchValidChannelIds();
  }

  private validChannelIds: Set<UUID> = new Set();

  private async fetchValidChannelIds(): Promise<void> {
    try {
      const serverApiUrl = this.getCentralMessageServerUrl();

      // Clear existing channel IDs before fetching new ones
      this.validChannelIds.clear();
      const messageServersToCheck = new Set(this.subscribedMessageServers);
      messageServersToCheck.add(this.serverInstance.messageServerId);

      // Fetch channels for each subscribed server
```