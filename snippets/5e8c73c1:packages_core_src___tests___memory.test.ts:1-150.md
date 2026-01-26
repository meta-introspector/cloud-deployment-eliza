# 5e8c73c1:packages_core_src___tests___memory.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/memory.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { describe, it, expect } from 'bun:test';
import {
  createMessageMemory,
  isDocumentMetadata,
  isFragmentMetadata,
  isMessageMetadata,
  isDescriptionMetadata,
  isCustomMetadata,
  isDocumentMemory,
  isFragmentMemory,
  getMemoryText,
} from '../memory';
import {
  MemoryType,
  type Memory,
  type DocumentMetadata,
  type FragmentMetadata,
  type MessageMetadata,
  type DescriptionMetadata,
  type CustomMetadata,
  type UUID,
  type Content,
} from '../types';

describe('Memory Utilities', () => {
  const mockEntityId = '123e4567-e89b-12d3-a456-426614174000' as UUID;
  const mockRoomId = '123e4567-e89b-12d3-a456-426614174001' as UUID;
  const mockAgentId = '123e4567-e89b-12d3-a456-426614174002' as UUID;

  describe('createMessageMemory', () => {
    it('should create a message memory with required fields', () => {
      const memory = createMessageMemory({
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Hello, world!' },
      });

      expect(memory.entityId).toBe(mockEntityId);
      expect(memory.roomId).toBe(mockRoomId);
      expect(memory.content.text).toBe('Hello, world!');
      expect(memory.metadata.type).toBe(MemoryType.MESSAGE);
      expect(memory.metadata.timestamp).toBeDefined();
      expect(memory.createdAt).toBeDefined();
    });

    it('should set scope to private when agentId is provided', () => {
      const memory = createMessageMemory({
        entityId: mockEntityId,
        roomId: mockRoomId,
        agentId: mockAgentId,
        content: { text: 'Private message' },
      });

      expect(memory.metadata.scope).toBe('private');
    });

    it('should set scope to shared when agentId is not provided', () => {
      const memory = createMessageMemory({
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Shared message' },
      });

      expect(memory.metadata.scope).toBe('shared');
    });

    it('should include embedding if provided', () => {
      const embedding = [0.1, 0.2, 0.3];
      const memory = createMessageMemory({
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Message with embedding' },
        embedding,
      });

      expect(memory.embedding).toEqual(embedding);
    });

    it('should use provided id if given', () => {
      const customId = '123e4567-e89b-12d3-a456-426614174003' as UUID;
      const memory = createMessageMemory({
        id: customId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Message with custom id' },
      });

      expect(memory.id).toBe(customId);
    });
  });

  describe('isDocumentMetadata', () => {
    it('should return true for document metadata', () => {
      const metadata: DocumentMetadata = {
        type: MemoryType.DOCUMENT,
        timestamp: Date.now(),
      };
      expect(isDocumentMetadata(metadata)).toBe(true);
    });

    it('should return false for non-document metadata', () => {
      const metadata: MessageMetadata = {
        type: MemoryType.MESSAGE,
        timestamp: Date.now(),
        scope: 'shared',
      };
      expect(isDocumentMetadata(metadata)).toBe(false);
    });
  });

  describe('isFragmentMetadata', () => {
    it('should return true for fragment metadata', () => {
      const metadata: FragmentMetadata = {
        type: MemoryType.FRAGMENT,
        timestamp: Date.now(),
      };
      expect(isFragmentMetadata(metadata)).toBe(true);
    });

    it('should return false for non-fragment metadata', () => {
      const metadata: MessageMetadata = {
        type: MemoryType.MESSAGE,
        timestamp: Date.now(),
        scope: 'shared',
      };
      expect(isFragmentMetadata(metadata)).toBe(false);
    });
  });

  describe('isMessageMetadata', () => {
    it('should return true for message metadata', () => {
      const metadata: MessageMetadata = {
        type: MemoryType.MESSAGE,
        timestamp: Date.now(),
        scope: 'shared',
      };
      expect(isMessageMetadata(metadata)).toBe(true);
    });

    it('should return false for non-message metadata', () => {
      const metadata: DocumentMetadata = {
        type: MemoryType.DOCUMENT,
        timestamp: Date.now(),
      };
      expect(isMessageMetadata(metadata)).toBe(false);
    });
  });

  describe('isDescriptionMetadata', () => {
    it('should return true for description metadata', () => {
```