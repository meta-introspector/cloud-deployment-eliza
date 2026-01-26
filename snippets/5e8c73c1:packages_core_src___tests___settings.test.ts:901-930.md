# 5e8c73c1:packages_core_src___tests___settings.test.ts:901-930

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/settings.test.ts:901-930
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        });
        expect(character.settings!.telegram).toEqual({
          botToken: 'bot-token',
        });

        // Verify existing settings root values are preserved
        expect(character.settings!.SIMPLE_KEY).toBe('character-override');

        // Verify .env values are NOT merged into settings root (no duplication)
        expect(character.settings!.ANOTHER_KEY).toBeUndefined();

        // Verify .env values are merged into settings.secrets
        expect((character.settings!.secrets as Record<string, string>).SIMPLE_KEY).toBe(
          'simple-value'
        );
        expect((character.settings!.secrets as Record<string, string>).ANOTHER_KEY).toBe(
          'another-value'
        );
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