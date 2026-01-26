# a7046c18:packages_core_typescript_src_prompts.ts:151-252

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/prompts.ts:151-252
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

Be objective and descriptive. Focus on what you can actually see in the image rather than making assumptions about context or meaning.
</instructions>

<output>
Do NOT include any thinking, reasoning, or <think> sections in your response. 
Go directly to the XML response format without any preamble or explanation.

Respond using XML format like this:
<response>
  <title>A concise, descriptive title for the image</title>
  <description>A brief 1-2 sentence summary of the key elements in the image</description>
  <text>An extensive, detailed description covering all visible elements, composition, lighting, colors, mood, setting, objects, people, activities, and any other relevant details you can observe in the image</text>
</response>

IMPORTANT: Your response must ONLY contain the <response></response> XML block above. Do not include any text, thinking, or reasoning before or after this XML block. Start your response immediately with <response> and end with </response>.
</output>`;

export const multiStepDecisionTemplate = `<task>
Determine the next step the assistant should take in this conversation to help the user reach their goal.
</task>

{{recentMessages}}

# Multi-Step Workflow

In each step, decide:

1. **Which providers (if any)** should be called to gather necessary data.
2. **Which action (if any)** should be executed after providers return.
3. Decide whether the task is complete. If so, set \`isFinish: true\`. Do not select the \`REPLY\` action; replies are handled separately after task completion.

You can select **multiple providers** and at most **one action** per step.

If the task is fully resolved and no further steps are needed, mark the step as \`isFinish: true\`.

---

{{actionsWithDescriptions}}

{{providersWithDescriptions}}

These are the actions or data provider calls that have already been used in this run. Use this to avoid redundancy and guide your next move.

{{actionResults}}

<keys>
"thought" Clearly explain your reasoning for the selected providers and/or action, and how this step contributes to resolving the user's request.
"action"  Name of the action to execute after providers return (can be empty if no action is needed).
"providers" List of provider names to call in this step (can be empty if none are needed).
"isFinish" Set to true only if the task is fully complete.
</keys>

⚠️ IMPORTANT: Do **not** mark the task as \`isFinish: true\` immediately after calling an action. Wait for the action to complete before deciding the task is finished.

<output>
<response>
  <thought>Your thought here</thought>
  <action>ACTION</action>
  <providers>PROVIDER1,PROVIDER2</providers>
  <isFinish>true | false</isFinish>
</response>
</output>`;

export const multiStepSummaryTemplate = `<task>
Summarize what the assistant has done so far and provide a final response to the user based on the completed steps.
</task>

# Context Information
{{bio}}

---

{{system}}

---

{{messageDirections}}

# Conversation Summary
Below is the user’s original request and conversation so far:
{{recentMessages}}

# Execution Trace
Here are the actions taken by the assistant to fulfill the request:
{{actionResults}}

# Assistant’s Last Reasoning Step
{{recentMessage}}

# Instructions

 - Review the execution trace and last reasoning step carefully

 - Your final output MUST be in this XML format:
<output>
<response>
  <thought>Your thought here</thought>
  <text>Your final message to the user</text>
</response>
</output>
`;
```