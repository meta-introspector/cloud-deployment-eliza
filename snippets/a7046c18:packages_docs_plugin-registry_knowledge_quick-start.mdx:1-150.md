# a7046c18:packages_docs_plugin-registry_knowledge_quick-start.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/quick-start.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: Quick Start Guide
description: Get up and running with the Knowledge Plugin in 5 minutes
---

Give your AI agent the ability to learn from documents and answer questions based on that knowledge. Works out of the box with zero configuration!

## Getting Started (Beginner-Friendly)

### Step 1: Add the Plugin

The Knowledge plugin works automatically with any elizaOS agent. Just add it to your agent's plugin list:

```typescript
// In your character file (e.g., character.ts)
export const character = {
  name: 'MyAgent',
  plugins: [
    '@elizaos/plugin-openai', // ← Make sure you have this
    '@elizaos/plugin-knowledge', // ← Add this line
    // ... your other plugins
  ],
  // ... rest of your character config
};
```

**That's it!** Your agent can now learn from documents. You'll need an `OPENAI_API_KEY` in your `.env` file for embeddings.

<Note>
Add `OPENAI_API_KEY=your-api-key` to your `.env` file. This is used for creating document embeddings, even if you're using a different AI provider for chat.
</Note>

### Step 2: Upload Documents (Optional)

Want your agent to automatically learn from documents when it starts?

1. **Create a `docs` folder** in your project root:

   ```
   your-project/
   ├── .env
   ├── docs/           ← Create this folder
   │   ├── guide.pdf
   │   ├── manual.txt
   │   └── notes.md
   └── package.json
   ```

2. **Add this line to your `.env` file:**

   ```env
   LOAD_DOCS_ON_STARTUP=true
   ```

3. **Start your agent** - it will automatically learn from all documents in the `docs` folder!

### Step 3: Ask Questions

Once documents are loaded, just talk to your agent naturally:

- "What does the guide say about setup?"
- "Search your knowledge for configuration info"
- "What do you know about [any topic]?"

Your agent will search through all loaded documents and give you relevant answers!

## Supported File Types

The plugin can read almost any document:

- **Text Files:** `.txt`, `.md`, `.csv`, `.json`, `.xml`, `.yaml`
- **Documents:** `.pdf`, `.doc`, `.docx`
- **Code Files:** `.js`, `.ts`, `.py`, `.java`, `.cpp`, `.html`, `.css` and many more

## Using the Web Interface

The Knowledge Plugin includes a powerful web interface for managing your agent's knowledge base.

### Accessing the Knowledge Manager

1. **Start your agent:**
   ```bash
   elizaos start
   ```

2. **Open your browser** and go to `http://localhost:3000`

3. **Select your agent** from the list (e.g., "Eliza")

4. **Click the Knowledge tab** in the right panel

That's it! You can now:
- Upload new documents
- Search existing documents
- Delete documents you no longer need
- See all documents your agent has learned from

<Tip>
You can also drag and drop files directly onto the Knowledge tab to upload them!
</Tip>

## Agent Actions

Your agent automatically gets these new abilities:

- **PROCESS_KNOWLEDGE** - "Remember this document: [file path or text]"
- **SEARCH_KNOWLEDGE** - "Search your knowledge for [topic]"

### Examples in Chat

**First, upload a document through the GUI:**
1. Go to `http://localhost:3000`
2. Click on your agent and open the Knowledge tab
3. Upload a document (e.g., `company_q3_earnings.pdf`)

**Then ask your agent about it:**

```
You: What were the Q3 revenue figures?
Agent: Based on the Q3 earnings report in my knowledge base, the revenue was $2.3M, 
       representing a 15% increase from Q2...

You: Search your knowledge for information about profit margins
Agent: I found relevant information about profit margins: The Q3 report shows gross 
       margins improved to 42%, up from 38% in the previous quarter...

You: What does the report say about future projections?
Agent: According to the earnings report, the company projects Q4 revenue to reach 
       $2.8M with continued margin expansion...
```

## Organizing Your Documents

Create subfolders for better organization:

```
docs/
├── products/
│   ├── product-guide.pdf
│   └── pricing.md
├── support/
│   ├── faqs.txt
│   └── troubleshooting.md
└── policies/
    └── terms.pdf
```

## Basic Configuration (Optional)

### Custom Document Folder
```