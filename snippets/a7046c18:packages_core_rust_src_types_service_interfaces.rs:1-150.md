# a7046c18:packages_core_rust_src_types_service_interfaces.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Service interface definitions for elizaOS
//!
//! This module provides standardized service interface trait definitions that plugins implement.
//! Each trait extends the base Service trait and defines the contract for a specific
//! capability (e.g., transcription, wallet, browser automation).

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::{service::Service, service_type, Metadata, Uuid};

// ============================================================================
// Token & Wallet Types
// ============================================================================

/// A standardized representation of a token holding.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenBalance {
    /// Token mint address or native identifier
    pub address: String,
    /// Raw balance as string for precision
    pub balance: String,
    /// Number of decimal places
    pub decimals: u8,
    /// User-friendly balance
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ui_amount: Option<f64>,
    /// Token name
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    /// Token symbol
    #[serde(skip_serializing_if = "Option::is_none")]
    pub symbol: Option<String>,
    /// Token logo URI
    #[serde(skip_serializing_if = "Option::is_none")]
    pub logo_uri: Option<String>,
}

/// Generic representation of token data from various services.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenData {
    /// Unique identifier
    pub id: String,
    /// Token symbol
    pub symbol: String,
    /// Token name
    pub name: String,
    /// Contract address
    pub address: String,
    /// Chain identifier (e.g., 'solana', 'ethereum')
    pub chain: String,
    /// Data source provider
    pub source_provider: String,
    /// Current price in USD
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price: Option<f64>,
    /// 24h price change percentage
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price_change_24h_percent: Option<f64>,
    /// 24h price change USD
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price_change_24h_usd: Option<f64>,
    /// 24h trading volume
    #[serde(skip_serializing_if = "Option::is_none")]
    pub volume_24h_usd: Option<f64>,
    /// Market capitalization
    #[serde(skip_serializing_if = "Option::is_none")]
    pub market_cap_usd: Option<f64>,
    /// Liquidity in USD
    #[serde(skip_serializing_if = "Option::is_none")]
    pub liquidity: Option<f64>,
    /// Number of holders
    #[serde(skip_serializing_if = "Option::is_none")]
    pub holders: Option<u64>,
    /// Token logo URI
    #[serde(skip_serializing_if = "Option::is_none")]
    pub logo_uri: Option<String>,
    /// Token decimals
    #[serde(skip_serializing_if = "Option::is_none")]
    pub decimals: Option<u8>,
    /// Last update time (ISO 8601)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_updated_at: Option<String>,
    /// Raw provider data
    #[serde(skip_serializing_if = "Option::is_none")]
    pub raw: Option<serde_json::Value>,
}

/// A wallet asset with value information.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WalletAsset {
    #[serde(flatten)]
    pub token: TokenBalance,
    /// Current price in USD
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price_usd: Option<f64>,
    /// Total value in USD
    #[serde(skip_serializing_if = "Option::is_none")]
    pub value_usd: Option<f64>,
}

/// Wallet portfolio containing all assets.
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WalletPortfolio {
    /// Total portfolio value
    pub total_value_usd: f64,
    /// Portfolio assets
    pub assets: Vec<WalletAsset>,
}

/// Token data service trait
#[async_trait]
pub trait TokenDataService: Service {
    /// Fetch detailed information for a single token
    async fn get_token_details(&self, address: &str, chain: &str) -> Result<Option<TokenData>, anyhow::Error>;
    
    /// Fetch trending tokens
    async fn get_trending_tokens(
        &self,
        chain: Option<&str>,
        limit: Option<usize>,
        time_period: Option<&str>,
    ) -> Result<Vec<TokenData>, anyhow::Error>;
    
    /// Search for tokens
    async fn search_tokens(
        &self,
        query: &str,
        chain: Option<&str>,
        limit: Option<usize>,
    ) -> Result<Vec<TokenData>, anyhow::Error>;
    
    /// Fetch tokens by addresses
    async fn get_tokens_by_addresses(
        &self,
        addresses: &[String],
        chain: &str,
    ) -> Result<Vec<TokenData>, anyhow::Error>;
}

/// Wallet service trait
#[async_trait]
pub trait WalletService: Service {
    /// Get wallet portfolio
    async fn get_portfolio(&self, owner: Option<&str>) -> Result<WalletPortfolio, anyhow::Error>;
```