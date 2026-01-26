# a7046c18:packages_plugin-sql_src___tests___fixtures_test-plugin-schema.ts:151-255

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/fixtures/test-plugin-schema.ts:151-255
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    foreignKey({
      columns: [table.conditionId],
      foreignColumns: [polymarketMarketsTable.conditionId],
      name: "fk_rewards_condition_id",
    }).onDelete("cascade"),

    // One reward config per market
    unique("rewards_condition_id_unique").on(table.conditionId),

    // Index for epoch queries
    index("rewards_epoch_idx").on(table.rewardEpoch),
  ],
);

/**
 * Market prices table - stores current price data for tokens
 */
export const polymarketPricesTable = polymarketSchema.table(
  "prices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tokenId: text("token_id").notNull(),
    conditionId: text("condition_id").notNull(),

    // Price data
    price: decimal("price", { precision: 10, scale: 6 }), // Price from 0 to 1
    bid: decimal("bid", { precision: 10, scale: 6 }),
    ask: decimal("ask", { precision: 10, scale: 6 }),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    // Foreign keys
    foreignKey({
      columns: [table.conditionId],
      foreignColumns: [polymarketMarketsTable.conditionId],
      name: "fk_prices_condition_id",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.tokenId],
      foreignColumns: [polymarketTokensTable.tokenId],
      name: "fk_prices_token_id",
    }).onDelete("cascade"),

    // Indexes for price lookups
    index("prices_token_id_idx").on(table.tokenId),
    index("prices_condition_id_idx").on(table.conditionId),
    index("prices_updated_at_idx").on(table.updatedAt),
    // Most recent price per token
    index("prices_token_updated_idx").on(table.tokenId, table.updatedAt),
  ],
);

/**
 * Sync status table - tracks sync operations and status
 */
export const polymarketSyncStatusTable = polymarketSchema.table(
  "sync_status",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    syncType: text("sync_type").notNull(), // 'markets', 'prices', 'volume'
    lastSyncAt: timestamp("last_sync_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    syncStatus: text("sync_status").default("pending").notNull(), // 'pending', 'running', 'success', 'error'
    errorMessage: text("error_message"),
    recordsProcessed: integer("records_processed").default(0),

    // Metadata for sync details
    metadata: jsonb("metadata").default(sql`'{}'::jsonb`).notNull(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    // Indexes for sync monitoring
    index("sync_status_type_idx").on(table.syncType),
    index("sync_status_last_sync_idx").on(table.lastSyncAt),
    index("sync_status_status_idx").on(table.syncStatus),
    // Latest sync per type
    index("sync_status_type_last_sync_idx").on(
      table.syncType,
      table.lastSyncAt,
    ),
  ],
);

// Export all tables as schema for migration registration
export const testPolymarketSchema = {
  polymarketMarketsTable,
  polymarketTokensTable,
  polymarketRewardsTable,
  polymarketPricesTable,
  polymarketSyncStatusTable,
};
```