# 5e8c73c1:packages_cli_src_commands_scenario_docs_README.md:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/docs/README.md:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
├── matrix-2025-08-17.../          # Matrix execution results
└── run-2025-08-17_16-43-39/       # Generated reports
    ├── README.md                   # Auto-generated summary
    ├── report.json                 # Raw data & analysis (5KB)
    ├── report.html                 # Interactive web report (56KB)
    └── report.pdf                  # Print-ready report (304KB)
```

### **Report Features**

- **JSON Reports**: Raw data for programmatic analysis
- **HTML Reports**: Interactive web interface with charts and filtering
- **PDF Reports**: Professional print-ready reports
- **Auto-Documentation**: README files with run summaries
- **Success Analytics**: Success rates, execution times, trajectory patterns

## 🔄 **Running Multiple Scenarios**

### **Sequential Execution**

**Production Commands:**

```bash
# Run all scenarios in sequence
elizaos scenario run packages/cli/src/commands/scenario/examples/*.scenario.yaml
```

**Local Development Commands:**

```bash
# Run all scenarios in sequence
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/*.scenario.yaml
```

### **Matrix Execution**

**Production Commands:**

```bash
# Run matrix testing with parameter combinations
elizaos scenario matrix packages/cli/src/commands/scenario/examples/github-issue-analysis.matrix.yaml
```

**Local Development Commands:**

```bash
# Run matrix testing with parameter combinations
bun packages/cli/dist/index.js scenario matrix packages/cli/src/commands/scenario/examples/github-issue-analysis.matrix.yaml
```

## 🛠️ **Troubleshooting**

### **Plugin Loading Issues**

If you encounter issues with plugins not being loaded during scenario testing:

1. **Ensure you're running from the project root directory**

   **Production Commands:**

   ```bash
   # Always run scenario commands from the project root
   cd /path/to/eliza
   elizaos scenario run <scenario-file>
   ```

   **Local Development Commands:**

   ```bash
   # Always run scenario commands from the project root
   cd /path/to/eliza
   bun packages/cli/dist/index.js scenario run <scenario-file>
   ```

2. **If plugins still fail to load, add them as dependencies**

   ```bash
   # From the project root directory
   bun add elizaos/plugin-name
   ```

   Common plugin examples:

   ```bash
   bun add elizaos/plugin-bootstrap
   bun add elizaos/plugin-sql
   bun add elizaos/plugin-quick-starter
   ```

3. **Verify plugin installation**
   ```bash
   # Check if the plugin is listed in package.json dependencies
   cat package.json | grep "elizaos/"
   ```

This approach ensures that the plugin is properly installed and available for the ElizaOS runtime to load during scenario execution.

## 🔧 **Development & Building**

### **Building the CLI**

After making changes to the scenario system:

```bash
# Build from CLI directory
cd packages/cli
bun run build

# Or build from project root
bun run build
```

### **Testing Changes**

**Production Commands:**

```bash
# Test scenario functionality
elizaos scenario run packages/cli/src/commands/scenario/examples/simple-test.scenario.yaml

# Test matrix functionality
elizaos scenario matrix packages/cli/src/commands/scenario/examples/simple-test.matrix.yaml

# Test report generation
elizaos report generate packages/cli/src/commands/scenario/_logs_
```

**Local Development Commands:**

```bash
# Test scenario functionality
bun packages/cli/dist/index.js scenario run packages/cli/src/commands/scenario/examples/simple-test.scenario.yaml

# Test matrix functionality
bun packages/cli/dist/index.js scenario matrix packages/cli/src/commands/scenario/examples/simple-test.matrix.yaml

# Test report generation
bun packages/cli/dist/index.js report generate packages/cli/src/commands/scenario/_logs_
```

## 🔑 **Environment Setup**

### **Required Environment Variables**

```env
OPENAI_API_KEY=your_key_here   # Required for LLM judge evaluations
```

### **Local Development Setup**

```