# a7046c18:packages_docs_guides_create-a-plugin.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/create-a-plugin.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: 'Create a Plugin'
description: 'Build a working plugin in 20 minutes - from scaffold to test'
---

**20 minutes.** That's all it takes to build a plugin that generates AI videos from text prompts. No boilerplate, no complex setup - just code that works.

<Tip>
  **Video Tutorial**: [**Plugin Power: Add Superpowers to Your Agents**](https://www.youtube.com/watch?v=nC6veN2Q-ps&list=PLrjBjP4nU8ehOgKAa0-XddHzE0KK0nNvS&index=4)
</Tip>

## What We'll Build

This guide shows how to build a [fal.ai](https://fal.ai) plugin that lets your agent generate 6-second, 768p videos from text prompts using the MiniMax Hailuo-02 model. For architectural concepts, see [Plugin Architecture](/plugins/architecture).

**You'll learn:**
- **Actions** (what the agent can DO)
- **Progressive development** (start simple, organize as you grow)
- **Local plugin testing** (character.plugins array method)
- **Plugin testing** (component and E2E tests)

For component details and patterns, see [Plugin Components](/plugins/components) and [Plugin Patterns](/plugins/patterns).

---

## Step 1: Quick Start

### Create Project and Plugin

Create a project with a plugin inside using CLI commands:

<Steps>
  <Step title="Create project">
    ```bash Terminal
    elizaos create --type project my-eliza-project
    ```
    
    Configure when prompted:
    - **Database**: PgLite (perfect for local development)
    - **Model**: OpenAI
    
    ```bash Terminal
    cd my-eliza-project
    ```
  </Step>

  <Step title="Create plugin inside project">
    ```bash Terminal
    elizaos create --type plugin plugin-fal-ai
    ```
    
    When prompted, choose **Quick Plugin** (we don't need frontend UI)
    
    Your structure now looks like:
    ```
    my-eliza-project/
    ├── src/character.ts       # Default Eliza character
    └── plugin-fal-ai/         # 👈 Plugin lives alongside project
        ├── src/
        │   ├── index.ts       # Plugin exports
        │   ├── plugin.ts      # Main plugin (start here)
        │   └── __tests__/     # Plugin tests
        └── package.json
    ```
  </Step>

  <Step title="Add plugin to character">
    In `my-eliza-project/src/character.ts`, add the local path to Eliza's plugins array:
    
    ```typescript src/character.ts
    export const character: Character = {
      name: 'Eliza',
      plugins: [
        '@elizaos/plugin-sql',
        '@elizaos/plugin-openai',
        '@elizaos/plugin-bootstrap',
        './plugin-fal-ai'  // [!code ++]
      ],
    };
    ```
  </Step>
</Steps>

### Connect and Test

<Steps>
  <Step title="Build plugin and test connection">
    The plugin needs to be built first to create the `dist/` folder that ElizaOS loads from:
    
    ```bash Terminal
    # Build the plugin first
    cd plugin-fal-ai
    bun run build
    
    # Go back to project and start
    cd ..
    elizaos start
    ```
    
    **Verify it's loaded:**
    - Check the console logs for `Successfully loaded plugin 'plugin-fal-ai'`
    - Visit `http://localhost:3000` → click your agent → **Plugins tab**

  </Step>
</Steps>

---

## Step 2: Development

### Research the API

Let's research what we want to build by exploring [fal.ai](https://fal.ai) for a good text-to-video model. [MiniMax Hailuo-02 Text to Video](https://fal.ai/models/fal-ai/minimax/hailuo-02/standard/text-to-video) looks pretty good.

4. **Navigate to the [JavaScript/Typescript section of the docs](https://docs.fal.ai/model-apis/clients/javascript)** to see how to call the API:
   - Install: `bun add @fal-ai/client`
   - Import: `import { fal } from "@fal-ai/client"`
   - Use: `fal.subscribe("model-endpoint", { input: {...} })`
   - Returns: `{ data, requestId }`

Now we know exactly what to build and how to call it, so let's start developing our plugin.

### Edit Default Plugin Template

<Steps>
  <Step title="Add fal.ai dependency">
    ```bash Terminal
    cd plugin-fal-ai
    bun add @fal-ai/client
    ```
    
    This adds the [fal.ai](https://fal.ai) client package to your plugin dependencies.

  </Step>

  <Step title="Study the template structure">
    Open `plugin-fal-ai/src/plugin.ts` to see the sample code patterns for plugins:
    
    - `quickAction` - example Action (what agent can DO)
    - `quickProvider` - example Provider (gives agent CONTEXT)  
    - `StarterService` - example Service (manages state/connections)
    - Plugin events, routes, models - other comprehensive patterns
  
  </Step>

  <Step title="Create your text-to-video action using plugin patterns">
    Copy the plugin file and rename it to create your action:
    
    ```bash Terminal
    mkdir src/actions
```