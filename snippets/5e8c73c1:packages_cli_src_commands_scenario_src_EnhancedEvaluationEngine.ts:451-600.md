# 5e8c73c1:packages_cli_src_commands_scenario_src_EnhancedEvaluationEngine.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EnhancedEvaluationEngine.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            ? response
            : typeof response === 'object' && response !== null && !Array.isArray(response)
              ? (response as Record<string, unknown>)
              : String(response);
        parsedResponse = this.validateStructuredResponse(responseValue, jsonSchema);
      } catch (parseError: unknown) {
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        return {
          evaluator_type: 'llm_judge',
          success: false,
          summary: `LLM Judge FAILED: Invalid LLM response - ${errorMessage}`,
          details: {
            error: 'llm_parse_error',
            error_type: 'llm_parse_error',
            error_message: errorMessage,
            model_used: modelType,
            prompt,
            expected,
            raw_llm_response: response,
            custom_capabilities_provided: !!(capabilities && capabilities.length > 0),
            capabilities_count: capabilities ? capabilities.length : 0,
          },
        };
      }
      const success = this.compareWithExpected(parsedResponse, expected);

      return {
        evaluator_type: 'llm_judge',
        success,
        summary: `LLM Judge ${success ? 'PASSED' : 'FAILED'}: ${parsedResponse.qualitative_summary.substring(0, 150)}${parsedResponse.qualitative_summary.length > 150 ? '...' : ''}`,
        details: {
          llm_judge_result: {
            qualitative_summary: parsedResponse.qualitative_summary,
            capability_checklist: parsedResponse.capability_checklist,
          },
          custom_capabilities_provided: !!(capabilities && capabilities.length > 0),
          capabilities_count: capabilities ? capabilities.length : 5, // Default capabilities count
          judgment_confidence: parsedResponse.confidence,
          expected_outcome: expected,
          model_used: modelType,
          prompt_used: prompt,
          raw_llm_response: response,
        },
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const isTimeout = msg.toLowerCase().includes('timeout');

      return {
        evaluator_type: 'llm_judge',
        success: false,
        summary: isTimeout
          ? `LLM Judge FAILED: Timed out after ${timeoutMs}ms.`
          : `LLM Judge FAILED: ${msg}`,
        details: {
          error: isTimeout ? 'llm_timeout' : 'llm_error',
          error_type: isTimeout ? 'llm_timeout' : 'llm_error',
          error_message: msg,
          timeout_ms: timeoutMs,
          model_attempted: modelType,
          prompt,
          expected,
          custom_capabilities_provided: !!(capabilities && capabilities.length > 0),
          capabilities_count: capabilities ? capabilities.length : 0,
        },
      };
    }
  }

  private createStructuredPrompt(
    runResult: ExecutionResult,
    userPrompt: string,
    expected: string,
    capabilities?: string[]
  ): string {
    // Default capabilities if none provided
    const defaultCapabilities = [
      'Task Completion',
      'Response Quality',
      'User Intent Understanding',
      'Error Handling',
      'Appropriate Response Format',
    ];

    const capabilitiesToUse =
      capabilities && capabilities.length > 0 ? capabilities : defaultCapabilities;

    // Build capabilities list for prompt
    const capabilitiesSection = capabilitiesToUse
      .map((capability, index) => {
        return `${index + 1}. ${capability}`;
      })
      .join('\n');

    return `You are an expert evaluator analyzing an AI agent's performance. Provide a comprehensive, structured assessment.

## Execution Context
- Exit Code: ${runResult.exitCode}
- Standard Output: ${runResult.stdout}
- Standard Error: ${runResult.stderr}  
- Files Created: ${Object.keys(runResult.files).join(', ') || 'None'}

## Evaluation Question
${userPrompt}

## Expected Outcome
${expected}

## Instructions
Analyze the agent's performance and provide a detailed assessment. You must evaluate the agent against the following specific capabilities:

${capabilitiesSection}

For each capability listed above, you must assess whether the agent achieved it and provide detailed reasoning. Your response should include:

1. **Qualitative Summary**: A comprehensive paragraph summarizing overall performance
2. **Capability Checklist**: For each capability above, provide:
   - capability: The exact capability name from the list
   - achieved: Boolean indicating if the capability was demonstrated
   - reasoning: Detailed explanation of your assessment

Provide your assessment as a structured JSON response with detailed reasoning for each capability.`;
  }

  private getStructuredJudgmentSchema() {
    return {
      type: 'object',
      properties: {
        qualitative_summary: {
          type: 'string',
          description:
            "A comprehensive paragraph summarizing the agent's performance, reasoning, and notable successes or failures",
        },
        capability_checklist: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              capability: { type: 'string' },
              achieved: { type: 'boolean' },
              reasoning: { type: 'string' },
            },
            required: ['capability', 'achieved', 'reasoning'],
          },
        },
        confidence: {
          type: 'number',
          minimum: 0,
          maximum: 1,
          description: 'Confidence level in the assessment (0-1)',
```