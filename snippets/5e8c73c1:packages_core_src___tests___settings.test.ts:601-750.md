# 5e8c73c1:packages_core_src___tests___settings.test.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/settings.test.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const config: OnboardingConfig = {
        settings: {
          API_KEY: {
            name: 'API_KEY',
            description: 'API Key',
            usageDescription: 'Enter your API key',
            required: true,
            secret: true,
          },
          PUBLIC_URL: {
            name: 'PUBLIC_URL',
            description: 'Public URL',
            usageDescription: 'Enter your public URL',
            required: false,
            secret: false,
          },
        },
      };

      updateWorldMock.mockResolvedValue(undefined);

      const result = await initializeOnboarding(mockRuntime, mockWorld, config);

      expect(result).not.toBeNull();
      expect(result!.API_KEY).toBeDefined();
      expect(result!.API_KEY.value).toBeNull();
      expect(result!.API_KEY.secret).toBe(true);
      expect(result!.PUBLIC_URL).toBeDefined();
      expect(result!.PUBLIC_URL.secret).toBe(false);
    });

    it('should return existing settings if already initialized', async () => {
      const salt = getSalt();
      const encrypted = encryptStringValue('existing-secret', salt);

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

      const config: OnboardingConfig = {
        settings: {
          NEW_KEY: {
            name: 'NEW_KEY',
            description: 'New Key',
            usageDescription: 'Enter new key',
            required: true,
          },
        },
      };

      const result = await initializeOnboarding(mockRuntime, mockWorld, config);

      expect(result).not.toBeNull();
      expect(result!.API_KEY).toBeDefined();
      expect(result!.API_KEY.value).toBe('existing-secret');
      expect(result!.NEW_KEY).toBeUndefined(); // Should not add new settings
    });

    it('should handle config without settings', async () => {
      const config: OnboardingConfig = { settings: {} };

      updateWorldMock.mockResolvedValue(undefined);

      const result = await initializeOnboarding(mockRuntime, mockWorld, config);

      expect(result).toEqual({});
      expect(mockRuntime.updateWorld).toHaveBeenCalled();
    });
  });

  describe('encryptedCharacter', () => {
    it('should encrypt character settings.secrets', () => {
      const character: Character = {
        id: 'char-123' as UUID,
        name: 'Test Character',
        bio: 'Test character bio',
        settings: {
          secrets: {
            API_KEY: 'secret-api-key',
            PASSWORD: 'secret-password',
          },
        },
      };

      const encrypted = encryptedCharacter(character);

      expect(encrypted.settings?.secrets?.['API_KEY']).not.toBe('secret-api-key');
      expect(encrypted.settings?.secrets?.['API_KEY']).toContain(':');
      expect(encrypted.settings?.secrets?.['PASSWORD']).not.toBe('secret-password');
      expect(encrypted.settings?.secrets?.['PASSWORD']).toContain(':');
    });

    it('should encrypt character.secrets', () => {
      const character: Character = {
        id: 'char-123' as UUID,
        name: 'Test Character',
        bio: 'Test character bio',
        secrets: {
          TOKEN: 'secret-token',
          KEY: 'secret-key',
        },
      };

      const encrypted = encryptedCharacter(character);

      expect(encrypted.secrets?.TOKEN).not.toBe('secret-token');
      expect(encrypted.secrets?.TOKEN).toContain(':');
      expect(encrypted.secrets?.KEY).not.toBe('secret-key');
      expect(encrypted.secrets?.KEY).toContain(':');
    });

    it('should handle character without secrets', () => {
      const character: Character = {
        id: 'char-123' as UUID,
        name: 'Test Character',
        bio: 'Test character bio',
      };

      const encrypted = encryptedCharacter(character);

      expect(encrypted).toEqual(character);
    });

    it('should not modify original character', () => {
      const character: Character = {
        id: 'char-123' as UUID,
        name: 'Test Character',
        bio: 'Test character bio',
        secrets: {
          TOKEN: 'secret-token',
        },
      };

      const encrypted = encryptedCharacter(character);

      expect(character.secrets?.TOKEN).toBe('secret-token');
      expect(encrypted.secrets?.TOKEN).not.toBe('secret-token');
    });
  });

  describe('decryptedCharacter', () => {
```