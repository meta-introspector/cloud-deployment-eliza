[@elizaos/core v0.25.9](../index.md) / Evaluator

# Interface: Evaluator

Evaluator for assessing agent responses

## Properties

### alwaysRun?

> `optional` **alwaysRun**: `boolean`

Whether to always run

#### Defined in

[packages/core/src/types.ts:484](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L484)

***

### description

> **description**: `string`

Detailed description

#### Defined in

[packages/core/src/types.ts:487](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L487)

***

### similes

> **similes**: `string`[]

Similar evaluator descriptions

#### Defined in

[packages/core/src/types.ts:490](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L490)

***

### examples

> **examples**: [`EvaluationExample`](EvaluationExample.md)[]

Example evaluations

#### Defined in

[packages/core/src/types.ts:493](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L493)

***

### handler

> **handler**: [`Handler`](../type-aliases/Handler.md)

Handler function

#### Defined in

[packages/core/src/types.ts:496](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L496)

***

### name

> **name**: `string`

Evaluator name

#### Defined in

[packages/core/src/types.ts:499](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L499)

***

### validate

> **validate**: [`Validator`](../type-aliases/Validator.md)

Validation function

#### Defined in

[packages/core/src/types.ts:502](https://github.com/elizaOS/eliza/blob/main/packages/core/src/types.ts#L502)
