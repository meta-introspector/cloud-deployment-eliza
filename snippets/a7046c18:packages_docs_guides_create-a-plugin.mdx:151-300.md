# a7046c18:packages_docs_guides_create-a-plugin.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/create-a-plugin.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    cp src/plugin.ts src/actions/generateVideo.ts
    ```
    
    Now let's edit the example plugin into our generateVideo action:
    
    **Add the fal.ai import (from the fal.ai docs):**
    ```typescript src/actions/generateVideo.ts
    import {
      Action, ActionResult, IAgentRuntime, Memory, HandlerCallback, State, logger
    } from '@elizaos/core';
    import { fal } from '@fal-ai/client'; // [!code ++]
    ```
    
    **Update the action identity for video generation:**
    ```typescript
    const quickAction: Action = { // [!code --]
    export const generateVideoAction: Action = { // [!code ++]
      name: 'QUICK_ACTION', // [!code --]
      name: 'TEXT_TO_VIDEO', // [!code ++]
      similes: ['GREET', 'SAY_HELLO', 'HELLO_WORLD'], // [!code --]
      similes: ['CREATE_VIDEO', 'MAKE_VIDEO', 'GENERATE_VIDEO', 'VIDEO_FROM_TEXT'], // [!code ++]
      description: 'Responds with a simple hello world message', // [!code --]
      description: 'Generate a video from text using MiniMax Hailuo-02', // [!code ++]
    ```
    
    **Replace validation with API key check:**
    ```typescript
      validate: async (_runtime, _message, _state) => { // [!code --]
        return true; // Always valid // [!code --]
      }, // [!code --]
      validate: async (runtime: IAgentRuntime, message: Memory) => { // [!code ++]
        const falKey = runtime.getSetting('FAL_KEY'); // [!code ++]
        if (!falKey) { // [!code ++]
          logger.error('FAL_KEY not found in environment variables'); // [!code ++]
          return false; // [!code ++]
        } // [!code ++]
        return true; // [!code ++]
      }, // [!code ++]
    ```
    
    **Replace hello world logic with video generation:**
    ```typescript
      handler: async (_runtime, message, _state, _options, callback) => { // [!code --]
        const response = 'Hello world!'; // [!code --]
        
        if (callback) { // [!code --]
          await callback({ // [!code --]
            text: response, // [!code --]
            actions: ['QUICK_ACTION'], // [!code --]
            source: message.content.source, // [!code --]
          }); // [!code --]
        } // [!code --]
        
        return { // [!code --]
          text: response, // [!code --]
          success: true, // [!code --]
          data: { actions: ['QUICK_ACTION'], source: message.content.source } // [!code --]
        }; // [!code --]
      }, // [!code --]
      handler: async ( // [!code ++]
        runtime: IAgentRuntime, // [!code ++]
        message: Memory, // [!code ++]
        state: State | undefined, // [!code ++]
        options: any, // [!code ++]
        callback?: HandlerCallback // [!code ++]
      ): Promise<ActionResult> => { // [!code ++]
        try { // [!code ++]
          fal.config({ credentials: runtime.getSetting('FAL_KEY') }); // [!code ++]
          let prompt = message.content.text.replace(/^(create video:|make video:)/i, '').trim(); // [!code ++]
          if (!prompt) return { success: false, text: 'I need a description' }; // [!code ++]
          
          const result = await fal.subscribe("fal-ai/minimax/hailuo-02/standard/text-to-video", { // [!code ++]
            input: { prompt, duration: "6" }, logs: true // [!code ++]
          }); // [!code ++]
          
          const videoUrl = result.data.video.url; // [!code ++]
          if (callback) await callback({ text: `✅ Video ready! ${videoUrl}` }); // [!code ++]
          return { success: true, text: 'Video generated', data: { videoUrl, prompt } }; // [!code ++]
        } catch (error) { // [!code ++]
          return { success: false, text: `Failed: ${error.message}` }; // [!code ++]
        } // [!code ++]
      }, // [!code ++]
    ```
    
    **Update examples for video conversations:**
    ```typescript
      examples: [ // [!code --]
        [{ // [!code --]
          name: '{{name1}}', // [!code --]
          content: { text: 'Can you say hello?' } // [!code --]
        }, { // [!code --]
          name: '{{name2}}', // [!code --]
          content: { text: 'hello world!', actions: ['QUICK_ACTION'] } // [!code --]
        }] // [!code --]
      ], // [!code --]
      examples: [ // [!code ++]
        [{ name: '{{user}}', content: { text: 'Create video: dolphins jumping' } }, // [!code ++]
         { name: '{{agent}}', content: { text: 'Creating video!', actions: ['TEXT_TO_VIDEO'] }}] // [!code ++]
      ], // [!code ++]
    };
    ```
    
  </Step>

  <Step title="Update index.ts to use your action">
    Finally, update `src/index.ts` to use our new plugin:
    
    ```typescript src/index.ts
    import { Plugin } from '@elizaos/core';
    import { generateVideoAction } from './actions/generateVideo'; // [!code ++]

    export const falaiPlugin: Plugin = { // [!code ++]
      name: 'fal-ai', // [!code ++]
      description: 'Generate videos using fal.ai MiniMax Hailuo-02', // [!code ++]
      actions: [generateVideoAction], // [!code ++]
      providers: [], // [!code ++]
      services: [] // [!code ++]
    }; // [!code ++]

    export default falaiPlugin; // [!code ++]
    export { generateVideoAction }; // [!code ++]
    ```
    
    <Note>
    You can reference `plugin.ts` as well as other plugins from the [Plugin Registry](/plugin-registry/overview) to see other plugin component examples (providers, services, etc.) as you expand your plugin.
    </Note>
  </Step>
</Steps>


### Add Configuration

<Steps>
  <Step title="Get your fal.ai API key">
    Get an API key from [fal.ai](https://fal.ai) and copy/paste it into your .env:

    ```bash .env
    PGLITE_DATA_DIR=./.eliza/.elizadb
    OPENAI_API_KEY=your_openai_key_here
    
    FAL_KEY=your_fal_key_here # [!code ++]
    ```
  </Step>
</Steps>

---

## Step 3: Testing

### Test Plugin Functionality
```