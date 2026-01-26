# 5e8c73c1:packages_cli_src_commands_scenario_src_EnhancedEvaluationEngine.ts:601-710

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EnhancedEvaluationEngine.ts:601-710
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        },
        overall_success: {
          type: 'boolean',
          description: 'Whether the agent successfully met the expected outcome',
        },
      },
      required: ['qualitative_summary', 'capability_checklist', 'confidence', 'overall_success'],
    };
  }

  private validateStructuredResponse(
    response: string | Record<string, unknown>,
    _schema: Record<string, unknown>
  ): {
    qualitative_summary: string;
    capability_checklist: Array<{ capability: string; achieved: boolean; reasoning: string }>;
    confidence?: number;
    overall_success?: boolean;
  } {
    interface PartialStructuredResponse {
      qualitative_summary?: string;
      capability_checklist?: unknown;
      confidence?: number;
      overall_success?: boolean;
    }

    interface CapabilityItem {
      capability?: string;
      achieved?: boolean;
      reasoning?: string;
    }

    interface CompleteStructuredResponse {
      qualitative_summary: string;
      capability_checklist: Array<{ capability: string; achieved: boolean; reasoning: string }>;
      confidence?: number;
      overall_success?: boolean;
    }

    const responseObj = typeof response === 'string' ? JSON.parse(response) : response;
    const typedResponse = responseObj as PartialStructuredResponse;

    // Validate required fields
    if (!typedResponse.qualitative_summary || !typedResponse.capability_checklist) {
      throw new Error('Invalid LLM response: missing required fields');
    }

    // Ensure capability_checklist is properly formatted
    if (!Array.isArray(typedResponse.capability_checklist)) {
      throw new Error('Invalid LLM response: capability_checklist must be an array');
    }

    const capabilityChecklist = typedResponse.capability_checklist as CapabilityItem[];

    // Add default capabilities if none provided
    if (capabilityChecklist.length === 0) {
      capabilityChecklist.push({
        capability: 'Task Completion',
        achieved: typedResponse.overall_success || false,
        reasoning: 'Default capability assessment based on overall success',
      });
    }

    // Provide default values for missing fields
    if (typedResponse.confidence === undefined) {
      typedResponse.confidence = 0.8; // Default confidence
    }

    // Parse again to get complete response (duplicate code but needed for type narrowing)
    const completeResponseObj = typeof response === 'string' ? JSON.parse(response) : response;
    const completeTypedResponse = completeResponseObj as CompleteStructuredResponse;

    if (completeTypedResponse.overall_success === undefined) {
      // Determine overall success based on capability checklist
      const allAchieved = completeTypedResponse.capability_checklist.every(
        (cap) => cap.achieved === true
      );
      completeTypedResponse.overall_success = allAchieved;
    }

    return completeTypedResponse;
  }

  private compareWithExpected(
    parsedResponse: {
      overall_success?: boolean;
      confidence?: number;
      [key: string]: unknown;
    },
    expected: string
  ): boolean {
    const overallSuccess = parsedResponse.overall_success;
    const confidence = parsedResponse.confidence || 0;
    const expectedLower = expected.toLowerCase();

    // Handle yes/no expectations
    if (expectedLower === 'yes' || expectedLower === 'no') {
      return (expectedLower === 'yes') === overallSuccess;
    }

    // Handle confidence thresholds
    if (expectedLower.includes('+')) {
      const threshold = parseFloat(expectedLower.replace('+', ''));
      return confidence >= threshold;
    }

    // Default: use overall_success from LLM
    return overallSuccess ?? false;
  }
}
```