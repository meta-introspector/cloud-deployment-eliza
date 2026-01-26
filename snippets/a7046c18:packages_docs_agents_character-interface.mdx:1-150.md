# a7046c18:packages_docs_agents_character-interface.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/character-interface.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: 'Character Interface'
description: 'Define your agent personality, knowledge, and behavior in one file'
---

## Your First Character (2 minutes)

A character file is all you need to create a unique agent. Here's the minimum:

```typescript
export const character: Character = {
  name: "Chef Mario",
  bio: "A passionate Italian chef who loves sharing recipes and cooking tips.",
  plugins: ["@elizaos/plugin-openai"],
};
```

That's it. Your agent now has a name, personality, and can chat. Everything else is optional.

<Tip>
**Start minimal, add complexity later.** Most fields have sensible defaults. Only add what you need.
</Tip>

---

## Overview

In elizaOS, the distinction between a **Character** and an **Agent** is fundamental:

- **Character**: A configuration object that defines an agent's personality, capabilities, and settings
- **Agent**: A runtime instance created from a Character, with additional status tracking and lifecycle management

Think of a Character as a blueprint and an Agent as the living instance built from that blueprint. For hands-on implementation, see [Customize an Agent](/guides/customize-an-agent). For runtime details, see [Runtime and Lifecycle](/agents/runtime-and-lifecycle).

## Character vs Agent

The transformation from Character to Agent happens at runtime:

```typescript
// Character: Static configuration
interface Character {
  name: string;
  bio: string | string[];
  // ... configuration properties
}

// Agent: Runtime instance with status
interface Agent extends Character {
  enabled?: boolean;
  status?: 'active' | 'inactive';
  createdAt: number;
  updatedAt: number;
}
```

## Character Interface Reference

The complete TypeScript interface for agents:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | ✅ | Agent's display name |
| `bio` | string \| string[] | ✅ | Background/personality description |
| `id` | UUID | ❌ | Unique identifier (auto-generated if not provided) |
| `username` | string | ❌ | Social media username |
| `system` | string | ❌ | System prompt override |
| `templates` | object | ❌ | Custom prompt templates |
| `adjectives` | string[] | ❌ | Character traits (e.g., "helpful", "creative") |
| `topics` | string[] | ❌ | Conversation topics the agent knows |
| `knowledge` | array | ❌ | Facts, files, or directories of knowledge |
| `messageExamples` | array[][] | ❌ | Example conversations (2D array) |
| `postExamples` | string[] | ❌ | Example social media posts |
| `style` | object | ❌ | Writing style for different contexts |
| `plugins` | string[] | ❌ | Enabled plugin packages |
| `settings` | object | ❌ | Configuration values |
| `secrets` | object | ❌ | Sensitive configuration |

## Core Properties

### Identity Configuration

The fundamental properties that define who your agent is:

```typescript
export const character: Character = {
  // Required: The agent's display name
  name: "TechHelper",
  
  // Optional: Username for social platforms
  username: "tech_helper_bot",
  
  // Optional: Unique ID (auto-generated from name if not provided)
  id: "550e8400-e29b-41d4-a716-446655440000",
}
```

### Bio and Description

The bio can be a single string or an array of strings for better organization:

```typescript
// Single string format
bio: "A helpful AI assistant specializing in technical support and programming guidance."

// Array format (recommended for complex bios)
bio: [
  "Expert in web development and open source technologies",
  "Specializes in TypeScript, React, and Node.js",
  "Helps developers debug issues and learn best practices",
  "Friendly and patient teaching style"
]
```

### System Prompt Configuration

Override the default system prompt to fine-tune agent behavior:

```typescript
system: `You are a technical support specialist. 
Always:
- Provide code examples when relevant
- Explain technical concepts clearly
- Be encouraging to learners
- Admit when you don't know something
Never:
- Be condescending or dismissive
- Assume prior knowledge without checking
- Provide outdated or deprecated solutions`
```

### Templates Object Structure

Custom prompt templates for various agent operations:

```typescript
templates?: {
  // Define custom templates for different contexts
  messageTemplate?: string | ((params: any) => string);
  thoughtTemplate?: string | ((params: any) => string);
  actionTemplate?: string | ((params: any) => string);
  // Add any custom template keys your plugins need
  [key: string]: string | ((params: any) => string);
}
```

## Conversation Training

### Message Examples Structure

Message examples train the agent's conversational style using a 2D array format:
```