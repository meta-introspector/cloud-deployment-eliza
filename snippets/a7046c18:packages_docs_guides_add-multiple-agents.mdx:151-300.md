# a7046c18:packages_docs_guides_add-multiple-agents.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/add-multiple-agents.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    "@elizaos/plugin-sql",
    "@elizaos/plugin-openai",
    "@elizaos/plugin-discord",
    "@elizaos/plugin-bootstrap",
    "@elizaos/plugin-elevenlabs"  // [!code ++]
  ]
}
```

```typescript src/character.ts
export const character: Character = {
  plugins: [
    '@elizaos/plugin-sql',
    '@elizaos/plugin-discord',
    '@elizaos/plugin-elevenlabs',  // [!code ++]
    ...(process.env.OPENAI_API_KEY?.trim() ? ['@elizaos/plugin-openai'] : []),
    ...(!process.env.IGNORE_BOOTSTRAP ? ['@elizaos/plugin-bootstrap'] : []),
  ],
}
```

### Configure voices for each agent

Now let's add the ElevenLabs secrets so each agent has their own distinct voice:

**For Hemingway (`hemingway.json`):**
```json hemingway.json
{
  "settings": {
    "secrets": {
      "DISCORD_APPLICATION_ID": "YOUR_HEMINGWAY_APP_ID",
      "DISCORD_API_TOKEN": "YOUR_HEMINGWAY_BOT_TOKEN",
      "DISCORD_VOICE_ENABLED": "true",
      
      "ELEVENLABS_API_KEY": "your_elevenlabs_api_key",  // [!code ++]
      "ELEVENLABS_VOICE_ID": "Xb7hH8MSUJpSbSDYk0k2",  // Deep male voice  // [!code ++]
      "ELEVENLABS_MODEL_ID": "eleven_multilingual_v2",  // [!code ++]
      "ELEVENLABS_VOICE_STABILITY": "0.5",  // [!code ++]
      "ELEVENLABS_OPTIMIZE_STREAMING_LATENCY": "0",  // [!code ++]
      "ELEVENLABS_OUTPUT_FORMAT": "pcm_16000",  // [!code ++]
      "ELEVENLABS_VOICE_SIMILARITY_BOOST": "0.75",  // [!code ++]
      "ELEVENLABS_VOICE_STYLE": "0",  // [!code ++]
      "ELEVENLABS_VOICE_USE_SPEAKER_BOOST": "true"  // [!code ++]
    }
  }
}
```

**For Shakespeare (`src/character.ts`):**
```typescript src/character.ts
{
  settings: {
    secrets: {
      DISCORD_APPLICATION_ID: "YOUR_SHAKESPEARE_APP_ID",
      DISCORD_API_TOKEN: "YOUR_SHAKESPEARE_BOT_TOKEN",
      DISCORD_VOICE_ENABLED: "true",
      
      ELEVENLABS_API_KEY: "your_elevenlabs_api_key",  // [!code ++]
      ELEVENLABS_VOICE_ID: "21m00Tcm4TlvDq8ikWAM",  // Theatrical British voice  // [!code ++]
      ELEVENLABS_MODEL_ID: "eleven_multilingual_v2",  // [!code ++]
      ELEVENLABS_VOICE_STABILITY: "0.3",  // More variation for dramatic effect  // [!code ++]
      ELEVENLABS_OPTIMIZE_STREAMING_LATENCY: "0",  // [!code ++]
      ELEVENLABS_OUTPUT_FORMAT: "pcm_16000",  // [!code ++]
      ELEVENLABS_VOICE_SIMILARITY_BOOST: "0.75",  // [!code ++]
      ELEVENLABS_VOICE_STYLE: "0.5",  // More expressive  // [!code ++]
      ELEVENLABS_VOICE_USE_SPEAKER_BOOST: "true"  // [!code ++]
    }
  }
}
```

<Note>
Get your ElevenLabs API key from [elevenlabs.io](https://elevenlabs.io) and explore different voice IDs to find the perfect match for each agent's personality.
</Note>

## Step 3: Configure multi-agent project

### Add newly created agent to your project

Update your `src/index.ts` to include both agents so they start automatically:

```typescript src/index.ts
import { logger, type IAgentRuntime, type Project, type ProjectAgent } from '@elizaos/core';
import { character } from './character.ts';
import hemingway from '../hemingway.json';  // [!code ++]

const initCharacter = ({ runtime }: { runtime: IAgentRuntime }) => {
  logger.info('Initializing character');
  logger.info({ name: character.name }, 'Name:');
};

export const projectAgent: ProjectAgent = {
  character,
  init: async (runtime: IAgentRuntime) => await initCharacter({ runtime }),
};

// Add Hemingway agent  // [!code ++]
const hemingwayAgent: ProjectAgent = {  // [!code ++]
  character: hemingway,  // [!code ++]
  init: async (runtime: IAgentRuntime) => {  // [!code ++]
    logger.info('Initializing Hemingway');  // [!code ++]
    logger.info({ name: hemingway.name }, 'Name:');  // [!code ++]
  },  // [!code ++]
};  // [!code ++]

const project: Project = {
  agents: [projectAgent],  // [!code --]
  agents: [projectAgent, hemingwayAgent],  // [!code ++]
};
```

### Launch both agents simultaneously

Now when you start your project, both agents launch automatically:

```bash Terminal
elizaos start
```

You'll see both agents initialize in the console output:
```
✓ Shakespeare initialized
✓ Hemingway initialized
```

<Note>
**Alternative: CLI agent command**

You can also manipulate agents via the CLI once a server is running. See the [CLI Agent Command Reference](/cli-reference/agent) for complete details.
</Note>

### Join them in Discord voice chat

Now go to the voice channel's chatroom and invite both agents to join the voice channel:

<img src="/images/ask-to-join-vc.jpeg" alt="Discord text channel showing messages inviting Shakespeare and Hemingway to join voice chat" />

Say something, and hear your literary duo respond and converse:

<img src="/images/added-to-vc.jpg" alt="Discord voice channel showing Shakespeare and Hemingway engaged in literary debate with their unique voices" />

It's working! Your agents are now conversing with their own unique personalities and voices!

## See Also

Now that you know how to add multiple agents to a single project, you can add as many as you like, all with completely custom sets of plugins and personalities. Here's what's next:

<CardGroup cols={2}>
  <Card title="Test a Project" icon="flask" href="/guides/test-a-project">
    Ensure your literary duo maintains their unique voices consistently
```