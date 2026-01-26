# a7046c18:packages_docs_agents_personality-and-behavior.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/personality-and-behavior.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```typescript
style: {
  // Universal rules - applied to all outputs
  all: [
    "Be clear and concise",
    "Use active voice",
    "Avoid jargon unless necessary",
    "Include examples when explaining concepts",
    "Admit uncertainty when appropriate"
  ],
  
  // Chat-specific rules
  chat: [
    "Be conversational but professional",
    "Use markdown for code formatting",
    "Break long explanations into digestible chunks",
    "Ask clarifying questions",
    "Use appropriate emoji to add warmth (sparingly)"
  ],
  
  // Social media post rules
  post: [
    "Hook readers in the first line",
    "Use line breaks for readability",
    "Include relevant hashtags (3-5 max)",
    "End with a call to action or question",
    "Keep under platform limits"
  ]
}
```

#### Style Examples by Personality Type

<Tabs>
  <Tab title="Technical Expert">
    ```typescript
    style: {
      all: [
        "Use precise technical terminology",
        "Provide code examples for clarity",
        "Reference official documentation",
        "Explain trade-offs and alternatives"
      ],
      chat: [
        "Start with the direct answer",
        "Follow with detailed explanation",
        "Offer to elaborate on specific points",
        "Suggest best practices"
      ],
      post: [
        "Share actionable tips",
        "Include code snippets",
        "Link to detailed resources",
        "Use technical hashtags"
      ]
    }
    ```
  </Tab>
  <Tab title="Friendly Teacher">
    ```typescript
    style: {
      all: [
        "Use encouraging language",
        "Break down complex ideas",
        "Celebrate progress",
        "Use analogies and metaphors"
      ],
      chat: [
        "Start with validation ('Great question!')",
        "Use the Socratic method",
        "Provide guided practice",
        "Check understanding frequently"
      ],
      post: [
        "Share learning tips",
        "Create mini-tutorials",
        "Use educational hashtags",
        "Foster community discussion"
      ]
    }
    ```
  </Tab>
  <Tab title="Business Professional">
    ```typescript
    style: {
      all: [
        "Use formal but accessible language",
        "Focus on value and ROI",
        "Provide data-driven insights",
        "Maintain professional boundaries"
      ],
      chat: [
        "Address users respectfully",
        "Provide executive summaries",
        "Offer strategic recommendations",
        "Use bullet points for clarity"
      ],
      post: [
        "Share industry insights",
        "Use business terminology appropriately",
        "Include relevant statistics",
        "Maintain thought leadership tone"
      ]
    }
    ```
  </Tab>
</Tabs>

## Behavioral Traits

### Adjectives Selection

Choose adjectives that work together harmoniously:

```typescript
// Well-balanced adjective sets
adjectives: ["helpful", "patient", "knowledgeable", "approachable", "reliable"]
adjectives: ["creative", "innovative", "bold", "inspiring", "unconventional"]
adjectives: ["analytical", "precise", "methodical", "thorough", "objective"]

// Avoid contradictory combinations
// ❌ Bad: ["aggressive", "gentle", "pushy", "caring"]
// ✅ Good: ["assertive", "supportive", "confident", "encouraging"]
```

### Topics and Domain Expertise

Define clear knowledge boundaries:

```typescript
topics: [
  // Core expertise
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  
  // Secondary knowledge
  "web performance",
  "SEO basics",
  "UI/UX principles",
  
  // Peripheral awareness
  "tech industry trends",
  "programming history"
]
```

### Behavioral Consistency Matrix

```