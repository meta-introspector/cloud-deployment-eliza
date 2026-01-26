# a7046c18:packages_core_typescript_src_schemas_character.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/schemas/character.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      z.boolean(),
      z.number(),
      z.object({}).loose(),
      z.array(z.unknown()),
    ]),
  )
  .optional()
  .describe(
    "Character-specific settings like avatar URL, preferences, and configuration",
  );

// Secrets schema
export const secretsSchema = z
  .record(z.string(), z.union([z.string(), z.boolean(), z.number()]))
  .optional()
  .describe(
    "Secret values and API keys (should not be committed to version control)",
  );

// Main Character schema
export const characterSchema = z
  .object({
    id: uuidSchema.optional().describe("Unique identifier for the character"),
    name: z
      .string()
      .min(1, "Character name is required")
      .describe('The name of the character (e.g., "Eliza")'),
    username: z
      .string()
      .optional()
      .describe("Username for the character on various platforms"),
    system: z
      .string()
      .optional()
      .describe(
        "System prompt that defines the character's core behavior and response style",
      ),
    templates: z
      .record(z.string(), templateTypeSchema)
      .optional()
      .describe("Custom templates for generating different types of content"),
    bio: z
      .union([z.string(), z.array(z.string())])
      .describe(
        "Character biography - can be a single string or array of biographical points",
      ),
    messageExamples: z
      .array(z.array(messageExampleSchema))
      .optional()
      .describe(
        "Example conversations showing how the character responds in different scenarios",
      ),
    postExamples: z
      .array(z.string())
      .optional()
      .describe(
        "Example social media posts demonstrating the character's voice and topics",
      ),
    topics: z
      .array(z.string())
      .optional()
      .describe("Topics the character is knowledgeable about and engages with"),
    adjectives: z
      .array(z.string())
      .optional()
      .describe(
        "Adjectives that describe the character's personality and traits",
      ),
    knowledge: z
      .array(knowledgeItemSchema)
      .optional()
      .describe(
        "Knowledge sources (files, directories) the character can reference",
      ),
    plugins: z
      .array(z.string())
      .optional()
      .describe(
        'List of plugin package names to load (e.g., ["@elizaos/plugin-sql", "@elizaos/plugin-bootstrap"] - these are commonly required)',
      ),
    settings: settingsSchema,
    secrets: secretsSchema,
    style: styleSchema,
  })
  .strict() // Only allow known properties
  .describe(
    "Complete character definition including personality, behavior, and capabilities",
  );

// Validation result type
export interface CharacterValidationResult {
  success: boolean;
  data?: Character;
  error?: {
    message: string;
    issues?: z.ZodIssue[];
  };
}

/**
 * Safely validates character data using Zod schema
 * @param data - Raw character data to validate
 * @returns Validation result with success flag and either data or error
 */
export function validateCharacter(data: unknown): CharacterValidationResult {
  const result = characterSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data as Character,
    };
  }

  return {
    success: false,
    error: {
      message: `Character validation failed: ${result.error.message}`,
      issues: result.error.issues,
    },
  };
}

/**
 * Safely parses JSON string and validates as character
 * @param jsonString - JSON string to parse and validate
 * @returns Validation result with success flag and either data or error
 */
export function parseAndValidateCharacter(
  jsonString: string,
): CharacterValidationResult {
  try {
    const parsed = JSON.parse(jsonString);
    return validateCharacter(parsed);
  } catch (error) {
    return {
      success: false,
      error: {
        message: `Invalid JSON: ${error instanceof Error ? error.message : "Unknown JSON parsing error"}`,
      },
    };
  }
}

/**
 * Type guard to check if data is a valid Character
 * @param data - Data to check
 * @returns True if data is a valid Character
 */
export function isValidCharacter(data: unknown): data is Character {
```