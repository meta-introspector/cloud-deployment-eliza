# 5e8c73c1:packages_cli_src_commands_scenario_src_EvaluationEngine.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/EvaluationEngine.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
CRITICAL: You must respond with a JSON object that EXACTLY matches this schema:
${JSON.stringify(jsonSchema, null, 2)}

The response MUST include these exact field names:
${
  typeof jsonSchema === 'object' &&
  jsonSchema !== null &&
  'properties' in jsonSchema &&
  typeof jsonSchema.properties === 'object' &&
  jsonSchema.properties !== null
    ? Object.keys(jsonSchema.properties).join(', ')
    : 'N/A'
}

Do not use any other field names. Use only the exact field names specified above.`;

    try {
      // Check if the picked model is available; if not, return gracefully
      // Note: models property is internal to runtime, accessing for debugging only
      // const availableModels = (runtime as IAgentRuntime & { models?: Map<string, unknown> | Record<string, unknown> }).models; // unused
      // const modelKeys =
      //   availableModels && typeof availableModels.keys === 'function'
      //     ? Array.from(availableModels.keys())
      //     : Object.keys(availableModels || {});
      // console.log(`🔍 [LLMJudgeEvaluator] Available models: ${JSON.stringify(availableModels)}`);
      // console.log(`🔍 [LLMJudgeEvaluator] Model keys: ${JSON.stringify(modelKeys)}`);
      const modelHandler = runtime.getModel(modelType);
      console.log(`🔍 [LLMJudgeEvaluator] Model handler: ${JSON.stringify(modelHandler)}`);
      console.log(`🔍 [LLMJudgeEvaluator] Model type: ${modelType}`);
      console.log(`🔍 [LLMJudgeEvaluator] Candidate models: ${candidateModels.join(', ')}`);
      if (!modelHandler) {
        return {
          success: false,
          message: `LLM judge: no available model handler (tried ${candidateModels.join(', ')})`,
        };
      }

      // Check if OpenAI plugin is loaded
      // const openaiService = runtime.getService('openai');

      // Check all loaded services
      // const allServices = runtime.services;

      // Do not include runtime here; runtime.useModel will inject it
      const objectParams: Omit<ObjectGenerationParams, 'runtime'> = {
        prompt: fullPrompt,
        schema: jsonSchema,
        temperature,
        output: 'object',
      };

      const response = await Promise.race([
        runtime.useModel(modelType, objectParams),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`LLM judge timeout after ${timeoutMs}ms`)), timeoutMs)
        ),
      ]);

      // The object model should return a proper object, but let's validate it
      const parsedResponse = this.validateResponse(response, jsonSchema) as Record<string, unknown>;

      // Compare with expected result
      const success = this.compareWithExpected(parsedResponse, expected);

      const responseObj = parsedResponse as Record<string, unknown>;
      const judgment = responseObj.judgment as string | undefined;
      const confidence = responseObj.confidence as number | undefined;

      return {
        success,
        message: `LLM judgment: ${judgment || 'unknown'} (confidence: ${confidence ?? 'unknown'}). Expected: "${expected}". Result: ${success}`,
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const isTimeout = msg.toLowerCase().includes('timeout');
      return {
        success: false,
        message: isTimeout ? `LLM judge timed out after ${timeoutMs}ms` : `LLM judge error: ${msg}`,
      };
    }
  }

  private getDefaultJudgmentSchema(): JSONSchema {
    return {
      type: 'object',
      properties: {
        judgment: { type: 'string', enum: ['yes', 'no'] },
        confidence: { type: 'number', minimum: 0, maximum: 1 },
        reasoning: { type: 'string' },
      },
      required: ['judgment', 'confidence', 'reasoning'],
    };
  }

  private validateResponse(response: unknown, schema: JSONSchema): unknown {
    // The object model should return a proper object, but let's validate it
    if (typeof response === 'string') {
      // Fallback: parse as JSON if it's a string
      const parsed = JSON.parse(response);
      return this.validateWithZod(parsed, schema);
    }

    // If it's already an object, validate it directly
    return this.validateWithZod(response, schema);
  }

  private validateWithZod(response: unknown, schema: JSONSchema): unknown {
    try {
      const zodSchema = this.convertToZodSchema(schema);
      return zodSchema.parse(response);
    } catch (error) {
      throw error;
    }
  }

  private convertToZodSchema(schema: JSONSchema): z.ZodObject<Record<string, z.ZodTypeAny>> {
    // Convert JSON schema to Zod schema
    const properties: Record<string, z.ZodTypeAny> = {};

    const schemaProperties =
      (schema.properties as
        | Record<string, { type?: string; enum?: string[]; minimum?: number; maximum?: number }>
        | undefined) || {};
    for (const [key, prop] of Object.entries(schemaProperties)) {
      const propSchema = prop;

      if (propSchema.type === 'string') {
        let zodProp: z.ZodTypeAny = z.string();
        if (propSchema.enum) {
          zodProp = z.enum(propSchema.enum as [string, ...string[]]);
        }
        properties[key] = zodProp;
      } else if (propSchema.type === 'number') {
        let zodProp = z.number();
        if (propSchema.minimum !== undefined) {
          zodProp = zodProp.min(propSchema.minimum);
        }
        if (propSchema.maximum !== undefined) {
          zodProp = zodProp.max(propSchema.maximum);
        }
        properties[key] = zodProp;
      } else if (propSchema.type === 'boolean') {
        properties[key] = z.boolean();
      }
    }

    return z.object(properties);
  }

  private compareWithExpected(parsedResponse: Record<string, unknown>, expected: string): boolean {
```