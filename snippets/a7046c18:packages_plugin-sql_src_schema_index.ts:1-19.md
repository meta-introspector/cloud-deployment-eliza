# a7046c18:packages_plugin-sql_src_schema_index.ts:1-19

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/schema/index.ts:1-19
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
export { agentTable } from "./agent";
export { cacheTable } from "./cache";
export { channelTable } from "./channel";
export { channelParticipantsTable } from "./channelParticipant";
export { componentTable } from "./component";
export { embeddingTable } from "./embedding";
export { entityTable } from "./entity";
export { logTable } from "./log";
export { memoryTable } from "./memory";
export { messageTable } from "./message";
// Central database tables
export { messageServerTable } from "./messageServer";
export { messageServerAgentsTable } from "./messageServerAgent";
export { participantTable } from "./participant";
export { relationshipTable } from "./relationship";
export { roomTable } from "./room";
export { serverTable } from "./server";
export { taskTable } from "./tasks";
export { worldTable } from "./world";
```