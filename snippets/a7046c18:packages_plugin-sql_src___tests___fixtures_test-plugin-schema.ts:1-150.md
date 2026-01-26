# a7046c18:packages_plugin-sql_src___tests___fixtures_test-plugin-schema.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/fixtures/test-plugin-schema.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Test schema for polymarket plugin using proper pgSchema syntax
 * This is a copy for testing the runtime migrator with namespaced schemas
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  decimal,
  foreignKey,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

// Create a dedicated schema for the polymarket plugin
export const polymarketSchema = pgSchema("polymarket");

/**
 * Markets table - stores core market information from Polymarket
 * Using array syntax for constraints like core schema does
 */
export const polymarketMarketsTable = polymarketSchema.table(
  "markets",
  {
    // Primary key (internal)
    id: uuid("id").defaultRandom().primaryKey(),

    // Polymarket identifiers - conditionId is unique for foreign key references
    conditionId: text("condition_id").notNull().unique(),
    questionId: text("question_id").notNull(),
    marketSlug: text("market_slug").notNull(),

    // Market content
    question: text("question").notNull(),
    category: text("category"),

    // Dates (ISO strings from API)
    endDateIso: timestamp("end_date_iso", { withTimezone: true }),
    gameStartTime: timestamp("game_start_time", { withTimezone: true }),

    // Status flags
    active: boolean("active").notNull().default(false),
    closed: boolean("closed").notNull().default(false),

    // Trading parameters (strings from API)
    minimumOrderSize: text("minimum_order_size"),
    minimumTickSize: text("minimum_tick_size"),
    minIncentiveSize: text("min_incentive_size"),
    maxIncentiveSpread: text("max_incentive_spread"),
    secondsDelay: integer("seconds_delay").default(0),

    // Metadata
    icon: text("icon"),
    fpmm: text("fpmm"), // Fixed Product Market Maker address

    // Tracking fields
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  // Use array syntax like core schema
  (table) => [
    // Indexes for common queries
    index("markets_condition_id_idx").on(table.conditionId),
    index("markets_active_idx").on(table.active),
    index("markets_closed_idx").on(table.closed),
    index("markets_category_idx").on(table.category),
    index("markets_end_date_idx").on(table.endDateIso),
    index("markets_last_synced_idx").on(table.lastSyncedAt),
    // Active markets are most commonly queried
    index("markets_active_closed_idx").on(table.active, table.closed),
  ],
);

/**
 * Tokens table - stores YES/NO token information for each market
 */
export const polymarketTokensTable = polymarketSchema.table(
  "tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tokenId: text("token_id").notNull().unique(),
    conditionId: text("condition_id").notNull(),
    outcome: text("outcome").notNull(), // 'YES' or 'NO'

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    // Foreign key to markets
    foreignKey({
      columns: [table.conditionId],
      foreignColumns: [polymarketMarketsTable.conditionId],
      name: "fk_tokens_condition_id",
    }).onDelete("cascade"),

    // Indexes
    index("tokens_token_id_idx").on(table.tokenId),
    index("tokens_condition_id_idx").on(table.conditionId),
    index("tokens_outcome_idx").on(table.outcome),
    // Compound index for market + outcome lookups
    index("tokens_condition_outcome_idx").on(table.conditionId, table.outcome),
  ],
);

/**
 * Rewards table - stores reward configuration for markets
 */
export const polymarketRewardsTable = polymarketSchema.table(
  "rewards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conditionId: text("condition_id").notNull(),

    // Reward parameters (from API)
    minSize: decimal("min_size", { precision: 20, scale: 8 }),
    maxSpread: decimal("max_spread", { precision: 10, scale: 4 }),
    eventStartDate: text("event_start_date"), // Store as ISO string from API
    eventEndDate: text("event_end_date"), // Store as ISO string from API
    inGameMultiplier: decimal("in_game_multiplier", {
      precision: 10,
      scale: 4,
    }),
    rewardEpoch: integer("reward_epoch"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    // Foreign key and unique constraint
```