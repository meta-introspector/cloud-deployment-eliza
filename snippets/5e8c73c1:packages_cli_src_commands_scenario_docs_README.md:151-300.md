# 5e8c73c1:packages_cli_src_commands_scenario_docs_README.md:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/docs/README.md:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
elizaos scenario run packages/cli/src/commands/scenario/examples/simple-mock-test.scenario.yaml

# Run full mock test
elizaos scenario run packages/cli/src/commands/scenario/examples/mock-test.scenario.yaml
```

**Local Development Commands:**

```bash
# Run simple mock test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/simple-mock-test.scenario.yaml

# Run full mock test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/mock-test.scenario.yaml
```

#### 4. LLM Judge Tests

**Production Commands:**

```bash
# Run LLM judgment test
elizaos scenario run packages/cli/src/commands/scenario/examples/llm-judge-test.scenario.yaml

# Run LLM judgment failure test
elizaos scenario run packages/cli/src/commands/scenario/examples/llm-judge-failure-test.scenario.yaml
```

**Local Development Commands:**

```bash
# Run LLM judgment test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/llm-judge-test.scenario.yaml

# Run LLM judgment failure test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/llm-judge-failure-test.scenario.yaml
```

#### 5. Matrix Testing (NEW!)

**Production Commands:**

```bash
# Run matrix testing with parameter combinations
elizaos scenario matrix packages/cli/src/commands/scenario/examples/github-issue-analysis.matrix.yaml

# Run simple matrix test
elizaos scenario matrix packages/cli/src/commands/scenario/examples/simple-test.matrix.yaml
```

**Local Development Commands:**

```bash
# Run matrix testing with parameter combinations
bun packages/cli/dist/index.js scenario matrix packages/cli/src/commands/scenario/examples/github-issue-analysis.matrix.yaml

# Run simple matrix test
bun packages/cli/dist/index.js scenario matrix packages/cli/src/commands/scenario/examples/simple-test.matrix.yaml
```

#### 6. Conversation Tests (NEW!)

**Production Commands:**

```bash
# Run basic conversation test
elizaos scenario run packages/cli/src/commands/scenario/examples/basic-conversation.scenario.yaml

# Run advanced conversation scenarios
elizaos scenario run packages/cli/src/commands/scenario/examples/customer-support.scenario.yaml
elizaos scenario run packages/cli/src/commands/scenario/examples/technical-interview.scenario.yaml
```

**Local Development Commands:**

```bash
# Run basic conversation test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/basic-conversation.scenario.yaml

# Run advanced conversation scenarios
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/customer-support.scenario.yaml
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/technical-interview.scenario.yaml
```

#### 7. Other Test Types

**Production Commands:**

```bash
# Run multi-step scenario
elizaos scenario run packages/cli/src/commands/scenario/examples/multi-step.scenario.yaml

# Run mixed results test
elizaos scenario run packages/cli/src/commands/scenario/examples/mixed-results.scenario.yaml

# Run trajectory test
elizaos scenario run packages/cli/src/commands/scenario/examples/trajectory-test.scenario.yaml
```

**Local Development Commands:**

```bash
# Run multi-step scenario
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/multi-step.scenario.yaml

# Run mixed results test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/mixed-results.scenario.yaml

# Run trajectory test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/trajectory-test.scenario.yaml
```

## 📊 **Reporting & Analysis (NEW!)**

### **Automatic Report Generation**

The scenario system now automatically generates comprehensive reports in multiple formats:

**Production Commands:**

```bash
# Generate all report formats (JSON, HTML, PDF) in organized folders
elizaos report generate packages/cli/src/commands/scenario/_logs_

# Generate specific format only
elizaos report generate packages/cli/src/commands/scenario/_logs_ --format json
elizaos report generate packages/cli/src/commands/scenario/_logs_ --format html
elizaos report generate packages/cli/src/commands/scenario/_logs_ --format pdf
```

**Local Development Commands:**

```bash
# Generate all report formats (JSON, HTML, PDF) in organized folders
bun packages/cli/dist/index.js report generate packages/cli/src/commands/scenario/_logs_

# Generate specific format only
bun packages/cli/dist/index.js report generate packages/cli/src/commands/scenario/_logs_ --format json
bun packages/cli/dist/index.js report generate packages/cli/src/commands/scenario/_logs_ --format html
bun packages/cli/dist/index.js report generate packages/cli/src/commands/scenario/_logs_ --format pdf
```

### **Organized Output Structure**

All results are automatically organized in the simplified `@scenario/_logs_/` structure:

```
packages/cli/src/commands/scenario/_logs_/
├── run-001.json                    # Individual scenario results
├── run-002.json
```