# a7046c18:packages_core_typescript_src___tests___settings.test.ts:901-957

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/settings.test.ts:901-957
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        // Load .env file into process.env
        loadEnvFile(path.join(testDir, ".env"));
        testEnvKeys.add("SIMPLE_KEY");
        testEnvKeys.add("ANOTHER_KEY");

        const character: Character = {
          name: "TestChar",
          bio: ["Test bio"],
          settings: {
            discord: {
              shouldIgnoreBotMessages: true,
              allowedChannelIds: ["123", "456"],
            },
            telegram: {
              botToken: "bot-token",
            },
            SIMPLE_KEY: "character-override", // Override .env
          },
        };

        await setDefaultSecretsFromEnv(character, { skipEnvMerge: false });

        // Verify complex objects are preserved
        expect(character.settings?.discord).toEqual({
          shouldIgnoreBotMessages: true,
          allowedChannelIds: ["123", "456"],
        });
        expect(character.settings?.telegram).toEqual({
          botToken: "bot-token",
        });

        // Verify existing settings root values are preserved
        expect(character.settings?.SIMPLE_KEY).toBe("character-override");

        // Verify .env values are NOT merged into settings root (no duplication)
        expect(character.settings?.ANOTHER_KEY).toBeUndefined();

        // Verify .env values are merged into settings.secrets
        expect(
          (character.settings?.secrets as Record<string, string>).SIMPLE_KEY,
        ).toBe("simple-value");
        expect(
          (character.settings?.secrets as Record<string, string>).ANOTHER_KEY,
        ).toBe("another-value");
      } finally {
        process.chdir(originalCwd);
        fs.rmSync(testDir, { recursive: true, force: true });

        // Clean up test environment variables
        for (const key of testEnvKeys) {
          delete process.env[key];
        }
      }
    });
  });
});
```