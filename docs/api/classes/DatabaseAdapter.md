[@elizaos/core v0.25.9](../index.md) / DatabaseAdapter

# Class: `abstract` DatabaseAdapter\<DB\>

An abstract class representing a database adapter for managing various entities
like accounts, memories, actors, goals, and rooms.

## Type Parameters

• **DB** = `any`

## Implements

- [`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md)

## Constructors

### new DatabaseAdapter()

> **new DatabaseAdapter**\<`DB`\>(`circuitBreakerConfig`?): [`DatabaseAdapter`](DatabaseAdapter.md)\<`DB`\>

Creates a new DatabaseAdapter instance with optional circuit breaker configuration.

#### Parameters

• **circuitBreakerConfig?**

Configuration options for the circuit breaker

• **circuitBreakerConfig.failureThreshold?**: `number`

Number of failures before circuit opens (defaults to 5)

• **circuitBreakerConfig.resetTimeout?**: `number`

Time in ms before attempting to close circuit (defaults to 60000)

• **circuitBreakerConfig.halfOpenMaxAttempts?**: `number`

Number of successful attempts needed to close circuit (defaults to 3)

#### Returns

[`DatabaseAdapter`](DatabaseAdapter.md)\<`DB`\>

#### Defined in

[packages/core/src/database.ts:47](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L47)

## Properties

### db

> **db**: `DB`

The database instance.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`db`](../interfaces/IDatabaseAdapter.md#db)

#### Defined in

[packages/core/src/database.ts:24](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L24)

***

### circuitBreaker

> `protected` **circuitBreaker**: `CircuitBreaker`

Circuit breaker instance used to handle fault tolerance and prevent cascading failures.
Implements the Circuit Breaker pattern to temporarily disable operations when a failure threshold is reached.

The circuit breaker has three states:
- CLOSED: Normal operation, requests pass through
- OPEN: Failure threshold exceeded, requests are blocked
- HALF_OPEN: Testing if service has recovered

#### Defined in

[packages/core/src/database.ts:37](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L37)

## Methods

### init()

> `abstract` **init**(): `Promise`\<`void`\>

Optional initialization method for the database adapter.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when initialization is complete.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`init`](../interfaces/IDatabaseAdapter.md#init)

#### Defined in

[packages/core/src/database.ts:59](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L59)

***

### close()

> `abstract` **close**(): `Promise`\<`void`\>

Optional close method for the database adapter.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when closing is complete.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`close`](../interfaces/IDatabaseAdapter.md#close)

#### Defined in

[packages/core/src/database.ts:65](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L65)

***

### getAccountById()

> `abstract` **getAccountById**(`userId`): `Promise`\<[`Account`](../interfaces/Account.md)\>

Retrieves an account by its ID.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the user account to retrieve.

#### Returns

`Promise`\<[`Account`](../interfaces/Account.md)\>

A Promise that resolves to the Account object or null if not found.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getAccountById`](../interfaces/IDatabaseAdapter.md#getAccountById)

#### Defined in

[packages/core/src/database.ts:72](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L72)

***

### createAccount()

> `abstract` **createAccount**(`account`): `Promise`\<`boolean`\>

Creates a new account in the database.

#### Parameters

• **account**: [`Account`](../interfaces/Account.md)

The account object to create.

#### Returns

`Promise`\<`boolean`\>

A Promise that resolves when the account creation is complete.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`createAccount`](../interfaces/IDatabaseAdapter.md#createAccount)

#### Defined in

[packages/core/src/database.ts:79](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L79)

***

### getMemories()

> `abstract` **getMemories**(`params`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Retrieves memories based on the specified parameters.

#### Parameters

• **params**

An object containing parameters for the memory retrieval.

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.count?**: `number`

• **params.unique?**: `boolean`

• **params.tableName**: `string`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

A Promise that resolves to an array of Memory objects.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getMemories`](../interfaces/IDatabaseAdapter.md#getMemories)

#### Defined in

[packages/core/src/database.ts:86](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L86)

***

### getMemoriesByRoomIds()

> `abstract` **getMemoriesByRoomIds**(`params`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

#### Parameters

• **params**

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomIds**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]

• **params.tableName**: `string`

• **params.limit?**: `number`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getMemoriesByRoomIds`](../interfaces/IDatabaseAdapter.md#getMemoriesByRoomIds)

#### Defined in

[packages/core/src/database.ts:94](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L94)

***

### getMemoryById()

> `abstract` **getMemoryById**(`id`): `Promise`\<[`Memory`](../interfaces/Memory.md)\>

#### Parameters

• **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)\>

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getMemoryById`](../interfaces/IDatabaseAdapter.md#getMemoryById)

#### Defined in

[packages/core/src/database.ts:101](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L101)

***

### getMemoriesByIds()

> `abstract` **getMemoriesByIds**(`memoryIds`, `tableName`?): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Retrieves multiple memories by their IDs

#### Parameters

• **memoryIds**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]

Array of UUIDs of the memories to retrieve

• **tableName?**: `string`

Optional table name to filter memories by type

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Promise resolving to array of Memory objects

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getMemoriesByIds`](../interfaces/IDatabaseAdapter.md#getMemoriesByIds)

#### Defined in

[packages/core/src/database.ts:109](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L109)

***

### getCachedEmbeddings()

> `abstract` **getCachedEmbeddings**(`params`): `Promise`\<`object`[]\>

Retrieves cached embeddings based on the specified query parameters.

#### Parameters

• **params**

An object containing parameters for the embedding retrieval.

• **params.query\_table\_name**: `string`

• **params.query\_threshold**: `number`

• **params.query\_input**: `string`

• **params.query\_field\_name**: `string`

• **params.query\_field\_sub\_name**: `string`

• **params.query\_match\_count**: `number`

#### Returns

`Promise`\<`object`[]\>

A Promise that resolves to an array of objects containing embeddings and levenshtein scores.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getCachedEmbeddings`](../interfaces/IDatabaseAdapter.md#getCachedEmbeddings)

#### Defined in

[packages/core/src/database.ts:119](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L119)

***

### log()

> `abstract` **log**(`params`): `Promise`\<`void`\>

Logs an event or action with the specified details.

#### Parameters

• **params**

An object containing parameters for the log entry.

• **params.body**

• **params.userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.type**: `string`

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the log entry has been saved.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`log`](../interfaces/IDatabaseAdapter.md#log)

#### Defined in

[packages/core/src/database.ts:145](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L145)

***

### getActorDetails()

> `abstract` **getActorDetails**(`params`): `Promise`\<[`Actor`](../interfaces/Actor.md)[]\>

Retrieves details of actors in a given room.

#### Parameters

• **params**

An object containing the roomId to search for actors.

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Actor`](../interfaces/Actor.md)[]\>

