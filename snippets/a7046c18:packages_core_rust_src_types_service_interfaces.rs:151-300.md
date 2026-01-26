# a7046c18:packages_core_rust_src_types_service_interfaces.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    
    /// Get balance of specific asset
    async fn get_balance(&self, asset_address: &str, owner: Option<&str>) -> Result<f64, anyhow::Error>;
    
    /// Transfer native tokens
    async fn transfer_sol(
        &self,
        from: &[u8],
        to: &[u8],
        lamports: u64,
    ) -> Result<String, anyhow::Error>;
}

// ============================================================================
// Liquidity Pool Types
// ============================================================================

/// Token information in a pool
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PoolTokenInfo {
    pub mint: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub symbol: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reserve: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub decimals: Option<u8>,
}

/// A standardized representation of a liquidity pool
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PoolInfo {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,
    pub dex: String,
    pub token_a: PoolTokenInfo,
    pub token_b: PoolTokenInfo,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lp_token_mint: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub apr: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub apy: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tvl: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub fee: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<Metadata>,
}

/// User's position in a liquidity pool
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LpPositionDetails {
    pub pool_id: String,
    pub dex: String,
    pub lp_token_balance: TokenBalance,
    pub underlying_tokens: Vec<TokenBalance>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value_usd: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub accrued_fees: Option<Vec<TokenBalance>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rewards: Option<Vec<TokenBalance>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<Metadata>,
}

/// Result of a blockchain transaction
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransactionResult {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub transaction_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<serde_json::Value>,
}

/// Add liquidity parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddLiquidityParams {
    pub pool_id: String,
    pub token_a_amount_lamports: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub token_b_amount_lamports: Option<String>,
    pub slippage_bps: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tick_lower_index: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tick_upper_index: Option<i32>,
}

/// Remove liquidity parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RemoveLiquidityParams {
    pub pool_id: String,
    pub lp_token_amount_lamports: String,
    pub slippage_bps: u32,
}

/// Liquidity pool service trait
#[async_trait]
pub trait LpService: Service {
    /// Get DEX name
    fn get_dex_name(&self) -> &str;
    
    /// Get available pools
    async fn get_pools(
        &self,
        token_a_mint: Option<&str>,
        token_b_mint: Option<&str>,
    ) -> Result<Vec<PoolInfo>, anyhow::Error>;
    
    /// Add liquidity
    async fn add_liquidity(
        &self,
        user_vault: &[u8],
        params: AddLiquidityParams,
    ) -> Result<(TransactionResult, Option<TokenBalance>), anyhow::Error>;
    
    /// Remove liquidity
    async fn remove_liquidity(
        &self,
        user_vault: &[u8],
        params: RemoveLiquidityParams,
    ) -> Result<(TransactionResult, Option<Vec<TokenBalance>>), anyhow::Error>;
    
    /// Get LP position details
    async fn get_lp_position_details(
        &self,
        user_account_public_key: &str,
        pool_or_position_identifier: &str,
    ) -> Result<Option<LpPositionDetails>, anyhow::Error>;
    
    /// Get market data for pools
    async fn get_market_data_for_pools(
        &self,
        pool_ids: &[String],
    ) -> Result<HashMap<String, PoolInfo>, anyhow::Error>;
}

```