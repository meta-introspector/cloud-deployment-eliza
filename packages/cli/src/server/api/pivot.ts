import type { IAgentRuntime, Memory, UUID } from '@elizaos/core';
import { logger } from '@elizaos/core';

interface PivotEntry {
  action: string;
  provider: string;
  thought: string;
  metaThought: string;
  entityIds: string[];
  count: number;
  memoryIds: string[];
  //earliestCreatedAt: number;
  //frequencyOverTime: { [date: string]: number };
  //uniqueProvidersCount: number;
  //embedding: number[];
  //matrixEmbedding: number[];
  //clusterId: number;
  //timestep: number;
  //[key: `cluster_${number}`]: number;
  //[key: `dim_${number}`]: number;
}

function clusterEmbeddings(embeddings: number[][], k: number = 3): number[] {
  // Simplified clustering (or use previous k-means)
  return embeddings.map((_, i) => Math.min(i % k, k - 1));
}

export async function generateMemoryPivotTable(
  runtime: IAgentRuntime,
  roomId: UUID,
  cutoff: number,
  limit: number = 100,
  kClusters: number = 3,
  timestepSize: number = 24 * 60 * 60 * 1000
): Promise<PivotEntry[]> {
  let memories = await runtime.getMemories({
    tableName: 'messages',
    roomId,
    count: limit,
    unique: false,
    //  where: { createdAt: { $lte: cutoff } }, // Initial cutoff
  });

  const pivotTable: PivotEntry[] = [];
  //let currentTime = cutoff;
  //const endTime = cutoff + timestepSize; // Limit to one step for stability
  //console.log('memories', memories.length, 'cutoff', cutoff, 'endTime', endTime);
  //for (let timestep = 0; currentTime <= endTime; timestep++, currentTime += timestepSize) {
  //const timestepMemories = memories.filter(m => {
  //console.log('mem', m);
  //const createdAt = m.createdAt.getTime();
  //return createdAt > (currentTime - timestepSize) && createdAt <= currentTime;
  //return true
  //});

  const thoughts: string[] = [];
  const thoughtMemoryMap: { [thought: string]: Memory[] } = {};
  for (const memory of memories) {
    const contentText = memory.content.text.trim();
    let data;
    try {
      data = contentText.startsWith('```json\n')
        ? JSON.parse(contentText.slice(7, -3))
        : JSON.parse(contentText);
    } catch {
      // Fallback for malformed JSON
      data = {
        thought: contentText.replace(/```/g, '').trim(),
        actions: ['REPLY'],
        providers: ['default'],
      };
    }
    const thought = data.thought || 'unknown';
    thoughts.push(thought);
    thoughtMemoryMap[thought] = thoughtMemoryMap[thought] || [];
    thoughtMemoryMap[thought].push(memory);
    // } catch (e) {
    //     logger.debug('[PIVOT_TABLE] Skipping malformed memory', { id: memory.id, error: e.message });
    // }
  }

  const uniqueThoughts = Array.from(new Set(thoughts));
  // const thoughtEmbeddings = await Promise.all(
  //     uniqueThoughts.map(async (thought) => {
  //         const mem = thoughtMemoryMap[thought][0];
  //         const embedded = await runtime.addEmbeddingToMemory({
  //             ...mem,
  //             content: { text: thought },
  //             createdAt: new Date(currentTime),
  //         });
  //         //console.log('DEBUGembedded', embedded);
  //         // DEBUGembedded {
  //         //     id: "754e36d9-68c4-46fb-98c0-3da6be3287b9",
  //         //     type: "messages",
  //         //     createdAt: 1970-01-01T00:00:00.100Z,
  //         //     content: {
  //         //       text: "Understanding the context of the current conversation and planning next steps",
  //         //     },
  //         //     entityId: "0f24db58-8427-0a26-9dde-31fee8fe32d6",
  //         //     agentId: "3694f252-b1e1-0268-8d1a-361a5015872b",
  //         //     roomId: "b00277bb-f2f5-0bd8-87c0-fdcde110498e",
  //         //     unique: true,
  //         //     metadata: {},
  //         //     embedding: [
  //         //       0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //         //       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //         //       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //         //       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  //         //       ... 1436 more items
  //         //     ],
  //         //   }
  //         for (const [index, item] of embedded.embedding.entries()) {
  //             if (item != 0) {
  //                 console.log('DEBUGembedded', item, index);
  //             }
  //         }
  //         return embedded.embedding || new Array(384).fill(0);
  //     })
  // );

  // const clusters = thoughtEmbeddings.length ? clusterEmbeddings(thoughtEmbeddings, kClusters) : [];
  //const thoughtToCluster = new Map(uniqueThoughts.map((t, i) => [t, clusters[i] || 0]));

  const pivotMap = new Map<string, PivotEntry>();
  const providerSets = new Map<string, Set<string>>();

  for (const text of uniqueThoughts) {
    let memory = thoughtMemoryMap[text][0];
    // try {
    const contentText = memory.content.text.trim();
    let data;
    try {
      data = contentText.startsWith('```json\n')
        ? JSON.parse(contentText.slice(7, -3))
        : JSON.parse(contentText);
    } catch {
      data = {
        thought: contentText.replace(/```/g, '').trim(),
        actions: ['REPLY'],
        providers: ['default'],
      };
    }
    const actions = Array.isArray(data.actions) ? data.actions : [data.actions || 'UNKNOWN'];
    const providers = Array.isArray(data.providers)
      ? data.providers.sort()
      : [data.providers || 'default'];
    const thought = data.thought || 'unknown';
    const entityId = memory.entityId || 'unknown';
    const createdAt = 0; // memory.createdAt.getTime();
    const dateKey = 'now'; //new Date(createdAt).toISOString().split('T')[0];
    const thoughtIndex = uniqueThoughts.indexOf(thought);
    // const embedding = thoughtEmbeddings[thoughtIndex] || new Array(384).fill(0);
    // const clusterId = thoughtToCluster.get(thought) || 0;

    for (const action of actions) {
      for (const provider of providers) {
        const key = `${thought}|${action}|${providers}`;
        const entry = pivotMap.get(key) || {
          action,
          provider: provider,
          thought,
          metaThought: '',
          entityIds: [],
          count: 0,
          memoryIds: [],
          earliestCreatedAt: Infinity,
          frequencyOverTime: {},
          uniqueProvidersCount: 0,
          //embedding,
          matrixEmbedding: [],
          //clusterId,
          //timestep,
        };

        entry.count += 1;
        entry.memoryIds.push(memory.id);
        //entry.earliestCreatedAt = Math.min(entry.earliestCreatedAt, createdAt);
        //entry.frequencyOverTime[dateKey] = (entry.frequencyOverTime[dateKey] || 0) + 1;
        if (!entry.entityIds.includes(entityId)) entry.entityIds.push(entityId);

        const actionKey = action;
        //   const providerSet = providerSets.get(actionKey) || new Set();
        //   providerSet.add(JSON.stringify(providers));
        //   providerSets.set(actionKey, providerSet);
        //   entry.uniqueProvidersCount = providerSets.get(actionKey)!.size;

        //embedding.forEach((value, idx) => {
        //    entry[`dim_${idx}` as const] = value;
        //});

        pivotMap.set(key, entry);
      }
    }

    //catch (e) {
    //    logger.debug('[PIVOT_TABLE] Skipping malformed memory', { id: memory.id, error: e.message });
  }

  const timestepPivot = Array.from(pivotMap.values());
  for (const entry of timestepPivot) {
    //entry[`cluster_${entry.clusterId}` as const] = entry.count;
    //for (let i = 0; i < kClusters; i++) {
    //    if (i !== entry.clusterId) entry[`cluster_${i}` as const] = 0;
    //}

    entry.metaThought = `thought reflects ${entry.count} ${entry.action} actions from ${entry.provider}.`;
    const matrixText = JSON.stringify({
      action: entry.action,
      provider: entry.provider,
      thought: entry.thought,
      metaThought: entry.metaThought,
      count: entry.count,
      //clusterId: entry.clusterId,
      //timestep: entry.timestep,
    });
    // const matrixMem = await runtime.addEmbeddingToMemory({
    //     entityId: roomId,
    //     agentId: runtime.agentId,
    //     content: { text: matrixText },
    //     roomId,
    //     //  createdAt: new Date(currentTime),
    // });
    // entry.matrixEmbedding = matrixMem.embedding || new Array(384).fill(0);

    //await runtime.createMemory(
    const mem = {
      id: `${roomId}-matrix`,
      entityId: roomId,
      agentId: runtime.agentId,
      content: { text: matrixText },
      roomId,
      //createdAt: new Date(currentTime),
    }; //, 'messages');
    // console.log('mem', mem);
  }

  pivotTable.push(...timestepPivot);

  // Refresh memories for next timestep (but cap at cutoff for stability)
  memories = await runtime.getMemories({
    tableName: 'messages',
    roomId,
    count: limit,
    unique: false,
    //where: { createdAt: { $lte: cutoff } }, // Pin to cutoff
  });

  //logger.info('[PIVOT_TABLE] Pivot table with timesteps', { entries: pivotTable.slice(0, 5) });
  //console.log('[PIVOT_TABLE] Pivot table with timesteps', { entries: pivotTable.slice(0, 5) });
  //console.log('[PIVOT_TABLE2] Pivot table with timesteps', pivotTable.length);
  return pivotTable;
}
