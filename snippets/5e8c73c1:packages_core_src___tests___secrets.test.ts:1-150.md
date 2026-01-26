# 5e8c73c1:packages_core_src___tests___secrets.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/secrets.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { hasCharacterSecrets, setDefaultSecretsFromEnv } from '../secrets';
import type { Character } from '../types';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('SecretsManager', () => {
  let originalCwd: string;
  let testDir: string;
  let testEnvKeys: Set<string>;

  beforeEach(() => {
    // Track test-added keys only
    testEnvKeys = new Set();
    originalCwd = process.cwd();

    // Create a temporary test directory without .env files
    testDir = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'secrets-test-'));
    process.chdir(testDir);
  });

  afterEach(() => {
    // Restore working directory
    process.chdir(originalCwd);

    // Clean up test directory
    try {
      fs.rmSync(testDir, { recursive: true, force: true });
    } catch {}

    // Clean up only test-added environment variables
    for (const key of testEnvKeys) {
      delete process.env[key];
    }
    testEnvKeys.clear();
  });

  describe('hasCharacterSecrets', () => {
    test('should return true when character has secrets', () => {
      const character: Character = {
        name: 'TestChar',
        bio: ['Test bio'],
        settings: {
          secrets: {
            apiKey: 'secret-key',
          },
        },
      } as Character;

      expect(hasCharacterSecrets(character)).toBe(true);
    });

    test('should return false when character has no secrets', () => {
      const character: Character = {
        name: 'TestChar',
        bio: ['Test bio'],
        settings: {},
      } as Character;

      expect(hasCharacterSecrets(character)).toBe(false);
    });

    test('should return false when character has empty secrets', () => {
      const character: Character = {
        name: 'TestChar',
        bio: ['Test bio'],
        settings: {
          secrets: {},
        },
      } as Character;

      expect(hasCharacterSecrets(character)).toBe(false);
    });
  });

  describe('setDefaultSecretsFromEnv', () => {
    test('should return true and merge process.env when not skipped', async () => {
      const character: Character = {
        name: 'TestChar',
        bio: ['Test bio'],
        settings: {},
      } as Character;

      const result = await setDefaultSecretsFromEnv(character, { skipEnvMerge: false });

      // Should return true because process.env merge is enabled
      expect(result).toBe(true);
      expect(character.settings?.secrets).toBeDefined();
    });

    test('should return false when skipEnvMerge is true', async () => {
      const character: Character = {
        name: 'TestChar',
        bio: ['Test bio'],
        settings: {},
      } as Character;

      const result = await setDefaultSecretsFromEnv(character, { skipEnvMerge: true });

      // Should return false because env merge is skipped
      expect(result).toBe(false);
    });

    test('should load secrets from process.env', async () => {
      // Set environment variables
      process.env.TEST_OPENAI_API_KEY = 'test-key-123';
      process.env.TEST_ANTHROPIC_API_KEY = 'test-key-456';
      testEnvKeys.add('TEST_OPENAI_API_KEY');
      testEnvKeys.add('TEST_ANTHROPIC_API_KEY');

      const character: Character = {
        name: 'TestChar',
        bio: ['Test bio'],
        settings: {},
      } as Character;

      const result = await setDefaultSecretsFromEnv(character, { skipEnvMerge: false });

      expect(result).toBe(true);
      expect(character.settings?.secrets).toBeDefined();
      expect((character.settings!.secrets as Record<string, string>).TEST_OPENAI_API_KEY).toBe(
        'test-key-123'
      );
      expect((character.settings!.secrets as Record<string, string>).TEST_ANTHROPIC_API_KEY).toBe(
        'test-key-456'
      );
    });

    test('should merge process.env with existing character.settings.secrets (character overrides)', async () => {
      // Set environment variables
      process.env.TEST_OPENAI_KEY = 'env-key';
      process.env.TEST_ANTHROPIC_KEY = 'env-key-456';
      testEnvKeys.add('TEST_OPENAI_KEY');
      testEnvKeys.add('TEST_ANTHROPIC_KEY');

      const character: Character = {
        name: 'TestChar',
        bio: ['Test bio'],
        settings: {
          secrets: {
            TEST_OPENAI_KEY: 'character-override',
          },
        },
      } as Character;

      const result = await setDefaultSecretsFromEnv(character, { skipEnvMerge: false });

      expect(result).toBe(true);
      // Character secret should override process.env
      expect((character.settings!.secrets as Record<string, string>).TEST_OPENAI_KEY).toBe(
```