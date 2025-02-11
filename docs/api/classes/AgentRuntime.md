[@elizaos/core v0.25.9](../index.md) / AgentRuntime

# Class: AgentRuntime

## Implements

- [`IAgentRuntime`](../interfaces/IAgentRuntime.md)

## Constructors

### new AgentRuntime()

> **new AgentRuntime**(`opts`): [`AgentRuntime`](AgentRuntime.md)

Creates an instance of AgentRuntime.

#### Parameters

• **opts**

The options for configuring the AgentRuntime.

• **opts.conversationLength?**: `number`

The number of messages to hold in the recent message cache.

• **opts.agentId?**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

Optional ID of the agent.

• **opts.character?**: [`Character`](../type-aliases/Character.md)

• **opts.token**: `string`

The JWT token, can be a JWT token if outside worker, or an OpenAI token if inside worker.

• **opts.serverUrl?**: `string`

The URL of the worker.

• **opts.actions?**: [`Action`](../interfaces/Action.md)[]

Optional custom actions.

• **opts.evaluators?**: [`Evaluator`](../interfaces/Evaluator.md)[]

Optional custom evaluators.

• **opts.plugins?**: [`Plugin`](../type-aliases/Plugin.md)[]

• **opts.providers?**: [`Provider`](../interfaces/Provider.md)[]

Optional context providers.

• **opts.modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

• **opts.services?**: [`Service`](Service.md)[]

Optional custom services.

• **opts.managers?**: [`IMemoryManager`](../interfaces/IMemoryManager.md)[]

