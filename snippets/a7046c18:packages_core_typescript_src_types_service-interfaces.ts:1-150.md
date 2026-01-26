# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Service Interface Definitions for elizaOS
 *
 * This module provides standardized service interface definitions that plugins implement.
 * Each interface extends the base Service class and defines the contract for a specific
 * capability (e.g., transcription, wallet, browser automation).
 *
 * Plugin developers should implement these interfaces to provide their service functionality.
 */

import type { Metadata, UUID } from "./primitives";
import { Service, ServiceType } from "./service";

// ============================================================================
// Token & Wallet Interfaces
// ============================================================================

/**
 * A standardized representation of a token holding.
 */
export interface TokenBalance {
  /** Token mint address, or a native identifier like 'SOL' or 'ETH' */
  address: string;
  /** Raw balance as a string to handle large numbers with precision */
  balance: string;
  /** Number of decimal places for this token */
  decimals: number;
  /** User-friendly balance, adjusted for decimals */
  uiAmount?: number;
  /** Token name */
  name?: string;
  /** Token symbol */
  symbol?: string;
  /** Token logo URI */
  logoURI?: string;
}

/**
 * Generic representation of token data that can be provided by various services.
 */
export interface TokenData {
  /** Unique identifier (e.g., contract address or a composite ID) */
  id: string;
  /** Token symbol */
  symbol: string;
  /** Token name */
  name: string;
  /** Contract address */
  address: string;
  /** Chain identifier (e.g., 'solana', 'ethereum', 'base') */
  chain: string;
  /** Source provider (e.g., 'birdeye', 'coinmarketcap') */
  sourceProvider: string;

  /** Current price in USD */
  price?: number;
  /** 24h price change percentage */
  priceChange24hPercent?: number;
  /** 24h price change in USD (absolute) */
  priceChange24hUSD?: number;

  /** 24h trading volume in USD */
  volume24hUSD?: number;
  /** Market capitalization in USD */
  marketCapUSD?: number;

  /** Liquidity in USD */
  liquidity?: number;
  /** Number of token holders */
  holders?: number;

  /** Token logo URI */
  logoURI?: string;
  /** Token decimals */
  decimals?: number;

  /** When this specific data point was last updated from the source */
  lastUpdatedAt?: Date;

  /** Optional raw data from the provider */
  raw?: Record<string, unknown>;
}

/**
 * Represents a single asset holding within a wallet, including its value.
 */
export interface WalletAsset extends TokenBalance {
  /** Current price in USD */
  priceUsd?: number;
  /** Total value in USD */
  valueUsd?: number;
}

/**
 * Represents the entire portfolio of assets in a wallet.
 */
export interface WalletPortfolio {
  /** Total portfolio value in USD */
  totalValueUsd: number;
  /** Array of assets in the portfolio */
  assets: WalletAsset[];
}

/**
 * Interface for a generic service that provides token data.
 */
export abstract class ITokenDataService extends Service {
  static override readonly serviceType = ServiceType.TOKEN_DATA;
  public readonly capabilityDescription =
    "Provides standardized access to token market data." as string;

  /**
   * Fetches detailed information for a single token.
   * @param address The token's contract address.
   * @param chain The blockchain the token resides on.
   * @returns A Promise resolving to TokenData or null if not found.
   */
  abstract getTokenDetails(
    address: string,
    chain: string,
  ): Promise<TokenData | null>;

  /**
   * Fetches a list of trending tokens.
   * @param chain Optional: Filter by a specific blockchain.
   * @param limit Optional: Number of tokens to return.
   * @param timePeriod Optional: Time period for trending data (e.g., '24h', '7d').
   * @returns A Promise resolving to an array of TokenData.
   */
  abstract getTrendingTokens(
    chain?: string,
    limit?: number,
    timePeriod?: string,
  ): Promise<TokenData[]>;

  /**
   * Searches for tokens based on a query string.
   * @param query The search query (e.g., symbol, name, address).
   * @param chain Optional: Filter by a specific blockchain.
   * @param limit Optional: Number of results to return.
   * @returns A Promise resolving to an array of TokenData.
   */
  abstract searchTokens(
    query: string,
    chain?: string,
    limit?: number,
  ): Promise<TokenData[]>;

  /**
   * Fetches data for multiple tokens by their addresses on a specific chain.
```