# a7046c18:packages_core_python_elizaos_types_service_interfaces.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/service_interfaces.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```


class PoolInfo(BaseModel):
    """A standardized representation of a liquidity pool."""

    id: str = Field(..., description="Pool unique identifier")
    display_name: str | None = Field(None, description="User-friendly name")
    dex: str = Field(..., description="DEX identifier")
    token_a: PoolTokenInfo = Field(..., description="First token")
    token_b: PoolTokenInfo = Field(..., description="Second token")
    lp_token_mint: str | None = Field(None, description="LP token mint")
    apr: float | None = Field(None, description="Annual Percentage Rate")
    apy: float | None = Field(None, description="Annual Percentage Yield")
    tvl: float | None = Field(None, description="Total Value Locked")
    fee: float | None = Field(None, description="Trading fee percentage")
    metadata: dict[str, Any] | None = Field(None, description="DEX-specific data")


class LpPositionDetails(BaseModel):
    """User's position in a liquidity pool."""

    pool_id: str = Field(..., description="Pool ID")
    dex: str = Field(..., description="DEX identifier")
    lp_token_balance: TokenBalance = Field(..., description="LP token balance")
    underlying_tokens: list[TokenBalance] = Field(
        default_factory=list, description="Underlying tokens"
    )
    value_usd: float | None = Field(None, description="Position value in USD")
    accrued_fees: list[TokenBalance] | None = Field(None, description="Accrued fees")
    rewards: list[TokenBalance] | None = Field(None, description="Farming rewards")
    metadata: dict[str, Any] | None = Field(None, description="Additional data")


class TransactionResult(BaseModel):
    """Result of a blockchain transaction."""

    success: bool = Field(..., description="Whether transaction succeeded")
    transaction_id: str | None = Field(None, description="Transaction ID")
    error: str | None = Field(None, description="Error message if failed")
    data: dict[str, Any] | None = Field(None, description="Additional data")


class ILpService(Service):
    """Interface for liquidity pool services."""

    service_type: ClassVar[str] = ServiceType.LP_POOL

    @property
    def capability_description(self) -> str:
        return "Provides standardized access to DEX liquidity pools."

    @abstractmethod
    def get_dex_name(self) -> str:
        """Returns the name of the DEX this service interacts with."""
        ...

    @abstractmethod
    async def get_pools(
        self, token_a_mint: str | None = None, token_b_mint: str | None = None
    ) -> list[PoolInfo]:
        """Fetch available liquidity pools from the DEX."""
        ...

    @abstractmethod
    async def add_liquidity(
        self,
        user_vault: object,
        pool_id: str,
        token_a_amount_lamports: str,
        token_b_amount_lamports: str | None,
        slippage_bps: int,
        tick_lower_index: int | None = None,
        tick_upper_index: int | None = None,
    ) -> tuple[TransactionResult, TokenBalance | None]:
        """Add liquidity to a pool."""
        ...

    @abstractmethod
    async def remove_liquidity(
        self,
        user_vault: object,
        pool_id: str,
        lp_token_amount_lamports: str,
        slippage_bps: int,
    ) -> tuple[TransactionResult, list[TokenBalance] | None]:
        """Remove liquidity from a pool."""
        ...

    @abstractmethod
    async def get_lp_position_details(
        self, user_account_public_key: str, pool_or_position_identifier: str
    ) -> LpPositionDetails | None:
        """Fetch details of a specific LP position."""
        ...

    @abstractmethod
    async def get_market_data_for_pools(self, pool_ids: list[str]) -> dict[str, PoolInfo]:
        """Fetch latest market data for pools."""
        ...


# ============================================================================
# Transcription & Audio Interfaces
# ============================================================================


class TranscriptionOptions(BaseModel):
    """Options for audio transcription."""

    language: str | None = None
    model: str | None = None
    temperature: float | None = None
    prompt: str | None = None
    response_format: Literal["json", "text", "srt", "vtt", "verbose_json"] | None = None
    timestamp_granularities: list[Literal["word", "segment"]] | None = None
    word_timestamps: bool | None = None
    segment_timestamps: bool | None = None


class TranscriptionSegment(BaseModel):
    """A segment of transcription."""

    id: int = Field(..., description="Segment ID")
    text: str = Field(..., description="Segment text")
    start: float = Field(..., description="Start time in seconds")
    end: float = Field(..., description="End time in seconds")
    confidence: float | None = None
    tokens: list[int] | None = None
    temperature: float | None = None
    avg_logprob: float | None = None
    compression_ratio: float | None = None
    no_speech_prob: float | None = None


class TranscriptionWord(BaseModel):
    """A word in transcription."""

    word: str = Field(..., description="The word")
    start: float = Field(..., description="Start time in seconds")
    end: float = Field(..., description="End time in seconds")
    confidence: float | None = None


class TranscriptionResult(BaseModel):
    """Result of audio transcription."""

    text: str = Field(..., description="Transcribed text")
    language: str | None = None
    duration: float | None = None
    segments: list[TranscriptionSegment] | None = None
```