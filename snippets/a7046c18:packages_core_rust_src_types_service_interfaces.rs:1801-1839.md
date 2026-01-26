# a7046c18:packages_core_rust_src_types_service_interfaces.rs:1801-1839

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:1801-1839
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        &self,
        query: &str,
        options: Option<PostSearchOptions>,
    ) -> Result<Vec<PostInfo>, anyhow::Error>;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_token_balance_serialization() {
        let balance = TokenBalance {
            address: "So11111111111111111111111111111111111111112".to_string(),
            balance: "1000000000".to_string(),
            decimals: 9,
            ui_amount: Some(1.0),
            name: Some("Wrapped SOL".to_string()),
            symbol: Some("SOL".to_string()),
            logo_uri: None,
        };

        let json = serde_json::to_string(&balance).unwrap();
        assert!(json.contains("\"address\":\"So11111111111111111111111111111111111111112\""));
        assert!(json.contains("\"uiAmount\":1.0"));
    }

    #[test]
    fn test_wallet_portfolio_serialization() {
        let portfolio = WalletPortfolio {
            total_value_usd: 1000.0,
            assets: vec![],
        };

        let json = serde_json::to_string(&portfolio).unwrap();
        assert!(json.contains("\"totalValueUsd\":1000.0"));
    }
}

```