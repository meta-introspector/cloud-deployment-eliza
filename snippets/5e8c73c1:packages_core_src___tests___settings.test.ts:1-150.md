# 5e8c73c1:packages_core_src___tests___settings.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/settings.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { describe, it, expect, beforeEach, afterEach, type MockFunction } from 'bun:test';
import { mock, spyOn } from 'bun:test';
import {
  createSettingFromConfig,
  getSalt,
  clearSaltCache,
  encryptStringValue,
  decryptStringValue,
  saltSettingValue,
  unsaltSettingValue,
  saltWorldSettings,
  unsaltWorldSettings,
  updateWorldSettings,
  getWorldSettings,
  initializeOnboarding,
  encryptedCharacter,
  decryptedCharacter,
  encryptObjectValues,
  decryptObjectValues,
  decryptSecret,
} from '../settings';
import type {
  IAgentRuntime,
  Setting,
  World,
  WorldSettings,
  OnboardingConfig,
  Character,
  UUID,
} from '../types';

import * as entities from '../entities';
import * as logger_module from '../logger';
import { getEnvironment } from '../utils/environment';

// Remove global module mocks - they interfere with other tests

describe('settings utilities', () => {
  let mockRuntime: IAgentRuntime;
  let mockWorld: World;
  let getWorldMock: MockFunction<(id: UUID) => Promise<World | null>>;
  let updateWorldMock: MockFunction<(world: World) => Promise<void>>;

  beforeEach(() => {
    mock.restore();

    // Set up scoped mocks for this test
    spyOn(entities, 'createUniqueUuid').mockImplementation(
      (_runtime, serverId) => `world-${serverId}` as UUID
    );

    // Mock logger if it doesn't have the methods
    if (logger_module.logger) {
      const methods = ['error', 'info', 'warn', 'debug'];
      methods.forEach((method) => {
        if (typeof logger_module.logger[method] === 'function') {
          spyOn(logger_module.logger, method).mockImplementation(() => {});
        } else {
          logger_module.logger[method] = mock(() => {});
        }
      });
    }

    // Mock process.env
    process.env.SECRET_SALT = 'test-salt-value';
    // Clear environment cache after setting env var
    getEnvironment().clearCache();

    getWorldMock = mock<(id: UUID) => Promise<World | null>>();
    updateWorldMock = mock<(world: World) => Promise<void>>();

    mockRuntime = {
      agentId: 'agent-123' as UUID,
      character: {
        id: 'agent-123' as UUID,
        name: 'TestAgent',
        username: 'testagent',
        bio: [],
        messageExamples: [],
        postExamples: [],
        topics: [],
        style: { all: [], chat: [], post: [] },
        adjectives: [],
      },
      getWorld: getWorldMock,
      updateWorld: updateWorldMock,
    } as Partial<IAgentRuntime> as IAgentRuntime;

    mockWorld = {
      id: 'world-123' as UUID,
      name: 'Test World',
      agentId: 'agent-123' as UUID,
      messageServerId: 'server-123',
      metadata: {},
      createdAt: Date.now(),
    };
  });

  afterEach(() => {
    mock.restore();
    delete process.env.SECRET_SALT;
    getEnvironment().clearCache(); // Clear cache after cleanup
  });

  describe('createSettingFromConfig', () => {
    it('should create setting with all required fields', () => {
      const cfg = {
        name: 'API_KEY',
        description: 'API Key for service',
        usageDescription: '',
        required: true,
      };

      const setting = createSettingFromConfig(cfg);

      expect(setting).toEqual({
        name: 'API_KEY',
        description: 'API Key for service',
        usageDescription: '',
        value: null,
        required: true,
        validation: undefined,
        public: false,
        secret: false,
        dependsOn: [],
        onSetAction: undefined,
        visibleIf: undefined,
      });
    });

    it('should create setting with optional fields', () => {
      const validationFn = (value: any) => /^[A-Z0-9]+$/.test(value);
      const onSetActionFn = (_value: any) => 'restart';
      const cfg = {
        name: 'API_KEY',
        description: 'API Key for service',
        usageDescription: 'Enter your API key',
        required: false,
        validation: validationFn,
        public: true,
        secret: true,
        dependsOn: ['OTHER_SETTING'],
        onSetAction: onSetActionFn,
        visibleIf: (settings) => settings['OTHER_SETTING']?.value === 'enabled',
      };

      const setting = createSettingFromConfig(cfg);

      expect(setting.usageDescription).toBe('Enter your API key');
      expect(setting.validation).toBe(validationFn);
```