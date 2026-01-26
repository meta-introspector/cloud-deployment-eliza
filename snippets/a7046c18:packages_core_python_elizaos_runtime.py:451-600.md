# a7046c18:packages_core_python_elizaos_runtime.py:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/runtime.py:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        return state

    # Model usage
    async def use_model(
        self,
        model_type: str,
        params: dict[str, Any],
        provider: str | None = None,
    ) -> Any:
        """Use a model for inference."""
        handlers = self._models.get(model_type, [])

        if not handlers:
            raise RuntimeError(f"No model handler registered for: {model_type}")

        # Sort by priority and get highest
        handlers.sort(key=lambda h: h.priority, reverse=True)

        # Filter by provider if specified
        if provider:
            handlers = [h for h in handlers if h.provider == provider]
            if not handlers:
                raise RuntimeError(f"No model handler for provider: {provider}")

        handler = handlers[0]
        return await handler.handler(self, params)

    async def generate_text(
        self,
        input_text: str,
        options: GenerateTextOptions | None = None,
    ) -> GenerateTextResult:
        """Generate text using an LLM."""
        model_type = options.model_type if options else ModelType.TEXT_LARGE

        params: dict[str, str | int | float] = {
            "prompt": input_text,
        }
        if options:
            if options.temperature is not None:
                params["temperature"] = options.temperature
            if options.max_tokens is not None:
                params["maxTokens"] = options.max_tokens
            if options.system:
                params["system"] = options.system

        result = await self.use_model(str(model_type), params)
        return GenerateTextResult(text=str(result))

    def register_model(
        self,
        model_type: str,
        handler: Callable[[IAgentRuntime, dict[str, Any]], Awaitable[Any]],
        provider: str,
        priority: int = 0,
    ) -> None:
        """Register a model handler."""
        if model_type not in self._models:
            self._models[model_type] = []

        self._models[model_type].append(
            ModelHandler(handler=handler, provider=provider, priority=priority)
        )

    def get_model(
        self, model_type: str
    ) -> Callable[[IAgentRuntime, dict[str, Any]], Awaitable[Any]] | None:
        """Get a model handler."""
        handlers = self._models.get(model_type, [])
        if handlers:
            handlers.sort(key=lambda h: h.priority, reverse=True)
            return handlers[0].handler
        return None

    # Event handling
    def register_event(
        self,
        event: str,
        handler: Callable[[Any], Awaitable[None]],
    ) -> None:
        """Register an event handler."""
        if event not in self._events:
            self._events[event] = []
        self._events[event].append(handler)

    def get_event(self, event: str) -> list[Callable[[Any], Awaitable[None]]] | None:
        """Get event handlers for an event type."""
        return self._events.get(event)

    async def emit_event(
        self,
        event: str | list[str],
        params: Any,
    ) -> None:
        """Emit an event."""
        events = [event] if isinstance(event, str) else event

        for evt in events:
            handlers = self._events.get(evt, [])
            for handler in handlers:
                try:
                    await handler(params)
                except Exception as e:
                    self.logger.error(f"Event handler failed for {evt}: {e}")

    # Task management
    def register_task_worker(self, task_handler: TaskWorker) -> None:
        """Register a task worker."""
        self._task_workers[task_handler.name] = task_handler

    def get_task_worker(self, name: str) -> TaskWorker | None:
        """Get a task worker by name."""
        return self._task_workers.get(name)

    # Lifecycle
    async def stop(self) -> None:
        """Stop the runtime."""
        self.logger.info("Stopping AgentRuntime...")

        # Stop all services
        for service_type, services in self._services.items():
            for service in services:
                try:
                    await service.stop()
                except Exception as e:
                    self.logger.error(f"Failed to stop service {service_type}: {e}")

        # Close database adapter
        if self._adapter:
            await self._adapter.close()

        self.logger.info("AgentRuntime stopped")

    # Memory/embedding helpers
    async def add_embedding_to_memory(self, memory: Memory) -> Memory:
        """Add embedding to a memory."""
        # This would use an embedding model
        # For now, return the memory as-is
        return memory

    async def queue_embedding_generation(self, memory: Memory, priority: str = "normal") -> None:
        """Queue a memory for async embedding generation."""
        await self.emit_event(
            EventType.EMBEDDING_GENERATION_REQUESTED.value,
            {"runtime": self, "memory": memory, "priority": priority, "source": "runtime"},
        )

    async def get_all_memories(self) -> list[Memory]:
        """Get all memories."""
```