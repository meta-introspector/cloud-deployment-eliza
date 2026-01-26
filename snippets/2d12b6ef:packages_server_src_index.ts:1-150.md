# 2d12b6ef:packages_server_src_index.ts:1-150

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/index.ts:1-150
**Novelty Score:** 35.43
**Concepts:** testing

```
import {
  type Character,
  DatabaseAdapter,
  type IAgentRuntime,
  logger,
  type UUID,
  getGeneratedDir,
  getUploadsAgentsDir,
  ElizaOS,
} from '@elizaos/core';
import cors from 'cors';
import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as fs from 'node:fs';
import { existsSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import net from 'node:net';
import path, { basename, dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server as SocketIOServer } from 'socket.io';
import { createApiRouter, createPluginRouteHandler, setupSocketIO } from './api/index';
import { apiKeyAuthMiddleware } from './middleware/index';
import {
  messageBusConnectorPlugin,
  setGlobalElizaOS,
  setGlobalAgentServer,
} from './services/message';
import { loadCharacterTryPath, jsonToCharacter } from './services/loader';
import * as Sentry from '@sentry/node';
import sqlPlugin, {
  createDatabaseAdapter,
  DatabaseMigrationService,
  installRLSFunctions,
  getOrCreateRlsServer,
  setServerContext,
  assignAgentToServer,
  uninstallRLS,
} from '@elizaos/plugin-sql';
import { stringToUuid, type Plugin } from '@elizaos/core';
import { sql } from 'drizzle-orm';

import type { CentralRootMessage, MessageChannel, MessageServer } from './types/server';

// Re-export config utilities for backward compatibility
export {
  DEFAULT_SERVER_ID,
  expandTildePath,
  resolvePgliteDir,
  isWebUIEnabled,
  type ServerMiddleware,
  type ServerConfig,
} from './utils/config';

// Import for internal use
import {
  DEFAULT_SERVER_ID,
  isWebUIEnabled,
  resolvePgliteDir,
  type ServerConfig,
  type ServerMiddleware,
} from './utils/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Type for database adapter with messaging methods
 * These methods are provided by BaseDrizzleAdapter implementations
 * Signatures match BaseDrizzleAdapter in @elizaos/plugin-sql
 */
type DatabaseAdapterWithMessaging = DatabaseAdapter & {
  createMessageServer(data: {
    id?: UUID;
    name: string;
    sourceType: string;
    sourceId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<MessageServer>;
  getMessageServers(): Promise<MessageServer[]>;
  getMessageServerById(serverId: UUID): Promise<MessageServer | null>;
  getMessageServerByRlsServerId(rlsServerId: UUID): Promise<MessageServer | null>;
  createChannel(
    data: {
      id?: UUID;
      messageServerId: UUID;
      name: string;
      type: string;
      sourceType?: string;
      sourceId?: string;
      topic?: string;
      metadata?: Record<string, unknown>;
    },
    participantIds?: UUID[]
  ): Promise<MessageChannel>;
  addChannelParticipants(channelId: UUID, userIds: UUID[]): Promise<void>;
  getChannelsForMessageServer(messageServerId: UUID): Promise<MessageChannel[]>;
  getChannelDetails(channelId: UUID): Promise<MessageChannel | null>;
  getChannelParticipants(channelId: UUID): Promise<UUID[]>;
  isChannelParticipant(channelId: UUID, entityId: UUID): Promise<boolean>;
  deleteMessage(messageId: UUID): Promise<void>;
  updateChannel(
    channelId: UUID,
    updates: {
      name?: string;
      participantCentralUserIds?: UUID[];
      metadata?: Record<string, unknown>;
    }
  ): Promise<MessageChannel>;
  deleteChannel(channelId: UUID): Promise<void>;
  getMessagesForChannel(
    channelId: UUID,
    limit?: number,
    beforeTimestamp?: Date
  ): Promise<CentralRootMessage[]>;
  findOrCreateDmChannel(
    user1Id: UUID,
    user2Id: UUID,
    messageServerId: UUID
  ): Promise<MessageChannel>;
  createMessage(data: {
    messageId?: UUID;
    channelId: UUID;
    authorId: UUID;
    content: string;
    rawMessage?: Record<string, unknown>;
    sourceType?: string;
    sourceId?: string;
    metadata?: Record<string, unknown>;
    inReplyToRootMessageId?: UUID;
  }): Promise<CentralRootMessage>;
  updateMessage(
    messageId: UUID,
    patch: {
      content?: string;
      rawMessage?: Record<string, unknown>;
      sourceType?: string;
      sourceId?: string;
      metadata?: Record<string, unknown>;
      inReplyToRootMessageId?: UUID;
    }
  ): Promise<CentralRootMessage | null>;
  addAgentToMessageServer(messageServerId: UUID, agentId: UUID): Promise<void>;
  removeAgentFromMessageServer(messageServerId: UUID, agentId: UUID): Promise<void>;
  getAgentsForMessageServer(messageServerId: UUID): Promise<UUID[]>;
  getDatabase?(): unknown;
  db: { execute: (query: unknown) => Promise<unknown> };
};

/**
```