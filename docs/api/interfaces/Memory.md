[@elizaos/core v0.25.9](../index.md) / Memory

# Interface: Memory

Represents a stored memory/message

## Properties

### id?

> `optional` **id**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Optional unique identifier

#### Defined in

[packages/core/src/types.ts:373](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L373)

***

### userId

> **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Associated user ID

#### Defined in

[packages/core/src/types.ts:376](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L376)

***

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Associated agent ID

#### Defined in

[packages/core/src/types.ts:379](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L379)

***

### createdAt?

> `optional` **createdAt**: `number`

Optional creation timestamp

#### Defined in

[packages/core/src/types.ts:382](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L382)

***

### content

> **content**: [`Content`](Content.md)

Memory content

#### Defined in

[packages/core/src/types.ts:385](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L385)

***

### embedding?

> `optional` **embedding**: `number`[]

Optional embedding vector

#### Defined in

[packages/core/src/types.ts:388](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L388)

***

### roomId

> **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Associated room ID

#### Defined in

[packages/core/src/types.ts:391](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L391)

***

### unique?

> `optional` **unique**: `boolean`

Whether memory is unique

#### Defined in

[packages/core/src/types.ts:394](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L394)

***

### similarity?

> `optional` **similarity**: `number`

Embedding similarity score

#### Defined in

[packages/core/src/types.ts:397](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L397)
