# a7046c18:packages_docs_plugin-registry_sql_examples.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/examples.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Examples"
description: "Practical code examples and patterns"
---

This document provides practical examples of common database patterns and operations using the elizaOS plugin-sql system.

## Basic Operations

### Creating Records

```typescript
// Simple insert
const newUser = await db
  .insert(userTable)
  .values({
    name: 'Alice',
    email: 'alice@example.com',
    isActive: true,
  })
  .returning();

// Bulk insert
const users = await db
  .insert(userTable)
  .values([
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' },
  ])
  .returning();

// Insert with conflict handling
await db
  .insert(userTable)
  .values({ email: 'alice@example.com', name: 'Alice Updated' })
  .onConflictDoUpdate({
    target: userTable.email,
    set: { name: 'Alice Updated', updatedAt: sql`now()` },
  });
```

### Querying Data

```typescript
import { eq, and, or, like, inArray, desc, lt, gte, sql } from 'drizzle-orm';

// Simple select
const users = await db.select().from(userTable);

// Select with conditions
const activeUsers = await db
  .select()
  .from(userTable)
  .where(eq(userTable.isActive, true))
  .orderBy(desc(userTable.createdAt))
  .limit(10);

// Select specific columns
const userEmails = await db
  .select({
    email: userTable.email,
    name: userTable.name,
  })
  .from(userTable);

// Complex conditions
const filteredUsers = await db
  .select()
  .from(userTable)
  .where(
    and(
      eq(userTable.isActive, true),
      or(
        like(userTable.email, '%@company.com'),
        inArray(userTable.role, ['admin', 'moderator'])
      )
    )
  );
```

### Updating Records

```typescript
// Update single record
await db
  .update(userTable)
  .set({
    name: 'Updated Name',
    updatedAt: sql`now()`,
  })
  .where(eq(userTable.id, userId));

// Update multiple records
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

await db
  .update(userTable)
  .set({ isActive: false })
  .where(lt(userTable.lastLoginAt, thirtyDaysAgo));

// Update with returning
const [updatedUser] = await db
  .update(userTable)
  .set({ level: sql`${userTable.level} + 1` })
  .where(eq(userTable.id, userId))
  .returning();
```

### Deleting Records

```typescript
// Delete single record
await db.delete(userTable).where(eq(userTable.id, userId));

// Delete with conditions
await db
  .delete(sessionTable)
  .where(lt(sessionTable.expiresAt, new Date()));

// Soft delete pattern
await db
  .update(userTable)
  .set({
    isDeleted: true,
    deletedAt: sql`now()`,
  })
  .where(eq(userTable.id, userId));
```

## Working with Relationships

### One-to-Many

```typescript
// Get user with their posts
const userWithPosts = await db
  .select({
    user: userTable,
    posts: postTable,
  })
  .from(userTable)
  .leftJoin(postTable, eq(userTable.id, postTable.authorId))
  .where(eq(userTable.id, userId));

// Group posts by user
const usersWithPostCount = await db
  .select({
    userId: userTable.id,
    userName: userTable.name,
```