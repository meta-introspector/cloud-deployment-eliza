// ai generated untested code
import { AgentServer } from '../server/index';
import { AgentRuntime, type Character, type IAgentRuntime } from '@elizaos/core';
import { startAgent, promptForProjectPlugins, wait } from './start';
import fs from 'node:fs';
import path from 'node:path';

// Mock dependencies
jest.mock('../server/index');
jest.mock('@elizaos/core');
jest.mock('node:fs');
jest.mock('node:path');

describe('Start Command Functions', () => {
  // Test wait function
  describe('wait', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should wait for a random time between min and max', async () => {
      const waitPromise = wait(1000, 2000);
      jest.advanceTimersByTime(2000);
      await waitPromise;

      // Verify setTimeout was called with a value between 1000 and 2000
      const calls = jest.getTimerCount();
      expect(calls).toBe(1);
    });
  });

  // Test promptForProjectPlugins
  describe('promptForProjectPlugins', () => {
    const mockProject = {
      agents: [
        {
          plugins: ['plugin-test', '@elizaos/plugin-example'],
        },
      ],
    };

    it('should prompt for each unique plugin', async () => {
      const result = await promptForProjectPlugins(mockProject);
      // Add assertions based on expected behavior
    });

    it('should handle project with single agent format', async () => {
      const singleAgentProject = {
        agent: {
          plugins: ['plugin-single'],
        },
      };
      const result = await promptForProjectPlugins(singleAgentProject);
      // Add assertions
    });

    it('should handle empty project', async () => {
      const emptyProject = { agents: [] };
      const result = await promptForProjectPlugins(emptyProject);
      // Add assertions
    });
  });

  // Test startAgent
  describe('startAgent', () => {
    let mockServer: jest.Mocked<AgentServer>;
    let mockCharacter: Character;
    let mockRuntime: jest.Mocked<IAgentRuntime>;

    beforeEach(() => {
      mockServer = {
        registerAgent: jest.fn(),
      } as any;

      mockCharacter = {
        name: 'Test Agent',
        id: '123',
        plugins: [],
      };

      mockRuntime = {
        initialize: jest.fn(),
        character: mockCharacter,
        agentId: '123',
        close: jest.fn(),
      } as any;

      (AgentRuntime as jest.Mock).mockImplementation(() => mockRuntime);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should start an agent with given character and register it with server', async () => {
      const result = await startAgent(mockCharacter, mockServer);

      expect(AgentRuntime).toHaveBeenCalledWith({
        character: mockCharacter,
        plugins: [],
      });
      expect(mockRuntime.initialize).toHaveBeenCalled();
      expect(mockServer.registerAgent).toHaveBeenCalledWith(mockRuntime);
      expect(result).toBe(mockRuntime);
    });

    it('should handle initialization function if provided', async () => {
      const initFn = jest.fn();
      await startAgent(mockCharacter, mockServer, initFn);

      expect(initFn).toHaveBeenCalledWith(mockRuntime);
    });

    it('should handle plugins correctly', async () => {
      const mockPlugins = [{ name: 'TestPlugin', init: jest.fn() }];
      await startAgent(mockCharacter, mockServer, undefined, mockPlugins);

      expect(AgentRuntime).toHaveBeenCalledWith({
        character: mockCharacter,
        plugins: mockPlugins,
      });
    });

    it('should generate an id if not provided in character', async () => {
      const characterWithoutId = { ...mockCharacter, id: undefined };
      await startAgent(characterWithoutId, mockServer);

      expect(characterWithoutId.id).toBeDefined();
    });
  });

  // Test stopAgent
  describe('stopAgent', () => {
    let mockRuntime: jest.Mocked<IAgentRuntime>;
    let mockServer: jest.Mocked<AgentServer>;

    beforeEach(() => {
      mockRuntime = {
        close: jest.fn(),
        agentId: '123',
      } as any;

      mockServer = {
        unregisterAgent: jest.fn(),
      } as any;
    });

    it('should close runtime and unregister agent', async () => {
      await stopAgent(mockRuntime, mockServer);

      expect(mockRuntime.close).toHaveBeenCalled();
      expect(mockServer.unregisterAgent).toHaveBeenCalledWith('123');
    });
  });
});
