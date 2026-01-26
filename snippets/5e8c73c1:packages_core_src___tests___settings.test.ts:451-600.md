# 5e8c73c1:packages_core_src___tests___settings.test.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/settings.test.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          usageDescription: 'Enter public URL',
          value: 'https://example.com',
          secret: false,
          required: true,
        },
      };

      const salted = saltWorldSettings(worldSettings, salt);

      expect(salted.API_KEY.value).not.toBe('secret1');
      expect(salted.API_KEY.value).toContain(':');
      expect(salted.DB_PASSWORD.value).not.toBe('secret2');
      expect(salted.DB_PASSWORD.value).toContain(':');
      expect(salted.PUBLIC_URL.value).toBe('https://example.com');
    });
  });

  describe('unsaltWorldSettings', () => {
    const salt = 'test-salt';

    it('should unsalt all secret settings in world settings', () => {
      const encrypted1 = encryptStringValue('secret1', salt);
      const encrypted2 = encryptStringValue('secret2', salt);

      const worldSettings: WorldSettings = {
        API_KEY: {
          name: 'API_KEY',
          description: 'API Key',
          usageDescription: 'Enter your API key',
          value: encrypted1,
          secret: true,
          required: true,
        },
        DB_PASSWORD: {
          name: 'DB_PASSWORD',
          description: 'Database Password',
          usageDescription: 'Enter your database password',
          value: encrypted2,
          secret: true,
          required: true,
        },
      };

      const unsalted = unsaltWorldSettings(worldSettings, salt);

      expect(unsalted.API_KEY.value).toBe('secret1');
      expect(unsalted.DB_PASSWORD.value).toBe('secret2');
    });
  });

  describe('updateWorldSettings', () => {
    it('should update world settings successfully', async () => {
      const worldSettings: WorldSettings = {
        API_KEY: {
          name: 'API_KEY',
          description: 'API Key',
          usageDescription: 'Enter your API key',
          value: 'secret-key',
          secret: true,
          required: true,
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);
      updateWorldMock.mockResolvedValue(undefined);

      const result = await updateWorldSettings(mockRuntime, 'server-123', worldSettings);

      expect(result).toBe(true);
      expect(mockRuntime.updateWorld).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            settings: expect.any(Object),
          }),
        })
      );
    });

    it('should return false when world not found', async () => {
      getWorldMock.mockResolvedValue(null);

      const result = await updateWorldSettings(mockRuntime, 'server-123', {});

      expect(result).toBe(false);
      expect(mockRuntime.updateWorld).not.toHaveBeenCalled();
    });

    it('should initialize metadata if it does not exist', async () => {
      const worldWithoutMetadata = { ...mockWorld, metadata: undefined };
      getWorldMock.mockResolvedValue(worldWithoutMetadata);
      updateWorldMock.mockResolvedValue(undefined);

      const result = await updateWorldSettings(mockRuntime, 'server-123', {});

      expect(result).toBe(true);
      expect(mockRuntime.updateWorld).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: expect.objectContaining({
            settings: {},
          }),
        })
      );
    });
  });

  describe('getWorldSettings', () => {
    it('should get and unsalt world settings', async () => {
      const salt = getSalt();
      const encrypted = encryptStringValue('secret-value', salt);

      mockWorld.metadata = {
        settings: {
          API_KEY: {
            name: 'API_KEY',
            description: 'API Key',
            usageDescription: 'Enter your API key',
            value: encrypted,
            secret: true,
            required: true,
          },
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const result = await getWorldSettings(mockRuntime, 'server-123');

      expect(result).not.toBeNull();
      expect(result!.API_KEY.value).toBe('secret-value');
    });

    it('should return null when world not found', async () => {
      getWorldMock.mockResolvedValue(null);

      const result = await getWorldSettings(mockRuntime, 'server-123');

      expect(result).toBeNull();
    });

    it('should return null when world has no settings', async () => {
      getWorldMock.mockResolvedValue(mockWorld);

      const result = await getWorldSettings(mockRuntime, 'server-123');

      expect(result).toBeNull();
    });
  });

  describe('initializeOnboarding', () => {
    it('should initialize settings from config', async () => {
```