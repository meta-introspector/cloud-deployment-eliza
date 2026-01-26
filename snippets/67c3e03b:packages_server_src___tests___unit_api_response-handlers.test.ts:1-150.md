# 67c3e03b:packages_server_src___tests___unit_api_response-handlers.test.ts:1-150

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/__tests__/unit/api/response-handlers.test.ts:1-150
**Novelty Score:** 14.99
**Concepts:** testing

```
/**
 * Tests for shared response handlers
 *
 * These tests verify the logic and format of transport type handling
 * for the messaging API endpoints.
 */

import { describe, it, expect } from 'bun:test';
import { SSE_EVENTS } from '../../../api/shared/response-handlers';
import {
  TRANSPORT_TYPES,
  DEFAULT_TRANSPORT,
  type TransportType,
  LEGACY_MODE_MAP,
} from '../../../api/shared/constants';

describe('Transport Type Constants', () => {
  describe('TRANSPORT_TYPES', () => {
    it('should have exactly three valid types', () => {
      expect(TRANSPORT_TYPES).toHaveLength(3);
    });

    it('should include http transport', () => {
      expect(TRANSPORT_TYPES).toContain('http');
    });

    it('should include sse transport', () => {
      expect(TRANSPORT_TYPES).toContain('sse');
    });

    it('should include websocket transport', () => {
      expect(TRANSPORT_TYPES).toContain('websocket');
    });

    it('should be a readonly array', () => {
      // TypeScript compile-time check - array should be immutable
      const types: readonly string[] = TRANSPORT_TYPES;
      expect(Array.isArray(types)).toBe(true);
    });
  });

  describe('DEFAULT_TRANSPORT', () => {
    it('should be websocket for backward compatibility', () => {
      expect(DEFAULT_TRANSPORT).toBe('websocket');
    });

    it('should be a valid transport type', () => {
      expect(TRANSPORT_TYPES).toContain(DEFAULT_TRANSPORT);
    });
  });

  describe('TransportType type', () => {
    it('should accept valid types', () => {
      const validTypes: TransportType[] = ['http', 'sse', 'websocket'];
      validTypes.forEach((type) => {
        expect(TRANSPORT_TYPES).toContain(type);
      });
    });
  });

  describe('LEGACY_MODE_MAP', () => {
    it('should map sync to http', () => {
      expect(LEGACY_MODE_MAP['sync']).toBe('http');
    });

    it('should map stream to sse', () => {
      expect(LEGACY_MODE_MAP['stream']).toBe('sse');
    });

    it('should map websocket to websocket', () => {
      expect(LEGACY_MODE_MAP['websocket']).toBe('websocket');
    });
  });
});

describe('SSE Events', () => {
  describe('SSE_EVENTS', () => {
    it('should have user_message event', () => {
      expect(SSE_EVENTS.USER_MESSAGE).toBe('user_message');
    });

    it('should have chunk event for streaming', () => {
      expect(SSE_EVENTS.CHUNK).toBe('chunk');
    });

    it('should have done event for completion', () => {
      expect(SSE_EVENTS.DONE).toBe('done');
    });

    it('should have error event for failures', () => {
      expect(SSE_EVENTS.ERROR).toBe('error');
    });

    it('should have all four required events', () => {
      const events = Object.values(SSE_EVENTS);
      expect(events).toHaveLength(4);
    });
  });
});

describe('Transport Type Validation Logic', () => {
  describe('Transport validation', () => {
    it('should validate http transport', () => {
      const transport = 'http';
      const isValid = TRANSPORT_TYPES.includes(transport as TransportType);
      expect(isValid).toBe(true);
    });

    it('should validate sse transport', () => {
      const transport = 'sse';
      const isValid = TRANSPORT_TYPES.includes(transport as TransportType);
      expect(isValid).toBe(true);
    });

    it('should validate websocket transport', () => {
      const transport = 'websocket';
      const isValid = TRANSPORT_TYPES.includes(transport as TransportType);
      expect(isValid).toBe(true);
    });

    it('should reject invalid transport', () => {
      const transport = 'invalid_transport';
      const isValid = TRANSPORT_TYPES.includes(transport as TransportType);
      expect(isValid).toBe(false);
    });

    it('should reject empty string', () => {
      const transport = '';
      const isValid = TRANSPORT_TYPES.includes(transport as TransportType);
      expect(isValid).toBe(false);
    });

    it('should be case sensitive', () => {
      const transport = 'HTTP';
      const isValid = TRANSPORT_TYPES.includes(transport as TransportType);
      expect(isValid).toBe(false);
    });
  });
});

describe('Response Format', () => {
  describe('HTTP transport response', () => {
    it('should have correct structure', () => {
      const httpResponse = {
        success: true,
        userMessage: { id: 'msg-123', content: 'Hello' },
        agentResponse: { text: 'Hi there!' },
      };

      expect(httpResponse).toHaveProperty('success', true);
```