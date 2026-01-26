# dd338745:packages_core_src___tests___runtime-streaming.test.ts:1-150

**Commit:** dd338745cb075f0766fb7dc04df0f2cb018bd06e
**Author:** standujar
**Date:** Tue Dec 16 02:41:08 2025 +0100
**File:** packages/core/src/__tests__/runtime-streaming.test.ts:1-150
**Novelty Score:** 18.06
**Concepts:** rag-system, testing

```
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { AgentRuntime } from '../runtime';
import { ModelType, type TextStreamResult } from '../types/model';
import type { Character } from '../types';
import { stringToUuid } from '../utils';
import {
  runWithStreamingContext,
  setStreamingContextManager,
  getStreamingContextManager,
  type StreamingContext,
  type IStreamingContextManager,
} from '../streaming-context';
import { createNodeStreamingContextManager } from '../streaming-context.node';
import { createMockAdapter } from './test-helpers';

describe('useModel Streaming', () => {
  let runtime: AgentRuntime;
  let originalManager: IStreamingContextManager;

  const mockCharacter: Character = {
    id: stringToUuid('test-streaming'),
    name: 'StreamBot',
    bio: 'A bot for testing streaming',
  };

  // Helper to create a mock TextStreamResult
  function createMockTextStreamResult(chunks: string[]): TextStreamResult {
    let index = 0;
    return {
      textStream: {
        [Symbol.asyncIterator]: () => ({
          next: async () => {
            if (index < chunks.length) {
              return { value: chunks[index++], done: false };
            }
            return { value: undefined, done: true };
          },
        }),
      } as AsyncIterable<string>,
      text: Promise.resolve(chunks.join('')),
      usage: Promise.resolve({ promptTokens: 10, completionTokens: 20, totalTokens: 30 }),
      finishReason: Promise.resolve('stop' as const),
    };
  }

  beforeEach(() => {
    originalManager = getStreamingContextManager();
    setStreamingContextManager(createNodeStreamingContextManager());

    runtime = new AgentRuntime({
      agentId: stringToUuid('test-streaming-agent'),
      character: mockCharacter,
      adapter: createMockAdapter(),
    });
  });

  afterEach(() => {
    setStreamingContextManager(originalManager);
  });

  describe('onStreamChunk callback in params', () => {
    it('should call onStreamChunk for each chunk when handler returns TextStreamResult', async () => {
      const chunks: string[] = [];
      const mockChunks = ['Hello', ' ', 'World', '!'];

      // Register a mock handler that returns TextStreamResult when stream: true
      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        if ((params as any).stream) {
          return createMockTextStreamResult(mockChunks);
        }
        return mockChunks.join('');
      }, 'test-provider');

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: 'Test prompt',
        onStreamChunk: (chunk: string) => {
          chunks.push(chunk);
        },
      });

      expect(result).toBe('Hello World!');
      expect(chunks).toEqual(mockChunks);
    });

    it('should return full text even when streaming', async () => {
      const mockChunks = ['Part1', 'Part2', 'Part3'];

      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        if ((params as any).stream) {
          return createMockTextStreamResult(mockChunks);
        }
        return mockChunks.join('');
      }, 'test-provider');

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: 'Test',
        onStreamChunk: () => {},
      });

      expect(result).toBe('Part1Part2Part3');
    });

    it('should not stream when no callback is provided', async () => {
      let streamRequested = false;

      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        streamRequested = (params as any).stream === true;
        return 'Non-streamed result';
      }, 'test-provider');

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: 'Test',
      });

      expect(result).toBe('Non-streamed result');
      expect(streamRequested).toBe(false);
    });
  });

  describe('stream: false forces non-streaming', () => {
    it('should not stream when stream: false even with onStreamChunk', async () => {
      let streamRequested = false;
      const chunks: string[] = [];

      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        streamRequested = (params as any).stream === true;
        return 'Non-streamed result';
      }, 'test-provider');

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: 'Test',
        stream: false,
        onStreamChunk: (chunk: string) => {
          chunks.push(chunk);
        },
      });

      expect(result).toBe('Non-streamed result');
      expect(streamRequested).toBe(false);
      expect(chunks).toEqual([]); // No chunks received
    });

    it('should not stream when stream: false even with context callback', async () => {
      let streamRequested = false;
      const contextChunks: string[] = [];

      runtime.registerModel(ModelType.TEXT_LARGE, async (_rt, params) => {
        streamRequested = (params as any).stream === true;
        return 'Non-streamed result';
      }, 'test-provider');
```