# a7046c18:packages_core_typescript_src_test_resources_types.ts:1-22

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/test_resources/types.ts:1-22
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Interface representing a User.
 * @typedef {Object} User
 * @property {string} id - The user's ID.
 * @property {string} [email] - The user's email (optional).
 * @property {string} [phone] - The user's phone number (optional).
 * @property {string} [role] - The user's role (optional).
 */
/**
 * Represents a User with optional properties.
 * @typedef {Object} User
 * @property {string} id - The unique identifier for the user.
 * @property {string} [email] - The email address of the user (optional).
 * @property {string} [phone] - The phone number of the user (optional).
 * @property {string} [role] - The role of the user (optional).
 */
export interface User {
  id: string;
  email?: string;
  phone?: string;
  role?: string;
}
```