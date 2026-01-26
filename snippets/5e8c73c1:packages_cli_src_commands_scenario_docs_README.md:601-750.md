# 5e8c73c1:packages_cli_src_commands_scenario_docs_README.md:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/docs/README.md:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  strategy: 'all_pass'
```

### Example Conversation Scenario

```yaml
name: 'Customer Support Conversation'
description: 'Tests multi-turn customer support capabilities'
plugins:
  - '@elizaos/plugin-bootstrap'
  - '@elizaos/plugin-openai'
environment:
  type: 'local'
run:
  - name: 'Billing Support'
    input: 'Hi, I need help with my billing'

    conversation:
      max_turns: 4
      user_simulator:
        persona: 'customer with a billing question'
        objective: 'find out why charged twice this month'
        temperature: 0.6
        style: 'polite and patient'
        constraints:
          - 'Be polite and cooperative'
          - 'Provide details when asked'
          - 'Express gratitude for help'

      termination_conditions:
        - type: 'user_expresses_satisfaction'
          keywords: ['thank you', 'resolved', 'perfect']
        - type: 'agent_provides_solution'
          keywords: ['follow these steps', 'issue resolved']

      turn_evaluations:
        - type: 'llm_judge'
          prompt: 'Did the agent respond helpfully and professionally?'
          expected: 'yes'

      final_evaluations:
        - type: 'llm_judge'
          prompt: 'Was the billing issue successfully resolved?'
          expected: 'yes'
          capabilities:
            - "Understood the customer's billing concern"
            - 'Asked appropriate follow-up questions'
            - 'Provided helpful solutions'
judgment:
  strategy: 'all_pass'
```

## 🗣️ **Conversation Features (NEW!)**

### **Dynamic Prompting & User Simulation**

The scenario system now supports sophisticated multi-turn conversations with:

- **User Simulator**: AI-powered user that maintains personas, objectives, and behavioral constraints
- **Dynamic Responses**: Context-aware responses that adapt to conversation flow
- **Intelligent Termination**: Natural conversation endings based on satisfaction or solution detection
- **Turn-based Evaluation**: Real-time assessment of each conversation turn
- **Persona Consistency**: Maintains character traits and objectives across turns
- **Context Retention**: Remembers conversation history and builds upon it
- **Emotional Intelligence**: Handles emotional states and progression
- **Flexible Termination**: Multiple termination strategies including LLM-based decisions

### **Conversation Configuration Options**

```yaml
conversation:
  max_turns: 6 # Maximum conversation length
  user_simulator:
    persona: 'customer support' # Character description
    objective: 'resolve billing' # What user wants to achieve
    temperature: 0.6 # Response creativity (0.0-1.0)
    style: 'professional' # Communication style
    constraints: # Behavioral rules
      - 'Be polite and patient'
      - 'Provide details when asked'

  termination_conditions: # When to end conversation
    - type: 'user_expresses_satisfaction'
      keywords: ['thank you', 'resolved']
    - type: 'agent_provides_solution'
      keywords: ['follow these steps']

  turn_evaluations: # Evaluate each turn
    - type: 'llm_judge'
      prompt: 'Was this response helpful?'
      expected: 'yes'

  final_evaluations: # Evaluate overall conversation
    - type: 'llm_judge'
      prompt: 'Was the issue resolved?'
      expected: 'yes'
      capabilities:
        - 'Understood the problem'
        - 'Provided solutions'
    - type: 'conversation_length'
      min_turns: 2
      max_turns: 8
      optimal_turns: 4
```

### **New Evaluation Types**

#### **Conversation-Specific Evaluators:**

- **`conversation_length`**: Validates conversation turn count
  - Parameters: `min_turns`, `max_turns`, `optimal_turns`, `target_range`
- **`conversation_flow`**: Detects required conversation patterns
  - Parameters: `required_patterns`, `flow_quality_threshold`
  - Patterns: `question_then_answer`, `problem_then_solution`, `clarification_cycle`, `empathy_then_solution`, `escalation_pattern`
- **`user_satisfaction`**: Measures user satisfaction level
  - Parameters: `satisfaction_threshold`, `indicators`, `measurement_method`
  - Methods: `keyword_analysis`, `sentiment_analysis`, `llm_judge`
- **`context_retention`**: Tests agent memory across turns
  - Parameters: `test_memory_of`, `retention_turns`, `memory_accuracy_threshold`

### Usage notes

Occasionally there were some embedding issues with GPT-5 models, so if you run into issues append your `.env` file with:

```bash
# Use a specific embedding model to avoid GPT-5 embedding issues
OPENAI_SMALL_MODEL="gpt-4o-mini"
SMALL_MODEL="gpt-4o-mini"
OPENAI_LARGE_MODEL="gpt-4o"
LARGE_MODEL="gpt-4o"
OPENAI_EMBEDDING_MODEL="text-embedding-3-small"

```

#### **Enhanced Core Evaluators:**

- **`llm_judge`**: Now supports `capabilities` parameter for detailed assessment
  - Enhanced Parameters: `prompt`, `expected`, `capabilities`, `json_schema`, `model_type`, `temperature`
- **Turn Evaluations**: All existing evaluators can now run per-turn
- **Final Evaluations**: Separate evaluation set for conversation completion
- **Multi-level Assessment**: Turn-level, flow-level, and outcome-level evaluations

## Implementation Details

The scenario system is built on several key components:

1. **YAML Parser** ([#5574](https://github.com/elizaOS/eliza/issues/5574))
   - Validates scenario file structure
   - Provides type-safe scenario configuration

```