[@elizaos/core v0.25.9](../index.md) / Action

# Interface: Action

Represents an action the agent can perform

## Properties

### similes

> **similes**: `string`[]

Similar action descriptions

#### Defined in

[packages/core/src/types.ts:444](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L444)

***

### description

> **description**: `string`

Detailed description

#### Defined in

[packages/core/src/types.ts:447](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L447)

***

### examples

> **examples**: [`ActionExample`](ActionExample.md)[][]

Example usages

#### Defined in

[packages/core/src/types.ts:450](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L450)

***

### handler

> **handler**: [`Handler`](../type-aliases/Handler.md)

Handler function

#### Defined in

[packages/core/src/types.ts:453](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L453)

***

### name

> **name**: `string`

Action name

#### Defined in

[packages/core/src/types.ts:456](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L456)

***

### validate

> **validate**: [`Validator`](../type-aliases/Validator.md)

Validation function

#### Defined in

[packages/core/src/types.ts:459](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L459)

***

### suppressInitialMessage?

> `optional` **suppressInitialMessage**: `boolean`

Whether to suppress the initial message when this action is used

#### Defined in

[packages/core/src/types.ts:462](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L462)
