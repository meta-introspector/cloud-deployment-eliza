# a7046c18:packages_core_python_elizaos_types___init__.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/__init__.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
elizaOS Core Types - Pydantic models and type definitions.

This module provides all the core type definitions for elizaOS,
using Pydantic for validation and strong typing.
"""

from elizaos.types.agent import (
    Agent,
    AgentStatus,
    Character,
    MessageExample,
    TemplateType,
)
from elizaos.types.components import (
    Action,
    ActionContext,
    ActionExample,
    ActionResult,
    EvaluationExample,
    Evaluator,
    Handler,
    HandlerCallback,
    HandlerOptions,
    Provider,
    ProviderResult,
    Validator,
)
from elizaos.types.database import (
    VECTOR_DIMS,
    ActionLogBody,
    AgentRunCounts,
    AgentRunSummary,
    AgentRunSummaryResult,
    BaseLogBody,
    DbConnection,
    EmbeddingLogBody,
    EmbeddingSearchResult,
    EvaluatorLogBody,
    IDatabaseAdapter,
    Log,
    LogBody,
    MemoryOptions,
    MemoryRetrievalOptions,
    MemorySearchOptions,
    ModelLogBody,
    MultiRoomMemoryOptions,
    RunStatus,
    SearchOptions,
)
from elizaos.types.environment import (
    ChannelType,
    Component,
    Entity,
    Participant,
    Relationship,
    Role,
    Room,
    RoomMetadata,
    World,
    WorldMetadata,
)
from elizaos.types.events import (
    ActionEventPayload,
    ChannelClearedPayload,
    ControlMessagePayload,
    EmbeddingGenerationPayload,
    EntityPayload,
    EvaluatorEventPayload,
    EventHandler,
    EventPayload,
    EventPayloadMap,
    EventType,
    InvokePayload,
    MessagePayload,
    ModelEventPayload,
    PlatformPrefix,
    RunEventPayload,
    WorldPayload,
)
from elizaos.types.memory import (
    BaseMetadata,
    CustomMetadata,
    DescriptionMetadata,
    DocumentMetadata,
    FragmentMetadata,
    Memory,
    MemoryMetadata,
    MemoryScope,
    MemoryType,
    MessageMemory,
    MessageMetadata,
)
from elizaos.types.model import (
    ModelSettings,
    ModelType,
    ModelTypeName,
)
from elizaos.types.plugin import (
    Plugin,
    PluginEvents,
    Project,
    ProjectAgent,
    Route,
    RouteRequest,
    RouteResponse,
)
from elizaos.types.primitives import (
    UUID,
    Content,
    ContentType,
    Media,
    MentionContext,
    Metadata,
    as_uuid,
)
from elizaos.types.runtime import (
    IAgentRuntime,
    RuntimeSettings,
)
from elizaos.types.service import (
    Service,
    ServiceError,
    ServiceType,
    ServiceTypeName,
    ServiceTypeRegistry,
    create_service_error,
)
from elizaos.types.service_interfaces import (
    BrowserNavigationOptions,
    # Browser
    BrowserViewport,
    # Messaging
    ChannelPermissions,
    ClickOptions,
    CrossPostedInfo,
    DemographicsData,
    ElementSelector,
    EmailAccount,
    # Email
    EmailAddress,
    EmailAttachment,
    EmailFolder,
    EmailMessage,
    EmailSearchOptions,
    EmailSendOptions,
    EmbedField,
    ExtractedContent,
    ExtractedImage,
    ExtractedLink,
```