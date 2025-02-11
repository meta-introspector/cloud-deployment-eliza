[@elizaos/core v0.25.9](../index.md) / State

# Interface: State

Represents the current state/context of a conversation

## Indexable

 \[`key`: `string`\]: `unknown`

## Properties

### userId?

> `optional` **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

ID of user who sent current message

#### Defined in

[packages/core/src/types.ts:286](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L286)

***

### agentId?

> `optional` **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

ID of agent in conversation

#### Defined in

[packages/core/src/types.ts:289](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L289)

***

### bio

> **bio**: `string`

Agent's biography

#### Defined in

[packages/core/src/types.ts:292](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L292)

***

### lore

> **lore**: `string`

Agent's background lore

#### Defined in

[packages/core/src/types.ts:295](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L295)

***

### messageDirections

> **messageDirections**: `string`

Message handling directions

#### Defined in

[packages/core/src/types.ts:298](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L298)

***

### postDirections

> **postDirections**: `string`

Post handling directions

#### Defined in

[packages/core/src/types.ts:301](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L301)

***

### roomId

> **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Current room/conversation ID

#### Defined in

[packages/core/src/types.ts:304](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L304)

***

### agentName?

> `optional` **agentName**: `string`

Optional agent name

#### Defined in

[packages/core/src/types.ts:307](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L307)

***

### senderName?

> `optional` **senderName**: `string`

Optional message sender name

#### Defined in

[packages/core/src/types.ts:310](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L310)

***

### actors

> **actors**: `string`

String representation of conversation actors

#### Defined in

[packages/core/src/types.ts:313](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L313)

***

### actorsData?

> `optional` **actorsData**: [`Actor`](Actor.md)[]

Optional array of actor objects

#### Defined in

[packages/core/src/types.ts:316](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L316)

***

### goals?

> `optional` **goals**: `string`

Optional string representation of goals

#### Defined in

[packages/core/src/types.ts:319](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L319)

***

### goalsData?

> `optional` **goalsData**: [`Goal`](Goal.md)[]

Optional array of goal objects

#### Defined in

[packages/core/src/types.ts:322](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L322)

***

### recentMessages

> **recentMessages**: `string`

Recent message history as string

#### Defined in

[packages/core/src/types.ts:325](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L325)

***

### recentMessagesData

> **recentMessagesData**: [`Memory`](Memory.md)[]

Recent message objects

#### Defined in

[packages/core/src/types.ts:328](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L328)

***

### actionNames?

> `optional` **actionNames**: `string`

Optional valid action names

#### Defined in

[packages/core/src/types.ts:331](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L331)

***

### actions?

> `optional` **actions**: `string`

Optional action descriptions

#### Defined in

[packages/core/src/types.ts:334](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L334)

***

### actionsData?

> `optional` **actionsData**: [`Action`](Action.md)[]

Optional action objects

#### Defined in

[packages/core/src/types.ts:337](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L337)

***

### actionExamples?

> `optional` **actionExamples**: `string`

Optional action examples

#### Defined in

[packages/core/src/types.ts:340](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L340)

***

### providers?

> `optional` **providers**: `string`

Optional provider descriptions

#### Defined in

[packages/core/src/types.ts:343](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L343)

***

### responseData?

> `optional` **responseData**: [`Content`](Content.md)

Optional response content

#### Defined in

[packages/core/src/types.ts:346](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L346)

***

### recentInteractionsData?

> `optional` **recentInteractionsData**: [`Memory`](Memory.md)[]

Optional recent interaction objects

#### Defined in

[packages/core/src/types.ts:349](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L349)

***

### recentInteractions?

> `optional` **recentInteractions**: `string`

Optional recent interactions string

#### Defined in

[packages/core/src/types.ts:352](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L352)

***

### formattedConversation?

> `optional` **formattedConversation**: `string`

Optional formatted conversation

#### Defined in

[packages/core/src/types.ts:355](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L355)

***

### knowledge?

> `optional` **knowledge**: `string`

Optional formatted knowledge

#### Defined in

[packages/core/src/types.ts:358](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L358)

***

### knowledgeData?

> `optional` **knowledgeData**: [`KnowledgeItem`](../type-aliases/KnowledgeItem.md)[]

Optional knowledge data

#### Defined in

[packages/core/src/types.ts:360](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L360)

***

### ragKnowledgeData?

> `optional` **ragKnowledgeData**: [`RAGKnowledgeItem`](RAGKnowledgeItem.md)[]

Optional knowledge data

#### Defined in

[packages/core/src/types.ts:362](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L362)
