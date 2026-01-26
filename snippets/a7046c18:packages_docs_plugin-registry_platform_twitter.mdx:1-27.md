# a7046c18:packages_docs_plugin-registry_platform_twitter.mdx:1-27

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter.mdx:1-27
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Twitter/X Integration"
description: "Welcome to the comprehensive documentation for the @elizaos/plugin-twitter package. This index provides organized access to all documentation resources."
---


The @elizaos/plugin-twitter enables your elizaOS agent to interact with Twitter/X through autonomous posting, timeline monitoring, and intelligent engagement.

## Documentation

- **[Developer Guide](/plugin-registry/platform/twitter/developer-guide)** - Detailed technical reference
- **[Timeline Flow](/plugin-registry/platform/twitter/timeline-flow)** - Visual guide to timeline processing
- **[Examples](/plugin-registry/platform/twitter/examples)** - Practical implementation examples
- **[Testing Guide](/plugin-registry/platform/twitter/testing-guide)** - Testing strategies and patterns

## Configuration

### Required Settings
- `TWITTER_API_KEY` - OAuth 1.0a API Key
- `TWITTER_API_SECRET_KEY` - OAuth 1.0a API Secret
- `TWITTER_ACCESS_TOKEN` - OAuth 1.0a Access Token
- `TWITTER_ACCESS_TOKEN_SECRET` - OAuth 1.0a Token Secret

### Feature Toggles
- `TWITTER_POST_ENABLE` - Enable autonomous posting
- `TWITTER_SEARCH_ENABLE` - Enable timeline monitoring
- `TWITTER_DRY_RUN` - Test mode without posting
```