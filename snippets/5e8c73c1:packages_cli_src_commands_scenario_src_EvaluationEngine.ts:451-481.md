# 5e8c73c1:packages_cli_src_commands_scenario_src_EvaluationEngine.ts:451-481

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EvaluationEngine.ts:451-481
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    const judgment = (parsedResponse.judgment as string | undefined)?.toLowerCase() || '';
    const confidence = parsedResponse.confidence as number | undefined;
    const expectedLower = expected.toLowerCase();

    // Handle yes/no expectations
    if (expectedLower === 'yes' || expectedLower === 'no') {
      return judgment === expectedLower;
    }

    // Handle confidence thresholds (e.g., "0.8+")
    if (expectedLower.includes('+')) {
      const threshold = parseFloat(expectedLower.replace('+', ''));
      return confidence !== undefined && confidence >= threshold;
    }

    // Handle confidence upper bounds (e.g., "0.3-")
    if (expectedLower.endsWith('-')) {
      const threshold = parseFloat(expectedLower.replace('-', ''));
      return confidence !== undefined && confidence <= threshold;
    }

    // Handle confidence ranges (e.g., "0.8-1.0")
    if (expectedLower.includes('-')) {
      const [min, max] = expectedLower.split('-').map(Number);
      return confidence !== undefined && confidence >= min && confidence <= max;
    }

    // Default: check if judgment contains expected
    return judgment.includes(expectedLower);
  }
}
```