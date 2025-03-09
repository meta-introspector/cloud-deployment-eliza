
import {
    type Adapter,
    AgentRuntime,
    CacheManager,
    CacheStore,
    type Character,
    type ClientInstance,
    DbCacheAdapter,
    elizaLogger,
    FsCacheAdapter,
    type IAgentRuntime,
    type IDatabaseAdapter,
    type IDatabaseCacheAdapter,
    ModelProviderName,
    parseBooleanFromText,
    settings,
    stringToUuid,
    validateCharacterConfig,
} from "@elizaos/core";
//import { defaultCharacter } from "./defaultCharacter.ts";
//import { bootstrapPlugin } from "@elizaos/plugin-bootstrap";

import fs from "fs";
import net from "net";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";

async function startMemory(): Promise<AgentRuntime> {
    let db: IDatabaseAdapter & IDatabaseCacheAdapter;
    try {
        character.id ??= stringToUuid(character.name);
        character.username ??= character.name;

        const token = getTokenForProvider(character.modelProvider, character);

        const runtime: AgentRuntime = await createAgent(
            character,
            token
        );

        // initialize database
        // find a db from the plugins
        db = await findDatabaseAdapter(runtime);
        runtime.databaseAdapter = db;

        // initialize cache
        const cache = initializeCache(
            process.env.CACHE_STORE ?? CacheStore.DATABASE,
            character,
            process.env.CACHE_DIR ?? "",
            db
        ); // "" should be replaced with dir for file system caching. THOUGHTS: might probably make this into an env
        runtime.cacheManager = cache;

        // start services/plugins/process knowledge
        await runtime.initialize();

        // start assigned clients
        runtime.clients = await initializeClients(character, runtime);

        // add to container
        directClient.registerAgent(runtime);

        // report to console
        elizaLogger.debug(`Started ${character.name} as ${runtime.agentId}`);

        return runtime;
    } catch (error) {
        elizaLogger.error(
            `Error starting agent for character ${character.name}:`,
            error
        );
        elizaLogger.error(error);
        if (db) {
            await db.close();
        }
        throw error;
    }
}

public async processChunk(prompt: string): Promise<string> {
    try {
        const memory = await runtime.memoryManager.addEmbeddingToMemory({
        userId: user?.id,
        content: { text: evaluationResult },
        roomId: roomId,
        embedding: await embed(runtime, evaluationResult),
    });
    await runtime.memoryManager.createMemory(memory);
} catch (error) {
    console.error("Failed to store evaluation result:", error);
}
}
