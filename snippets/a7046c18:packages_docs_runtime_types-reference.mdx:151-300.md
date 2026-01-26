# a7046c18:packages_docs_runtime_types-reference.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/types-reference.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}
```

### StateData

Typed cache for frequently accessed data:

```typescript
interface StateData {
  room?: Room;
  world?: World;
  entity?: Entity;
  providers?: Record<string, ProviderResult>;
  actionPlan?: ActionPlan;
  actionResults?: ActionResult[];
}
```

### ActionPlan

For multi-step action execution:

```typescript
interface ActionPlan {
  thought: string;
  totalSteps: number;
  currentStep: number;
  steps: ActionPlanStep[];
}

interface ActionPlanStep {
  action: string;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
  result?: ActionResult;
}
```

**Example - Multi-step Action:**

```typescript
// The runtime creates action plans automatically
const state = await runtime.composeState(message);

if (state.data.actionPlan) {
  console.log(`Step ${state.data.actionPlan.currentStep} of ${state.data.actionPlan.totalSteps}`);
  console.log(`Current action: ${state.data.actionPlan.steps[0].action}`);
}
```

---

## Messaging Types

### ControlMessage

Backend-to-frontend control messages:

```typescript
interface ControlMessage {
  type: 'control';
  payload: {
    action: 'disable_input' | 'enable_input';
    target?: string;
    [key: string]: unknown;
  };
  roomId: UUID;
}
```

**Use Case:** Disable user input while agent is processing:

```typescript
// Emit control message to disable input
await runtime.emit(EventType.CONTROL_MESSAGE, {
  type: 'control',
  payload: {
    action: 'disable_input',
  },
  roomId: currentRoomId
});

// ... do work ...

// Re-enable input
await runtime.emit(EventType.CONTROL_MESSAGE, {
  type: 'control',
  payload: {
    action: 'enable_input'
  },
  roomId: currentRoomId
});
```

### MessageStreamChunkPayload

Streaming response chunk data:

```typescript
interface MessageStreamChunkPayload {
  messageId: UUID;
  chunk: string;
  index: number;
  channelId: string;
  agentId: UUID;
}
```

### TargetInfo

Message routing target:

```typescript
interface TargetInfo {
  source: string;           // Platform (discord, telegram, etc.)
  roomId: UUID;
  channelId?: string;
  serverId?: string;
  entityId?: UUID;
  threadId?: string;
}
```

### SOCKET_MESSAGE_TYPE

WebSocket message type enum:

```typescript
enum SOCKET_MESSAGE_TYPE {
  ROOM_JOINING = 1,
  SEND_MESSAGE = 2,
  MESSAGE = 3,
  ACK = 4,
  THINKING = 5,
  CONTROL = 6,
}
```

---

## Event Payloads

### RunEventPayload

Emitted on run start/end:

```typescript
interface RunEventPayload extends EventPayload {
  runId: UUID;
  agentId: UUID;
```