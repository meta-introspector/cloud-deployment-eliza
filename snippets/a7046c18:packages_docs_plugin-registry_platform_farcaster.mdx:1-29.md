# a7046c18:packages_docs_plugin-registry_platform_farcaster.mdx:1-29

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/farcaster.mdx:1-29
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Farcaster Integration"
description: "Welcome to the comprehensive documentation for the @elizaos/plugin-farcaster package. This index provides organized access to all documentation resources."
---


The @elizaos/plugin-farcaster enables your elizaOS agent to interact with the Farcaster social network through casting, replying, and engaging with the decentralized social protocol.

## 📚 Documentation

- **[Developer Guide](/plugin-registry/platform/farcaster/developer-guide)** - Detailed technical reference
- **[Cast Flow](/plugin-registry/platform/farcaster/cast-flow)** - Visual guide to cast processing
- **[Examples](/plugin-registry/platform/farcaster/examples)** - Practical implementation examples
- **[Testing Guide](/plugin-registry/platform/farcaster/testing-guide)** - Testing strategies and patterns

## 🔧 Configuration

### Required Settings
- `FARCASTER_NEYNAR_API_KEY` - Neynar API key for authentication
- `FARCASTER_SIGNER_UUID` - Neynar signer UUID for your account
- `FARCASTER_FID` - Your Farcaster ID (FID)

### Optional Settings
- `ENABLE_CAST` - Enable autonomous casting (default: true)
- `ENABLE_ACTION_PROCESSING` - Enable processing interactions (default: false)
- `FARCASTER_DRY_RUN` - Test mode without posting (default: false)
- `CAST_INTERVAL_MIN` - Minimum interval between casts in minutes (default: 90)
- `CAST_INTERVAL_MAX` - Maximum interval between casts in minutes (default: 180)
- `ACTION_TIMELINE_TYPE` - Type of timeline to use for actions (default: ForYou)
```