# 12812d74:packages_core_src___tests___runtime.test.ts:1351-1379

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/__tests__/runtime.test.ts:1351-1379
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
          ),
        ]);

        // Each context should have received only its own chunks (extracted from <text> tags)
        const context1Text = context1Chunks.join('');
        const context2Text = context2Chunks.join('');
        const context3Text = context3Chunks.join('');

        // Verify each context got its own unique content
        expect(context1Text).toContain('ctx1-');
        expect(context1Text).not.toContain('ctx2-');
        expect(context1Text).not.toContain('ctx3-');

        expect(context2Text).toContain('ctx2-');
        expect(context2Text).not.toContain('ctx1-');
        expect(context2Text).not.toContain('ctx3-');

        expect(context3Text).toContain('ctx3-');
        expect(context3Text).not.toContain('ctx1-');
        expect(context3Text).not.toContain('ctx2-');

        // All results should be strings (full XML)
        expect(typeof result1).toBe('string');
        expect(typeof result2).toBe('string');
        expect(typeof result3).toBe('string');
      });
    });
  });
}); // End of main describe block
```