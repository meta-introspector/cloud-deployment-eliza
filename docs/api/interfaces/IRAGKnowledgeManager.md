[@elizaos/core v0.25.9](../index.md) / IRAGKnowledgeManager

# Interface: IRAGKnowledgeManager

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

[packages/core/src/types.ts:1220](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1220)

***

### tableName

> **tableName**: `string`

#### Defined in

[packages/core/src/types.ts:1221](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1221)

## Methods

### getKnowledge()

> **getKnowledge**(`params`): `Promise`\<[`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]\>

#### Parameters

• **params**

• **params.query?**: `string`

• **params.id?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.limit?**: `number`

• **params.conversationContext?**: `string`

• **params.agentId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<[`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]\>

#### Defined in

[packages/core/src/types.ts:1223](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1223)

***

### createKnowledge()

> **createKnowledge**(`item`): `Promise`\<`void`\>

#### Parameters

• **item**: [`RAGKnowledgeItem`](RAGKnowledgeItem.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1230](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1230)

***

### removeKnowledge()

> **removeKnowledge**(`id`): `Promise`\<`void`\>

#### Parameters

• **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1231](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1231)

***

### searchKnowledge()

> **searchKnowledge**(`params`): `Promise`\<[`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]\>

#### Parameters

• **params**

• **params.agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **params.embedding**: `number`[] \| `Float32Array`

• **params.match\_threshold?**: `number`

• **params.match\_count?**: `number`

• **params.searchText?**: `string`

#### Returns

`Promise`\<[`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]\>

#### Defined in

[packages/core/src/types.ts:1232](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1232)

***

### clearKnowledge()

> **clearKnowledge**(`shared`?): `Promise`\<`void`\>

#### Parameters

• **shared?**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1239](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1239)

***

### processFile()

> **processFile**(`file`): `Promise`\<`void`\>

#### Parameters

• **file**

• **file.path**: `string`

• **file.content**: `string`

• **file.type**: `"pdf"` \| `"md"` \| `"txt"`

• **file.isShared**: `boolean`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1240](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1240)

***

### cleanupDeletedKnowledgeFiles()

> **cleanupDeletedKnowledgeFiles**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1246](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1246)

***

### generateScopedId()

> **generateScopedId**(`path`, `isShared`): \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Parameters

• **path**: `string`

• **isShared**: `boolean`

#### Returns

\`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Defined in

[packages/core/src/types.ts:1247](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1247)
