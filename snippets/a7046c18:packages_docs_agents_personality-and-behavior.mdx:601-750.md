# a7046c18:packages_docs_agents_personality-and-behavior.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/personality-and-behavior.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```env
# .env
OPENAI_API_KEY=sk-...
LOAD_DOCS_ON_STARTUP=true           # Auto-load all docs on startup
```

**4. Start Your Agent**

```bash
elizaos start
```

The agent will automatically process all documents in the `docs` folder, creating embeddings and making the knowledge searchable.

### Knowledge-Enhanced Response Patterns

When loaded with comprehensive knowledge, your agent can provide remarkably sophisticated responses:

```typescript
messageExamples: [
  // Demonstrates deep literary analysis
  [
    { name: "{{user}}", content: { text: "What makes Hamlet's soliloquy so powerful?" }},
    { name: "Shakespeare Scholar", content: { 
      text: "The 'To be or not to be' soliloquy reveals Hamlet's philosophical depth through its structure. Notice how Shakespeare uses the infinitive 'to be' - existence itself becomes a choice. The speech moves from abstract contemplation ('to suffer') to concrete imagery ('bodkin'), mirroring Hamlet's mental process from philosophy to action. The caesura after 'to sleep' creates dramatic pause, while 'perchance to dream' introduces uncertainty that drives the entire moral argument." 
    }}
  ],
  
  // Shows historical context integration
  [
    { name: "{{user}}", content: { text: "How did audiences react to Othello in Shakespeare's time?" }},
    { name: "Shakespeare Scholar", content: { 
      text: "Othello premiered around 1603 at the Globe Theatre, where groundlings paid a penny to stand in the yard. Contemporary accounts suggest audiences were shocked by the interracial marriage - unusual even in cosmopolitan London. The play's exploration of jealousy and manipulation would have resonated with court intrigue under James I. Thomas Rymer's 1693 critique called it 'a bloody farce' - reflecting period discomfort with the play's psychological realism over classical dramatic rules." 
    }}
  ]
]
```

### How Knowledge Enhances Personality

Once loaded, the knowledge plugin automatically injects relevant information into conversations. Your agent's responses become dramatically more sophisticated:

```typescript
messageExamples: [
  // Before knowledge: Generic response
  [
    { name: "{{user}}", content: { text: "Tell me about Hamlet" }},
    { name: "BasicAgent", content: { 
      text: "Hamlet is a famous play by Shakespeare about a prince seeking revenge." 
    }}
  ],
  
  // After knowledge: Rich, detailed response
  [
    { name: "{{user}}", content: { text: "Tell me about Hamlet" }},
    { name: "Shakespeare Scholar", content: { 
      text: "Hamlet, written around 1600-1601, is Shakespeare's longest and most psychologically complex tragedy. The play follows Prince Hamlet's quest to avenge his father's murder by his uncle Claudius. What makes it extraordinary is its exploration of madness, revenge, mortality, and moral uncertainty. The famous 'To be or not to be' soliloquy in Act 3 crystallizes Hamlet's philosophical struggle between action and inaction." 
    }}
  ]
]
```

### Knowledge Organization Strategies

**File-Based Knowledge (Recommended)**

Organize documents in your `docs` folder by relevance and type:

```
docs/
├── primary-sources/          # Most important/authoritative
│   ├── complete-works.pdf   # Shakespeare's actual texts
│   └── historical-records/
├── analysis/                 # Secondary analysis
│   ├── literary-criticism/
│   └── scholarly-papers/
└── context/                  # Background information
    ├── elizabethan-era.md
    └── theater-history.txt
```

**Character Knowledge Array (For Small Snippets)**

Use the `knowledge` array only for brief, essential facts:

```typescript
// character.ts
export const character: Character = {
  // ... other config
  
  // Only for small, essential facts
  knowledge: [
    "I am the foremost expert on William Shakespeare's works",
    "I have studied Elizabethan theater for over 20 years",
    "I can quote any sonnet or play passage from memory"
  ]
}
```

<Warning>
  The `knowledge` array is only for tiny snippets. For actual documents, use the `docs` folder with `LOAD_DOCS_ON_STARTUP=true`.
</Warning>

### Advanced Configuration

Customize knowledge processing in your environment:

```env
# .env
OPENAI_API_KEY=sk-...

# Core knowledge settings
LOAD_DOCS_ON_STARTUP=true           # Auto-process docs folder
CTX_KNOWLEDGE_ENABLED=true          # Enable contextual embeddings

# Optional: Custom knowledge folder
KNOWLEDGE_PATH=/path/to/custom/docs

# Processing limits
MAX_INPUT_TOKENS=4000
MAX_OUTPUT_TOKENS=2000
```

### Testing Knowledge Integration

Verify your knowledge is working:

```bash
# Start your agent
elizaos start

# Check logs for confirmation
# You should see: "[INFO] Loaded 15 documents from docs folder on startup"
```

Then test with your agent:
- "What do you know about [topic from your documents]?"
- "Search your knowledge for [specific term]"
- Ask domain-specific questions related to your uploaded documents

## Advanced Personality Features

### Multi-Persona Agents

Agents that can switch between different modes:

```typescript
templates: {
  personaSwitch: ({ mode }) => {
    const personas = {
```