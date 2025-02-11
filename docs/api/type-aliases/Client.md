[@elizaos/core v0.25.9](../index.md) / Client

# Type Alias: Client

> **Client**: `object`

Client interface for platform connections

## Type declaration

### name

> **name**: `string`

Client name

### config?

> `optional` **config**: `object`

Client configuration

#### Index Signature

 \[`key`: `string`\]: `any`

### start()

> **start**: (`runtime`) => `Promise`\<[`ClientInstance`](ClientInstance.md)\>

Start client connection

#### Parameters

• **runtime**: [`IAgentRuntime`](../interfaces/IAgentRuntime.md)

#### Returns

`Promise`\<[`ClientInstance`](ClientInstance.md)\>

## Defined in

[packages/core/src/types.ts:628](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L628)
