# e5b94879:packages_api-client_src___tests___services_sessions.test.ts:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/api-client/src/__tests__/services/sessions.test.ts:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { SessionsService } from '../../services/sessions';
import type { ApiClientConfig } from '../../types/base';

const mockFetch = mock();
global.fetch = mockFetch as unknown as typeof fetch;

describe('SessionsService', () => {
  let service: SessionsService;
  const config: ApiClientConfig = {
    baseUrl: 'http://localhost:3000',
    apiKey: 'test-key',
  };

  beforeEach(() => {
    service = new SessionsService(config);
    mockFetch.mockReset();
  });

  describe('checkHealth', () => {
    it('should get health status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: {
            status: 'healthy',
            activeSessions: 5,
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        }),
      });

      const result = await service.checkHealth();

      expect(result).toEqual({
        status: 'healthy',
        activeSessions: 5,
        timestamp: '2024-01-01T00:00:00.000Z',
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messaging/sessions/health',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'X-API-KEY': 'test-key',
          }),
        })
      );
    });
  });

  describe('createSession', () => {
    it('should create a new session', async () => {
      const params = {
        agentId: 'agent-123',
        userId: 'user-456',
        metadata: { platform: 'web' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: {
            sessionId: 'session-789',
            agentId: 'agent-123',
            userId: 'user-456',
            createdAt: '2024-01-01T00:00:00.000Z',
            metadata: { platform: 'web' },
          },
        }),
      });

      const result = await service.createSession(params);

      expect(result.sessionId).toBe('session-789');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messaging/sessions',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(params),
        })
      );
    });
  });

  describe('sendMessage', () => {
    it('should send a message in a session (websocket mode by default)', async () => {
      const sessionId = 'session-789';
      const params = {
        content: 'Hello, agent!',
        attachments: [
          { type: 'image' as const, url: 'https://example.com/image.jpg', name: 'image.jpg' },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name: string) => (name === 'content-length' ? '100' : null),
        },
        json: async () => ({
          success: true,
          data: {
            success: true,
            userMessage: {
              id: 'msg-123',
              content: 'Hello, agent!',
              authorId: 'user-456',
              createdAt: '2024-01-01T00:00:00.000Z',
            },
            sessionStatus: {
              expiresAt: '2024-01-01T00:30:00.000Z',
              renewalCount: 0,
              wasRenewed: false,
              isNearExpiration: false,
            },
          },
        }),
      });

      const result = await service.sendMessage(sessionId, params);

      expect(result.success).toBe(true);
      expect(result.userMessage.id).toBe('msg-123');
      expect(result.userMessage.content).toBe('Hello, agent!');
      expect(result.sessionStatus?.isNearExpiration).toBe(false);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/messaging/sessions/session-789/messages',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(params),
        })
      );
    });

    it('should send a message with http transport and get agent response', async () => {
      const sessionId = 'session-789';
      const params = {
        content: 'Hello, agent!',
```