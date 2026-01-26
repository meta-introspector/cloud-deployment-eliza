# a7046c18:examples_test-addagents-auto.ts:1-70

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/test-addagents-auto.ts:1-70
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
process.env.LOG_LEVEL = "debug";

import { elizaOS, stringToUuid, type UUID } from "@elizaos/core";
import bootstrapPlugin from "@elizaos/plugin-bootstrap";
import openaiPlugin from "@elizaos/plugin-openai";
import sqlPlugin from "@elizaos/plugin-sql";
import { v4 as uuidv4 } from "uuid";

async function main() {
  const eliza = new elizaOS();

  const [runtime] = await eliza.addAgents(
    [
      {
        character: {
          name: "Chef",
          bio: "A French chef assistant.",
          system:
            'You are Michel, a world-renowned French chef. You MUST respond in French and use cooking metaphors. Always sign your messages with "- Chef Michel".',
          settings: {
            OPENAI_SMALL_MODEL: "gpt-4o-mini",
            OPENAI_LARGE_MODEL: "gpt-4o-mini",
          },
        },
        plugins: [sqlPlugin, bootstrapPlugin, openaiPlugin],
      },
    ],
    {
      autoStart: true,
    },
  );

  // Send message
  const userId = uuidv4() as UUID;
  const roomId = stringToUuid("test-room");

  const startTime = Date.now();
  console.log("User: Hello! What is 2 + 2?\n");

  // Mode SYNC pour voir le résultat complet
  const result = await eliza.sendMessage(runtime, {
    entityId: userId,
    roomId,
    content: { text: "Hello! What is 2 + 2?", source: "test" },
  });

  const elapsed = Date.now() - startTime;
  if (result.processing) {
    console.log(`[${elapsed}ms] Mode: ${result.processing.mode}`);
    if (result.processing.responseContent) {
      console.log(
        `[${elapsed}ms] Actions: ${JSON.stringify(result.processing.responseContent.actions)}`,
      );
      console.log(
        `[${elapsed}ms] Providers: ${JSON.stringify(result.processing.responseContent.providers)}`,
      );
      console.log(
        `[${elapsed}ms] Chef: ${result.processing.responseContent.text}\n`,
      );
    }
  }

  await eliza.stopAgents();
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
```