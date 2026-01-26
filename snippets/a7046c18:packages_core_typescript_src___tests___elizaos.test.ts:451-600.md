# a7046c18:packages_core_typescript_src___tests___elizaos.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await elizaOS.deleteAgents(agentIds);

      expect(deletedHandler).toHaveBeenCalledTimes(1);
      const eventData: AgentsDeletedDetail = deletedHandler.mock.calls[0][0];
      expect(eventData.agentIds).toEqual(agentIds);
    });
  });

  describe("Secrets Encryption", () => {
    it("should encrypt character secrets after addAgents", async () => {
      const characterWithSecrets: Character = {
        name: "TestAgentWithSecrets",
        bio: "A test agent with secrets",
        system: "You are a test agent",
        settings: {
          secrets: {
            API_KEY: "sk-test-12345",
            DATABASE_PASSWORD: "super-secret-password",
          },
        },
      };

      const [runtime] = (await elizaOS.addAgents(
        [{ character: characterWithSecrets, plugins: [mockSqlPlugin] }],
        { returnRuntimes: true, isTestMode: true },
      )) as IAgentRuntime[];

      // Get the character from runtime
      const character = runtime.character;

      // Secrets should be encrypted (format: iv:encrypted)
      expect(character.settings?.secrets).toBeDefined();
      const secrets = character.settings.secrets as Record<string, string>;

      // Check that API_KEY is encrypted (contains ':' separator for iv:encrypted format)
      expect(secrets.API_KEY).toContain(":");
      expect(secrets.API_KEY).not.toBe("sk-test-12345");

      // Check that DATABASE_PASSWORD is encrypted
      expect(secrets.DATABASE_PASSWORD).toContain(":");
      expect(secrets.DATABASE_PASSWORD).not.toBe("super-secret-password");

      // Verify we can decrypt back to original values
      const salt = getSalt();
      const decrypted = decryptObjectValues(secrets, salt);
      expect(decrypted.API_KEY).toBe("sk-test-12345");
      expect(decrypted.DATABASE_PASSWORD).toBe("super-secret-password");
    });

    it("should not double-encrypt already encrypted secrets", async () => {
      const characterWithSecrets: Character = {
        name: "TestAgentWithSecrets2",
        bio: "A test agent",
        system: "You are a test agent",
        settings: {
          secrets: {
            API_KEY: "my-secret-key",
          },
        },
      };

      const [runtime] = (await elizaOS.addAgents(
        [{ character: characterWithSecrets, plugins: [mockSqlPlugin] }],
        { returnRuntimes: true, isTestMode: true },
      )) as IAgentRuntime[];

      const secrets = runtime.character.settings.secrets as Record<
        string,
        string
      >;
      const firstEncryption = secrets.API_KEY;

      // Decrypt and verify
      const salt = getSalt();
      const decrypted = decryptObjectValues(secrets, salt);
      expect(decrypted.API_KEY).toBe("my-secret-key");

      // The encrypted value should have iv:encrypted format
      const parts = firstEncryption.split(":");
      expect(parts.length).toBe(2);
      // IV should be 32 hex chars (16 bytes)
      expect(parts[0].length).toBe(32);
    });

    it("should handle empty secrets object", async () => {
      const characterWithEmptySecrets: Character = {
        name: "TestAgentEmptySecrets",
        bio: "A test agent",
        system: "You are a test agent",
        settings: {
          secrets: {},
        },
      };

      const [runtime] = (await elizaOS.addAgents(
        [{ character: characterWithEmptySecrets, plugins: [mockSqlPlugin] }],
        { returnRuntimes: true, isTestMode: true },
      )) as IAgentRuntime[];

      // Should not throw, secrets should remain empty object
      expect(runtime.character.settings?.secrets).toEqual({});
    });

    it("should handle character without settings", async () => {
      const characterWithoutSettings: Character = {
        name: "TestAgentNoSettings",
        bio: "A test agent",
        system: "You are a test agent",
      };

      const [runtime] = (await elizaOS.addAgents(
        [{ character: characterWithoutSettings, plugins: [mockSqlPlugin] }],
        { returnRuntimes: true, isTestMode: true },
      )) as IAgentRuntime[];

      // Should not throw
      expect(runtime).toBeDefined();
    });

    it("should preserve non-string secret values", async () => {
      const characterWithMixedSecrets: Character = {
        name: "TestAgentMixedSecrets",
        bio: "A test agent",
        system: "You are a test agent",
        settings: {
          secrets: {
            STRING_SECRET: "secret-value",
            NUMBER_VALUE: 12345 as unknown as string,
            BOOLEAN_VALUE: true as unknown as string,
            NULL_VALUE: null as unknown as string,
          },
        },
      };

      const [runtime] = (await elizaOS.addAgents(
        [{ character: characterWithMixedSecrets, plugins: [mockSqlPlugin] }],
        { returnRuntimes: true, isTestMode: true },
      )) as IAgentRuntime[];

      const secrets = runtime.character.settings.secrets;

      // String should be encrypted
      expect(secrets.STRING_SECRET).toContain(":");

      // Non-string values should be preserved as-is
      expect(secrets.NUMBER_VALUE).toBe(12345);
      expect(secrets.BOOLEAN_VALUE).toBe(true);
      expect(secrets.NULL_VALUE).toBeNull();
    });

```