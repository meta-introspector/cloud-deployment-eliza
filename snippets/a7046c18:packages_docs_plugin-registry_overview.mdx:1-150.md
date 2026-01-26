# a7046c18:packages_docs_plugin-registry_overview.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/overview.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Plugin System Overview"
description: "Comprehensive guide to the elizaOS plugin system architecture and implementation"
---


## Overview

The elizaOS plugin system is a comprehensive extension mechanism that allows developers to add functionality to agents through a well-defined interface. This analysis examines the complete plugin architecture by analyzing the source code and comparing it with the documentation.

## Core Plugins

elizaOS includes essential core plugins that provide foundational functionality:

<CardGroup cols={2}>
  <Card title="Bootstrap Plugin" icon="rocket" href="/plugin-registry/bootstrap">
    The core message handler and event system for elizaOS agents. Provides essential functionality for message processing, knowledge management, and basic agent operations.
  </Card>
  
  <Card title="SQL Plugin" icon="database" href="/plugin-registry/sql">
    Database integration and management for elizaOS. Features automatic schema migrations, multi-database support, and a sophisticated plugin architecture.
  </Card>
  
  <Card title="Knowledge Plugin" icon="brain" href="/plugin-registry/knowledge">
    Advanced knowledge base and RAG system for elizaOS. Provides semantic search, contextual embeddings, and intelligent document processing.
  </Card>
</CardGroup>

## DeFi Plugins

Blockchain and DeFi integrations for Web3 functionality:

<CardGroup cols={2}>
  <Card title="EVM Plugin" icon="cube" href="/plugin-registry/defi/evm">
    Multi-chain EVM support with token transfers, swaps, bridging, and governance across 30+ networks including Ethereum, Base, Arbitrum, and more.
  </Card>
  
  <Card title="Solana Plugin" icon="bolt" href="/plugin-registry/defi/solana">
    High-performance Solana blockchain integration with SOL/SPL transfers, Jupiter swaps, and real-time portfolio tracking.
  </Card>
</CardGroup>

## Platform Integrations

Connect your agent to popular platforms:

<CardGroup cols={2}>
  <Card title="Discord" icon="discord" href="/plugin-registry/platform/discord">
    Full Discord integration with voice, commands, and rich interactions.
  </Card>
  
  <Card title="Telegram" icon="telegram" href="/plugin-registry/platform/telegram">
    Telegram bot functionality with inline keyboards and media support.
  </Card>
  
  <Card title="Twitter" icon="twitter" href="/plugin-registry/platform/twitter">
    Twitter/X integration for posting, replying, and timeline management.
  </Card>
  
  <Card title="Farcaster" icon="message" href="/plugin-registry/platform/farcaster">
    Farcaster social network integration with casting and engagement.
  </Card>
</CardGroup>

## LLM Providers

Choose from various language model providers:

<CardGroup cols={3}>
  <Card title="OpenAI" icon="openai" href="/plugin-registry/llm/openai">
    GPT-4, GPT-3.5, and other OpenAI models.
  </Card>
  
  <Card title="Anthropic" icon="robot" href="/plugin-registry/llm/anthropic">
    Claude 3 and other Anthropic models.
  </Card>
  
  <Card title="OpenRouter" icon="route" href="/plugin-registry/llm/openrouter">
    OpenRouter models for advanced routing and customization.
  </Card>
</CardGroup>

## Community Plugin Registry

Explore the complete collection of community-contributed plugins in our dedicated registry.

<Card title="Browse Plugin Registry" icon="puzzle-piece" href="/plugin-registry/registry">
  Access the full plugin registry with real-time updates, detailed plugin information, version tracking, and easy installation instructions for all v1 compatible elizaOS plugins.
</Card>

## 1. Complete Plugin Interface

Based on `/Users/studio/Documents/GitHub/eliza/packages/core/src/types/plugin.ts`, the full Plugin interface includes:

```typescript
export interface Plugin {
  name: string;                          // Unique identifier
  description: string;                   // Human-readable description
  
  // Initialization
  init?: (config: Record<string, string>, runtime: IAgentRuntime) => Promise<void>;
  
  // Configuration
  config?: { [key: string]: any };       // Plugin-specific configuration
  
  // Core Components (documented)
  actions?: Action[];                    // Tasks agents can perform
  providers?: Provider[];                // Data sources
  evaluators?: Evaluator[];              // Response filters
  
  // Additional Components (not fully documented)
  services?: (typeof Service)[];         // Background services
  adapter?: IDatabaseAdapter;            // Database adapter
  models?: {                            // Model handlers
    [key: string]: (...args: any[]) => Promise<any>;
  };
  events?: PluginEvents;                // Event handlers
  routes?: Route[];                     // HTTP endpoints
  tests?: TestSuite[];                  // Test suites
  componentTypes?: {                    // Custom component types
    name: string;
    schema: Record<string, unknown>;
    validator?: (data: any) => boolean;
  }[];
  
  // Dependency Management
  dependencies?: string[];              // Required plugins
  testDependencies?: string[];          // Test-only dependencies
  priority?: number;                    // Loading priority
  schema?: any;                        // Database schema
}
```

## 2. Action, Provider, and Evaluator Interfaces

### Action Interface
From `/Users/studio/Documents/GitHub/eliza/packages/core/src/types/components.ts`:

```typescript
export interface Action {
  name: string;                         // Unique identifier
  similes?: string[];                   // Alternative names/aliases
  description: string;                  // What the action does
  examples?: ActionExample[][];         // Usage examples
  handler: Handler;                     // Execution logic
  validate: Validator;                  // Pre-execution validation
}

// Handler signature
type Handler = (
```