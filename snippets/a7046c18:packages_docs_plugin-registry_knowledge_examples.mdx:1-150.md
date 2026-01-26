# a7046c18:packages_docs_plugin-registry_knowledge_examples.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/examples.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: Examples & Recipes
description: Practical examples and code recipes for the Knowledge plugin
---

Learn how to use the Knowledge Plugin with practical examples that actually work.

## How Knowledge Actually Works

The Knowledge Plugin allows agents to learn from documents in three ways:

1. **Auto-load from `docs` folder** (recommended for most use cases)
2. **Upload via Web Interface** (best for dynamic content)
3. **Hardcode small snippets** (only for tiny bits of info like "hello world")

## Basic Character Examples

### Example 1: Document-Based Support Bot

Create a support bot that learns from your documentation:

```typescript title="characters/support-bot.ts"
import { type Character } from '@elizaos/core';

export const supportBot: Character = {
  name: 'SupportBot',
  plugins: [
    '@elizaos/plugin-openai', // Required for embeddings
    '@elizaos/plugin-knowledge', // Add knowledge capabilities
  ],
  system: 'You are a friendly customer support agent. Answer questions using the support documentation you have learned. Always search your knowledge base before responding.',
  bio: [
    'Expert in product features and troubleshooting',
    'Answers based on official documentation',
    'Always polite and helpful',
  ],
};
```

**Setup your support docs:**

```
your-project/
├── docs/                           # Create this folder
│   ├── product-manual.pdf         # Your actual product docs
│   ├── troubleshooting-guide.md   # Support procedures
│   ├── faq.txt                    # Common questions
│   └── policies/                  # Organize with subfolders
│       ├── refund-policy.pdf
│       └── terms-of-service.md
├── .env
│   OPENAI_API_KEY=sk-...
│   LOAD_DOCS_ON_STARTUP=true      # Auto-load all docs
└── src/
    └── character.ts
```

When you start the agent, it will automatically:
1. Load all documents from the `docs` folder
2. Process them into searchable chunks
3. Use this knowledge to answer questions

### Example 2: API Documentation Assistant

For technical documentation:

```typescript title="characters/api-assistant.ts"
export const apiAssistant: Character = {
  name: 'APIHelper',
  plugins: [
    '@elizaos/plugin-openai',
    '@elizaos/plugin-knowledge',
  ],
  system: 'You are a technical documentation assistant. Help developers by searching your knowledge base for API documentation, code examples, and best practices.',
  topics: [
    'API endpoints and methods',
    'Authentication and security',
    'Code examples and best practices',
    'Error handling and debugging',
  ],
};
```

**Organize your API docs:**

```
docs/
├── api-reference/
│   ├── authentication.md
│   ├── endpoints.json
│   └── error-codes.csv
├── tutorials/
│   ├── getting-started.md
│   ├── advanced-usage.md
│   └── examples.ts
└── changelog.md
```

### Example 3: Simple Info Bot (Hello World Example)

For very basic, hardcoded information only:

```json title="characters/info-bot.json"
{
  "name": "InfoBot",
  "plugins": [
    "@elizaos/plugin-openai",
    "@elizaos/plugin-knowledge"
  ],
  "knowledge": [
    "Our office is located at 123 Main St",
    "Business hours: 9 AM to 5 PM EST",
    "Contact: support@example.com"
  ],
  "system": "You are a simple information bot. Answer questions using your basic knowledge."
}
```

**Note:** The `knowledge` array is only for tiny snippets. For real documents, use the `docs` folder!

## Real-World Setup Guide

### Step 1: Prepare Your Documents

Create a well-organized `docs` folder:

```
docs/
├── products/
│   ├── product-overview.pdf
│   ├── pricing-tiers.md
│   └── feature-comparison.xlsx
├── support/
│   ├── installation-guide.pdf
│   ├── troubleshooting.md
│   └── common-issues.txt
├── legal/
│   ├── terms-of-service.pdf
│   ├── privacy-policy.md
│   └── data-processing.txt
└── README.md  # Optional: describe folder structure
```

### Step 2: Configure Auto-Loading

```env title=".env"
# Required: Your AI provider
OPENAI_API_KEY=sk-...

# Auto-load documents on startup
```