# 5e8c73c1:packages_cli_src_commands_scenario_src_MockEngine.ts:451-542

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/MockEngine.ts:451-542
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const index = parseInt(indexStr, 10);
      if (!isNaN(index) && index >= 0 && index < variables.args.length) {
        return variables.args[index];
      }
      return undefined;
    }

    // Handle object property access like input.prop, context.prop
    const parts = expression.split('.');
    if (parts.length >= 2) {
      const rootVar = parts[0];
      const propertyPath = parts.slice(1);

      let current: unknown;
      switch (rootVar) {
        case 'input':
          current = variables.input;
          break;
        case 'context':
          current = variables.context;
          break;
        case 'args':
          current = variables.args;
          break;
        default:
          throw new Error(`Unauthorized variable access: ${rootVar}`);
      }

      // Navigate the property path safely
      for (const prop of propertyPath) {
        if (current && typeof current === 'object' && prop in current) {
          current = (current as Record<string, unknown>)[prop];
        } else {
          return undefined;
        }
      }

      return current;
    }

    // Handle direct variable access
    switch (expression) {
      case 'args':
        return variables.args;
      case 'input':
        return variables.input;
      case 'context':
        return variables.context;
      default:
        throw new Error(`Unauthorized variable access: ${expression}`);
    }
  }

  /**
   * Perform safe comparison operations
   * SECURITY: Only allows whitelisted comparison operators
   */
  private performSafeComparison(left: string, operator: string, right: string): boolean {
    // Remove quotes if present
    const cleanLeft = left.replace(/^['"]|['"]$/g, '');
    const cleanRight = right.replace(/^['"]|['"]$/g, '');

    // Try to parse as numbers if possible
    const leftNum = parseFloat(cleanLeft);
    const rightNum = parseFloat(cleanRight);
    const leftIsNum = !isNaN(leftNum);
    const rightIsNum = !isNaN(rightNum);

    // Use numeric comparison if both are numbers
    const leftVal = leftIsNum ? leftNum : cleanLeft;
    const rightVal = rightIsNum ? rightNum : cleanRight;

    switch (operator) {
      case '===':
      case '==':
        return leftVal === rightVal;
      case '!==':
      case '!=':
        return leftVal !== rightVal;
      case '>=':
        return leftIsNum && rightIsNum ? leftNum >= rightNum : String(leftVal) >= String(rightVal);
      case '<=':
        return leftIsNum && rightIsNum ? leftNum <= rightNum : String(leftVal) <= String(rightVal);
      case '>':
        return leftIsNum && rightIsNum ? leftNum > rightNum : String(leftVal) > String(rightVal);
      case '<':
        return leftIsNum && rightIsNum ? leftNum < rightNum : String(leftVal) < String(rightVal);
      default:
        throw new Error(`Unsupported comparison operator: ${operator}`);
    }
  }
}
```