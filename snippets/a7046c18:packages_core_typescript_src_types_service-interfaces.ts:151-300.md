# a7046c18:packages_core_typescript_src_types_service-interfaces.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/service-interfaces.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @param addresses Array of token contract addresses.
   * @param chain The blockchain the tokens reside on.
   * @returns A Promise resolving to an array of TokenData.
   */
  abstract getTokensByAddresses(
    addresses: string[],
    chain: string,
  ): Promise<TokenData[]>;
}

/**
 * Abstract interface for a Wallet Service.
 * Plugins that provide wallet functionality should implement this service.
 */
export abstract class IWalletService extends Service {
  static override readonly serviceType = ServiceType.WALLET;

  public readonly capabilityDescription =
    "Provides standardized access to wallet balances and portfolios.";

  /**
   * Retrieves the entire portfolio of assets held by the wallet.
   * @param owner Optional: The specific wallet address/owner to query.
   * @returns A promise that resolves to the wallet's portfolio.
   */
  abstract getPortfolio(owner?: string): Promise<WalletPortfolio>;

  /**
   * Retrieves the balance of a specific asset in the wallet.
   * @param assetAddress The mint address or native identifier of the asset.
   * @param owner Optional: The specific wallet address/owner to query.
   * @returns A promise that resolves to the user-friendly balance.
   */
  abstract getBalance(assetAddress: string, owner?: string): Promise<number>;

  /**
   * Transfers native tokens (SOL/ETH) from a specified keypair to a recipient.
   * @param from The keypair of the sender.
   * @param to The public key of the recipient.
   * @param lamports The amount in smallest units to transfer.
   * @returns A promise that resolves with the transaction signature.
   */
  abstract transferSol(
    from: unknown,
    to: unknown,
    lamports: number,
  ): Promise<string>;
}

// ============================================================================
// Liquidity Pool Interfaces
// ============================================================================

/**
 * A standardized representation of a liquidity pool from any DEX.
 */
export interface PoolInfo {
  /** Unique identifier for the pool */
  id: string;
  /** User-friendly name for the pool */
  displayName?: string;
  /** Identifier for the DEX (e.g., "orca", "raydium") */
  dex: string;
  /** First token in the pair */
  tokenA: {
    mint: string;
    symbol?: string;
    reserve?: string;
    decimals?: number;
  };
  /** Second token in the pair */
  tokenB: {
    mint: string;
    symbol?: string;
    reserve?: string;
    decimals?: number;
  };
  /** LP token mint address */
  lpTokenMint?: string;
  /** Annual Percentage Rate */
  apr?: number;
  /** Annual Percentage Yield */
  apy?: number;
  /** Total Value Locked in USD */
  tvl?: number;
  /** Trading fee percentage */
  fee?: number;
  /** DEX-specific extra data */
  metadata?: Metadata;
}

/**
 * A standardized representation of a user's position in a liquidity pool.
 */
export interface LpPositionDetails {
  /** Pool ID */
  poolId: string;
  /** DEX identifier */
  dex: string;
  /** LP token balance */
  lpTokenBalance: TokenBalance;
  /** Array of underlying token balances */
  underlyingTokens: TokenBalance[];
  /** Position value in USD */
  valueUsd?: number;
  /** Accrued trading fees */
  accruedFees?: TokenBalance[];
  /** Farming rewards */
  rewards?: TokenBalance[];
  /** Additional DEX-specific position data */
  metadata?: Metadata;
}

/**
 * A standardized result for blockchain transactions.
 */
export interface TransactionResult {
  /** Whether the transaction succeeded */
  success: boolean;
  /** Transaction ID/signature */
  transactionId?: string;
  /** Error message if failed */
  error?: string;
  /** Additional transaction data */
  data?: Record<string, unknown>;
}

/**
 * Abstract interface for a Liquidity Pool Service.
 * DEX-specific plugins must implement this service.
 */
export abstract class ILpService extends Service {
  static override readonly serviceType = "lp_pool";

  public readonly capabilityDescription =
    "Provides standardized access to DEX liquidity pools.";

  /**
   * Returns the name of the DEX this service interacts with.
   */
  abstract getDexName(): string;

  /**
   * Fetches a list of available liquidity pools from the DEX.
   * @param tokenAMint Optional: Filter pools by first token mint.
   * @param tokenBMint Optional: Filter pools by second token mint.
   */
  abstract getPools(
    tokenAMint?: string,
    tokenBMint?: string,
```