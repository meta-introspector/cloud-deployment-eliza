# a7046c18:packages_plugin-sql_src___tests___integration_seed_task-seed.ts:1-97

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/task-seed.ts:1-97
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { Task, UUID } from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";

// Test IDs
export const taskTestAgentId = uuidv4() as UUID;
export const taskTestRoomId = uuidv4() as UUID;
export const taskTestWorldId = uuidv4() as UUID;
export const taskTestEntityId = uuidv4() as UUID;

// Sample test tasks
export const taskTestTasks: Task[] = [
  {
    id: uuidv4() as UUID,
    name: "Test Task 1",
    description: "This is a test task for integration testing #1",
    roomId: taskTestRoomId,
    worldId: taskTestWorldId,
    tags: ["test", "integration", "task1"],
    metadata: {
      priority: "high",
      dueDate: Date.now() + 86400000, // 1 day from now
      status: "pending",
    },
  },
  {
    id: uuidv4() as UUID,
    name: "Test Task 2",
    description: "This is a test task for integration testing #2",
    roomId: taskTestRoomId,
    worldId: taskTestWorldId,
    tags: ["test", "integration", "task2"],
    metadata: {
      priority: "medium",
      dueDate: Date.now() + 172800000, // 2 days from now
      status: "pending",
    },
  },
  {
    id: uuidv4() as UUID,
    name: "Test Task 3",
    description: "This is a test task for integration testing #3",
    roomId: taskTestRoomId,
    worldId: taskTestWorldId,
    tags: ["test", "integration", "task3"],
    metadata: {
      priority: "low",
      dueDate: Date.now() + 259200000, // 3 days from now
      status: "pending",
    },
  },
  {
    id: uuidv4() as UUID,
    name: "Special Test Task",
    description:
      "This is a special task with unique name for name search testing",
    roomId: taskTestRoomId,
    worldId: taskTestWorldId,
    tags: ["test", "integration", "special"],
    metadata: {
      priority: "high",
      dueDate: Date.now() + 43200000, // 12 hours from now
      status: "pending",
      options: [
        { name: "Option 1", description: "First option" },
        { name: "Option 2", description: "Second option" },
      ],
    },
  },
];

// Sample task with different room
export const taskTestTaskDifferentRoom: Task = {
  id: uuidv4() as UUID,
  name: "Task Different Room",
  description: "This task belongs to a different room for filter testing",
  roomId: uuidv4() as UUID, // Different room ID
  worldId: taskTestWorldId,
  tags: ["test", "different-room"],
  metadata: {
    priority: "medium",
    status: "pending",
  },
};

// Test task with specific tags for filtering tests
export const taskTestTaskWithSpecificTags: Task = {
  id: uuidv4() as UUID,
  name: "Task With Specific Tags",
  description: "This task has specific tags for filter testing",
  roomId: taskTestRoomId,
  worldId: taskTestWorldId,
  tags: ["test", "filter-test", "specific-tag"],
  metadata: {
    priority: "high",
    status: "pending",
  },
};
```