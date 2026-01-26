# a7046c18:packages_docs_plugin-registry_bootstrap_examples.mdx:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/examples.mdx:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
- Identify team dynamics and roles
- Record successful strategies shared
- Monitor player frustration levels
</gaming-focus>

<output>
{
  "thought": "Gaming insight",
  "facts": [{
    "claim": "Gaming fact or strategy",
    "type": "strategy|mechanic|meta",
    "game": "specific game name"
  }],
  "playerProfile": {
    "skillLevel": "beginner|intermediate|advanced|pro",
    "preferredRole": "tank|dps|support|flex",
    "interests": ["pvp", "pve", "competitive"]
  }
}
</output>`,
  },

  // Gaming-related bio and style
  bio: [
    'Expert in multiple game genres',
    'Provides real-time strategy advice',
    'Helps teams coordinate effectively',
    'Explains complex game mechanics simply',
  ],

  style: {
    chat: [
      'Use gaming slang appropriately',
      'Quick responses during matches',
      'Detailed guides when asked',
      'Supportive and encouraging tone',
    ],
  },
};

// Create the gaming bot
const gamingBot = new AgentRuntime({
  character: gamingBotCharacter,
  plugins: [bootstrapPlugin],
});
```

### Example 2: Customer Support Bot with Templates

```typescript
const supportBotCharacter: Character = {
  name: 'SupportAgent',
  description: '24/7 customer support specialist',

  templates: {
    // Support-focused shouldRespond
    shouldRespondTemplate: `<task>Determine if {{agentName}} should handle this support request.</task>

{{providers}}

<support-priorities>
PRIORITY 1 (Always respond):
- Error messages or bug reports
- Account issues or login problems
- Payment or billing questions
- Direct help requests

PRIORITY 2 (Respond):
- Feature questions
- How-to requests
- General feedback

PRIORITY 3 (Conditionally respond):
- Complaints (respond with empathy)
- Feature requests (acknowledge and log)

NEVER IGNORE:
- Frustrated customers
- Urgent issues
- Security concerns
</support-priorities>

<output>
<response>
  <reasoning>Support priority assessment</reasoning>
  <action>RESPOND | ESCALATE | ACKNOWLEDGE</action>
</response>
</output>`,

    // Professional support message handler
    messageHandlerTemplate: `<task>Provide professional support as {{agentName}}.</task>

{{providers}}
Available actions: {{actionNames}}

<support-guidelines>
- Acknowledge the issue immediately
- Express empathy for any inconvenience
- Provide clear, step-by-step solutions
- Offer alternatives if primary solution unavailable
- Always follow up on open issues
</support-guidelines>

<tone>
- Professional yet friendly
- Patient and understanding
- Solution-oriented
- Proactive in preventing future issues
</tone>

<output>
<response>
  <thought>Issue analysis and solution approach</thought>
  <actions>REPLY,CREATE_TICKET</actions>
  <providers>USER_HISTORY,KNOWLEDGE_BASE,OPEN_TICKETS</providers>
  <text>Your support response</text>
</response>
</output>`,

    // Support interaction reflection
    reflectionTemplate: `<task>Analyze support interaction for quality and improvement.</task>

{{recentMessages}}

<support-metrics>
- Issue resolved: yes/no/escalated
- Customer satisfaction indicators
- Response time and efficiency
- Knowledge gaps identified
- Common issues pattern
</support-metrics>

<output>
{
  "thought": "Support interaction analysis",
  "resolution": {
    "status": "resolved|unresolved|escalated",
    "issueType": "technical|billing|account|other",
    "satisfactionIndicators": ["positive", "negative", "neutral"]
  },
  "facts": [{
    "claim": "Issue or solution discovered",
    "type": "bug|workaround|feature_request",
    "frequency": "first_time|recurring|common"
  }],
  "improvements": ["suggested FAQ entries", "documentation needs"]
}
</output>`,
  },
};
```