# 5e8c73c1:packages_cli_src_commands_scenario_src_ConversationEvaluators.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/ConversationEvaluators.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    const prompt = (patternPrompts as Record<string, string>)[pattern];
    if (!prompt) {
      console.warn(`[ConversationFlowEvaluator] Unknown pattern: ${pattern}`);
      return false;
    }

    const analysisPrompt = `${prompt}

Conversation:
${conversationText}

Analyze the conversation and respond with only 'yes' or 'no'.`;

    try {
      const response = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: analysisPrompt,
        temperature: 0.1,
      });

      return response.toLowerCase().includes('yes');
    } catch (error) {
      console.error(`[ConversationFlowEvaluator] Pattern detection failed for ${pattern}:`, error);
      return false;
    }
  }
}

/**
 * Evaluates user satisfaction based on conversation content
 */
interface UserSatisfactionParams {
  type: 'user_satisfaction';
  satisfaction_threshold?: number;
  indicators?: {
    positive?: string[];
    negative?: string[];
  };
  measurement_method?: 'sentiment_analysis' | 'keyword_analysis' | 'llm_judge';
}

export class UserSatisfactionEvaluator implements Evaluator {
  async evaluate(
    params: EvaluationSchema,
    runResult: ExecutionResult,
    runtime: IAgentRuntime
  ): Promise<EvaluationResult> {
    const typedParams = params as UserSatisfactionParams;
    const { satisfaction_threshold, indicators, measurement_method } = typedParams;
    const conversationText = runResult.stdout;

    let satisfactionScore = 0;
    const method = measurement_method || 'llm_judge';

    switch (method) {
      case 'keyword_analysis':
        satisfactionScore = this.analyzeKeywords(conversationText, indicators);
        break;
      case 'sentiment_analysis':
        satisfactionScore = await this.analyzeSentiment(conversationText, runtime);
        break;
      case 'llm_judge':
      default:
        satisfactionScore = await this.judgeWithLLM(conversationText, runtime);
        break;
    }

    const threshold = satisfaction_threshold || 0.7;
    const success = satisfactionScore >= threshold;
    const percentage = (satisfactionScore * 100).toFixed(1);
    const thresholdPercentage = (threshold * 100).toFixed(1);

    const message = `User satisfaction: ${percentage}% (threshold: ${thresholdPercentage}%, method: ${method})`;

    return { success, message };
  }

  private analyzeKeywords(
    conversationText: string,
    indicators?: { positive?: string[]; negative?: string[] }
  ): number {
    const text = conversationText.toLowerCase();
    const positive = indicators?.positive || [
      'thank you',
      'thanks',
      'great',
      'perfect',
      'helpful',
      'solved',
      'fixed',
      'working',
    ];
    const negative = indicators?.negative || [
      'frustrated',
      'unhelpful',
      'confused',
      'angry',
      'useless',
      'waste of time',
    ];

    const countOccurrences = (text: string, keyword: string): number => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      return (text.match(regex) || []).length;
    };
    const positiveCount = positive.reduce(
      (sum: number, word: string) => sum + countOccurrences(text, word),
      0
    );
    const negativeCount = negative.reduce(
      (sum: number, word: string) => sum + countOccurrences(text, word),
      0
    );

    if (positiveCount === 0 && negativeCount === 0) return 0.5; // neutral
    return positiveCount / (positiveCount + negativeCount);
  }

  private async analyzeSentiment(
    conversationText: string,
    runtime: IAgentRuntime
  ): Promise<number> {
    const prompt = `Analyze the overall sentiment of the user in this conversation on a scale of 0.0 to 1.0, where:
- 0.0 = Very dissatisfied, angry, frustrated
- 0.5 = Neutral 
- 1.0 = Very satisfied, happy, grateful

Focus on the user's messages and their progression throughout the conversation.

Conversation:
${conversationText}

Respond with only a number between 0.0 and 1.0:`;

    try {
      const response = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: prompt,
        temperature: 0.1,
      });

      const score = parseFloat(response.trim());
      return isNaN(score) ? 0.5 : Math.max(0, Math.min(1, score));
    } catch (error) {
      console.error('[UserSatisfactionEvaluator] Sentiment analysis failed:', error);
      return 0.5; // Default to neutral on error
    }
  }

  private async judgeWithLLM(conversationText: string, runtime: IAgentRuntime): Promise<number> {
    const prompt = `Evaluate how satisfied the user appears to be with this conversation on a scale of 0.0 to 1.0.

```