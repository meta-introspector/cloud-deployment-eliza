[@elizaos/core v0.25.9](../index.md) / cleanJsonResponse

# Function: cleanJsonResponse()

> **cleanJsonResponse**(`response`): `string`

Cleans a JSON-like response string by removing unnecessary markers, line breaks, and extra whitespace.
This is useful for handling improperly formatted JSON responses from external sources.

## Parameters

• **response**: `string`

The raw JSON-like string response to clean.

## Returns

`string`

The cleaned string, ready for parsing or further processing.

## Defined in

[packages/core/src/parsing.ts:269](https://github.com/elizaOS/eliza/blob/main/packages/core/src/parsing.ts#L269)
