[@elizaos/core v0.25.9](../index.md) / ITeeLogService

# Interface: ITeeLogService

## Extends

- [`Service`](../classes/Service.md)

## Accessors

### serviceType

#### Get Signature

> **get** **serviceType**(): [`ServiceType`](../enumerations/ServiceType.md)

##### Returns

[`ServiceType`](../enumerations/ServiceType.md)

#### Inherited from

[`Service`](../classes/Service.md).[`serviceType`](../classes/Service.md#serviceType-1)

#### Defined in

[packages/core/src/types.ts:1280](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1280)

## Methods

### initialize()

> `abstract` **initialize**(`runtime`): `Promise`\<`void`\>

Add abstract initialize method that must be implemented by derived classes

#### Parameters

• **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`Service`](../classes/Service.md).[`initialize`](../classes/Service.md#initialize)

#### Defined in

[packages/core/src/types.ts:1285](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1285)

***

### getInstance()

> **getInstance**(): [`ITeeLogService`](ITeeLogService.md)

#### Returns

[`ITeeLogService`](ITeeLogService.md)

#### Defined in

[packages/core/src/types.ts:1515](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1515)

***

### log()

> **log**(`agentId`, `roomId`, `userId`, `type`, `content`): `Promise`\<`boolean`\>

#### Parameters

• **agentId**: `string`

• **roomId**: `string`

• **userId**: `string`

• **type**: `string`

• **content**: `string`

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[packages/core/src/types.ts:1516](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L1516)
