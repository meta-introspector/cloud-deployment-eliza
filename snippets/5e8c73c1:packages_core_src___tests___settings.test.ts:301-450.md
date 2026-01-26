# 5e8c73c1:packages_core_src___tests___settings.test.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/settings.test.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      expect(decryptStringValue(obj as any, salt)).toBe(obj);
    });

    it('should return original value if not in encrypted format', () => {
      const plainValue = 'not-encrypted';
      expect(decryptStringValue(plainValue, salt)).toBe(plainValue);
    });

    it('should return original value if IV length is invalid', () => {
      const invalidFormat = 'shortiv:encrypted';
      expect(decryptStringValue(invalidFormat, salt)).toBe(invalidFormat);
    });

    it('should return original value on decryption error', () => {
      const invalidEncrypted = '0123456789abcdef0123456789abcdef:invalidhex';
      const result = decryptStringValue(invalidEncrypted, salt);
      expect(result).toBe(invalidEncrypted);
    });

    it('should handle empty IV gracefully', () => {
      const emptyIv = ':encrypted';
      expect(decryptStringValue(emptyIv, salt)).toBe(emptyIv);
    });
  });

  describe('saltSettingValue', () => {
    const salt = 'test-salt';

    it('should encrypt secret string settings', () => {
      const setting: Setting = {
        name: 'API_KEY',
        description: 'API Key',
        usageDescription: 'Enter API key',
        value: 'my-secret-key',
        secret: true,
        required: true,
      };

      const salted = saltSettingValue(setting, salt);

      expect(salted.value).not.toBe('my-secret-key');
      expect(salted.value).toContain(':');
    });

    it('should not encrypt non-secret settings', () => {
      const setting: Setting = {
        name: 'PUBLIC_URL',
        description: 'Public URL',
        usageDescription: 'Enter public URL',
        value: 'https://example.com',
        secret: false,
        required: true,
      };

      const salted = saltSettingValue(setting, salt);

      expect(salted.value).toBe('https://example.com');
    });

    it('should not encrypt non-string values', () => {
      const setting: Setting = {
        name: 'ENABLED',
        description: 'Feature enabled',
        usageDescription: 'Enable feature',
        value: true,
        secret: true,
        required: true,
      };

      const salted = saltSettingValue(setting, salt);

      expect(salted.value).toBe(true);
    });

    it('should not encrypt empty string values', () => {
      const setting: Setting = {
        name: 'API_KEY',
        description: 'API Key',
        usageDescription: 'Enter API key',
        value: '',
        secret: true,
        required: false,
      };

      const salted = saltSettingValue(setting, salt);

      expect(salted.value).toBe('');
    });
  });

  describe('unsaltSettingValue', () => {
    const salt = 'test-salt';

    it('should decrypt secret string settings', () => {
      const original = 'my-secret-key';
      const encrypted = encryptStringValue(original, salt);
      const setting: Setting = {
        name: 'API_KEY',
        description: 'API Key',
        usageDescription: 'Enter API key',
        value: encrypted,
        secret: true,
        required: true,
      };

      const unsalted = unsaltSettingValue(setting, salt);

      expect(unsalted.value).toBe(original);
    });

    it('should not decrypt non-secret settings', () => {
      const setting: Setting = {
        name: 'PUBLIC_URL',
        description: 'Public URL',
        usageDescription: 'Enter public URL',
        value: 'https://example.com',
        secret: false,
        required: true,
      };

      const unsalted = unsaltSettingValue(setting, salt);

      expect(unsalted.value).toBe('https://example.com');
    });
  });

  describe('saltWorldSettings', () => {
    const salt = 'test-salt';

    it('should salt all secret settings in world settings', () => {
      const worldSettings: WorldSettings = {
        API_KEY: {
          name: 'API_KEY',
          description: 'API Key',
          usageDescription: 'Enter API key',
          value: 'secret1',
          secret: true,
          required: true,
        },
        DB_PASSWORD: {
          name: 'DB_PASSWORD',
          description: 'Database Password',
          usageDescription: 'Enter database password',
          value: 'secret2',
          secret: true,
          required: true,
        },
        PUBLIC_URL: {
          name: 'PUBLIC_URL',
          description: 'Public URL',
```