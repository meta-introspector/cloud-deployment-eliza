# a7046c18:packages_docs_projects_overview.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/projects/overview.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Build your project structure to match your needs and goals, whether that's organizing agents by function, separating character configurations, or creating shared utilities. The elizaOS runtime will orchestrate everything once you define your project configuration.

<CodeGroup>
```typescript src/index.ts (Single Agent)
import { Project, ProjectAgent, IAgentRuntime } from '@elizaos/core';
import { character } from './character';

export const projectAgent: ProjectAgent = {
  character,
  init: async (runtime: IAgentRuntime) => {
    console.log(`Initializing ${character.name}`);
    // Optional: Setup knowledge base, connections, etc.
  },
  // plugins: [customPlugin], // Project-specific plugins
};

const project: Project = {
  agents: [projectAgent],
};

export default project;
```

```typescript src/index.ts (Multi-Agent)
import { Project, ProjectAgent } from '@elizaos/core';
import { eliza, spartan, billy, bobby } from './agents';

const elizaAgent: ProjectAgent = {
  character: eliza,
  init: async (runtime) => {
    await setupElizaKnowledge(runtime);
  }
};

const spartanAgent: ProjectAgent = {
  character: spartan,
  init: async (runtime) => {
    await initializeSpartanProtocols(runtime);
  }
};

const billyAgent: ProjectAgent = {
  character: billy,
  init: async (runtime) => {
    await connectBillySystems(runtime);
  }
};

const bobbyAgent: ProjectAgent = {
  character: bobby,
  init: async (runtime) => {
    await setupBobbyCapabilities(runtime);
  }
};

const project: Project = {
  agents: [elizaAgent, spartanAgent, billyAgent, bobbyAgent]
};

export default project;
```
</CodeGroup>


## Environment Configuration

Projects come with `.env` files for API keys and configuration, plus `.env.example` with additional variables you can copy. Define these at the project level to start, then you can define them at the agent level in multi-agent projects using the `secrets` array in your character `.ts`/`.json` object.

```bash .env
# Model Providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Platform Integrations  
DISCORD_API_TOKEN=...
TELEGRAM_BOT_TOKEN=...
TWITTER_API_KEY=...

# Database
DATABASE_URL=postgresql://localhost/eliza
PGLITE_DIR=./tmp/pglite

# Settings
LOG_LEVEL=info
NODE_ENV=production
```

<Tip>
  For detailed information about server security, authentication, and UI configuration environment variables, see the [Environment Variables](/projects/environment-variables) documentation.
</Tip>

## Running Projects Locally

Start your project with the elizaOS CLI:

```bash
# Start your project
elizaos start

# Development mode with hot reload
elizaos dev

# Start with specific character
elizaos start --character ./custom-character.ts
```

<Tip>
  See the [CLI Reference](/cli-reference/overview) for all available options and flags.
</Tip>

## Advanced Project Examples

Explore these real-world projects showcasing different elizaOS capabilities:

<CardGroup cols={2}>
  <Card title="Spartan" icon="github" href="https://github.com/elizaos/spartan">
    **Onchain Trading Agent**
    
    Advanced capabilities for blockchain trading:
    - Multi-modal reasoning across data types
    - Strategic decision-making framework
    - Long-term memory with retrieval strategies  
    - Complex action chaining
    - Advanced prompt engineering
  </Card>
  
  <Card title="The Org" icon="github" href="https://github.com/elizaos/the-org">
    **Business Profiles Swarm**
    
    Swarm of business profiles who collaborate and work together:
    - Executive, department, and operational layers
    - Inter-agent communication protocols
    - Specialized role-based expertise
    - Coordinated decision-making
    - Shared knowledge management
  </Card>
  
  <Card title="3D Hyperfy Starter" icon="github" href="https://github.com/elizaOS/eliza-3d-hyperfy-starter">
    **3D World Integration**
    
    Agent that connects to 3D virtual worlds:
    - WebSocket connection to Hyperfy worlds
    - Voice chat support (ElevenLabs/OpenAI)
    - Screen perception capabilities
    - 3D MMO development prototyping
    - Real-time interaction in virtual spaces
  </Card>
  
  <Card title="Next.js Starter" icon="github" href="https://github.com/elizaOS/eliza-nextjs-starter">
```