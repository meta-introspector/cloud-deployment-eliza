# a7046c18:packages_docs_plugin-registry_knowledge_quick-start.mdx:151-245

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/quick-start.mdx:151-245
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

If you want to use a different folder for documents:

```env title=".env"
# Custom path to your documents
KNOWLEDGE_PATH=/path/to/your/documents
```

### Provider Settings

The plugin automatically uses your existing AI provider. If you're using OpenRouter:

```typescript
// In your character file (e.g., character.ts)
export const character = {
  name: 'MyAgent',
  plugins: [
    '@elizaos/plugin-openrouter',
    '@elizaos/plugin-knowledge', // ← Add this line
    // ... your other plugins
  ],
  // ... rest of your character config
};
```

```env title=".env"
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-large  # Optional: specify embedding model
```

<Note>
OpenRouter now supports embeddings natively with multiple models: `text-embedding-3-large`, `qwen3-embedding`, `gemini-embedding`, `mistral-embed`.
</Note>

## <Icon icon="question" /> FAQ

**Q: Do I need any API keys?**  
A: For simple setup, only OPENAI_API_KEY.

**Q: What if I don't have any AI plugins?**  
A: You need at least one AI provider plugin (like `@elizaos/plugin-openai`) for embeddings.

**Q: Can I upload documents while the agent is running?**  
A: Yes! Use the web interface or just tell your agent to process a file.

**Q: How much does this cost?**
A: Only the cost of generating embeddings (usually pennies per document).

**Q: Where are my documents stored?**  
A: Documents are processed and stored in your agent's database as searchable chunks.

## <Icon icon="exclamation-triangle" /> Common Issues

### Documents Not Loading

Make sure:
- Your `docs` folder exists in the right location
- `LOAD_DOCS_ON_STARTUP=true` is in your `.env` file
- Files are in supported formats

### Can't Access Web Interface

Check that:
- Your agent is running (`elizaos start`)
- You're using the correct URL: `http://localhost:3000`
- No other application is using port 3000

### Agent Can't Find Information

Try:
- Using simpler search terms
- Checking if the document was successfully processed
- Looking in the Knowledge tab to verify the document is there

## <Icon icon="rocket" /> Next Steps

Now that you have the basics working:

- Try uploading different types of documents
- Organize your documents into folders
- Ask your agent complex questions about the content
- Explore the web interface features

<CardGroup cols={2}>
  <Card title="Examples" icon="code" href="/plugin-registry/knowledge/examples">
    See the plugin in action
  </Card>
  <Card title="Advanced Guide" icon="rocket" href="/plugin-registry/knowledge/complete-documentation">
    Advanced configuration options
  </Card>
</CardGroup>

<Info>
The Knowledge Plugin is designed to work out-of-the-box. You only need to adjust settings if you have specific requirements.
</Info>
```