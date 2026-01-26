# 5e8c73c1:packages_server_src___tests___unit_api_channels-mode.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/api/channels-mode.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Test suite for Channels API response mode parameter
 */

import { describe, it, expect, beforeEach, mock } from 'bun:test';
import express from 'express';
import { createChannelsRouter } from '../../../api/messaging/channels';
import type { UUID, ElizaOS } from '@elizaos/core';
import type { AgentServer } from '../../../index';

/**
 * Type for handleMessage mock function
 */
type HandleMessageFn = (
  agentId: UUID,
  message: unknown,
  options?: {
    onStreamChunk?: (chunk: string, messageId: UUID) => Promise<void>;
    onResponse?: (content: unknown) => Promise<void>;
    onError?: (error: Error) => Promise<void>;
  }
) => Promise<{ processing?: { responseContent?: { text: string } } }>;

// Create mock functions using Bun's mock()
const mockGetAgent = mock(() => null);
const mockHandleMessage = mock<HandleMessageFn>(() =>
  Promise.resolve({
    processing: {
      responseContent: { text: 'Agent response' },
    },
  })
);

const mockGetChannelDetails = mock(() =>
  Promise.resolve({
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Channel',
    type: 'dm',
  })
);

const mockGetServers = mock(() =>
  Promise.resolve([{ id: '00000000-0000-0000-0000-000000000001' }])
);

const mockCreateMessage = mock(() =>
  Promise.resolve({
    id: 'msg-123',
    channelId: '123e4567-e89b-12d3-a456-426614174000',
    content: 'Test message',
    authorId: '456e7890-e89b-12d3-a456-426614174000',
    createdAt: new Date(),
    sourceType: 'eliza_gui',
    metadata: {},
  })
);

const mockGetChannelParticipants = mock(() =>
  Promise.resolve([
    '456e7890-e89b-12d3-a456-426614174000', // user
    '789e1234-e89b-12d3-a456-426614174000', // agent
  ])
);

const mockCreateChannel = mock(() =>
  Promise.resolve({
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Channel',
    type: 'dm',
  })
);

// Mock ElizaOS
const mockElizaOS = {
  getAgent: mockGetAgent,
  handleMessage: mockHandleMessage,
} as unknown as ElizaOS;

// Mock AgentServer
const mockServerInstance = {
  messageServerId: '00000000-0000-0000-0000-000000000001' as UUID,
  socketIO: null,
  getChannelDetails: mockGetChannelDetails,
  getServers: mockGetServers,
  createMessage: mockCreateMessage,
  getChannelParticipants: mockGetChannelParticipants,
  createChannel: mockCreateChannel,
} as unknown as AgentServer;

// Helper to simulate Express request/response
async function simulateRequest(
  app: express.Application,
  method: string,
  path: string,
  body?: unknown
): Promise<{ status: number; body: unknown; headers: Record<string, string> }> {
  return new Promise((resolve) => {
    let responseStatus = 200;
    let responseBody: unknown = null;
    let responseSent = false;
    const responseHeaders: Record<string, string> = {};

    const req = {
      method: method.toUpperCase(),
      url: path,
      path,
      originalUrl: path,
      baseUrl: '',
      body: body || {},
      query: {},
      params: {},
      headers: {
        'content-type': 'application/json',
      },
      get(header: string) {
        return this.headers[header.toLowerCase()];
      },
      header(header: string) {
        return this.headers[header.toLowerCase()];
      },
      accepts() {
        return 'application/json';
      },
      is(type: string) {
        return type === 'application/json';
      },
    };

    const res = {
      statusCode: 200,
      headers: {},
      locals: {},
      headersSent: false,
      status(code: number) {
        if (!responseSent) {
          responseStatus = code;
          this.statusCode = code;
        }
        return this;
      },
      json(data: unknown) {
        if (!responseSent) {
          responseSent = true;
          responseBody = data;
          resolve({ status: responseStatus, body: data, headers: responseHeaders });
        }
        return this;
      },
      send(data: unknown) {
        if (!responseSent) {
```