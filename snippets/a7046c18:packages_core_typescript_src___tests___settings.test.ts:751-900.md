# a7046c18:packages_core_typescript_src___tests___settings.test.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/settings.test.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      };

      const encrypted = encryptedCharacter(character);

      expect(encrypted).toEqual(character);
    });

    it("should not modify original character", () => {
      const character: Character = {
        id: "char-123" as UUID,
        name: "Test Character",
        bio: "Test character bio",
        secrets: {
          TOKEN: "secret-token",
        },
      };

      const encrypted = encryptedCharacter(character);

      expect(character.secrets?.TOKEN).toBe("secret-token");
      expect(encrypted.secrets?.TOKEN).not.toBe("secret-token");
    });
  });

  describe("decryptedCharacter", () => {
    it("should decrypt character settings.secrets", () => {
      const salt = getSalt();
      const character: Character = {
        id: "char-123" as UUID,
        name: "Test Character",
        bio: "Test character bio",
        settings: {
          secrets: {
            API_KEY: encryptStringValue("secret-api-key", salt),
            PASSWORD: encryptStringValue("secret-password", salt),
          },
        },
      };

      const decrypted = decryptedCharacter(character, mockRuntime);

      expect(decrypted.settings?.secrets?.API_KEY).toBe("secret-api-key");
      expect(decrypted.settings?.secrets?.PASSWORD).toBe("secret-password");
    });

    it("should decrypt character.secrets", () => {
      const salt = getSalt();
      const character: Character = {
        id: "char-123" as UUID,
        name: "Test Character",
        bio: "Test character bio",
        secrets: {
          TOKEN: encryptStringValue("secret-token", salt),
          KEY: encryptStringValue("secret-key", salt),
        },
      };

      const decrypted = decryptedCharacter(character, mockRuntime);

      expect(decrypted.secrets?.TOKEN).toBe("secret-token");
      expect(decrypted.secrets?.KEY).toBe("secret-key");
    });

    it("should handle character without secrets", () => {
      const character: Character = {
        id: "char-123" as UUID,
        name: "Test Character",
        bio: "Test character bio",
      };

      const decrypted = decryptedCharacter(character, mockRuntime);

      expect(decrypted).toEqual(character);
    });
  });

  describe("encryptObjectValues", () => {
    const salt = "test-salt";

    it("should encrypt all string values in object", () => {
      const obj = {
        key1: "value1",
        key2: "value2",
        key3: 123,
        key4: true,
        key5: null,
        key6: "",
      };

      const encrypted = encryptObjectValues(obj, salt);

      expect(encrypted.key1).not.toBe("value1");
      expect(encrypted.key1).toContain(":");
      expect(encrypted.key2).not.toBe("value2");
      expect(encrypted.key2).toContain(":");
      expect(encrypted.key3).toBe(123);
      expect(encrypted.key4).toBe(true);
      expect(encrypted.key5).toBeNull();
      expect(encrypted.key6).toBe(""); // Empty strings are not encrypted
    });
  });

  describe("decryptObjectValues", () => {
    const salt = "test-salt";

    it("should decrypt all string values in object", () => {
      const obj = {
        key1: encryptStringValue("value1", salt),
        key2: encryptStringValue("value2", salt),
        key3: 123,
        key4: true,
      };

      const decrypted = decryptObjectValues(obj, salt);

      expect(decrypted.key1).toBe("value1");
      expect(decrypted.key2).toBe("value2");
      expect(decrypted.key3).toBe(123);
      expect(decrypted.key4).toBe(true);
    });
  });

  describe("decryptSecret alias", () => {
    it("should be an alias for decryptStringValue", () => {
      expect(decryptSecret).toBe(decryptStringValue);
    });
  });

  describe("Character settings merge with complex objects", () => {
    it("should handle complex character settings without corrupting them during .env merge", async () => {
      const { setDefaultSecretsFromEnv } = await import("../secrets");
      const { loadEnvFile } = await import("../utils/environment");
      const fs = await import("node:fs");
      const path = await import("node:path");
      const os = await import("node:os");

      const testDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "settings-complex-test-"),
      );
      const originalCwd = process.cwd();

      // Track keys we add to process.env for cleanup
      const testEnvKeys = new Set<string>();

      try {
        process.chdir(testDir);

        const envContent = `SIMPLE_KEY=simple-value
ANOTHER_KEY=another-value`;
        fs.writeFileSync(path.join(testDir, ".env"), envContent);
```