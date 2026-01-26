# a7046c18:packages_docs_plugin-registry_knowledge_examples.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/examples.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
LOAD_DOCS_ON_STARTUP=true

# Optional: Custom docs path (default is ./docs)
KNOWLEDGE_PATH=/path/to/your/documents
```

### Step 3: Start Your Agent

```bash
elizaos start
```

The agent will:
- Automatically find and load all documents
- Process PDFs, text files, markdown, etc.
- Create searchable embeddings
- Log progress: "Loaded 23 documents from docs folder on startup"

## Using the Web Interface

### Uploading Documents

1. Start your agent: `elizaos start`
2. Open browser: `http://localhost:3000`
3. Select your agent
4. Click the **Knowledge** tab
5. Drag and drop files or click to upload

**Best for:**
- Adding documents while the agent is running
- Uploading user-specific content
- Testing with different documents
- Managing (view/delete) existing documents

### What Happens When You Upload

When you upload a document via the web interface:
1. The file is processed immediately
2. It's converted to searchable chunks
3. The agent can use it right away
4. You'll see it listed in the Knowledge tab

## How Agents Use Knowledge

### Automatic Knowledge Search

When users ask questions, the agent automatically:

```typescript
// User asks: "What's your refund policy?"
// Agent automatically:
// 1. Searches knowledge base for "refund policy"
// 2. Finds relevant chunks from refund-policy.pdf
// 3. Uses this information to answer

// User asks: "How do I install the software?"
// Agent automatically:
// 1. Searches for "install software"
// 2. Finds installation-guide.pdf content
// 3. Provides step-by-step instructions
```

### The Knowledge Provider

The knowledge plugin includes a provider that automatically injects relevant knowledge into the agent's context:

```typescript
// This happens behind the scenes:
// 1. User sends message
// 2. Knowledge provider searches for relevant info
// 3. Found knowledge is added to agent's context
// 4. Agent generates response using this knowledge
```

## Configuration Examples

### Production Support Bot

```env title=".env"
# AI Configuration
OPENAI_API_KEY=sk-...

# Knowledge Configuration
LOAD_DOCS_ON_STARTUP=true
KNOWLEDGE_PATH=/var/app/support-docs

# Optional: For better processing
CTX_KNOWLEDGE_ENABLED=true
OPENROUTER_API_KEY=sk-or-...  # For enhanced context
```

### Development Setup

```env title=".env"
# Minimal setup for testing
OPENAI_API_KEY=sk-...
LOAD_DOCS_ON_STARTUP=true
# Docs in default ./docs folder
```

## Best Practices

### DO: Use the Docs Folder

✅ **Recommended approach for most use cases:**

```
1. Put your documents in the docs folder
2. Set LOAD_DOCS_ON_STARTUP=true
3. Start your agent
4. Documents are automatically loaded
```

### DO: Use Web Upload for Dynamic Content

✅ **When to use the web interface:**

- User-uploaded content
- Frequently changing documents  
- Testing different documents
- One-off documents

### DON'T: Hardcode Large Content

❌ **Avoid this:**

```json
{
  "knowledge": [
    "Chapter 1: Introduction... (500 lines)",
    "Chapter 2: Getting Started... (1000 lines)",
    // Don't do this!
  ]
}
```

✅ **Instead, use files:**

```
docs/
├── chapter-1-introduction.md
├── chapter-2-getting-started.md
└── ...
```

## Testing Your Setup

### Quick Verification

1. Check the logs when starting:
```