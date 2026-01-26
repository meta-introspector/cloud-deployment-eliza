# 5e8c73c1:packages_cli_src_commands_scenario_src_MockEngine.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/MockEngine.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

  /**
   * Record mock execution for history and debugging
   */
  private recordMockExecution(
    serviceMethod: string,
    args: unknown[],
    mock: MockDefinition,
    executionTime: number
  ): void {
    const historyEntry: MockExecutionHistory = {
      service: serviceMethod.split('.')[0],
      method: serviceMethod.split('.')[1],
      args,
      matchedMock: mock,
      timestamp: new Date(),
      executionTime,
    };

    this.mockHistory.push(historyEntry);

    this.logger.info(`Mock triggered: ${serviceMethod}`);
    this.logger.debug(`  Condition: ${JSON.stringify(mock.when)}`);
    this.logger.debug(`  Args: ${JSON.stringify(args)}`);
    this.logger.debug(`  Execution time: ${executionTime}ms`);

    if (mock.responseFn) {
      this.logger.debug(`  Using dynamic response function`);
    } else if (mock.error) {
      this.logger.debug(`  Simulating error: ${mock.error.code}`);
    } else {
      this.logger.debug(`  Using static response`);
    }
  }

  /**
   * Get mock execution history
   */
  public getMockHistory(): MockExecutionHistory[] {
    return [...this.mockHistory];
  }

  /**
   * Clear mock history
   */
  public clearMockHistory(): void {
    this.mockHistory = [];
  }

  /**
   * Get mock statistics
   */
  public getMockStatistics(): { totalExecutions: number; averageExecutionTime: number } {
    if (this.mockHistory.length === 0) {
      return { totalExecutions: 0, averageExecutionTime: 0 };
    }

    const totalExecutions = this.mockHistory.length;
    const totalTime = this.mockHistory.reduce((sum, entry) => sum + entry.executionTime, 0);
    const averageExecutionTime = totalTime / totalExecutions;

    return { totalExecutions, averageExecutionTime };
  }

  /**
   * Parse response template with safe variable interpolation
   * SECURITY: Only allows predefined variables, no arbitrary code execution
   */
  private parseResponseTemplate(
    template: string,
    variables: { args: unknown[]; input: Record<string, unknown>; context: Record<string, unknown> }
  ): unknown {
    // Handle JSON response templates
    if (template.trim().startsWith('{') || template.trim().startsWith('[')) {
      try {
        return JSON.parse(this.interpolateTemplate(template, variables));
      } catch (error) {
        this.logger.error(`Failed to parse JSON template: ${error}`);
        throw new Error('Invalid JSON template');
      }
    }

    // Handle string templates
    return this.interpolateTemplate(template, variables);
  }

  /**
   * Evaluate template for boolean conditions
   * SECURITY: Only allows safe comparison operations, no arbitrary code execution
   */
  private evaluateTemplate(
    template: string,
    variables: { args: unknown[]; input: Record<string, unknown>; context: Record<string, unknown> }
  ): boolean {
    // Simple boolean template evaluation with safe operations
    // Supports patterns like: "${input.type} === 'test'" or "${args[0]} > 10"
    const interpolated = this.interpolateTemplate(template, variables);

    // Parse simple boolean expressions safely
    try {
      // Only allow safe comparison operations
      const safeExpression = interpolated.replace(/[^\w\s===!<>()\[\]\.'"]/g, '');

      // Basic pattern matching for simple comparisons
      const comparisonRegex = /^\s*(.+?)\s*(===|!==|==|!=|>=|<=|>|<)\s*(.+?)\s*$/;
      const match = safeExpression.match(comparisonRegex);

      if (match) {
        const [, left, operator, right] = match;
        return this.performSafeComparison(left.trim(), operator, right.trim());
      }

      // For non-comparison expressions, check if it's truthy
      return Boolean(interpolated && interpolated !== 'false' && interpolated !== '0');
    } catch (error) {
      this.logger.error(`Template evaluation error: ${error}`);
      return false;
    }
  }

  /**
   * Perform safe string interpolation
   * SECURITY: Only allows access to whitelisted variables
   */
  private interpolateTemplate(
    template: string,
    variables: { args: unknown[]; input: Record<string, unknown>; context: Record<string, unknown> }
  ): string {
    return template.replace(/\$\{([^}]+)\}/g, (match, expression) => {
      try {
        const value = this.resolveTemplateVariable(expression.trim(), variables);
        return String(value);
      } catch (error) {
        this.logger.warn(`Failed to resolve template variable: ${expression}`);
        return match; // Return original if resolution fails
      }
    });
  }

  /**
   * Resolve template variables safely
   * SECURITY: Only allows access to predefined variable paths
   */
  private resolveTemplateVariable(
    expression: string,
    variables: { args: unknown[]; input: Record<string, unknown>; context: Record<string, unknown> }
  ): unknown {
    // Handle array access like args[0], args[1], etc.
    if (expression.startsWith('args[') && expression.endsWith(']')) {
      const indexStr = expression.slice(5, -1);
```