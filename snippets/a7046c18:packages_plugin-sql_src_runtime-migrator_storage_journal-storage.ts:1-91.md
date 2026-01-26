# a7046c18:packages_plugin-sql_src_runtime-migrator_storage_journal-storage.ts:1-91

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/storage/journal-storage.ts:1-91
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { sql } from "drizzle-orm";
import { getRow } from "../../types";
import type { DrizzleDB, Journal, JournalEntry } from "../types";

export class JournalStorage {
  constructor(private db: DrizzleDB) {}

  async loadJournal(pluginName: string): Promise<Journal | null> {
    const result = await this.db.execute(
      sql`SELECT version, dialect, entries 
          FROM migrations._journal 
          WHERE plugin_name = ${pluginName}`,
    );

    if (result.rows.length === 0) {
      return null;
    }

    interface JournalRow {
      version: string;
      dialect: string;
      entries: JournalEntry[];
    }
    const row = getRow<JournalRow>(result)!;
    return {
      version: row.version,
      dialect: row.dialect,
      entries: row.entries as JournalEntry[],
    };
  }

  async saveJournal(pluginName: string, journal: Journal): Promise<void> {
    await this.db.execute(
      sql`INSERT INTO migrations._journal (plugin_name, version, dialect, entries)
          VALUES (${pluginName}, ${journal.version}, ${journal.dialect}, ${JSON.stringify(journal.entries)}::jsonb)
          ON CONFLICT (plugin_name) 
          DO UPDATE SET 
            version = EXCLUDED.version,
            dialect = EXCLUDED.dialect,
            entries = EXCLUDED.entries`,
    );
  }

  async addEntry(pluginName: string, entry: JournalEntry): Promise<void> {
    // First, get the current journal
    let journal = await this.loadJournal(pluginName);

    // If no journal exists, create a new one
    if (!journal) {
      journal = {
        version: "7", // Latest Drizzle version
        dialect: "postgresql",
        entries: [],
      };
    }

    // Add the new entry
    journal.entries.push(entry);

    // Save the updated journal
    await this.saveJournal(pluginName, journal);
  }

  async getNextIdx(pluginName: string): Promise<number> {
    const journal = await this.loadJournal(pluginName);

    if (!journal || journal.entries.length === 0) {
      return 0;
    }

    const lastEntry = journal.entries[journal.entries.length - 1];
    return lastEntry.idx + 1;
  }

  async updateJournal(
    pluginName: string,
    idx: number,
    tag: string,
    breakpoints: boolean = true,
  ): Promise<void> {
    const entry: JournalEntry = {
      idx,
      version: "7",
      when: Date.now(),
      tag,
      breakpoints,
    };

    await this.addEntry(pluginName, entry);
  }
}
```