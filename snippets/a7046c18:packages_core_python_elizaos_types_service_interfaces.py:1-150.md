# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Service interface definitions for elizaOS.

This module provides standardized service interface definitions that plugins implement.
Each interface extends the base Service class and defines the contract for a specific
capability (e.g., transcription, wallet, browser automation).
"""

from __future__ import annotations

from abc import abstractmethod
from datetime import datetime
from typing import TYPE_CHECKING, Any, ClassVar, Literal

from pydantic import BaseModel, Field

from elizaos.types.service import Service, ServiceType

if TYPE_CHECKING:
    from io import BufferedReader

# ============================================================================
# Token & Wallet Interfaces
# ============================================================================


class TokenBalance(BaseModel):
    """A standardized representation of a token holding."""

    address: str = Field(..., description="Token mint address or native identifier")
    balance: str = Field(..., description="Raw balance as string for precision")
    decimals: int = Field(..., description="Number of decimal places")
    ui_amount: float | None = Field(None, description="User-friendly balance")
    name: str | None = Field(None, description="Token name")
    symbol: str | None = Field(None, description="Token symbol")
    logo_uri: str | None = Field(None, description="Token logo URI")


class TokenData(BaseModel):
    """Generic representation of token data from various services."""

    id: str = Field(..., description="Unique identifier")
    symbol: str = Field(..., description="Token symbol")
    name: str = Field(..., description="Token name")
    address: str = Field(..., description="Contract address")
    chain: str = Field(..., description="Chain identifier")
    source_provider: str = Field(..., description="Data source provider")

    price: float | None = Field(None, description="Current price in USD")
    price_change_24h_percent: float | None = Field(None, description="24h price change %")
    price_change_24h_usd: float | None = Field(None, description="24h price change USD")

    volume_24h_usd: float | None = Field(None, description="24h trading volume")
    market_cap_usd: float | None = Field(None, description="Market capitalization")

    liquidity: float | None = Field(None, description="Liquidity in USD")
    holders: int | None = Field(None, description="Number of holders")

    logo_uri: str | None = Field(None, description="Token logo URI")
    token_decimals: int | None = Field(None, description="Token decimals")

    last_updated_at: datetime | None = Field(None, description="Last update time")
    raw: dict[str, Any] | None = Field(None, description="Raw provider data")


class WalletAsset(TokenBalance):
    """A wallet asset with value information."""

    price_usd: float | None = Field(None, description="Current price in USD")
    value_usd: float | None = Field(None, description="Total value in USD")


class WalletPortfolio(BaseModel):
    """Wallet portfolio containing all assets."""

    total_value_usd: float = Field(..., description="Total portfolio value")
    assets: list[WalletAsset] = Field(default_factory=list, description="Portfolio assets")


class ITokenDataService(Service):
    """Interface for token data services."""

    service_type: ClassVar[str] = ServiceType.TOKEN_DATA

    @property
    def capability_description(self) -> str:
        return "Provides standardized access to token market data."

    @abstractmethod
    async def get_token_details(self, address: str, chain: str) -> TokenData | None:
        """Fetch detailed information for a single token."""
        ...

    @abstractmethod
    async def get_trending_tokens(
        self, chain: str | None = None, limit: int | None = None, time_period: str | None = None
    ) -> list[TokenData]:
        """Fetch a list of trending tokens."""
        ...

    @abstractmethod
    async def search_tokens(
        self, query: str, chain: str | None = None, limit: int | None = None
    ) -> list[TokenData]:
        """Search for tokens based on a query string."""
        ...

    @abstractmethod
    async def get_tokens_by_addresses(self, addresses: list[str], chain: str) -> list[TokenData]:
        """Fetch data for multiple tokens by their addresses."""
        ...


class IWalletService(Service):
    """Interface for wallet services."""

    service_type: ClassVar[str] = ServiceType.WALLET

    @property
    def capability_description(self) -> str:
        return "Provides standardized access to wallet balances and portfolios."

    @abstractmethod
    async def get_portfolio(self, owner: str | None = None) -> WalletPortfolio:
        """Retrieve the entire portfolio of assets held by the wallet."""
        ...

    @abstractmethod
    async def get_balance(self, asset_address: str, owner: str | None = None) -> float:
        """Retrieve the balance of a specific asset in the wallet."""
        ...

    @abstractmethod
    async def transfer_sol(self, from_keypair: object, to_pubkey: object, lamports: int) -> str:
        """Transfer native tokens from a keypair to a recipient."""
        ...


# ============================================================================
# Liquidity Pool Interfaces
# ============================================================================


class PoolTokenInfo(BaseModel):
    """Token information in a pool."""

    mint: str = Field(..., description="Token mint address")
    symbol: str | None = Field(None, description="Token symbol")
    reserve: str | None = Field(None, description="Token reserve")
    decimals: int | None = Field(None, description="Token decimals")
```