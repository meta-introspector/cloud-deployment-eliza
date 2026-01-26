# 12812d74:packages_cli_src_commands_scenario_src_UserSimulator.ts:1-150

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/cli/src/commands/scenario/src/UserSimulator.ts:1-150
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
// File: packages/cli/src/commands/scenario/src/UserSimulator.ts
// User simulator for generating realistic user responses in multi-turn conversations

import { IAgentRuntime, ModelType } from '@elizaos/core';
import { ConversationTurn, SimulationContext, UserSimulatorConfig } from './conversation-types';

/**
 * UserSimulator generates realistic user responses based on persona and objectives
 * Uses LLM to simulate believable user behavior in conversations
 */
export class UserSimulator {
  private runtime: IAgentRuntime;
  private config: UserSimulatorConfig;

  constructor(runtime: IAgentRuntime, config: UserSimulatorConfig) {
    this.runtime = runtime;
    this.config = config;
  }

  /**
   * Generate a user response based on conversation history and agent's latest response
   * @param conversationHistory - Previous turns in the conversation
   * @param latestAgentResponse - The agent's most recent response
   * @param context - Current simulation context (turn number, debug options, etc.)
   * @returns Simulated user response
   */
  async generateResponse(
    conversationHistory: ConversationTurn[],
    latestAgentResponse: string,
    context: SimulationContext
  ): Promise<string> {
    const prompt = this.buildSimulationPrompt(conversationHistory, latestAgentResponse, context);

    try {
      console.log(
        `👤 [UserSimulator] Calling LLM with model: ${this.config.model_type || ModelType.TEXT_LARGE}`
      );
      console.log(`👤 [UserSimulator] Prompt length: ${prompt.length}`);
      console.log(`👤 [UserSimulator] Prompt preview: ${prompt.substring(0, 200)}...`);

      const rawResponse = await this.runtime.useModel((this.config.model_type || ModelType.TEXT_LARGE) as keyof import('@elizaos/core').ModelParamsMap, {
        prompt: prompt,
        temperature: this.config.temperature || 0.8,
      });
      const response = String(rawResponse || '');

      console.log(`👤 [UserSimulator] Raw LLM response: "${response}"`);
      console.log(`👤 [UserSimulator] Response type: ${typeof response}`);
      console.log(`👤 [UserSimulator] Response length: ${response.length}`);

      // Log simulation for debugging
      if (context.debugOptions?.log_user_simulation) {
        console.log(`👤 [UserSimulator] Generated response: "${response}"`);
        console.log(`👤 [UserSimulator] Context: Turn ${context.turnNumber}/${context.maxTurns}`);
        console.log(`👤 [UserSimulator] Persona: ${this.config.persona}`);
      }

      // Clean up the response (remove any meta-commentary)
      const cleanedResponse = this.cleanResponse(response);
      console.log(`👤 [UserSimulator] Cleaned response: "${cleanedResponse}"`);

      // Ensure we never return an empty string
      if (!cleanedResponse || cleanedResponse.trim() === '') {
        console.log(`👤 [UserSimulator] ⚠️ Empty response detected, using fallback`);
        return this.generateFallbackResponse(latestAgentResponse, context);
      }

      return cleanedResponse;
    } catch (error) {
      console.error(`❌ [UserSimulator] Failed to generate response:`, error);
      console.error(`❌ [UserSimulator] Error details:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        promptLength: prompt.length,
        modelType: this.config.model_type || 'TEXT_LARGE',
        temperature: this.config.temperature || 0.8,
        maxTokens: this.config.max_tokens || 200,
      });
      // Fallback to a simple response based on persona
      return this.generateFallbackResponse(latestAgentResponse, context);
    }
  }

  /**
   * Build the LLM prompt for user simulation
   * @private
   */
  private buildSimulationPrompt(
    history: ConversationTurn[],
    agentResponse: string,
    _context: SimulationContext
  ): string {
    const { persona, objective, style, constraints, emotional_state, knowledge_level } =
      this.config;

    // Simplified prompt structure to avoid LLM confusion
    let prompt = `Roleplay as a user with this profile:
Persona: ${persona}
Goal: ${objective}
Style: ${style || 'natural'}
Knowledge: ${knowledge_level}`;

    if (emotional_state) {
      prompt += `\nMood: ${emotional_state}`;
    }

    if (constraints.length > 0) {
      prompt += `\nConstraints: ${constraints.join(', ')}`;
    }

    // Add recent conversation context (limit to 2 turns to reduce complexity)
    const recentHistory = history.slice(-2);
    if (recentHistory.length > 0) {
      prompt += `\n\nRecent conversation:`;
      recentHistory.forEach((turn, i) => {
        const turnNum = history.length - recentHistory.length + i + 1;
        prompt += `\nTurn ${turnNum}: User: "${turn.userInput}" Agent: "${turn.agentResponse}"`;
      });
    }

    prompt += `\n\nAgent just said: "${agentResponse}"

Respond as the user (20-100 words, natural conversation):`;

    return prompt;
  }

  /**
   * Clean up the LLM response to remove any meta-commentary or formatting
   * @private
   */
  private cleanResponse(response: string): string {
    // Remove common meta-commentary patterns
    let cleaned = response.trim();

    // Remove "As a [persona]..." prefixes
    cleaned = cleaned.replace(/^As a [^,]+,?\s*/i, '');

    // Remove "The user would say:" or similar prefixes
    cleaned = cleaned.replace(/^(The user (would )?say|User response|Response):\s*/i, '');

    // Remove quotes if the entire response is quoted
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }

    // Remove excessive whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned;
```