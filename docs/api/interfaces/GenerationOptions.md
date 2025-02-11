[@elizaos/core v0.25.9](../index.md) / GenerationOptions

# Interface: GenerationOptions

Configuration options for generating objects with a model.

## Properties

### runtime

> **runtime**: [`IAgentRuntime`](IAgentRuntime.md)

#### Defined in

[packages/core/src/generation.ts:2191](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2191)

***

### context

> **context**: `string`

#### Defined in

[packages/core/src/generation.ts:2192](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2192)

***

### modelClass

> **modelClass**: [`ModelClass`](../enumerations/ModelClass.md)

#### Defined in

[packages/core/src/generation.ts:2193](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2193)

***

### schema?

> `optional` **schema**: `ZodSchema`

#### Defined in

[packages/core/src/generation.ts:2194](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2194)

***

### schemaName?

> `optional` **schemaName**: `string`

#### Defined in

[packages/core/src/generation.ts:2195](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2195)

***

### schemaDescription?

> `optional` **schemaDescription**: `string`

#### Defined in

[packages/core/src/generation.ts:2196](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2196)

***

### stop?

> `optional` **stop**: `string`[]

#### Defined in

[packages/core/src/generation.ts:2197](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2197)

***

### mode?

> `optional` **mode**: `"auto"` \| `"json"` \| `"tool"`

#### Defined in

[packages/core/src/generation.ts:2198](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2198)

***

### experimental\_providerMetadata?

> `optional` **experimental\_providerMetadata**: `Record`\<`string`, `unknown`\>

#### Defined in

[packages/core/src/generation.ts:2199](https://github.com/elizaOS/eliza/blob/main/packages/core/src/generation.ts#L2199)
