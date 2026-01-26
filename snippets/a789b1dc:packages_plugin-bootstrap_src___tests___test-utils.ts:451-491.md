# a789b1dc:packages_plugin-bootstrap_src___tests___test-utils.ts:451-491

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/test-utils.ts:451-491
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
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