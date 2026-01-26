# a7046c18:packages_core_typescript_src___tests___elizaos.test.ts:601-672

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos.test.ts:601-672
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    it("should encrypt character.secrets at root level", async () => {
      const characterWithRootSecrets: Character = {
        name: "TestAgentRootSecrets",
        bio: "A test agent with root-level secrets",
        system: "You are a test agent",
        secrets: {
          ROOT_API_KEY: "root-secret-12345",
          ROOT_PASSWORD: "root-password",
        },
      };

      const [runtime] = (await elizaOS.addAgents(
        [{ character: characterWithRootSecrets, plugins: [mockSqlPlugin] }],
        { returnRuntimes: true, isTestMode: true },
      )) as IAgentRuntime[];

      const character = runtime.character;

      // Root secrets should be encrypted
      expect(character.secrets).toBeDefined();
      const rootSecrets = character.secrets as Record<string, string>;

      // Check that ROOT_API_KEY is encrypted
      expect(rootSecrets.ROOT_API_KEY).toContain(":");
      expect(rootSecrets.ROOT_API_KEY).not.toBe("root-secret-12345");

      // Verify we can decrypt back to original values
      const salt = getSalt();
      const decrypted = decryptObjectValues(rootSecrets, salt);
      expect(decrypted.ROOT_API_KEY).toBe("root-secret-12345");
      expect(decrypted.ROOT_PASSWORD).toBe("root-password");
    });

    it("should encrypt both settings.secrets and root secrets", async () => {
      const characterWithBothSecrets: Character = {
        name: "TestAgentBothSecrets",
        bio: "A test agent with both secret locations",
        system: "You are a test agent",
        secrets: {
          ROOT_SECRET: "root-value",
        },
        settings: {
          secrets: {
            SETTINGS_SECRET: "settings-value",
          },
        },
      };

      const [runtime] = (await elizaOS.addAgents(
        [{ character: characterWithBothSecrets, plugins: [mockSqlPlugin] }],
        { returnRuntimes: true, isTestMode: true },
      )) as IAgentRuntime[];

      const character = runtime.character;
      const salt = getSalt();

      // Both should be encrypted
      expect(character.secrets.ROOT_SECRET).toContain(":");
      expect(character.settings.secrets.SETTINGS_SECRET).toContain(":");

      // Both should decrypt correctly
      const decryptedRoot = decryptObjectValues(character.secrets, salt);
      const decryptedSettings = decryptObjectValues(
        character.settings.secrets,
        salt,
      );

      expect(decryptedRoot.ROOT_SECRET).toBe("root-value");
      expect(decryptedSettings.SETTINGS_SECRET).toBe("settings-value");
    });
  });
});
```