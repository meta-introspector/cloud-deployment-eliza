# 5e8c73c1:packages_cli_src_commands_scenario_docs_README.md:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/docs/README.md:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
# ElizaOS Scenario Testing & Matrix Runner Guide

This guide covers the comprehensive scenario testing and matrix runner functionality implemented through Epic [#5781](https://github.com/elizaOS/eliza/issues/5781) and associated tickets.

## Overview

The ElizaOS Scenario System provides powerful testing capabilities for agents in both local and sandboxed environments. Each scenario is defined in YAML and can include:

- Environment setup and isolation
- Mock service responses
- Action tracking and trajectory analysis
- Multi-format evaluation criteria
- Matrix testing with parameter combinations
- Comprehensive reporting (JSON, HTML, PDF)
- Final judgment rules with LLM evaluation

## ✅ Completed Features (Epic #5781)

The scenario system has been significantly enhanced with the following completed features:

### 🎯 **Matrix Runner & Reporting System**

- **Parameter Matrix Testing**: Run scenarios across multiple parameter combinations
- **Comprehensive Reporting**: Generate JSON, HTML, and PDF reports automatically
- **Organized Output**: All results saved to `@scenario/_logs_/` with timestamped folders
- **Trajectory Analysis**: Track agent thought processes and action sequences
- **Success Rate Analytics**: Detailed metrics and performance analysis

### 📊 **Enhanced Evaluation System**

- **Structured Evaluations**: Enhanced evaluation results with success/failure details
- **Trajectory Tracking**: Monitor agent cognitive processes step-by-step
- **LLM Judge Integration**: AI-powered evaluation of agent responses
- **Multi-format Output**: Support for various evaluation result formats

### 🔧 **Improved Infrastructure**

- **Run Isolation**: Complete isolation between test runs
- **Resource Monitoring**: Track memory, CPU, and disk usage
- **Progress Tracking**: Real-time progress updates during matrix execution
- **Error Handling**: Comprehensive error capture and reporting
- **Plugin Management**: Dynamic plugin loading with dependency resolution

## Demo Videos

- https://drive.google.com/file/d/19oo2V_NfKZCJHuAdcRN3c2l2iTiXiWzd/view?usp=sharing
- https://drive.google.com/file/d/1fkKx8zphsDZpB8QrHy1F7oKnntqs6-0b/view?usp=sharing
- https://drive.google.com/file/d/1uUhCCqjCdcCv9mQS5CQrkj-mXOO4nC3z/view?usp=sharing
- https://drive.google.com/file/d/1OquQX7rn77iOH-njjU68k7KzjxsOtvWx/view?usp=sharing

## 🚀 Quick Start

### **Available Command Options**

#### **Production Commands (Recommended)**

For production use with globally installed CLI:

```bash
# Run a single scenario
elizaos scenario run <scenario-file> [options]

# Run matrix testing with parameter combinations
elizaos scenario matrix <matrix-config> [options]

# Generate comprehensive reports
elizaos report generate <input-directory> [options]
```

#### **Local Development Commands**

For local development and testing:

```bash
# Run a single scenario
bun packages/cli/dist/index.js scenario run <scenario-file> [options]

# Run matrix testing with parameter combinations
bun packages/cli/dist/index.js scenario matrix <matrix-config> [options]

# Generate comprehensive reports
bun packages/cli/dist/index.js report generate <input-directory> [options]
```

#### **Command Options**

**Scenario Run Options:**

- `--live` - Run in live mode, ignoring mocks (default: false)

**Matrix Options:**

- `--dry-run` - Show matrix analysis without executing tests
- `--parallel <number>` - Maximum parallel test runs (default: 1)
- `--filter <pattern>` - Filter parameter combinations by pattern
- `--verbose` - Show detailed progress information

**Report Options:**

- `--output-path <path>` - Path where report files will be saved
- `--format <format>` - Output format: "json", "html", "pdf", or "all" (default: "all")

> **Note**: Local commands require running from the project root directory and building the CLI first with `bun run build` in the `packages/cli` directory.

### **Available Scenario Types**

**Important**: Run all scenario commands from the project root directory for plugins to be loaded correctly.

#### 1. Single Scenario Tests

**Basic Single-Turn Tests:**

**Production Commands:**

```bash
# Run a simple local test
elizaos scenario run packages/cli/src/commands/scenario/examples/simple-test.scenario.yaml

# Run action tracking test
elizaos scenario run packages/cli/src/commands/scenario/examples/action-tracking-test.scenario.yaml

# Run evaluation test
elizaos scenario run packages/cli/src/commands/scenario/examples/evaluation-test.scenario.yaml

# Run basic conversation test
elizaos scenario run packages/cli/src/commands/scenario/examples/basic-conversation.scenario.yaml
```

**Local Development Commands:**

```bash
# Run a simple local test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/simple-test.scenario.yaml

# Run action tracking test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/action-tracking-test.scenario.yaml

# Run evaluation test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/evaluation-test.scenario.yaml

# Run basic conversation test
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/basic-conversation.scenario.yaml
```

#### 2. Mock Service Tests

**Production Commands:**

```bash
# Run simple mock test
```