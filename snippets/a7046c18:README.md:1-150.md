# a7046c18:README.md:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** README.md:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
<div align="center">
  <h1>elizaOS</h1>
  <p><strong>The Open-Source Framework for Multi-Agent AI Development</strong></p>
  <p>Build, deploy, and manage autonomous AI agents with a modern, extensible, and full-featured platform.</p>
</div>

<div align="center">
  <!-- Badges will go here -->
  <a href="https://github.com/elizaos/eliza/blob/main/LICENSE"><img src="https://img.shields.io/github/license/elizaos/eliza?style=for-the-badge" alt="License"></a>
  <a href="https://www.npmjs.com/package/@elizaos/cli"><img src="https://img.shields.io/npm/v/@elizaos/cli?style=for-the-badge" alt="NPM Version"></a>
  <a href="https://docs.elizaos.ai/"><img src="https://img.shields.io/badge/Documentation-Read%20Docs-blue?style=for-the-badge" alt="Documentation"></a>
  <a href="https://deepwiki.com/elizaOS/eliza"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" height="28"></a>
  <a href="https://github.com/elizaos/eliza/actions/workflows/image.yaml"><img src="https://img.shields.io/github/actions/workflow/status/elizaos/eliza/ci.yaml?branch=main&style=for-the-badge" alt="CI Status"></a>
  <a href="https://discord.gg/ai16z"><img src="https://img.shields.io/discord/1253563208833433701?style=for-the-badge&logo=discord" alt="Discord"></a>
</div>

## ✨ What is Eliza?

elizaOS is an all-in-one, extensible platform for building and deploying AI-powered applications. Whether you're creating sophisticated chatbots, autonomous agents for business process automation, or intelligent game NPCs, Eliza provides the tools you need to get started quickly and scale effectively.

It combines a modular architecture, a powerful CLI, and a rich web interface to give you full control over your agents' development, deployment, and management lifecycle.

For complete guides and API references, visit our official **[documentation](https://docs.elizaos.ai/)**.

## 🚀 Key Features

- 🔌 **Rich Connectivity**: Out-of-the-box connectors for Discord, Telegram, Farcaster, and more.
- 🧠 **Model Agnostic**: Supports all major models, including OpenAI, Gemini, Anthropic, Llama, and Grok.
- 🖥️ **Modern Web UI**: A professional dashboard for managing agents, groups, and conversations in real-time.
- 🤖 **Multi-Agent Architecture**: Designed from the ground up for creating and orchestrating groups of specialized agents.
- 📄 **Document Ingestion**: Easily ingest documents and allow agents to retrieve information and answer questions from your data (RAG).
- 🛠️ **Highly Extensible**: Build your own functionality with a powerful plugin system.
- 📦 **It Just Works**: A seamless setup and development experience from day one.

## 🏁 Getting Started (5-Minute Quick Start)

There are two recommended paths for using Eliza:

- **For Beginners & Standalone Projects (CLI):** If you want to create and deploy agents without modifying Eliza's core code, the CLI is the fastest and simplest method. The guide below is for you.

- **For Power Users & Contributors (Monorepo):** If you plan to contribute to Eliza, create complex custom plugins, or manage multiple projects in one place, we recommend cloning the full monorepo. See the [How to Contribute](#-how-to-contribute) section to get started.

---

Get your first AI agent running in just a few commands.

**Prerequisites:**

- [Node.js](https://nodejs.org/) (v23+)
- [bun](https://bun.sh/docs/installation)

> **Note for Windows Users:** [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install-manual) is required.

### 1. Install the CLI

```bash
# Install the elizaOS CLI globally
bun install -g @elizaos/cli

# Verify installation
elizaos --version
```

### 2. Create Your Project

```bash
# Create a new project with an interactive setup
elizaos create my-first-agent

# Follow the prompts. For beginners, we recommend:
# - Database: pglite (no setup required)
# - Model Provider: openai
# - Project Type: project
```

### 3. Configure Your API Key

```bash
cd my-first-agent

# Open the local environment file
elizaos env edit-local
```

Add your model provider's API key (e.g., for OpenAI):

```env
OPENAI_API_KEY=your_api_key_here
```

### 4. Start Your Agent

```bash
# Build and start the agent server
elizaos start
```

Your agent is now running!

- **Web Interface**: [http://localhost:3000](http://localhost:3000)
- **API Endpoint**: `http://localhost:3000/api`

---

<details>
<summary>📚 **Advanced CLI Commands & Usage**</summary>

Eliza's CLI is powerful. Here are some more commands for development and management.

#### Development Workflow

```bash
# Make changes to your agent code, then rebuild and restart
bun run build
elizaos start

# Or, start in development mode with auto-rebuild
elizaos dev

# Run tests to verify your changes
elizaos test
```

#### Agent & Environment Management

```bash
# List all available agents
elizaos agent list

# Start a specific agent by name
elizaos agent start --name "MyAgent"

# Show all environment variables
elizaos env list
```

#### Debugging

```bash
# Start with detailed debug logging
LOG_LEVEL=debug elizaos start
```

For a full command reference, run `elizaos --help` or `elizaos <command> --help`.

</details>

---

## 🔧 Running elizaOS Core Standalone
```