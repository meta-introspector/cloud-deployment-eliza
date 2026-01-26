# 5e8c73c1:packages_cli_src_commands_scenario_docs_README.md:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/docs/README.md:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
```bash
# Install dependencies
cd packages/cli
bun install

# Build the CLI
bun run build
```

### **Verify Setup**

**Production Commands (if CLI is globally installed):**

```bash
# Test that the CLI works correctly
elizaos --help

# Test a simple scenario (from project root)
elizaos scenario run packages/cli/src/commands/scenario/examples/simple-test.scenario.yaml

# Test matrix functionality
elizaos scenario matrix packages/cli/src/commands/scenario/examples/simple-test.matrix.yaml

# Test report generation
elizaos report generate packages/cli/src/commands/scenario/_logs_
```

**Local Development Commands:**

```bash
# Test that the CLI builds correctly
bun packages/cli/dist/index.js --help

# Test a simple scenario (from project root)
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/simple-test.scenario.yaml

# Test matrix functionality
bun packages/cli/dist/index.js scenario matrix packages/cli/src/commands/scenario/examples/simple-test.matrix.yaml

# Test report generation
bun packages/cli/dist/index.js report generate packages/cli/src/commands/scenario/_logs_
```

## Scenario File Structure

### Single-Turn Scenario

```yaml
name: 'Test Name'
description: 'Test Description'
environment:
  type: 'local'
  setup:
    # Environment-specific setup
mocks:
  - service: 'ServiceName'
    method: 'methodName'
    response: {}
run:
  - input: 'User input'
evaluations:
  - type: 'string_contains'
    value: 'expected text'
  - type: 'llm_judge'
    prompt: 'Evaluation question'
    expected: 'Expected answer'
judgment:
  strategy: 'all_pass'
```

### Conversation Scenario (NEW!)

```yaml
name: 'Conversation Test Name'
description: 'Test Description'
plugins:
  - '@elizaos/plugin-bootstrap'
  - '@elizaos/plugin-openai'
environment:
  type: 'local'
run:
  - name: 'Conversation Name'
    input: 'Initial user message'

    conversation:
      max_turns: 4
      user_simulator:
        persona: 'Description of simulated user'
        objective: 'What the user wants to achieve'
        temperature: 0.6
        style: 'Communication style'
        constraints:
          - 'Behavioral constraint 1'
          - 'Behavioral constraint 2'

      termination_conditions:
        - type: 'user_expresses_satisfaction'
          keywords: ['thank you', 'resolved', 'perfect']
        - type: 'agent_provides_solution'
          keywords: ['follow these steps', 'issue resolved']

      turn_evaluations:
        - type: 'llm_judge'
          prompt: 'Per-turn evaluation question'
          expected: 'yes'

      final_evaluations:
        - type: 'llm_judge'
          prompt: 'Overall conversation evaluation'
          expected: 'yes'
          capabilities:
            - 'Capability 1'
            - 'Capability 2'
        - type: 'conversation_length'
          min_turns: 2
          max_turns: 6
          optimal_turns: 3

    # Traditional evaluations still supported
    evaluations:
      - type: 'string_contains'
        value: 'help'
judgment:
  strategy: 'all_pass'
```

### Example Single-Turn Scenario

```yaml
name: 'Simple File Creation Test'
description: 'Tests basic file creation in local environment'
environment:
  type: 'local'
  setup:
    workingDirectory: '/tmp/test'
mocks:
  - service: 'FileService'
    method: 'createFile'
    response:
      success: true
      path: '/tmp/test/example.txt'
run:
  - input: 'Create a file called example.txt'
evaluations:
  - type: 'file_exists'
    path: '/tmp/test/example.txt'
  - type: 'llm_judge'
    prompt: 'Did the agent successfully create the file?'
    expected: 'yes'
judgment:
```