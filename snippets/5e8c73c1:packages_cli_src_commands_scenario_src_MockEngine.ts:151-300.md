# 5e8c73c1:packages_cli_src_commands_scenario_src_MockEngine.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/MockEngine.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  }

  /**
   * Enhanced condition matching with multiple strategies
   */
  private async matchesCondition(mock: MockDefinition, args: unknown[]): Promise<boolean> {
    if (!mock.when) return true; // Generic mock

    const input = this.extractInputFromArgs(args);
    const context = this.buildRequestContext(args);

    // 1. Exact argument matching (existing)
    if (mock.when.args) {
      if (!_.isEqual(args, mock.when.args)) {
        return false;
      }
    }

    // 2. Input parameter matching
    if (mock.when.input) {
      if (!this.matchesInput(input, mock.when.input)) {
        return false;
      }
    }

    // 3. Context matching
    if (mock.when.context) {
      if (!this.matchesContext(context, mock.when.context)) {
        return false;
      }
    }

    // 4. Custom matcher template (SECURITY FIX: No more arbitrary code execution)
    if (mock.when.matcher) {
      try {
        const result = this.evaluateTemplate(mock.when.matcher, { args, input, context });
        if (!result) {
          return false;
        }
      } catch (error) {
        this.logger.error(`Matcher template error: ${error}`);
        return false;
      }
    }

    // 5. Partial argument matching
    if (mock.when.partialArgs) {
      if (!this.matchesPartialArgs(args, mock.when.partialArgs)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Extract input parameters from method arguments
   */
  private extractInputFromArgs(args: unknown[]): Record<string, unknown> {
    const input: Record<string, unknown> = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (typeof arg === 'object' && arg !== null) {
        Object.assign(input, arg);
      } else if (typeof arg === 'string' || typeof arg === 'number') {
        input[`arg${i}`] = arg;
      }
    }

    return input;
  }

  /**
   * Build request context for matching
   */
  private buildRequestContext(args: unknown[]): Record<string, unknown> {
    return {
      timestamp: new Date().toISOString(),
      argsCount: args.length,
      hasObjectArgs: args.some((arg) => typeof arg === 'object'),
    };
  }

  /**
   * Sort mocks by specificity (more specific conditions first)
   */
  private sortMocksBySpecificity(mocks: MockDefinition[]): MockDefinition[] {
    return mocks.sort((a, b) => {
      const aSpecificity = this.calculateSpecificity(a);
      const bSpecificity = this.calculateSpecificity(b);
      return bSpecificity - aSpecificity; // Descending order
    });
  }

  private calculateSpecificity(mock: MockDefinition): number {
    let score = 0;
    if (mock.when) {
      if (mock.when.args) score += 10;
      if (mock.when.input) score += 8;
      if (mock.when.context) score += 6;
      if (mock.when.matcher) score += 4;
      if (mock.when.partialArgs) score += 2;
    }
    return score;
  }

  /**
   * Match input parameters
   */
  private matchesInput(
    input: Record<string, unknown>,
    expectedInput: Record<string, unknown>
  ): boolean {
    for (const [key, value] of Object.entries(expectedInput)) {
      if (!_.isEqual(input[key], value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Match context parameters
   */
  private matchesContext(
    context: Record<string, unknown>,
    expectedContext: Record<string, unknown>
  ): boolean {
    for (const [key, value] of Object.entries(expectedContext)) {
      if (!_.isEqual(context[key], value)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Match partial arguments
   */
  private matchesPartialArgs(args: unknown[], partialArgs: unknown[]): boolean {
    if (args.length < partialArgs.length) return false;

    for (let i = 0; i < partialArgs.length; i++) {
      if (!_.isEqual(args[i], partialArgs[i])) {
        return false;
      }
    }
    return true;
  }
```