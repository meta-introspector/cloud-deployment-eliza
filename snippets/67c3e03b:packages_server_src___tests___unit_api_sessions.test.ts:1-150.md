# 67c3e03b:packages_server_src___tests___unit_api_sessions.test.ts:1-150

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/__tests__/unit/api/sessions.test.ts:1-150
**Novelty Score:** 14.99
**Concepts:** testing

```
/**
 * Test suite for Sessions API with configurable timeout features
 */

import { describe, it, expect, beforeEach, afterEach, jest } from 'bun:test';
import express from 'express';
import { createSessionsRouter, type SessionRouter } from '../../../api/messaging/sessions';
import type { IAgentRuntime, UUID, ElizaOS } from '@elizaos/core';
import type { AgentServer } from '../../../index';
import type { SimplifiedMessage } from '../../../types/sessions';

// Mock dependencies
const mockAgents = new Map<UUID, IAgentRuntime>();
const mockElizaOS = {
  getAgent: jest.fn((id: UUID) => mockAgents.get(id)),
  getAgents: jest.fn(() => Array.from(mockAgents.values())),
} as Partial<ElizaOS> as ElizaOS;
const mockServerInstance = {
  createChannel: jest.fn().mockResolvedValue({
    id: '123e4567-e89b-12d3-a456-426614174000' as UUID,
    name: 'Test Channel',
    type: 'dm',
  }),
  addParticipantsToChannel: jest.fn().mockResolvedValue(undefined),
  createMessage: jest.fn().mockResolvedValue({
    id: 'msg-123',
    content: 'Test message',
    authorId: 'user-123' as UUID,
    createdAt: new Date(),
    metadata: {},
  }),
  getMessagesForChannel: jest.fn().mockResolvedValue([]),
} as Partial<AgentServer> as AgentServer;

// Helper function to validate UUID format
function isValidUuid(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Helper function to create a mock agent
function createMockAgent(agentId: string, settings?: Record<string, any>): IAgentRuntime {
  return {
    agentId: agentId as UUID,
    getSetting: jest.fn((key: string) => {
      // Return the value from settings if it exists
      if (settings && key in settings) {
        return settings[key];
      }
      return undefined;
    }),
    character: {
      name: 'Test Agent',
      id: agentId as UUID,
      settings: settings || {},
      bio: 'Test Agent',
    },
  } as Partial<IAgentRuntime> as IAgentRuntime;
}

// Helper to simulate Express request/response using supertest-like approach
async function simulateRequest(
  app: express.Application,
  method: string,
  path: string,
  body?: any,
  query?: any,
  params?: any
): Promise<{ status: number; body: any }> {
  return new Promise((resolve) => {
    let responseStatus = 200;
    let responseBody: any = null;
    let responseSent = false;

    const req: any = {
      method: method.toUpperCase(),
      url: path,
      path,
      originalUrl: path,
      baseUrl: '',
      body: body || {},
      query: query || {},
      params: params || {},
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

    const res: any = {
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
      json(data: any) {
        if (!responseSent) {
          responseSent = true;
          responseBody = data;
          resolve({ status: responseStatus, body: data });
        }
        return this;
      },
      send(data: any) {
        if (!responseSent) {
          responseSent = true;
          responseBody = data;
          resolve({ status: responseStatus, body: data });
        }
        return this;
      },
      setHeader(name: string, value: string) {
        this.headers[name] = value;
        return this;
      },
      set(name: string, value: string) {
        this.headers[name] = value;
        return this;
      },
      end() {
        if (!responseSent) {
          responseSent = true;
          resolve({ status: responseStatus, body: responseBody });
        }
      },
    };

    // Call the Express app directly with proper error handling
    const next = (err?: any) => {
      if (!responseSent) {
        if (err) {
          responseStatus = err.statusCode || err.status || 500;
          responseBody = {
```