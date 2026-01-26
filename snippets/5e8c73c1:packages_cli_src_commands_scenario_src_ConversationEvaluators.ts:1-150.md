# 5e8c73c1:packages_cli_src_commands_scenario_src_ConversationEvaluators.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/ConversationEvaluators.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
// File: packages/cli/src/commands/scenario/src/ConversationEvaluators.ts
// Specialized evaluators for conversation scenarios

import { IAgentRuntime, ModelType } from '@elizaos/core';
import { ExecutionResult } from './providers';
import { Evaluator, EvaluationResult } from './EvaluationEngine';
import { Evaluation as EvaluationSchema } from './schema';

/**
 * Evaluates conversation length against specified criteria
 */
interface ConversationMetadata {
  turnCount: number;
  terminatedEarly?: boolean;
  terminationReason?: string;
  finalEvaluations?: unknown;
}

interface ConversationLengthParams {
  type: 'conversation_length';
  min_turns?: number;
  max_turns?: number;
  optimal_turns?: number;
  target_range?: [number, number];
}

export class ConversationLengthEvaluator implements Evaluator {
  async evaluate(params: EvaluationSchema, runResult: ExecutionResult): Promise<EvaluationResult> {
    const metadata = (
      runResult as ExecutionResult & { conversationMetadata?: ConversationMetadata }
    ).conversationMetadata;
    if (!metadata) {
      return {
        success: false,
        message: 'No conversation metadata found - not a conversation step',
      };
    }

    const { turnCount } = metadata;
    const typedParams = params as ConversationLengthParams;
    const { min_turns, max_turns, optimal_turns, target_range } = typedParams;

    let success = true;
    let message = `Conversation lasted ${turnCount} turns`;
    const issues: string[] = [];

    // Check minimum turns
    if (min_turns && turnCount < min_turns) {
      success = false;
      issues.push(`below minimum of ${min_turns}`);
    }

    // Check maximum turns
    if (max_turns && turnCount > max_turns) {
      success = false;
      issues.push(`above maximum of ${max_turns}`);
    }

    // Check target range
    if (target_range && target_range.length === 2) {
      const [min, max] = target_range;
      if (turnCount < min || turnCount > max) {
        success = false;
        issues.push(`outside target range ${min}-${max}`);
      }
    }

    // Add optimal turns information
    if (optimal_turns) {
      const distance = Math.abs(turnCount - optimal_turns);
      if (distance === 0) {
        message += ` (optimal)`;
      } else {
        message += ` (${distance} turns from optimal ${optimal_turns})`;
      }
    }

    // Add issues to message
    if (issues.length > 0) {
      message += ` - ${issues.join(', ')}`;
    }

    return { success, message };
  }
}

/**
 * Evaluates conversation flow patterns
 */
interface ConversationFlowParams {
  type: 'conversation_flow';
  required_patterns: string[];
  flow_quality_threshold?: number;
}

export class ConversationFlowEvaluator implements Evaluator {
  async evaluate(
    params: EvaluationSchema,
    runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EvaluationResult> {
    const typedParams = params as ConversationFlowParams;
    const { required_patterns, flow_quality_threshold } = typedParams;
    const conversationText = runResult.stdout;

    const detectedPatterns: string[] = [];
    const missedPatterns: string[] = [];

    for (const pattern of required_patterns) {
      const detected = await this.detectPattern(pattern, conversationText, runtime);
      if (detected) {
        detectedPatterns.push(pattern);
      } else {
        missedPatterns.push(pattern);
      }
    }

    const detectionRate = detectedPatterns.length / required_patterns.length;
    const threshold = flow_quality_threshold || 0.7;
    const success = detectionRate >= threshold;

    let message = `Flow analysis: ${detectedPatterns.length}/${required_patterns.length} patterns detected`;

    if (detectedPatterns.length > 0) {
      message += ` (✓ ${detectedPatterns.join(', ')})`;
    }

    if (missedPatterns.length > 0) {
      message += ` (✗ ${missedPatterns.join(', ')})`;
    }

    return { success, message };
  }

  private async detectPattern(
    pattern: string,
    conversationText: string,
    runtime: IAgentRuntime
  ): Promise<boolean> {
    const patternPrompts = {
      question_then_answer:
        'Does this conversation contain instances where the agent asks a question and the user provides an answer?',
      problem_then_solution:
        'Does this conversation show the user stating a problem and the agent providing a solution?',
      clarification_cycle:
        'Does this conversation include back-and-forth clarification between user and agent?',
      empathy_then_solution: 'Does the agent show empathy before providing solutions?',
      escalation_pattern: 'Does the conversation include appropriate escalation when needed?',
    };

```