# 5e8c73c1:packages_cli_src_commands_scenario_src_TrajectoryReconstructor.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/TrajectoryReconstructor.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      return (
        contentObj.type === 'agent' ||
        contentObj.type === 'user' ||
        // Handle memories without explicit type but with thought/actions (agent responses)
        (typeof contentObj.thought !== 'undefined' && typeof contentObj.actions !== 'undefined') ||
        // Handle user messages (scenario messages)
        contentObj.source === 'scenario_message'
      );
    });

    console.log(
      `🎯 [TrajectoryReconstructor] Processing ${actionMemories.length} action memories and ${messageMemories.length} message memories...`
    );

    // Reconstruct trajectory steps from both action and message memories
    const steps: TrajectoryStep[] = [];
    const runIds = new Set<UUID>();

    // Process action memories to build trajectory (using EXACT same approach as working evaluator)
    for (const memory of actionMemories) {
      const content = memory.content as Record<string, unknown> & {
        actionName?: string;
        actionParams?: Record<string, unknown>;
        actionResult?: Record<string, unknown> & { text?: string };
        thought?: string;
        planThought?: string;
        actionStatus?: string;
      };

      console.log(`\n🔄 Processing action memory ${memory.id}...`);
      console.log(`   actionName: ${content.actionName || 'undefined'}`);
      console.log(`   actionParams:`, content.actionParams || {});
      console.log(`   actionResult:`, content.actionResult || {});
      console.log(`   thought:`, content.thought || 'undefined');
      console.log(`   planThought:`, content.planThought || 'undefined');
      console.log(`   actionStatus:`, content.actionStatus || 'undefined');

      // Extract action information (same structure as TrajectoryContainsActionEvaluator)
      const actionName = content.actionName || 'unknown';
      const actionParams = content.actionParams || {};
      const actionResult = content.actionResult as Record<string, unknown> | string | undefined;
      const thought = content.thought || content.planThought || '';

      // Get observation content from various possible locations
      let observationContent = '';
      if (actionResult && typeof actionResult === 'object' && 'text' in actionResult) {
        observationContent = String(actionResult.text);
      } else if (actionResult && typeof actionResult === 'object' && 'stdout' in actionResult) {
        observationContent = String(actionResult.stdout);
      } else if (actionResult && typeof actionResult === 'object' && 'output' in actionResult) {
        observationContent = String(actionResult.output);
      } else if (typeof actionResult === 'string') {
        observationContent = actionResult;
      } else if (actionResult && typeof actionResult === 'object') {
        observationContent = JSON.stringify(actionResult);
      }

      console.log(
        `   📋 Extracted observation (${observationContent.length} chars):`,
        observationContent.substring(0, 200)
      );

      // Create trajectory steps matching GitHub ticket #5785 format
      const timestamp = new Date(memory.createdAt || Date.now()).toISOString();

      // Step 1: Thought (if available)
      if (thought && thought.trim()) {
        const thoughtStep: TrajectoryStep = {
          type: 'thought',
          timestamp,
          content: thought,
        };
        steps.push(thoughtStep);
        console.log(`   💭 Created thought step:`, JSON.stringify(thoughtStep, null, 2));
      }

      // Step 2: Action
      const actionStep: TrajectoryStep = {
        type: 'action',
        timestamp,
        content: {
          name: actionName,
          parameters: actionParams,
        },
      };
      steps.push(actionStep);
      console.log(`   ⚡ Created action step:`, JSON.stringify(actionStep, null, 2));

      // Step 3: Observation
      const observationStep: TrajectoryStep = {
        type: 'observation',
        timestamp,
        content: observationContent,
      };
      steps.push(observationStep);
      console.log(`   👁️ Created observation step:`, JSON.stringify(observationStep, null, 2));
    }

    // NEW: Process message memories for conversation scenarios
    console.log(
      `\n💬 [TrajectoryReconstructor] Processing ${messageMemories.length} message memories...`
    );
    for (const memory of messageMemories) {
      const content = memory.content as Record<string, unknown> & {
        type?: string;
        text?: string;
        source?: string;
        thought?: string;
        actions?: unknown;
      };
      const timestamp = new Date(memory.createdAt || Date.now()).toISOString();

      console.log(`\n🔄 Processing message memory ${memory.id}...`);
      console.log(`   type: ${content.type || 'undefined'}`);
      console.log(
        `   text: ${content.text ? String(content.text).substring(0, 100) + '...' : 'undefined'}`
      );
      console.log(`   source: ${content.source || 'undefined'}`);
      console.log(`   thought: ${content.thought ? 'present' : 'absent'}`);
      console.log(`   Content Type: ${typeof content}`);
      console.log(`   Content Keys: ${Object.keys(content || {}).join(', ')}`);
      console.log(`   Full Content: ${JSON.stringify(content, null, 2)}`);

      // Determine if this is an agent message or user message
      const isAgentMessage =
        content.type === 'agent' ||
        (typeof content.thought !== 'undefined' && typeof content.actions !== 'undefined');

      // Create thought step from agent messages
      if (isAgentMessage && content?.thought) {
        const thoughtStep: TrajectoryStep = {
          type: 'thought',
          timestamp,
          content: content.thought,
        };
        steps.push(thoughtStep);
        console.log(
          `   💭 Created thought step from agent message:`,
          JSON.stringify(thoughtStep, null, 2)
        );
      }

      // Create observation step from message content
      const messageContent = content?.text || content?.content || 'No content';
      const messageType = isAgentMessage ? 'Agent' : 'User';
      const observationStep: TrajectoryStep = {
        type: 'observation',
        timestamp,
        content: `${messageType} message: ${messageContent}`,
      };
```