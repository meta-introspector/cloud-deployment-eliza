# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-runner.ts:301-332

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-runner.ts:301-332
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  const pessimistic = totalRuns * averageScenarioTime * 2 + totalCombinations * setupOverhead;

  return {
    totalCombinations,
    totalRuns,
    estimatedDuration: {
      optimistic: Math.round(optimistic),
      realistic: Math.round(realistic),
      pessimistic: Math.round(pessimistic),
    },
  };
}

/**
 * Formats execution time in a human-readable format.
 *
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}
```