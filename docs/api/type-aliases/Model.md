[@elizaos/core v0.25.9](../index.md) / Model

# Type Alias: Model

> **Model**: `object`

Configuration for an AI model

## Type declaration

### endpoint?

> `optional` **endpoint**: `string`

Optional API endpoint

### model

> **model**: `object`

Model names by size class

### model.small?

> `optional` **small**: [`ModelSettings`](ModelSettings.md)

### model.medium?

> `optional` **medium**: [`ModelSettings`](ModelSettings.md)

### model.large?

> `optional` **large**: [`ModelSettings`](ModelSettings.md)

### model.embedding?

> `optional` **embedding**: [`EmbeddingModelSettings`](EmbeddingModelSettings.md)

### model.image?

> `optional` **image**: [`ImageModelSettings`](ImageModelSettings.md)

## Defined in

[packages/core/src/types.ts:186](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L186)
