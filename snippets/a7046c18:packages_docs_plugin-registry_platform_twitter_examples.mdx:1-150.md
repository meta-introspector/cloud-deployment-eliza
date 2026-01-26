# a7046c18:packages_docs_plugin-registry_platform_twitter_examples.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/examples.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Examples"
description: "This document provides practical examples of using the @elizaos/plugin-twitter package in various scenarios."
---

This document provides practical examples of using the @elizaos/plugin-twitter package in various scenarios.

## Basic Bot Setup

### Simple Posting Bot

Create a basic Twitter bot that posts autonomously:

```typescript
import { AgentRuntime } from '@elizaos/core';
import { twitterPlugin } from '@elizaos/plugin-twitter';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';

const character = {
  name: "SimpleTwitterBot",
  description: "A simple Twitter bot that posts updates",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  postExamples: [
    "Just thinking about the future of technology...",
    "Building something new today!",
    "The best code is no code, but sometimes you need to write some.",
    "Learning something new every day keeps the mind sharp."
  ],
  settings: {
    TWITTER_API_KEY: process.env.TWITTER_API_KEY,
    TWITTER_API_SECRET_KEY: process.env.TWITTER_API_SECRET_KEY,
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
    TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    TWITTER_POST_ENABLE: "true",
    TWITTER_POST_IMMEDIATELY: "true",
    TWITTER_POST_INTERVAL_MIN: "120",
    TWITTER_POST_INTERVAL_MAX: "240"
  }
};

// Create and start the runtime
const runtime = new AgentRuntime({ character });
await runtime.start();

console.log('Twitter bot is running and will post every 2-4 hours!');
```

### Content Creator Bot

Bot focused on creating engaging content:

```typescript
const contentCreatorBot = {
  name: "ContentCreator",
  description: "Creates engaging Twitter content",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  postExamples: [
    "Thread: Let's talk about why decentralization matters...",
    "Hot take: The future of AI isn't about replacing humans, it's about augmentation",
    "Day 30 of building in public: Today I learned...",
    "Unpopular opinion: Simplicity > Complexity in system design",
    "What's your biggest challenge in tech right now? Let's discuss 👇"
  ],
  topics: [
    "artificial intelligence",
    "web3 and blockchain",
    "software engineering",
    "startups and entrepreneurship",
    "future of technology"
  ],
  style: {
    tone: "thought-provoking but approachable",
    format: "mix of threads, questions, and insights",
    emoji: "use sparingly for emphasis"
  },
  settings: {
    TWITTER_POST_ENABLE: "true",
    TWITTER_POST_INTERVAL_MIN: "90",
    TWITTER_POST_INTERVAL_MAX: "180",
    TWITTER_POST_INTERVAL_VARIANCE: "0.3",
    TWITTER_MAX_TWEET_LENGTH: "280"  // Keep it concise
  }
};
```

### Thread Poster

Bot that creates detailed threads:

```typescript
const threadPosterBot = {
  name: "ThreadMaster",
  description: "Creates informative Twitter threads",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  postExamples: [
    "A thread on system design principles:\n\n1/ Start with the problem, not the solution",
    "How to build a successful side project:\n\n1/ Pick something you'll use yourself",
    "Lessons learned from 10 years in tech:\n\n1/ Technology changes, principles remain"
  ],
  settings: {
    TWITTER_POST_ENABLE: "true",
    TWITTER_MAX_TWEET_LENGTH: "4000",  // Support for longer threads
    // Custom action for thread creation
    customActions: ["CREATE_THREAD"]
  }
};

// Custom thread creation action
const createThreadAction: Action = {
  name: "CREATE_THREAD",
  description: "Creates a Twitter thread",
  
  handler: async (runtime, message, state, options, callback) => {
    const topic = options.topic || "technology trends";
    
    // Generate thread content
    const threadContent = await runtime.generateText({
      messages: [{
        role: "system",
        content: `Create a Twitter thread about ${topic}. Format as numbered tweets (1/, 2/, etc). Make it informative and engaging.`
      }],
      maxTokens: 1000
    });
    
    // Split into individual tweets
    const tweets = threadContent.text.split(/\d+\//).filter(t => t.trim());
    
    // Post as thread
    let previousTweetId = null;
    for (const tweet of tweets) {
      const response = await runtime.getService('twitter').client.tweet(
        tweet.trim(),
        previousTweetId ? { reply: { in_reply_to_tweet_id: previousTweetId } } : {}
      );
      previousTweetId = response.id;
    }
    
    await callback({
      text: `Thread posted! First tweet: ${tweets[0].substring(0, 50)}...`
    });
    
    return true;
  }
};
```

## Interaction Bots
```