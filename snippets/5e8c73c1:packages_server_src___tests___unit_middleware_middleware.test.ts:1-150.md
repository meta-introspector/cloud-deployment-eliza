# 5e8c73c1:packages_server_src___tests___unit_middleware_middleware.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/middleware/middleware.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Unit tests for middleware functions
 */

import { describe, it, expect, beforeEach, afterEach, jest, spyOn } from 'bun:test';
import express from 'express';
import {
  agentExistsMiddleware,
  validateUuidMiddleware,
  validateChannelIdMiddleware,
  securityMiddleware,
  validateContentTypeMiddleware,
  createApiRateLimit,
  createChannelValidationRateLimit,
} from '../../../middleware';
import { logger } from '@elizaos/core';
import type { IAgentRuntime, UUID, ElizaOS } from '@elizaos/core';

// Mock ElizaOS interface for testing
type MockElizaOS = Pick<ElizaOS, 'getAgent'>;

describe('Middleware Functions', () => {
  let req: Partial<express.Request>;
  let res: Partial<express.Response>;
  let next: express.NextFunction;
  let loggerWarnSpy: ReturnType<typeof spyOn>;

  beforeEach(() => {
    // Spy on logger methods to verify they're called
    loggerWarnSpy = spyOn(logger, 'warn');

    req = {
      params: {},
      ip: '192.168.1.100',
      method: 'GET',
      originalUrl: '/api/test',
      url: '/api/test',
      query: {},
      get: jest.fn(),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      removeHeader: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    // Restore logger.warn spy to prevent test pollution
    loggerWarnSpy?.mockRestore();
  });

  describe('agentExistsMiddleware', () => {
    it('should call next when agent exists', () => {
      const mockRuntime = { id: 'test-runtime' } as Partial<IAgentRuntime> as IAgentRuntime;
      const agentId = '123e4567-e89b-12d3-a456-426614174000';

      // Create mock ElizaOS with getAgent method
      const mockElizaOS: MockElizaOS = {
        getAgent: jest.fn((id: UUID) => {
          return id === agentId ? mockRuntime : undefined;
        }),
      };

      req.params = { agentId };

      const middleware = agentExistsMiddleware(mockElizaOS as Partial<ElizaOS> as ElizaOS);
      middleware(req as express.Request, res as express.Response, next);

      expect(next).toHaveBeenCalled();
      expect((req as any).runtime).toBe(mockRuntime);
      expect((req as any).agentId).toBe(agentId);
    });

    it('should return 400 for invalid agent ID format', () => {
      const mockElizaOS: MockElizaOS = {
        getAgent: jest.fn(),
      };

      req.params = { agentId: 'invalid-id' };

      const middleware = agentExistsMiddleware(mockElizaOS as Partial<ElizaOS> as ElizaOS);
      middleware(req as express.Request, res as express.Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid agent ID format' },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 when agent not found', () => {
      const mockElizaOS: MockElizaOS = {
        getAgent: jest.fn(() => undefined),
      };

      req.params = { agentId: '123e4567-e89b-12d3-a456-426614174000' };

      const middleware = agentExistsMiddleware(mockElizaOS as Partial<ElizaOS> as ElizaOS);
      middleware(req as express.Request, res as express.Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Agent not found' },
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validateUuidMiddleware', () => {
    it('should validate and pass through valid UUID', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      req.params = { testId: validUuid };

      const middleware = validateUuidMiddleware('testId');
      middleware(req as express.Request, res as express.Response, next);

      expect(req.params!.testId).toBe(validUuid);
      expect(next).toHaveBeenCalled();
    });

    it('should reject invalid UUID and log security event', () => {
      req.params = { testId: 'invalid-uuid' };

      const middleware = validateUuidMiddleware('testId');
      middleware(req as express.Request, res as express.Response, next);

      expect(loggerWarnSpy).toHaveBeenCalledWith(
        { src: 'http', ip: '192.168.1.100', paramName: 'testId', paramValue: 'invalid-uuid' },
        'Invalid parameter'
      );
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it('should use enhanced validation for channelId', () => {
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';
      req.params = { channelId: validUuid };

      const middleware = validateUuidMiddleware('channelId');
      middleware(req as express.Request, res as express.Response, next);

      expect(req.params!.channelId).toBe(validUuid);
      expect(next).toHaveBeenCalled();
```