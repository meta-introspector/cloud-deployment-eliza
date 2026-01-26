# a7046c18:packages_docs_plugin-registry_sql_plugin-tables.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/plugin-tables.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  discountPrice: numeric('discount_price', { precision: 10, scale: 2 }),
}, (table) => ({
  // Ensure discount price is less than regular price
  priceCheck: check(
    'plugin_products_price_check',
    sql`${table.discountPrice} < ${table.price} OR ${table.discountPrice} IS NULL`
  ),
}));
```

### Generated Columns

```typescript
export const pluginOrdersTable = pgTable('plugin_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  
  // Regular columns
  subtotal: numeric('subtotal').notNull(),
  tax: numeric('tax').notNull(),
  shipping: numeric('shipping').notNull(),
  
  // Generated column
  total: numeric('total').generatedAlwaysAs(
    sql`${subtotal} + ${tax} + ${shipping}`
  ),
});
```

## Querying Your Tables

Once your tables are created, you can query them using Drizzle:

```typescript
import { db } from '@elizaos/plugin-sql';
import { pluginUsersTable } from './schema/users';

// In your plugin service or action
export class UserService {
  async createUser(data: any) {
    const [user] = await db
      .insert(pluginUsersTable)
      .values({
        username: data.username,
        email: data.email,
        profile: data.profile,
      })
      .returning();
    
    return user;
  }

  async getUserById(id: string) {
    const [user] = await db
      .select()
      .from(pluginUsersTable)
      .where(eq(pluginUsersTable.id, id));
    
    return user;
  }
}
```

## Best Practices

### 1. Prefix Table Names

Use a consistent prefix for your plugin's tables:

```typescript
// Good
export const pluginUsersTable = pgTable('plugin_users', {...});
export const pluginSettingsTable = pgTable('plugin_settings', {...});

// Avoid generic names
export const usersTable = pgTable('users', {...}); // Too generic
```

### 2. Always Include Timestamps

```typescript
createdAt: timestamp('created_at', { withTimezone: true })
  .default(sql`now()`)
  .notNull(),
updatedAt: timestamp('updated_at', { withTimezone: true })
  .default(sql`now()`)
  .notNull(),
```

### 3. Use JSONB Wisely

JSONB is great for flexibility but don't overuse it:

```typescript
// Good - structured data with flexibility
profile: jsonb('profile').$type<{
  avatar?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
  };
}>(),

// Avoid - everything in JSONB
data: jsonb('data'), // Too vague
```

### 4. Index Foreign Keys

Always index columns used in joins:

```typescript
(table) => ({
  userIdIdx: index('plugin_posts_user_id_idx').on(table.userId),
  createdAtIdx: index('plugin_posts_created_at_idx').on(table.createdAt),
})
```

### 5. Handle Cascading Deletes

Be explicit about deletion behavior:

```typescript
// Cascade delete - removes dependent records
.references(() => userTable.id, { onDelete: 'cascade' })

// Set null - preserves records but clears reference
.references(() => userTable.id, { onDelete: 'set null' })

// Restrict - prevents deletion if dependencies exist
.references(() => userTable.id, { onDelete: 'restrict' })
```

## Troubleshooting

### Tables Not Created

1. Ensure your plugin exports the schema:
   ```typescript
   export const plugin: Plugin = {
     schema, // Required!
   };
   ```

2. Check the logs for migration errors:
   ```
   [ERROR] Failed to run migrations for plugin @company/my-plugin
   ```

```