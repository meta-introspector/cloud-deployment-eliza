# 5e8c73c1:packages_cli_src_commands_scenario_docs_README.md:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/docs/README.md:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
2. **Environment Providers**
   - Local ([#5575](https://github.com/elizaOS/eliza/issues/5575))

3. **Mock Engine** ([#5577](https://github.com/elizaOS/eliza/issues/5577))
   - Service call interception
   - Response mocking

4. **Evaluation Engine** ([#5578](https://github.com/elizaOS/eliza/issues/5578))
   - Action tracking
   - Response validation
   - Trajectory analysis
   - Conversation evaluation
   - Turn-based assessment
   - User simulation

5. **Final Judgment** ([#5579](https://github.com/elizaOS/eliza/issues/5579))
   - LLM-based judgment
   - User-facing reports

## Common Issues

1. **Mock Failures**: For mock test failures:
   - Verify mock service name matches exactly
   - Check response format matches service expectations
   - Ensure all required methods are mocked

2. **Evaluation Failures**: For evaluation issues:
   - Check evaluator configuration
   - Verify expected responses match format
   - Review action tracking configuration

3. **Plugin Loading Issues**: If plugins are not being loaded correctly:
   - Ensure you're running commands from the project root directory
   - If plugins still fail to load, run `bun add elizaos/plugin-name` from the root directory
   - This will add the plugin as a dependency and ensure it's available for loading
   - Example: `bun add elizaos/plugin-bootstrap` or `bun add elizaos/plugin-sql`

## Contributing

When adding new scenarios:

1. Place YAML files in `src/commands/scenario/examples/`
2. Follow existing naming conventions
3. Include comprehensive descriptions
4. Add to this documentation

## 📋 **Best Practices**

### **Conversation Design Principles**

#### **Start Simple**

```yaml
# Begin with basic 2-3 turn conversations
conversation:
  max_turns: 3
  user_simulator:
    persona: 'straightforward user with simple goal'
    objective: 'basic problem resolution'
```

#### **Gradual Complexity**

```yaml
# Build up to complex multi-persona scenarios
conversation:
  max_turns: 8
  user_simulator:
    persona: 'complex user with evolving needs'
    emotional_state: 'initially frustrated, becomes cooperative'
    constraints:
      - 'Start with complaints'
      - 'Become helpful when shown empathy'
```

### **User Simulator Best Practices**

#### **Persona Consistency**

```yaml
user_simulator:
  persona: 'experienced developer who values efficiency'
  style: 'direct, technical, impatient with basic explanations'
  knowledge_level: 'expert'
  constraints:
    - 'Use technical terminology correctly'
    - 'Skip basic explanations'
    - 'Ask detailed implementation questions'
```

#### **Realistic Objectives**

```yaml
user_simulator:
  # Good: Specific, measurable objective
  objective: 'configure SSL certificate for production deployment'

  # Avoid: Vague objective
  # objective: "get help with website"
```

### **Performance Considerations**

#### **Resource Management**

```yaml
conversation:
  max_turns: 6 # Reasonable limit to prevent infinite loops
  timeout_per_turn_ms: 30000 # 30 second timeout per turn
  total_timeout_ms: 300000 # 5 minute total conversation timeout
```

#### **LLM Usage Optimization**

```yaml
user_simulator:
  model_type: 'TEXT_LARGE' # Use appropriate model size
  temperature: 0.7 # Balance creativity and consistency
  max_tokens: 150 # Limit response length
```

### **Matrix Testing with Conversations**

```yaml
name: 'Conversation Matrix Testing'
base_scenario: 'customer-support.scenario.yaml'
runs_per_combination: 2

matrix:
  # Test different user personas
  - parameter: 'run[0].conversation.user_simulator.persona'
    values:
      - 'frustrated customer'
      - 'confused beginner'
      - 'experienced power user'
      - 'non-native English speaker'

  # Test different conversation lengths
  - parameter: 'run[0].conversation.max_turns'
    values: [3, 5, 8]

  # Test different termination conditions
  - parameter: 'run[0].conversation.termination_conditions[0].type'
    values:
      - 'user_expresses_satisfaction'
      - 'agent_provides_solution'
      - 'escalation_needed'
```

## 📚 **References & Epic Information**
```