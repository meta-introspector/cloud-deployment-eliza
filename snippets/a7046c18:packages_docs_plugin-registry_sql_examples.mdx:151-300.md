# a7046c18:packages_docs_plugin-registry_sql_examples.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/examples.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    postCount: count(postTable.id),
  })
  .from(userTable)
  .leftJoin(postTable, eq(userTable.id, postTable.authorId))
  .groupBy(userTable.id);
```

### Many-to-Many

```typescript
// Get user's roles through junction table
const userRoles = await db
  .select({
    role: roleTable,
    assignedAt: userRoleTable.assignedAt,
  })
  .from(userRoleTable)
  .innerJoin(roleTable, eq(userRoleTable.roleId, roleTable.id))
  .where(eq(userRoleTable.userId, userId));

// Get users with specific role
const admins = await db
  .select({
    user: userTable,
  })
  .from(userTable)
  .innerJoin(userRoleTable, eq(userTable.id, userRoleTable.userId))
  .innerJoin(roleTable, eq(userRoleTable.roleId, roleTable.id))
  .where(eq(roleTable.name, 'admin'));
```

## Advanced Queries

### Aggregations

```typescript
// Count, sum, average
const stats = await db
  .select({
    totalUsers: count(userTable.id),
    avgAge: avg(userTable.age),
    totalRevenue: sum(orderTable.amount),
  })
  .from(userTable)
  .leftJoin(orderTable, eq(userTable.id, orderTable.userId));

// Group by with having
const activeCategories = await db
  .select({
    category: productTable.category,
    productCount: count(productTable.id),
    avgPrice: avg(productTable.price),
  })
  .from(productTable)
  .where(eq(productTable.isActive, true))
  .groupBy(productTable.category)
  .having(gte(count(productTable.id), 5));
```

### Subqueries

```typescript
// Subquery in select
const usersWithLatestPost = await db
  .select({
    user: userTable,
    latestPostId: sql<string>`(
      SELECT id FROM ${postTable}
      WHERE ${postTable.authorId} = ${userTable.id}
      ORDER BY ${postTable.createdAt} DESC
      LIMIT 1
    )`,
  })
  .from(userTable);

// Subquery in where
const usersWithRecentActivity = await db
  .select()
  .from(userTable)
  .where(
    sql`EXISTS (
      SELECT 1 FROM ${activityTable}
      WHERE ${activityTable.userId} = ${userTable.id}
      AND ${activityTable.createdAt} > NOW() - INTERVAL '7 days'
    )`
  );
```

### Window Functions

```typescript
// Row number for pagination
const rankedUsers = await db
  .select({
    id: userTable.id,
    name: userTable.name,
    score: userTable.score,
    rank: sql<number>`ROW_NUMBER() OVER (ORDER BY ${userTable.score} DESC)`,
  })
  .from(userTable);

// Running totals
const salesWithRunningTotal = await db
  .select({
    date: salesTable.date,
    amount: salesTable.amount,
    runningTotal: sql<number>`
      SUM(${salesTable.amount}) OVER (
        ORDER BY ${salesTable.date}
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      )
    `,
  })
  .from(salesTable)
  .orderBy(salesTable.date);
```

## Transaction Patterns

### Basic Transactions

```typescript
// Simple transaction
await db.transaction(async (tx) => {
  // Create user
  const [user] = await tx
    .insert(userTable)
    .values({ name: 'John', email: 'john@example.com' })
    .returning();

  // Create profile
  await tx
    .insert(profileTable)
    .values({ userId: user.id, bio: 'New user' });

  // Create initial settings
  await tx
    .insert(settingsTable)
    .values({ userId: user.id, theme: 'light' });
});
```

### Conditional Transactions

```typescript
// Transaction with rollback
try {
  await db.transaction(async (tx) => {
    const [user] = await tx
      .select()
```