# 5e8c73c1:packages_plugin-bootstrap_src___tests___test-utils.ts:451-501

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/test-utils.ts:451-501
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  emitEvent: ReturnType<typeof mock>;
  registerEvent: ReturnType<typeof mock>;
  getCache: ReturnType<typeof mock>;
  setCache: ReturnType<typeof mock>;

  // Knowledge methods
  getKnowledge: ReturnType<typeof mock>;
  addKnowledge: ReturnType<typeof mock>;

  // Task-related methods
  registerTaskWorker: ReturnType<typeof mock>;
  getTaskWorker: ReturnType<typeof mock>;

  // Additional methods used in action tests
  updateParticipantUserState: ReturnType<typeof mock>;
  getUserServerRole: ReturnType<typeof mock>;
  findEntityByName: ReturnType<typeof mock>;
  getParticipantUserState: ReturnType<typeof mock>;
  setParticipantUserState: ReturnType<typeof mock>;
  getMemberRole: ReturnType<typeof mock>;

  // Methods that were missing from the original implementation
  searchMemories: ReturnType<typeof mock>;
  getRoomsForParticipants: ReturnType<typeof mock>;
  getRoomsForEntity: ReturnType<typeof mock>;
  searchEntities: ReturnType<typeof mock>;
  searchRooms: ReturnType<typeof mock>;
  getEntity: ReturnType<typeof mock>;
  getWorldSettings: ReturnType<typeof mock>;
  findWorldsForOwner: ReturnType<typeof mock>;

  // State cache for multi-step functionality
  stateCache: {
    get: ReturnType<typeof mock>;
    set: ReturnType<typeof mock>;
  };

  // File, PDF, and Image service methods
  uploadFile: ReturnType<typeof mock>;
  getFile: ReturnType<typeof mock>;
  listFiles: ReturnType<typeof mock>;
  deleteFile: ReturnType<typeof mock>;
  extractTextFromPDF: ReturnType<typeof mock>;
  describeImage: ReturnType<typeof mock>;

  // Added for recentMessages provider
  getMemoriesByRoomIds: ReturnType<typeof mock>;

  // Add this line in the appropriate section with other database methods
  ensureAgentExists: ReturnType<typeof mock>;
};
```