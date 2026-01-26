# a7046c18:packages_docs_runtime_services.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/services.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Add MCP to your character's plugins:

```typescript
export const character: Character = {
  name: 'YourAgent',
  plugins: [
    '@elizaos/plugin-sql',
    '@elizaos/plugin-bootstrap',
    '@elizaos/plugin-mcp', // Add MCP plugin
    // ... other plugins
  ],
  // ... rest of configuration
};
```

### MCP Server Types

MCP supports two types of servers:

#### 1. STDIO Servers

STDIO servers run as local processes and communicate through standard input/output.

```typescript
export const character: Character = {
  name: 'WebSearchAgent',
  plugins: ['@elizaos/plugin-mcp'],
  settings: {
    mcp: {
      servers: {
        firecrawl: {
          type: 'stdio',
          command: 'npx',
          args: ['-y', 'firecrawl-mcp'],
          env: {
            // Optional: Add your Firecrawl API key if you have one
            FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY || '',
          },
        },
      },
    },
  },
  system: 'You are a helpful assistant with web search capabilities.',
};
```

**Capabilities:**
- Search the web for current information
- Extract content from websites
- Perform deep research on topics
- Scrape structured data

#### 2. SSE Servers

SSE (Server-Sent Events) servers connect to remote APIs through HTTP.

```typescript
export const character: Character = {
  name: 'APIAgent',
  plugins: ['@elizaos/plugin-mcp'],
  settings: {
    mcp: {
      servers: {
        myApiServer: {
          type: 'sse',
          url: 'https://your-api-server.com/sse', // Replace with your SSE server URL
        },
      },
    },
  },
  system: 'You are a helpful assistant with API access capabilities.',
};
```

**Capabilities:**
- Real-time data access
- API interactions
- Custom tool execution
- Dynamic resource fetching

### Complete MCP Configuration Example

```typescript
import { type Character } from '@elizaos/core';

export const character: Character = {
  name: 'Eliza',
  plugins: [
    '@elizaos/plugin-sql',
    ...(process.env.ANTHROPIC_API_KEY ? ['@elizaos/plugin-anthropic'] : []),
    ...(process.env.OPENAI_API_KEY ? ['@elizaos/plugin-openai'] : []),
    '@elizaos/plugin-bootstrap',
    '@elizaos/plugin-mcp',
  ],
  settings: {
    mcp: {
      servers: {
        // STDIO server example - runs locally
        firecrawl: {
          type: 'stdio',
          command: 'npx',
          args: ['-y', 'firecrawl-mcp'],
          env: {},
        },
        // SSE server example - connects to remote API
        customApi: {
          type: 'sse',
          url: 'https://your-api.com/sse',
        },
      },
    },
  },
  system: 'You are a helpful assistant with access to web search and API tools.',
  bio: [
    'Can search the web for information',
    'Can connect to external APIs',
    'Provides helpful responses',
  ],
};
```

### Testing MCP Integration

1. Start your agent:
```bash
bun run start
```

2. Ask your agent to use the tools:
   - For web search: "Search for [topic]"
   - For API tools: Use commands specific to your SSE server

### MCP Troubleshooting

- **Server not connecting**: Check that the command/URL is correct
- **Tools not available**: Ensure `@elizaos/plugin-mcp` is in your plugins array
- **Permission errors**: For STDIO servers, ensure the command can be executed
- **CORS issues**: For SSE servers, ensure proper CORS headers are configured

### MCP Service Implementation

The MCP plugin internally creates services for each configured server:

```typescript
class MCPService extends Service {
  static serviceType = 'mcp' as const;
  capabilityDescription = 'Model Context Protocol tool integration';
  
  private servers: Map<string, MCPServer> = new Map();
```