A Promise that resolves to an array of Actor objects.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getActorDetails`](../interfaces/IDatabaseAdapter.md#getActorDetails)

#### Defined in

[packages/core/src/database.ts:157](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L157)

***

### searchMemories()

> `abstract` **searchMemories**(`params`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Searches for memories based on embeddings and other specified parameters.

#### Parameters

• **params**

An object containing parameters for the memory search.

• **params.tableName**: `string`

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.embedding**: `number`[]

• **params.match\_threshold**: `number`

• **params.match\_count**: `number`

• **params.unique**: `boolean`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

A Promise that resolves to an array of Memory objects.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`searchMemories`](../interfaces/IDatabaseAdapter.md#searchMemories)

#### Defined in

[packages/core/src/database.ts:164](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L164)

***

### updateGoalStatus()

> `abstract` **updateGoalStatus**(`params`): `Promise`\<`void`\>

Updates the status of a specific goal.

#### Parameters

• **params**

An object containing the goalId and the new status.

• **params.goalId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.status**: [`GoalStatus`](../enumerations/GoalStatus.md)

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the goal status has been updated.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`updateGoalStatus`](../interfaces/IDatabaseAdapter.md#updateGoalStatus)

#### Defined in

[packages/core/src/database.ts:179](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L179)

***

### searchMemoriesByEmbedding()

> `abstract` **searchMemoriesByEmbedding**(`embedding`, `params`): `Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

