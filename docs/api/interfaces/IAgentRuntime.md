[@elizaos/core v0.25.9](../index.md) / IAgentRuntime

# Interface: IAgentRuntime

## Properties

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Properties

#### Defined in

[packages/core/src/types.ts:1290](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1290)

***

### serverUrl

> **serverUrl**: `string`

#### Defined in

[packages/core/src/types.ts:1291](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1291)

***

### databaseAdapter

> **databaseAdapter**: [`IDatabaseAdapter`](IDatabaseAdapter.md)

#### Defined in

[packages/core/src/types.ts:1292](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1292)

***

### token

> **token**: `string`

#### Defined in

[packages/core/src/types.ts:1293](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1293)

***

### modelProvider

> **modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:1294](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1294)

***

### imageModelProvider

> **imageModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:1295](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1295)

***

### imageVisionModelProvider

> **imageVisionModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

#### Defined in

[packages/core/src/types.ts:1296](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1296)

***

### character

> **character**: [`Character`](../type-aliases/Character.md)

#### Defined in

[packages/core/src/types.ts:1297](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1297)

***

### providers

> **providers**: [`Provider`](Provider.md)[]

#### Defined in

[packages/core/src/types.ts:1298](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1298)

***

### actions

> **actions**: [`Action`](Action.md)[]

#### Defined in

[packages/core/src/types.ts:1299](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1299)

***

### evaluators

> **evaluators**: [`Evaluator`](Evaluator.md)[]

#### Defined in

[packages/core/src/types.ts:1300](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1300)

***

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[]

#### Defined in

[packages/core/src/types.ts:1301](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1301)

***

### fetch()?

> `optional` **fetch**: (`input`, `init`?) => `Promise`\<`Response`\>

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

#### Parameters

• **input**: `RequestInfo` \| `URL`

• **init?**: `RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Defined in

[packages/core/src/types.ts:1303](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1303)

***

### messageManager

> **messageManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1305](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1305)

***

### descriptionManager

> **descriptionManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1306](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1306)

***

### documentsManager

> **documentsManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1307](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1307)

***

### knowledgeManager

> **knowledgeManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1308](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1308)

***

### ragKnowledgeManager

> **ragKnowledgeManager**: [`IRAGKnowledgeManager`](IRAGKnowledgeManager.md)

#### Defined in

[packages/core/src/types.ts:1309](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1309)

***

### loreManager

> **loreManager**: [`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1310](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1310)

***

### cacheManager

> **cacheManager**: [`ICacheManager`](ICacheManager.md)

#### Defined in

[packages/core/src/types.ts:1312](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1312)

***

### services

> **services**: `Map`\<[`ServiceType`](../enumerations/ServiceType.md), [`Service`](../classes/Service.md)\>

#### Defined in

[packages/core/src/types.ts:1314](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1314)

***

### clients

> **clients**: [`ClientInstance`](../type-aliases/ClientInstance.md)[]

#### Defined in

[packages/core/src/types.ts:1315](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1315)

## Methods

### initialize()

> **initialize**(): `Promise`\<`void`\>

verifiableInferenceAdapter?: IVerifiableInferenceAdapter | null;

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1319](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1319)

***

### registerMemoryManager()

> **registerMemoryManager**(`manager`): `void`

#### Parameters

• **manager**: [`IMemoryManager`](IMemoryManager.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1321](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1321)

***

### getMemoryManager()

> **getMemoryManager**(`name`): [`IMemoryManager`](IMemoryManager.md)

#### Parameters

• **name**: `string`

#### Returns

[`IMemoryManager`](IMemoryManager.md)

#### Defined in

[packages/core/src/types.ts:1323](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1323)

***

### getService()

> **getService**\<`T`\>(`service`): `T`

#### Type Parameters

• **T** *extends* [`Service`](../classes/Service.md)

#### Parameters

• **service**: [`ServiceType`](../enumerations/ServiceType.md)

#### Returns

`T`

#### Defined in

[packages/core/src/types.ts:1325](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1325)

***

### registerService()

> **registerService**(`service`): `void`

#### Parameters

• **service**: [`Service`](../classes/Service.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1327](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1327)

***

### getSetting()

> **getSetting**(`key`): `string`

#### Parameters

• **key**: `string`

#### Returns

`string`

#### Defined in

[packages/core/src/types.ts:1329](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1329)

***

### getConversationLength()

> **getConversationLength**(): `number`

Methods

#### Returns

`number`

#### Defined in

[packages/core/src/types.ts:1332](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1332)

***

### processActions()

> **processActions**(`message`, `responses`, `state`?, `callback`?): `Promise`\<`void`\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **responses**: [`Memory`](Memory.md)[]

• **state?**: [`State`](State.md)

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1334](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1334)

***

### evaluate()

> **evaluate**(`message`, `state`?, `didRespond`?, `callback`?): `Promise`\<`string`[]\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **state?**: [`State`](State.md)

• **didRespond?**: `boolean`

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`string`[]\>

#### Defined in

[packages/core/src/types.ts:1341](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1341)

***

### ensureParticipantExists()

> **ensureParticipantExists**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1348](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1348)

***

### ensureUserExists()

> **ensureUserExists**(`userId`, `userName`, `name`, `source`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName**: `string`

• **name**: `string`

• **source**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1350](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1350)

***

### registerAction()

> **registerAction**(`action`): `void`

#### Parameters

• **action**: [`Action`](Action.md)

#### Returns

`void`

#### Defined in

[packages/core/src/types.ts:1357](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1357)

***

### ensureConnection()

> **ensureConnection**(`userId`, `roomId`, `userName`?, `userScreenName`?, `source`?): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **userName?**: `string`

• **userScreenName?**: `string`

• **source?**: `string`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1359](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1359)

***

### ensureParticipantInRoom()

> **ensureParticipantInRoom**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1367](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1367)

***

### ensureRoomExists()

> **ensureRoomExists**(`roomId`): `Promise`\<`void`\>

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/types.ts:1369](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1369)

***

### composeState()

> **composeState**(`message`, `additionalKeys`?): `Promise`\<[`State`](State.md)\>

#### Parameters

• **message**: [`Memory`](Memory.md)

• **additionalKeys?**

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

[packages/core/src/types.ts:1371](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1371)

***

### updateRecentMessageState()

> **updateRecentMessageState**(`state`): `Promise`\<[`State`](State.md)\>

#### Parameters

• **state**: [`State`](State.md)

#### Returns

`Promise`\<[`State`](State.md)\>

#### Defined in

[packages/core/src/types.ts:1376](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1376)