• **opts.databaseAdapter?**: [`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md)

The database adapter used for interacting with the database.

• **opts.fetch?**: `unknown`

Custom fetch function to use for making requests.

• **opts.speechModelPath?**: `string`

• **opts.cacheManager?**: [`ICacheManager`](../interfaces/ICacheManager.md)

• **opts.logging?**: `boolean`

#### Returns

[`AgentRuntime`](AgentRuntime.md)

#### Defined in

[packages/core/src/runtime.ts:245](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L245)

## Properties

### agentId

> **agentId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The ID of the agent

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`agentId`](../interfaces/IAgentRuntime.md#agentId)

#### Defined in

[packages/core/src/runtime.ts:83](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L83)

***

### serverUrl

> **serverUrl**: `string` = `"http://localhost:7998"`

The base URL of the server where the agent's requests are processed.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`serverUrl`](../interfaces/IAgentRuntime.md#serverUrl)

#### Defined in

[packages/core/src/runtime.ts:87](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L87)

***

### databaseAdapter

> **databaseAdapter**: [`IDatabaseAdapter`](../interfaces/IDatabaseAdapter.md)

The database adapter used for interacting with the database.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`databaseAdapter`](../interfaces/IAgentRuntime.md#databaseAdapter)

#### Defined in

[packages/core/src/runtime.ts:92](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L92)

***

### token

> **token**: `string`

Authentication token used for securing requests.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`token`](../interfaces/IAgentRuntime.md#token)

#### Defined in

[packages/core/src/runtime.ts:97](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L97)

***

### actions

> **actions**: [`Action`](../interfaces/Action.md)[] = `[]`

Custom actions that the agent can perform.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`actions`](../interfaces/IAgentRuntime.md#actions)

#### Defined in

[packages/core/src/runtime.ts:102](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L102)

***

### evaluators

> **evaluators**: [`Evaluator`](../interfaces/Evaluator.md)[] = `[]`

Evaluators used to assess and guide the agent's responses.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`evaluators`](../interfaces/IAgentRuntime.md#evaluators)

#### Defined in

[packages/core/src/runtime.ts:107](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L107)

***

### providers

> **providers**: [`Provider`](../interfaces/Provider.md)[] = `[]`

Context providers used to provide context for message generation.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`providers`](../interfaces/IAgentRuntime.md#providers)

#### Defined in

[packages/core/src/runtime.ts:112](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L112)

***

### adapters

> **adapters**: [`Adapter`](../type-aliases/Adapter.md)[] = `[]`

Database adapters used to interact with the database.

#### Defined in

[packages/core/src/runtime.ts:117](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L117)

***

### plugins

> **plugins**: [`Plugin`](../type-aliases/Plugin.md)[] = `[]`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`plugins`](../interfaces/IAgentRuntime.md#plugins)

#### Defined in

[packages/core/src/runtime.ts:119](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L119)

***

### modelProvider

> **modelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

The model to use for generateText.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`modelProvider`](../interfaces/IAgentRuntime.md#modelProvider)

#### Defined in

[packages/core/src/runtime.ts:124](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L124)

***

### imageModelProvider

> **imageModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

The model to use for generateImage.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`imageModelProvider`](../interfaces/IAgentRuntime.md#imageModelProvider)

#### Defined in

[packages/core/src/runtime.ts:129](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L129)

***

### imageVisionModelProvider

> **imageVisionModelProvider**: [`ModelProviderName`](../enumerations/ModelProviderName.md)

The model to use for describing images.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`imageVisionModelProvider`](../interfaces/IAgentRuntime.md#imageVisionModelProvider)

#### Defined in

[packages/core/src/runtime.ts:134](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L134)

***

### fetch()

> **fetch**: (`input`, `init`?) => `Promise`\<`Response`\>

Fetch function to use
Some environments may not have access to the global fetch function and need a custom fetch override.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/fetch)

#### Parameters

• **input**: `RequestInfo` \| `URL`

• **init?**: `RequestInit`

#### Returns

`Promise`\<`Response`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`fetch`](../interfaces/IAgentRuntime.md#fetch)

#### Defined in

[packages/core/src/runtime.ts:140](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L140)

***

### character

> **character**: [`Character`](../type-aliases/Character.md)

The character to use for the agent

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`character`](../interfaces/IAgentRuntime.md#character)

#### Defined in

[packages/core/src/runtime.ts:145](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L145)

***

### messageManager

> **messageManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Store messages that are sent and received by the agent.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`messageManager`](../interfaces/IAgentRuntime.md#messageManager)

#### Defined in

[packages/core/src/runtime.ts:150](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L150)

***

### descriptionManager

> **descriptionManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Store and recall descriptions of users based on conversations.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`descriptionManager`](../interfaces/IAgentRuntime.md#descriptionManager)

#### Defined in

[packages/core/src/runtime.ts:155](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L155)

***

### loreManager

> **loreManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Manage the creation and recall of static information (documents, historical game lore, etc)

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`loreManager`](../interfaces/IAgentRuntime.md#loreManager)

#### Defined in

[packages/core/src/runtime.ts:160](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L160)

***

### documentsManager

> **documentsManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Hold large documents that can be referenced

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`documentsManager`](../interfaces/IAgentRuntime.md#documentsManager)

#### Defined in

[packages/core/src/runtime.ts:165](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L165)

***

### knowledgeManager

> **knowledgeManager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

Searchable document fragments

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`knowledgeManager`](../interfaces/IAgentRuntime.md#knowledgeManager)

#### Defined in

[packages/core/src/runtime.ts:170](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L170)

***

### ragKnowledgeManager

> **ragKnowledgeManager**: [`IRAGKnowledgeManager`](../interfaces/IRAGKnowledgeManager.md)

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ragKnowledgeManager`](../interfaces/IAgentRuntime.md#ragKnowledgeManager)

#### Defined in

[packages/core/src/runtime.ts:172](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L172)

***

### services

> **services**: `Map`\<[`ServiceType`](../enumerations/ServiceType.md), [`Service`](Service.md)\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`services`](../interfaces/IAgentRuntime.md#services)

#### Defined in

[packages/core/src/runtime.ts:176](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L176)

***

### memoryManagers

> **memoryManagers**: `Map`\<`string`, [`IMemoryManager`](../interfaces/IMemoryManager.md)\>

#### Defined in

[packages/core/src/runtime.ts:177](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L177)

***

### cacheManager

> **cacheManager**: [`ICacheManager`](../interfaces/ICacheManager.md)

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`cacheManager`](../interfaces/IAgentRuntime.md#cacheManager)

#### Defined in

[packages/core/src/runtime.ts:178](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L178)

***

### clients

> **clients**: [`ClientInstance`](../type-aliases/ClientInstance.md)[] = `[]`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`clients`](../interfaces/IAgentRuntime.md#clients)

#### Defined in

[packages/core/src/runtime.ts:179](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L179)

## Methods

### registerMemoryManager()

> **registerMemoryManager**(`manager`): `void`

verifiableInferenceAdapter?: IVerifiableInferenceAdapter;

#### Parameters

• **manager**: [`IMemoryManager`](../interfaces/IMemoryManager.md)

#### Returns

`void`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`registerMemoryManager`](../interfaces/IAgentRuntime.md#registerMemoryManager)

#### Defined in

[packages/core/src/runtime.ts:183](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L183)

***

### getMemoryManager()

> **getMemoryManager**(`tableName`): [`IMemoryManager`](../interfaces/IMemoryManager.md)

#### Parameters

• **tableName**: `string`

#### Returns

[`IMemoryManager`](../interfaces/IMemoryManager.md)

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`getMemoryManager`](../interfaces/IAgentRuntime.md#getMemoryManager)

#### Defined in

[packages/core/src/runtime.ts:198](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L198)

***

### getService()

> **getService**\<`T`\>(`service`): `T`

#### Type Parameters

• **T** *extends* [`Service`](Service.md)

#### Parameters

• **service**: [`ServiceType`](../enumerations/ServiceType.md)

#### Returns

`T`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`getService`](../interfaces/IAgentRuntime.md#getService)

#### Defined in

[packages/core/src/runtime.ts:202](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L202)

***

### registerService()

> **registerService**(`service`): `Promise`\<`void`\>

#### Parameters

• **service**: [`Service`](Service.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`registerService`](../interfaces/IAgentRuntime.md#registerService)

#### Defined in

[packages/core/src/runtime.ts:211](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L211)

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

verifiableInferenceAdapter?: IVerifiableInferenceAdapter | null;

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`initialize`](../interfaces/IAgentRuntime.md#initialize)

#### Defined in

[packages/core/src/runtime.ts:459](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L459)

***

### stop()

> **stop**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[packages/core/src/runtime.ts:580](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L580)

***

### getSetting()

> **getSetting**(`key`): `any`

#### Parameters

• **key**: `string`

#### Returns

`any`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`getSetting`](../interfaces/IAgentRuntime.md#getSetting)

#### Defined in

[packages/core/src/runtime.ts:959](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L959)

***

### getConversationLength()

> **getConversationLength**(): `number`

Get the number of messages that are kept in the conversation buffer.

#### Returns

`number`

The number of recent messages to be kept in memory.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`getConversationLength`](../interfaces/IAgentRuntime.md#getConversationLength)

#### Defined in

[packages/core/src/runtime.ts:981](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L981)

***

### registerAction()

> **registerAction**(`action`): `void`

Register an action for the agent to perform.

#### Parameters

• **action**: [`Action`](../interfaces/Action.md)

The action to register.

#### Returns

`void`

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`registerAction`](../interfaces/IAgentRuntime.md#registerAction)

#### Defined in

[packages/core/src/runtime.ts:989](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L989)

***

### registerEvaluator()

> **registerEvaluator**(`evaluator`): `void`

Register an evaluator to assess and guide the agent's responses.

#### Parameters

• **evaluator**: [`Evaluator`](../interfaces/Evaluator.md)

The evaluator to register.

#### Returns

`void`

#### Defined in

[packages/core/src/runtime.ts:998](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L998)

***

### registerContextProvider()

> **registerContextProvider**(`provider`): `void`

Register a context provider to provide context for message generation.

#### Parameters

• **provider**: [`Provider`](../interfaces/Provider.md)

The context provider to register.

#### Returns

`void`

#### Defined in

[packages/core/src/runtime.ts:1006](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1006)

***

### registerAdapter()

> **registerAdapter**(`adapter`): `void`

Register an adapter for the agent to use.

#### Parameters

• **adapter**: [`Adapter`](../type-aliases/Adapter.md)

The adapter to register.

#### Returns

`void`

#### Defined in

[packages/core/src/runtime.ts:1014](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1014)

***

### processActions()

> **processActions**(`message`, `responses`, `state`?, `callback`?): `Promise`\<`void`\>

Process the actions of a message.

#### Parameters

• **message**: [`Memory`](../interfaces/Memory.md)

The message to process.

• **responses**: [`Memory`](../interfaces/Memory.md)[]

• **state?**: [`State`](../interfaces/State.md)

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`processActions`](../interfaces/IAgentRuntime.md#processActions)

#### Defined in

[packages/core/src/runtime.ts:1023](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1023)

***

### evaluate()

> **evaluate**(`message`, `state`, `didRespond`?, `callback`?): `Promise`\<`string`[]\>

Evaluate the message and state using the registered evaluators.

#### Parameters

• **message**: [`Memory`](../interfaces/Memory.md)

The message to evaluate.

• **state**: [`State`](../interfaces/State.md)

The state of the agent.

• **didRespond?**: `boolean`

Whether the agent responded to the message.~

• **callback?**: [`HandlerCallback`](../type-aliases/HandlerCallback.md)

The handler callback

#### Returns

`Promise`\<`string`[]\>

The results of the evaluation.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`evaluate`](../interfaces/IAgentRuntime.md#evaluate)

#### Defined in

[packages/core/src/runtime.ts:1107](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1107)

***

### ensureParticipantExists()

> **ensureParticipantExists**(`userId`, `roomId`): `Promise`\<`void`\>

Ensure the existence of a participant in the room. If the participant does not exist, they are added to the room.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The user ID to ensure the existence of.

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Throws

An error if the participant cannot be added.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureParticipantExists`](../interfaces/IAgentRuntime.md#ensureParticipantExists)

#### Defined in

[packages/core/src/runtime.ts:1177](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1177)

***

### ensureUserExists()

> **ensureUserExists**(`userId`, `userName`, `name`, `email`?, `source`?): `Promise`\<`void`\>

Ensure the existence of a user in the database. If the user does not exist, they are added to the database.

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

The user ID to ensure the existence of.

• **userName**: `string`

The user name to ensure the existence of.

• **name**: `string`

• **email?**: `string`

• **source?**: `string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureUserExists`](../interfaces/IAgentRuntime.md#ensureUserExists)

#### Defined in

[packages/core/src/runtime.ts:1193](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1193)

***

### ensureParticipantInRoom()

> **ensureParticipantInRoom**(`userId`, `roomId`): `Promise`\<`void`\>

#### Parameters

• **userId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureParticipantInRoom`](../interfaces/IAgentRuntime.md#ensureParticipantInRoom)

#### Defined in

[packages/core/src/runtime.ts:1219](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1219)

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

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureConnection`](../interfaces/IAgentRuntime.md#ensureConnection)

#### Defined in

[packages/core/src/runtime.ts:1236](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1236)

***

### ensureRoomExists()

> **ensureRoomExists**(`roomId`): `Promise`\<`void`\>

Ensure the existence of a room between the agent and a user. If no room exists, a new room is created and the user
and agent are added as participants. The room ID is returned.

#### Parameters

• **roomId**: \`$\{string\}-$\{string\}-$\{string\}-$\{string\}-$\{string\}\`

#### Returns

`Promise`\<`void`\>

The room ID of the room between the agent and the user.

#### Throws

An error if the room cannot be created.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`ensureRoomExists`](../interfaces/IAgentRuntime.md#ensureRoomExists)

#### Defined in

[packages/core/src/runtime.ts:1272](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1272)

***

### composeState()

> **composeState**(`message`, `additionalKeys`): `Promise`\<[`State`](../interfaces/State.md)\>

Compose the state of the agent into an object that can be passed or used for response generation.

#### Parameters

• **message**: [`Memory`](../interfaces/Memory.md)

The message to compose the state from.

• **additionalKeys** = `{}`

#### Returns

`Promise`\<[`State`](../interfaces/State.md)\>

The state of the agent.

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`composeState`](../interfaces/IAgentRuntime.md#composeState)

#### Defined in

[packages/core/src/runtime.ts:1285](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1285)

***

### updateRecentMessageState()

> **updateRecentMessageState**(`state`): `Promise`\<[`State`](../interfaces/State.md)\>

#### Parameters

• **state**: [`State`](../interfaces/State.md)

#### Returns

`Promise`\<[`State`](../interfaces/State.md)\>

#### Implementation of

[`IAgentRuntime`](../interfaces/IAgentRuntime.md).[`updateRecentMessageState`](../interfaces/IAgentRuntime.md#updateRecentMessageState)

#### Defined in

[packages/core/src/runtime.ts:1742](https://github.com/elizaOS/eliza/blob/main/packages/core/src/runtime.ts#L1742)