Searches for memories by embedding and other specified parameters.

#### Parameters

• **embedding**: `number`[]

The embedding vector to search with.

• **params**

Additional parameters for the search.

• **params.match\_threshold?**: `number`

• **params.count?**: `number`

• **params.roomId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.agentId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.unique?**: `boolean`

• **params.tableName**: `string`

#### Returns

`Promise`\<[`Memory`](../interfaces/Memory.md)[]\>

A Promise that resolves to an array of Memory objects.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`searchMemoriesByEmbedding`](../interfaces/IDatabaseAdapter.md#searchMemoriesByEmbedding)

#### Defined in

[packages/core/src/database.ts:190](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L190)

***

### createMemory()

> `abstract` **createMemory**(`memory`, `tableName`, `unique`?): `Promise`\<`void`\>

Creates a new memory in the database.

#### Parameters

• **memory**: [`Memory`](../interfaces/Memory.md)

The memory object to create.

• **tableName**: `string`

The table where the memory should be stored.

• **unique?**: `boolean`

Indicates if the memory should be unique.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the memory has been created.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`createMemory`](../interfaces/IDatabaseAdapter.md#createMemory)

#### Defined in

[packages/core/src/database.ts:209](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L209)

***

### removeMemory()

> `abstract` **removeMemory**(`memoryId`, `tableName`): `Promise`\<`void`\>

Removes a specific memory from the database.

#### Parameters

• **memoryId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the memory to remove.

• **tableName**: `string`

The table from which the memory should be removed.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the memory has been removed.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`removeMemory`](../interfaces/IDatabaseAdapter.md#removeMemory)

#### Defined in

[packages/core/src/database.ts:221](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L221)

***

### removeAllMemories()

> `abstract` **removeAllMemories**(`roomId`, `tableName`): `Promise`\<`void`\>

Removes all memories associated with a specific room.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the room whose memories should be removed.

• **tableName**: `string`

The table from which the memories should be removed.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when all memories have been removed.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`removeAllMemories`](../interfaces/IDatabaseAdapter.md#removeAllMemories)

#### Defined in

[packages/core/src/database.ts:229](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L229)

***

### countMemories()

> `abstract` **countMemories**(`roomId`, `unique`?, `tableName`?): `Promise`\<`number`\>

Counts the number of memories in a specific room.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the room for which to count memories.

• **unique?**: `boolean`

Specifies whether to count only unique memories.

• **tableName?**: `string`

Optional table name to count memories from.

#### Returns

`Promise`\<`number`\>

A Promise that resolves to the number of memories.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`countMemories`](../interfaces/IDatabaseAdapter.md#countMemories)

#### Defined in

[packages/core/src/database.ts:238](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L238)

***

### getGoals()

> `abstract` **getGoals**(`params`): `Promise`\<[`Goal`](../interfaces/Goal.md)[]\>

Retrieves goals based on specified parameters.

#### Parameters

• **params**

An object containing parameters for goal retrieval.

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.userId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.onlyInProgress?**: `boolean`

• **params.count?**: `number`

#### Returns

`Promise`\<[`Goal`](../interfaces/Goal.md)[]\>

A Promise that resolves to an array of Goal objects.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getGoals`](../interfaces/IDatabaseAdapter.md#getGoals)

#### Defined in

[packages/core/src/database.ts:249](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L249)

***

### updateGoal()

> `abstract` **updateGoal**(`goal`): `Promise`\<`void`\>

Updates a specific goal in the database.

#### Parameters

• **goal**: [`Goal`](../interfaces/Goal.md)

The goal object with updated properties.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the goal has been updated.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`updateGoal`](../interfaces/IDatabaseAdapter.md#updateGoal)

#### Defined in

[packages/core/src/database.ts:262](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L262)

***

### createGoal()

> `abstract` **createGoal**(`goal`): `Promise`\<`void`\>

Creates a new goal in the database.

#### Parameters

• **goal**: [`Goal`](../interfaces/Goal.md)

The goal object to create.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the goal has been created.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`createGoal`](../interfaces/IDatabaseAdapter.md#createGoal)

#### Defined in

[packages/core/src/database.ts:269](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L269)

***

### removeGoal()

> `abstract` **removeGoal**(`goalId`): `Promise`\<`void`\>

Removes a specific goal from the database.

#### Parameters

• **goalId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the goal to remove.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the goal has been removed.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`removeGoal`](../interfaces/IDatabaseAdapter.md#removeGoal)

#### Defined in

[packages/core/src/database.ts:276](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L276)

***

### removeAllGoals()

> `abstract` **removeAllGoals**(`roomId`): `Promise`\<`void`\>

Removes all goals associated with a specific room.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the room whose goals should be removed.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when all goals have been removed.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`removeAllGoals`](../interfaces/IDatabaseAdapter.md#removeAllGoals)

#### Defined in

[packages/core/src/database.ts:283](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L283)

***

### getRoom()

> `abstract` **getRoom**(`roomId`): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`\>

Retrieves the room ID for a given room, if it exists.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the room to retrieve.

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`\>

A Promise that resolves to the room ID or null if not found.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getRoom`](../interfaces/IDatabaseAdapter.md#getRoom)

#### Defined in

[packages/core/src/database.ts:290](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L290)

***

### createRoom()

> `abstract` **createRoom**(`roomId`?): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`\>

Creates a new room with an optional specified ID.

#### Parameters

• **roomId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Optional UUID to assign to the new room.

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`\>

A Promise that resolves to the UUID of the created room.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`createRoom`](../interfaces/IDatabaseAdapter.md#createRoom)

#### Defined in

[packages/core/src/database.ts:297](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L297)

***

### removeRoom()

> `abstract` **removeRoom**(`roomId`): `Promise`\<`void`\>

Removes a specific room from the database.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the room to remove.

#### Returns

`Promise`\<`void`\>

A Promise that resolves when the room has been removed.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`removeRoom`](../interfaces/IDatabaseAdapter.md#removeRoom)

#### Defined in

[packages/core/src/database.ts:304](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L304)

***

### getRoomsForParticipant()

> `abstract` **getRoomsForParticipant**(`userId`): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

Retrieves room IDs for which a specific user is a participant.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the user.

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

A Promise that resolves to an array of room IDs.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getRoomsForParticipant`](../interfaces/IDatabaseAdapter.md#getRoomsForParticipant)

#### Defined in

[packages/core/src/database.ts:311](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L311)

***

### getRoomsForParticipants()

> `abstract` **getRoomsForParticipants**(`userIds`): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

Retrieves room IDs for which specific users are participants.

#### Parameters

• **userIds**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]

An array of UUIDs of the users.

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

A Promise that resolves to an array of room IDs.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getRoomsForParticipants`](../interfaces/IDatabaseAdapter.md#getRoomsForParticipants)

#### Defined in

[packages/core/src/database.ts:318](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L318)

***

### addParticipant()

> `abstract` **addParticipant**(`userId`, `roomId`): `Promise`\<`boolean`\>

Adds a user as a participant to a specific room.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the user to add as a participant.

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the room to which the user will be added.

#### Returns

`Promise`\<`boolean`\>

A Promise that resolves to a boolean indicating success or failure.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`addParticipant`](../interfaces/IDatabaseAdapter.md#addParticipant)

#### Defined in

[packages/core/src/database.ts:326](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L326)

***

### removeParticipant()

> `abstract` **removeParticipant**(`userId`, `roomId`): `Promise`\<`boolean`\>

Removes a user as a participant from a specific room.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the user to remove as a participant.

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the room from which the user will be removed.

#### Returns

`Promise`\<`boolean`\>

A Promise that resolves to a boolean indicating success or failure.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`removeParticipant`](../interfaces/IDatabaseAdapter.md#removeParticipant)

#### Defined in

[packages/core/src/database.ts:334](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L334)

***

### getParticipantsForAccount()

#### getParticipantsForAccount(userId)

> `abstract` **getParticipantsForAccount**(`userId`): `Promise`\<[`Participant`](../interfaces/Participant.md)[]\>

Retrieves participants associated with a specific account.

##### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the account.

##### Returns

`Promise`\<[`Participant`](../interfaces/Participant.md)[]\>

A Promise that resolves to an array of Participant objects.

##### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getParticipantsForAccount`](../interfaces/IDatabaseAdapter.md#getParticipantsForAccount)

##### Defined in

[packages/core/src/database.ts:341](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L341)

#### getParticipantsForAccount(userId)

> `abstract` **getParticipantsForAccount**(`userId`): `Promise`\<[`Participant`](../interfaces/Participant.md)[]\>

Retrieves participants associated with a specific account.

##### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the account.

##### Returns

`Promise`\<[`Participant`](../interfaces/Participant.md)[]\>

A Promise that resolves to an array of Participant objects.

##### Implementation of

`IDatabaseAdapter.getParticipantsForAccount`

##### Defined in

[packages/core/src/database.ts:348](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L348)

***

### getParticipantsForRoom()

> `abstract` **getParticipantsForRoom**(`roomId`): `Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

Retrieves participants for a specific room.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The UUID of the room for which to retrieve participants.

#### Returns

`Promise`\<\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`[]\>

A Promise that resolves to an array of UUIDs representing the participants.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getParticipantsForRoom`](../interfaces/IDatabaseAdapter.md#getParticipantsForRoom)

#### Defined in

[packages/core/src/database.ts:355](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L355)

***

### getParticipantUserState()

> `abstract` **getParticipantUserState**(`roomId`, `userId`): `Promise`\<`"FOLLOWED"` \| `"MUTED"`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`"FOLLOWED"` \| `"MUTED"`\>

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getParticipantUserState`](../interfaces/IDatabaseAdapter.md#getParticipantUserState)

#### Defined in

[packages/core/src/database.ts:357](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L357)

***

### setParticipantUserState()

> `abstract` **setParticipantUserState**(`roomId`, `userId`, `state`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **state**: `"FOLLOWED"` \| `"MUTED"`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`setParticipantUserState`](../interfaces/IDatabaseAdapter.md#setParticipantUserState)

#### Defined in

[packages/core/src/database.ts:361](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L361)

***

### createRelationship()

> `abstract` **createRelationship**(`params`): `Promise`\<`boolean`\>

Creates a new relationship between two users.

#### Parameters

• **params**

An object containing the UUIDs of the two users (userA and userB).

• **params.userA**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.userB**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`boolean`\>

A Promise that resolves to a boolean indicating success or failure of the creation.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`createRelationship`](../interfaces/IDatabaseAdapter.md#createRelationship)

#### Defined in

[packages/core/src/database.ts:372](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L372)

***

### getRelationship()

> `abstract` **getRelationship**(`params`): `Promise`\<[`Relationship`](../interfaces/Relationship.md)\>

Retrieves a relationship between two users if it exists.

#### Parameters

• **params**

An object containing the UUIDs of the two users (userA and userB).

• **params.userA**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.userB**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Relationship`](../interfaces/Relationship.md)\>

A Promise that resolves to the Relationship object or null if not found.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getRelationship`](../interfaces/IDatabaseAdapter.md#getRelationship)

#### Defined in

[packages/core/src/database.ts:382](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L382)

***

### getRelationships()

> `abstract` **getRelationships**(`params`): `Promise`\<[`Relationship`](../interfaces/Relationship.md)[]\>

Retrieves all relationships for a specific user.

#### Parameters

• **params**

An object containing the UUID of the user.

• **params.userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`Relationship`](../interfaces/Relationship.md)[]\>

A Promise that resolves to an array of Relationship objects.

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getRelationships`](../interfaces/IDatabaseAdapter.md#getRelationships)

#### Defined in

[packages/core/src/database.ts:392](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L392)

***

### getKnowledge()

> `abstract` **getKnowledge**(`params`): `Promise`\<[`RAGKnowledgeItem`](../interfaces/RAGKnowledgeItem.md)[]\>

Retrieves knowledge items based on specified parameters.

#### Parameters

• **params**

Object containing search parameters

• **params.id?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.limit?**: `number`

• **params.query?**: `string`

• **params.conversationContext?**: `string`

#### Returns

`Promise`\<[`RAGKnowledgeItem`](../interfaces/RAGKnowledgeItem.md)[]\>

Promise resolving to array of knowledge items

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`getKnowledge`](../interfaces/IDatabaseAdapter.md#getKnowledge)

#### Defined in

[packages/core/src/database.ts:401](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L401)

***

### searchKnowledge()

> `abstract` **searchKnowledge**(`params`): `Promise`\<[`RAGKnowledgeItem`](../interfaces/RAGKnowledgeItem.md)[]\>

#### Parameters

• **params**

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.embedding**: `Float32Array`

• **params.match\_threshold**: `number`

• **params.match\_count**: `number`

• **params.searchText?**: `string`

#### Returns

`Promise`\<[`RAGKnowledgeItem`](../interfaces/RAGKnowledgeItem.md)[]\>

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`searchKnowledge`](../interfaces/IDatabaseAdapter.md#searchKnowledge)

#### Defined in

[packages/core/src/database.ts:409](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L409)

***

### createKnowledge()

> `abstract` **createKnowledge**(`knowledge`): `Promise`\<`void`\>

Creates a new knowledge item in the database.

#### Parameters

• **knowledge**: [`RAGKnowledgeItem`](../interfaces/RAGKnowledgeItem.md)

The knowledge item to create

#### Returns

`Promise`\<`void`\>

Promise resolving when creation is complete

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`createKnowledge`](../interfaces/IDatabaseAdapter.md#createKnowledge)

#### Defined in

[packages/core/src/database.ts:422](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L422)

***

### removeKnowledge()

> `abstract` **removeKnowledge**(`id`): `Promise`\<`void`\>

Removes a knowledge item and its associated chunks from the database.

#### Parameters

• **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The ID of the knowledge item to remove

#### Returns

`Promise`\<`void`\>

Promise resolving when removal is complete

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`removeKnowledge`](../interfaces/IDatabaseAdapter.md#removeKnowledge)

#### Defined in

[packages/core/src/database.ts:429](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L429)

***

### clearKnowledge()

> `abstract` **clearKnowledge**(`agentId`, `shared`?): `Promise`\<`void`\>

Removes an agents full knowledge database and its associated chunks from the database.

#### Parameters

• **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The Agent ID of the knowledge items to remove

• **shared?**: `boolean`

#### Returns

`Promise`\<`void`\>

Promise resolving when removal is complete

#### Implementation of

[`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md).[`clearKnowledge`](../interfaces/IDatabaseAdapter.md#clearKnowledge)

#### Defined in

[packages/core/src/database.ts:436](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L436)

***

### withCircuitBreaker()

> `protected` **withCircuitBreaker**\<`T`\>(`operation`, `context`): `Promise`\<`T`\>

Executes an operation with circuit breaker protection.

#### Type Parameters

• **T**

#### Parameters

• **operation**

A function that returns a Promise to be executed with circuit breaker protection

• **context**: `string`

A string describing the context/operation being performed for logging purposes

#### Returns

`Promise`\<`T`\>

A Promise that resolves to the result of the operation

#### Throws

Will throw an error if the circuit breaker is open or if the operation fails

#### Defined in

[packages/core/src/database.ts:446](https://github.com/elizaOS/eliza/blob/main/packages/core/src/database.ts#L446)
