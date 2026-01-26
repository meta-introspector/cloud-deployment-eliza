# a7046c18:examples_standalone-cli-chat.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** examples/standalone-cli-chat.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * elizaOS Interactive Chat Interface
 *
 * An interactive command-line chat interface using elizaOS agents.
 * Similar to AI SDK's streamText but using elizaOS runtime and plugins.
 *
 * Usage:
 *   LOG_LEVEL=fatal OPENAI_API_KEY=your_key bun run standalone.ts
 */

// MUST be set before any imports to suppress elizaOS logs
process.env.LOG_LEVEL = process.env.LOG_LEVEL || "fatal";

import * as clack from "@clack/prompts";
import {
  AgentRuntime,
  ChannelType,
  type Character,
  type Content,
  createMessageMemory,
  type IDatabaseAdapter,
  type Memory,
  stringToUuid,
  type UUID,
} from "@elizaos/core";
import bootstrapPlugin from "@elizaos/plugin-bootstrap";
import openaiPlugin from "@elizaos/plugin-openai";
import sqlPlugin, {
  createDatabaseAdapter,
  DatabaseMigrationService,
} from "@elizaos/plugin-sql";
import "node:crypto";
import { v4 as uuidv4 } from "uuid";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const CONSTANTS = {
  TEXT_WRAP_WIDTH: 80,
  LOG_LEVEL: "fatal",
  DEFAULT_PGLITE_DATA_DIR: "memory://",
  CHAT_IDENTIFIERS: {
    WORLD: "chat-world",
    ROOM: "chat-room",
    CHANNEL: "chat-channel",
    SERVER: "chat-server",
    SOURCE: "cli",
  },
  EXIT_COMMANDS: ["quit", "exit"],
} as const;

interface AppConfiguration {
  openaiApiKey: string;
  postgresUrl: string;
  pgliteDataDir: string;
}

interface ChatSession {
  runtime: AgentRuntime;
  userId: UUID;
  roomId: UUID;
  worldId: UUID;
  character: Character;
}

interface MessageProcessingResult {
  response: string;
  thinkingTimeMs: number;
}

// ============================================================================
// CONFIGURATION MANAGEMENT
// ============================================================================

class Configuration {
  private static validateEnvironment(): void {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey || !openaiKey.trim()) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
  }

  static load(): AppConfiguration {
    Configuration.validateEnvironment();

    return {
      openaiApiKey: process.env.OPENAI_API_KEY!,
      postgresUrl: process.env.POSTGRES_URL || "",
      pgliteDataDir:
        process.env.PGLITE_DATA_DIR || CONSTANTS.DEFAULT_PGLITE_DATA_DIR,
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

class TextUtils {
  static wrapText(
    text: string,
    maxWidth: number = CONSTANTS.TEXT_WRAP_WIDTH,
  ): string {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if (currentLine.length === 0) {
        currentLine = word;
      } else if (currentLine.length + word.length + 1 <= maxWidth) {
        currentLine += ` ${word}`;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines.join("\n");
  }
}

class TimeUtils {
  static formatThinkingTime(milliseconds: number): string {
    const seconds = (milliseconds / 1000).toFixed(1);
    return `${seconds} seconds`;
  }
}

// ============================================================================
// AGENT INITIALIZATION
// ============================================================================

class AgentInitializer {
  private static createCharacter(): Character {
    return {
      name: "Eliza",
      username: "eliza",
      bio: "A helpful AI assistant powered by elizaOS.",
      adjectives: ["helpful", "friendly", "knowledgeable"],
    };
  }

  private static async setupDatabase(
    config: AppConfiguration,
```