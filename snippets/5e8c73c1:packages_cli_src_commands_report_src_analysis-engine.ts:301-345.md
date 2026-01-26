# 5e8c73c1:packages_cli_src_commands_report_src_analysis-engine.ts:301-345

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/src/analysis-engine.ts:301-345
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          pattern.totalDuration += duration;
        } else {
          trajectoryPatterns.set(sequenceKey, {
            count: 1,
            totalDuration: duration,
            sequence: [...sequence], // Create a copy of the sequence array
          });
        }
      }
    });

    // Convert to CommonTrajectory objects and sort by frequency
    const totalRunsWithTrajectories = runs.filter(
      (run) => run.trajectory && run.trajectory.length > 0
    ).length;

    const commonTrajectories: CommonTrajectory[] = Array.from(trajectoryPatterns.entries())
      .map(([_, pattern]) => ({
        sequence: pattern.sequence,
        count: pattern.count,
        average_duration: pattern.totalDuration / pattern.count,
        percentage: totalRunsWithTrajectories > 0 ? pattern.count / totalRunsWithTrajectories : 0,
      }))
      .sort((a, b) => b.count - a.count); // Sort by frequency (most common first)

    return commonTrajectories;
  }

  /**
   * Calculate median value from sorted array of numbers
   */
  private calculateMedian(sortedNumbers: number[]): number {
    if (sortedNumbers.length === 0) return 0;

    const middle = Math.floor(sortedNumbers.length / 2);

    if (sortedNumbers.length % 2 === 0) {
      // Even number of elements - average of two middle values
      return (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
    } else {
      // Odd number of elements - middle value
      return sortedNumbers[middle];
    }
  }
}
```