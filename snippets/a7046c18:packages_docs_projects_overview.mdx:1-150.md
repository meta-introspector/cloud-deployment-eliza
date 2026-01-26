# a7046c18:packages_docs_projects_overview.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/projects/overview.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: 'Overview'
description: 'Understanding and building with elizaOS projects'
---

<Info>
  **Projects** are the primary deployable unit in elizaOS. Each project contains one or more agents, and plugins can be managed either at the agent level or shared across the project. A project is container template that you develop locally and ship to production.
</Info>

## What is a Project?

A project in elizaOS is your **development workspace and deployment unit**. It's where you:
- Configure and run one or more agents
- Develop and test plugins
- Manage environment settings
- Build complete AI applications

Projects can include a fully customizable chat interface for user interaction, or run as headless services connecting to platforms like Discord or Twitter. The framework is flexible enough to support both frontend applications and background services.

<Note>
  Think of a project as a TypeScript application that orchestrates agents. Each agent can have unique plugins, creating specialized capabilities within your application.
</Note>

## Development Pattern

The elizaOS development workflow centers around projects:

<Steps>
  <Step title="Create a project">
    Initialize your development workspace with `elizaos create --type project`
  </Step>
  <Step title="Configure agents">
    Define agent personalities and select plugins
  </Step>
  <Step title="Develop features">
    Build custom plugins and actions within the project context
  </Step>
  <Step title="Test locally">
    Run and test using `elizaos start` without needing the full monorepo
  </Step>
  <Step title="Deploy to production">
    Ship the complete project as your production application
  </Step>
</Steps>

This pattern gives you access to all elizaOS core features without managing the entire framework codebase.

## Project Structure

<CodeGroup>
```bash Standard Project
my-project/
├── src/                 # Source code (you edit these)
│   ├── index.ts         # Project entry point
│   ├── character.ts     # Default Eliza character
│   ├── __tests__/       # Test files (E2E and component)
│   ├── frontend/        # Frontend components (if using web UI)
│   └── plugins/         # Custom plugins (optional)
├── .env                 # Environment variables
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── bun.lock            # Lock file
│
├── dist/                # 🔨 Built/compiled output
├── node_modules/        # 📦 Installed dependencies  
├── .eliza/              # 💾 Local runtime data
└── scripts/             # 🛠️ Utility scripts
```

```bash Multi-Agent Project
multi-agent-project/
├── src/                 # Source code
│   ├── index.ts         # Project orchestration
│   ├── agents/
│   │   ├── eliza.ts     # Eliza agent config
│   │   ├── spartan.ts   # Spartan agent config
│   │   ├── billy.ts     # Billy agent config
│   │   └── bobby.ts     # Bobby agent config
│   ├── __tests__/       # Test files (E2E and component)
│   ├── frontend/        # Frontend components (if using web UI)
│   └── plugins/         # Shared custom plugins
├── .env                 # Shared environment
├── package.json
├── tsconfig.json
│
├── dist/                # 🔨 Built output
├── node_modules/        # 📦 Dependencies
├── .eliza/              # 💾 Runtime data
└── scripts/             # 🛠️ Utilities
```
</CodeGroup>

<AccordionGroup>
  <Accordion title="src/ - Your main development workspace">
    **Your code lives here:** This is your main entry point area to build your agents and logic.
    
    You can organize this however works for your project - there are some common patterns, but it's flexible. All your TypeScript source code and configurations go here.
    
    This is committed to version control and where you'll spend most of your dev time.
  </Accordion>

  <Accordion title="dist/ - Compiled JavaScript output">
    **Created by:** `elizaos start` or `elizaos dev` (automatic), or manually with `bun run build`
    
    Contains the compiled JavaScript files from your TypeScript source. This is what actually runs when you start your project.
    - Safe to delete (will be regenerated automatically)
    - Not committed to version control
  </Accordion>
  
  <Accordion title="node_modules/ - Installed dependencies">
    **Created by:** `bun install` or `npm install`
    
    Contains all the packages your project depends on, including elizaOS core and plugins.
    - Safe to delete (reinstall with `bun install`)
    - Not committed to version control
    - Managed by your package manager
  </Accordion>
  
  <Accordion title=".eliza/ - Local runtime data">
    **Created by:** Running your agent
    
    Stores local runtime data including:
    - PGLite database files (if using local DB)
    - Cache files
    - Temporary agent state
    - Plugin data storage
    
    Safe to delete to reset your local development state.
  </Accordion>
  
  <Accordion title="scripts/ - Utility scripts">
    **Created by:** Project template or manually
    
    Contains helpful scripts for development:
    - Test utilities
    - Database migrations
    - Deployment scripts
    - Custom build steps
    - Is committed to version control, but generally not used much during dev process
    
  </Accordion>
</AccordionGroup>

<Note>
  **Clean Slate:** Run `rm -rf node_modules dist .eliza` to completely reset your project's generated files. Then `bun install` and your next `elizaos start` will rebuild automatically.
</Note>

## Project Definition

Projects are flexible containers you can design to fit your use case. The default entry point for every project is `src/index.ts`, where you define your agents, their character files, and any custom plugins or services. You might configure a single agent with specialized plugins, or coordinate multiple agents with distinct personalities and capabilities.
```