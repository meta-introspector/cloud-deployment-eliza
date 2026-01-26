# 5e8c73c1:packages_plugin-bootstrap_src_providers_recentMessages.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/recentMessages.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import {
  addHeader,
  ChannelType,
  CustomMetadata,
  formatMessages,
  formatPosts,
  getEntityDetails,
  type Entity,
  type IAgentRuntime,
  type Memory,
  type Provider,
  type UUID,
  logger,
} from '@elizaos/core';

// Move getRecentInteractions outside the provider
/**
 * Retrieves the recent interactions between two entities in a specific context.
 *
 * @param {IAgentRuntime} runtime - The agent runtime object.
 * @param {UUID} sourceEntityId - The UUID of the source entity.
 * @param {UUID} targetEntityId - The UUID of the target entity.
 * @param {UUID} excludeRoomId - The UUID of the room to exclude from the search.
 * @returns {Promise<Memory[]>} A promise that resolves to an array of Memory objects representing recent interactions.
 */
/**
 * Retrieves the recent interactions between two entities in different rooms excluding a specific room.
 * @param {IAgentRuntime} runtime - The agent runtime object.
 * @param {UUID} sourceEntityId - The UUID of the source entity.
 * @param {UUID} targetEntityId - The UUID of the target entity.
 * @param {UUID} excludeRoomId - The UUID of the room to exclude from the search.
 * @returns {Promise<Memory[]>} An array of Memory objects representing recent interactions between the two entities.
 */
const getRecentInteractions = async (
  runtime: IAgentRuntime,
  sourceEntityId: UUID,
  targetEntityId: UUID,
  excludeRoomId: UUID
): Promise<Memory[]> => {
  // Find all rooms where sourceEntityId and targetEntityId are participants
  const rooms = await runtime.getRoomsForParticipants([sourceEntityId, targetEntityId]);

  // Check the existing memories in the database
  return runtime.getMemoriesByRoomIds({
    tableName: 'messages',
    // filter out the current room id from rooms
    roomIds: rooms.filter((room) => room !== excludeRoomId),
    limit: 20,
  });
};

/**
 * A provider object that retrieves recent messages, interactions, and memories based on a given message.
 * @typedef {object} Provider
 * @property {string} name - The name of the provider ("RECENT_MESSAGES").
 * @property {string} description - A description of the provider's purpose ("Recent messages, interactions and other memories").
 * @property {number} position - The position of the provider (100).
 * @property {Function} get - Asynchronous function that retrieves recent messages, interactions, and memories.
 * @param {IAgentRuntime} runtime - The runtime context for the agent.
 * @param {Memory} message - The message to retrieve data from.
 * @returns {object} An object containing data, values, and text sections.
 */
export const recentMessagesProvider: Provider = {
  name: 'RECENT_MESSAGES',
  description: 'Recent messages, interactions and other memories',
  position: 100,
  get: async (runtime: IAgentRuntime, message: Memory) => {
    try {
      const { roomId } = message;
      const conversationLength = runtime.getConversationLength();

      // Parallelize initial data fetching operations including recentInteractions
      const [entitiesData, room, recentMessagesData, recentInteractionsData] = await Promise.all([
        getEntityDetails({ runtime, roomId }),
        runtime.getRoom(roomId),
        runtime.getMemories({
          tableName: 'messages',
          roomId,
          count: conversationLength,
          unique: false,
        }),
        message.entityId !== runtime.agentId
          ? getRecentInteractions(runtime, message.entityId, runtime.agentId, roomId)
          : Promise.resolve([]),
      ]);

      // Separate action results from regular messages
      const actionResultMessages = recentMessagesData.filter(
        (msg) => msg.content?.type === 'action_result' && msg.metadata?.type === 'action_result'
      );

      const dialogueMessages = recentMessagesData.filter(
        (msg) => !(msg.content?.type === 'action_result' && msg.metadata?.type === 'action_result')
      );

      // Default to message format if room is not found or type is undefined
      const isPostFormat = room?.type
        ? room.type === ChannelType.FEED || room.type === ChannelType.THREAD
        : false;

      // Format recent messages and posts in parallel, using only dialogue messages
      const [formattedRecentMessages, formattedRecentPosts] = await Promise.all([
        formatMessages({
          messages: dialogueMessages,
          entities: entitiesData,
        }),
        formatPosts({
          messages: dialogueMessages,
          entities: entitiesData,
          conversationHeader: false,
        }),
      ]);

      // Format action results separately
      let actionResultsText = '';
      if (actionResultMessages.length > 0) {
        // Group by runId using Map
        const groupedByRun = new Map<string, Memory[]>();

        for (const mem of actionResultMessages) {
          const runId: string = String(mem.content?.runId || 'unknown');
          if (!groupedByRun.has(runId)) {
            groupedByRun.set(runId, []);
          }
          const memories = groupedByRun.get(runId);
          if (memories) {
            memories.push(mem);
          }
        }

        const formattedActionResults = Array.from(groupedByRun.entries())
          .slice(-3) // Show last 3 runs
          .map(([runId, memories]) => {
            const sortedMemories = memories.sort(
              (a: Memory, b: Memory) => (a.createdAt || 0) - (b.createdAt || 0)
            );

            const thought = sortedMemories[0]?.content?.planThought || '';
            const runText = sortedMemories
              .map((mem: Memory) => {
                const actionName = mem.content?.actionName || 'Unknown';
                const status = mem.content?.actionStatus || 'unknown';
                const planStep = mem.content?.planStep || '';
                const text = mem.content?.text || '';
                const error = mem.content?.error || '';

                let memText = `  - ${actionName} (${status})`;
                if (planStep) {
                  memText += ` [${planStep}]`;
                }
```