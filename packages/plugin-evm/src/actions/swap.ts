import type { IAgentRuntime, Memory, State } from '@elizaos/core';
import { ModelType, composePrompt, elizaLogger } from '@elizaos/core';
import { type ExtendedChain, type Route, createConfig, executeRoute, getRoutes } from '@lifi/sdk';

import {
  type Address,
  type ByteArray,
  type Hex,
  encodeFunctionData,
  parseAbi,
  parseUnits,
} from 'viem';

