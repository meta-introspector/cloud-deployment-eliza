# a789b1dc:packages_plugin-bootstrap_src___tests___providers.test.ts:1-150

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/providers.test.ts:1-150
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import {
  createMockRuntime,
  createMockMemory,
  createMockState,
  MockRuntime,
  setupActionTest,
} from './test-utils';
import { IAgentRuntime, Memory, State, UUID, ChannelType, Media } from '@elizaos/core';

// Import providers from source modules
import choiceProvider from '../providers/choice';
import { factsProvider } from '../providers/facts';
import { providersProvider } from '../providers/providers';
import { recentMessagesProvider } from '../providers/recentMessages';
import roleProvider from '../providers/roles';
import { settingsProvider } from '../providers/settings';
import { attachmentsProvider } from '../providers/attachments';

describe('Choice Provider', () => {
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;

  beforeEach(() => {
    const setup = setupActionTest({}); // No specific state overrides needed for these tests
    mockRuntime = setup.mockRuntime;
    mockMessage = setup.mockMessage;
    mockState = setup.mockState;

    // Default mock for getTasks
    mockRuntime.getTasks = mock().mockResolvedValue([]);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should list pending tasks with options', async () => {
    const tasks = [
      {
        id: 'task-1' as UUID,
        name: 'Approve Post',
        description: 'A blog post is awaiting approval.',
        roomId: mockMessage.roomId,
        tags: ['AWAITING_CHOICE'],
        metadata: {
          options: ['approve', 'reject', { name: 'edit', description: 'Edit the post' }],
        },
      },
      {
        id: 'task-2' as UUID,
        name: 'Select Image',
        roomId: mockMessage.roomId,
        tags: ['AWAITING_CHOICE'],
        metadata: {
          options: [
            { name: 'imageA.jpg', description: 'A cat' },
            { name: 'imageB.jpg', description: 'A dog' },
          ],
        },
      },
    ];
    mockRuntime.getTasks = mock().mockResolvedValue(tasks);

    const result = await choiceProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data?.tasks).toHaveLength(2);
    expect(result.data?.tasks?.[0]?.name).toBe('Approve Post');
    expect(result.text).toContain('Pending Tasks');
    expect(result.text).toContain('1. **Approve Post**');
    expect(result.text).toContain('A blog post is awaiting approval.');
    expect(result.text).toContain('- `approve`');
    expect(result.text).toContain('- `reject`');
    expect(result.text).toContain('- `edit` - Edit the post');
    expect(result.text).toContain('2. **Select Image**');
    expect(result.text).toContain('- `imageA.jpg` - A cat');
    expect(result.text).toContain('- `imageB.jpg` - A dog');
    expect(result.text).toContain(
      "To select an option, reply with the option name (e.g., 'post' or 'cancel')."
    );
    expect(mockRuntime.getTasks).toHaveBeenCalledWith({
      roomId: mockMessage.roomId,
      tags: ['AWAITING_CHOICE'],
    });
  });

  it('should handle no pending tasks gracefully', async () => {
    mockRuntime.getTasks = mock().mockResolvedValue([]); // No tasks

    const result = await choiceProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data?.tasks).toHaveLength(0);
    expect(result.text).toContain('No pending choices for the moment.');
  });

  it('should handle tasks with no options gracefully', async () => {
    const tasks = [
      {
        id: 'task-1' as UUID,
        name: 'No Options Task',
        roomId: mockMessage.roomId,
        tags: ['AWAITING_CHOICE'],
        metadata: {}, // No options here
      },
    ];
    mockRuntime.getTasks = mock().mockResolvedValue(tasks);

    const result = await choiceProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data?.tasks).toHaveLength(0); // Tasks without options are filtered out
    expect(result.text).toContain('No pending choices for the moment.');
  });

  it('should handle errors from getTasks gracefully', async () => {
    mockRuntime.getTasks = mock().mockRejectedValue(new Error('Task service error'));

    const result = await choiceProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.data?.tasks).toHaveLength(0);
    expect(result.text).toContain('There was an error retrieving pending tasks with options.');
    // Cannot check logger.error calls without mocking @elizaos/core
  });
});

describe('Facts Provider', () => {
```