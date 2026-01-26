# a7046c18:packages_core_typescript_src___tests___settings.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/settings.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    it("should return undefined/null values as is", () => {
      // Intentionally testing with invalid types to verify runtime handling
      expect(decryptStringValue(undefined as any, salt)).toBeUndefined();
      expect(decryptStringValue(null as any, salt)).toBeNull();
    });

    it("should return boolean values as is", () => {
      // Intentionally testing with invalid types to verify runtime handling
      expect(decryptStringValue(true as any, salt)).toBe(true);
      expect(decryptStringValue(false as any, salt)).toBe(false);
    });

    it("should return number values as is", () => {
      // Intentionally testing with invalid types to verify runtime handling
      expect(decryptStringValue(123 as any, salt)).toBe(123);
    });

    it("should return non-string objects as is", () => {
      // Intentionally testing with invalid types to verify runtime handling
      const obj = { key: "value" };
      expect(decryptStringValue(obj as any, salt)).toBe(obj);
    });

    it("should return original value if not in encrypted format", () => {
      const plainValue = "not-encrypted";
      expect(decryptStringValue(plainValue, salt)).toBe(plainValue);
    });

    it("should return original value if IV length is invalid", () => {
      const invalidFormat = "shortiv:encrypted";
      expect(decryptStringValue(invalidFormat, salt)).toBe(invalidFormat);
    });

    it("should return original value on decryption error", () => {
      const invalidEncrypted = "0123456789abcdef0123456789abcdef:invalidhex";
      const result = decryptStringValue(invalidEncrypted, salt);
      expect(result).toBe(invalidEncrypted);
    });

    it("should handle empty IV gracefully", () => {
      const emptyIv = ":encrypted";
      expect(decryptStringValue(emptyIv, salt)).toBe(emptyIv);
    });
  });

  describe("saltSettingValue", () => {
    const salt = "test-salt";

    it("should encrypt secret string settings", () => {
      const setting: Setting = {
        name: "API_KEY",
        description: "API Key",
        usageDescription: "Enter API key",
        value: "my-secret-key",
        secret: true,
        required: true,
      };

      const salted = saltSettingValue(setting, salt);

      expect(salted.value).not.toBe("my-secret-key");
      expect(salted.value).toContain(":");
    });

    it("should not encrypt non-secret settings", () => {
      const setting: Setting = {
        name: "PUBLIC_URL",
        description: "Public URL",
        usageDescription: "Enter public URL",
        value: "https://example.com",
        secret: false,
        required: true,
      };

      const salted = saltSettingValue(setting, salt);

      expect(salted.value).toBe("https://example.com");
    });

    it("should not encrypt non-string values", () => {
      const setting: Setting = {
        name: "ENABLED",
        description: "Feature enabled",
        usageDescription: "Enable feature",
        value: true,
        secret: true,
        required: true,
      };

      const salted = saltSettingValue(setting, salt);

      expect(salted.value).toBe(true);
    });

    it("should not encrypt empty string values", () => {
      const setting: Setting = {
        name: "API_KEY",
        description: "API Key",
        usageDescription: "Enter API key",
        value: "",
        secret: true,
        required: false,
      };

      const salted = saltSettingValue(setting, salt);

      expect(salted.value).toBe("");
    });
  });

  describe("unsaltSettingValue", () => {
    const salt = "test-salt";

    it("should decrypt secret string settings", () => {
      const original = "my-secret-key";
      const encrypted = encryptStringValue(original, salt);
      const setting: Setting = {
        name: "API_KEY",
        description: "API Key",
        usageDescription: "Enter API key",
        value: encrypted,
        secret: true,
        required: true,
      };

      const unsalted = unsaltSettingValue(setting, salt);

      expect(unsalted.value).toBe(original);
    });

    it("should not decrypt non-secret settings", () => {
      const setting: Setting = {
        name: "PUBLIC_URL",
        description: "Public URL",
        usageDescription: "Enter public URL",
        value: "https://example.com",
        secret: false,
        required: true,
      };

      const unsalted = unsaltSettingValue(setting, salt);

      expect(unsalted.value).toBe("https://example.com");
    });
  });

  describe("saltWorldSettings", () => {
    const salt = "test-salt";

```