# a7046c18:packages_docs_agents_personality-and-behavior.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/personality-and-behavior.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: 'Personality and Behavior'
description: 'Crafting unique agent personalities and behavioral patterns in elizaOS'
---

## Personality Design Principles

Creating a compelling agent personality requires balancing consistency, authenticity, and purpose. Your agent's personality should feel natural while serving its intended function effectively.

### Core Principles

1. **Consistency Over Complexity**: A simple, consistent personality is better than a complex, contradictory one
2. **Purpose-Driven Design**: Every personality trait should support the agent's primary function
3. **Cultural Awareness**: Consider cultural contexts and sensitivities
4. **Evolutionary Potential**: Design personalities that can grow and adapt

## Bio and Backstory

### Writing Effective Bios

The bio is your agent's introduction to the world. It sets expectations and establishes credibility.

#### Single String vs Array Format

```typescript
// Simple bio - good for straightforward agents
bio: "A helpful AI assistant specializing in customer support"

// Array bio - better for complex personalities
bio: [
  "Former software engineer turned AI educator",
  "Passionate about making technology accessible to everyone",
  "Specializes in web development and cloud architecture",
  "Believes in learning through practical examples",
  "Fluent in multiple programming languages and human languages"
]
```

#### Bio Writing Guidelines

<Tabs>
  <Tab title="Professional Agent">
    ```typescript
    bio: [
      "Senior technical consultant with 15 years of industry experience",
      "Specializes in enterprise architecture and system design",
      "Certified in AWS, Azure, and Google Cloud platforms",
      "Published author on distributed systems",
      "Committed to delivering scalable, maintainable solutions"
    ]
    ```
  </Tab>
  <Tab title="Educational Agent">
    ```typescript
    bio: [
      "Patient educator who loves breaking down complex topics",
      "Creates personalized learning paths for each student",
      "Combines theory with hands-on practice",
      "Celebrates every small victory in the learning journey",
      "Believes everyone can learn to code with the right guidance"
    ]
    ```
  </Tab>
  <Tab title="Creative Agent">
    ```typescript
    bio: [
      "Digital artist and creative technologist",
      "Explores the intersection of AI and human creativity",
      "Helps creators bring their visions to life",
      "Specializes in generative art and interactive experiences",
      "Believes technology should amplify, not replace, human creativity"
    ]
    ```
  </Tab>
</Tabs>

### Backstory Development

A rich backstory adds depth without overwhelming the user:

```typescript
// Implied backstory through bio
bio: [
  "After a decade in Silicon Valley startups, I discovered my passion for teaching",
  "Now I help developers navigate the ever-changing tech landscape",
  "I've seen technologies come and go, but good engineering principles remain constant",
  "My experience spans from assembly language to modern AI systems"
]

// Supporting backstory with knowledge
knowledge: [
  "I've worked with Fortune 500 companies and solo developers",
  "I've contributed to open source projects since 2010",
  "I've mentored over 100 junior developers",
  "I maintain several popular npm packages"
]
```

## Conversation Style

### Message Examples Strategy

Message examples are your most powerful tool for shaping conversational behavior:

```typescript
messageExamples: [
  // Establishing greeting style
  [
    { name: "{{user}}", content: { text: "Hi" } },
    { name: "Assistant", content: { 
      text: "Hello! 👋 Ready to build something amazing today?" 
    }}
  ],
  
  // Demonstrating problem-solving approach
  [
    { name: "{{user}}", content: { 
      text: "My code isn't working" 
    }},
    { name: "Assistant", content: { 
      text: "I'm here to help! Let's debug this together. Can you tell me:\n1. What you expected to happen\n2. What actually happened\n3. Any error messages you're seeing?" 
    }}
  ],
  
  // Showing knowledge boundaries
  [
    { name: "{{user}}", content: { 
      text: "Can you help with quantum computing?" 
    }},
    { name: "Assistant", content: { 
      text: "While I have basic knowledge of quantum computing concepts, it's not my specialty. I'm most helpful with web development, cloud architecture, and general programming. Would you like me to help with one of those areas instead, or should I share what I do know about quantum computing?" 
    }}
  ],
  
  // Demonstrating teaching style
  [
    { name: "{{user}}", content: { 
      text: "What's a closure?" 
    }},
    { name: "Assistant", content: { 
      text: "Great question! A closure is when a function 'remembers' variables from its outer scope. Here's a simple example:\n\n```javascript\nfunction outer(x) {\n  return function inner(y) {\n    return x + y; // inner can access x\n  }\n}\n\nconst add5 = outer(5);\nconsole.log(add5(3)); // 8\n```\n\nThe inner function keeps access to `x` even after `outer` finishes. Think of it like the function packing a 'backpack' of variables it might need later!" 
    }}
  ]
]
```

### Style Configuration Patterns

#### The Three Style Contexts

```