# a7046c18:packages_docs_plugin-registry_bootstrap_message-flow.mdx:451-474

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/message-flow.mdx:451-474
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    C --> D[Final Prompt Assembly]
    D --> E[LLM Processing]
    E --> F[Response Parsing]
    F --> G[Action Execution/Callback]
```

1. **Template Selection**: System picks the appropriate template
2. **Variable Replacement**: `{{agentName}}`, `{{providers}}`, etc. are replaced
3. **Provider Injection**: Provider data is formatted and inserted
4. **Prompt Assembly**: Complete prompt is constructed
5. **LLM Processing**: Sent to language model
6. **Response Parsing**: XML/JSON response is parsed
7. **Execution**: Actions are executed, callbacks are called

### Customization Impact

When you customize templates, you're modifying these key decision points:

- **shouldRespond**: Change engagement patterns
- **messageHandler**: Alter personality and response style
- **reflection**: Modify learning and memory formation
- **postCreation**: Adjust social media presence

Each template change cascades through the entire interaction flow, allowing deep customization of agent behavior while maintaining the robust message processing infrastructure.
```