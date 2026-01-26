# a7046c18:packages_docs_guides_create-a-plugin.mdx:301-428

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/create-a-plugin.mdx:301-428
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Verify your plugin works as expected:

<Steps>
  <Step title="Test the updated plugin">
    First rebuild your plugin to effect our changes, then start from project root:
    ```bash Terminal
    # Build the plugin first
    cd plugin-fal-ai
    bun run build
    
    # Start from project root  
    cd ..
    elizaos start
    ```
  </Step>

  <Step title="Test video generation">
    Try your new action by chatting with Eliza in the GUI (`http://localhost:3000`):
    
    - `"Create video: dolphins jumping in ocean"`
    - `"Make video: cat playing piano"`  
    - `"Generate video: sunset over mountains"`
    
    You should see the video generation process and get a URL to view the result!

  </Step>
</Steps>

### Plugin Component Tests

Plugins come default with component and E2E tests. Let's add custom component tests:

<Steps>
  <Step title="Add a component test">
    Update `plugin-fal-ai/src/__tests__/plugin.test.ts`:
    
    ```typescript src/__tests__/plugin.test.ts
    import { describe, it, expect } from 'bun:test';
    import { falaiPlugin, generateVideoAction } from '../index'; // [!code ++]

    describe('FAL AI Plugin', () => {
      it('action validates with FAL_KEY', async () => { // [!code ++]
        const mockRuntime = { // [!code ++]
          getSetting: (key: string) => key === 'FAL_KEY' ? 'test-key' : null // [!code ++]
        }; // [!code ++]
        
        const isValid = await generateVideoAction.validate(mockRuntime as any, {} as any); // [!code ++]
        expect(isValid).toBe(true); // [!code ++]
      }); // [!code ++]
    });
    ```
  </Step>

  <Step title="Run component tests">
    ```bash Terminal
    cd plugin-fal-ai
    elizaos test --type component
    ```
  </Step>
</Steps>

### Plugin E2E Tests

Let's also add a custom E2E test:

<Steps>
  <Step title="Add an E2E test">
    Update `src/__tests__/e2e/plugin-fal-ai.e2e.ts`:
    
    ```typescript src/__tests__/e2e/plugin-fal-ai.e2e.ts
    export const FalAiTestSuite = { // [!code ++]
      name: 'fal-ai-video-generation', // [!code ++]
      tests: [{ // [!code ++]
        name: 'should find video action in runtime', // [!code ++]
        fn: async (runtime) => { // [!code ++]
          const action = runtime.actions.find(a => a.name === 'TEXT_TO_VIDEO'); // [!code ++]
          if (!action) throw new Error('TEXT_TO_VIDEO action not found'); // [!code ++]
        } // [!code ++]
      }] // [!code ++]
    }; // [!code ++]
    ```
  </Step>

  <Step title="Run E2E tests">
    ```bash Terminal
    cd plugin-fal-ai  
    elizaos test --type e2e
    ```
  </Step>
</Steps>

---

## Step 4: Possible Next Steps

Congratulations! You now have a working video generation plugin. Here are some ways you can improve it:

### Enhance Your Action
- **Add more similes** - Handle requests like "animate this", "video of", "show me a clip of"
- **Better examples** - Add more conversation examples so Eliza learns different chat patterns
- **Error handling** - Handle rate limits, invalid prompts, or API timeouts

### Add Plugin Components
- **Providers** - Give your agent context about recent videos or video history
- **Evaluators** - Track analytics, log successful generations, or rate video quality  
- **Services** - Add queueing for multiple video requests or caching for common prompts

The possibilities are endless! 

---

## See Also

<CardGroup cols={2}>
  <Card title="Publish a Plugin" icon="upload" href="/guides/publish-a-plugin">
    Share your plugin with the elizaOS community
  </Card>
  <Card title="Contribute to Core" icon="heart" href="/guides/contribute-to-core">
    Help improve elizaOS by contributing to the core framework
  </Card>
  <Card title="Plugin Registry" icon="book" href="/plugin-registry/overview">
    Explore existing plugins and find inspiration
  </Card>
  <Card title="CLI Reference" icon="terminal" href="/cli-reference/overview">
    Master all elizaOS CLI commands for plugin development
  </Card>
</CardGroup>
```