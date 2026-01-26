# a7046c18:packages_core_python_elizaos_runtime.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/runtime.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        if not self._adapter:
            raise RuntimeError("Database adapter not set")
        return self._adapter.db

    # Initialization
    async def initialize(self, config: dict[str, str | int | bool | None] | None = None) -> None:
        """Initialize the runtime."""
        _ = config  # Config handled during construction
        self.logger.info("Initializing AgentRuntime...")

        # Initialize database adapter if present
        if self._adapter:
            await self._adapter.initialize()
            self.logger.debug("Database adapter initialized")

        # Register initial plugins
        for plugin in self._initial_plugins:
            await self.register_plugin(plugin)

        self._init_complete = True
        self._init_event.set()
        self.logger.info("AgentRuntime initialized successfully")

    async def register_plugin(self, plugin: Plugin) -> None:
        """Register a plugin with the runtime."""
        from elizaos.plugin import register_plugin

        await register_plugin(self, plugin)
        self._plugins.append(plugin)

    # Service management
    def get_service(self, service: str) -> Service | None:
        services = self._services.get(service)
        return services[0] if services else None

    def get_services_by_type(self, service: str) -> list[Service]:
        return self._services.get(service, [])

    def get_all_services(self) -> dict[str, list[Service]]:
        return self._services

    async def register_service(self, service_class: type[Service]) -> None:
        service_type = service_class.service_type
        service = await service_class.start(self)

        if service_type not in self._services:
            self._services[service_type] = []
        self._services[service_type].append(service)

        self.logger.debug(f"Service registered: {service_type}")

    async def get_service_load_promise(self, service_type: str) -> Service:
        # Wait for initialization if not complete
        if not self._init_complete:
            await self._init_event.wait()

        service = self.get_service(service_type)
        if not service:
            raise RuntimeError(f"Service not found: {service_type}")
        return service

    def get_registered_service_types(self) -> list[str]:
        return list(self._services.keys())

    def has_service(self, service_type: str) -> bool:
        return service_type in self._services and len(self._services[service_type]) > 0

    # Settings
    def set_setting(self, key: str, value: str | bool | None, _secret: bool = False) -> None:
        self._settings[key] = value

    def get_setting(self, key: str) -> str | bool | int | float | None:
        # Check runtime settings first
        if key in self._settings:
            return self._settings[key]

        # Check character settings
        if self._character.settings and key in self._character.settings:
            setting = self._character.settings[key]
            if isinstance(setting, (str, bool, int)):
                return setting

        # Check character secrets
        if self._character.secrets and key in self._character.secrets:
            return self._character.secrets[key]

        return None

    def get_conversation_length(self) -> int:
        return self._conversation_length

    # Component registration
    def register_provider(self, provider: Provider) -> None:
        self._providers.append(provider)

    def register_action(self, action: Action) -> None:
        self._actions.append(action)

    def register_evaluator(self, evaluator: Evaluator) -> None:
        self._evaluators.append(evaluator)

    # Action processing
    async def process_actions(
        self,
        message: Memory,
        responses: list[Memory],
        state: State | None = None,
        callback: HandlerCallback | None = None,
        _options: dict[str, Any] | None = None,
    ) -> None:
        """Process actions for a message."""
        if not message.content.actions:
            return

        for action_name in message.content.actions:
            action = self._get_action_by_name(action_name)
            if action:
                try:
                    result = await action.handler(
                        self,
                        message,
                        state,
                        HandlerOptions(),
                        callback,
                        responses,
                    )

                    # Store result
                    if message.id:
                        message_id = str(message.id)
                        if message_id not in self._action_results:
                            self._action_results[message_id] = []
                        if result:
                            self._action_results[message_id].append(result)

                except Exception as e:
                    self.logger.error(f"Action {action_name} failed: {e}")

    def _get_action_by_name(self, name: str) -> Action | None:
        for action in self._actions:
            if action.name == name:
                return action
        return None

    def get_action_results(self, message_id: UUID) -> list[ActionResult]:
        return self._action_results.get(str(message_id), [])

    # Evaluation
    async def evaluate(
        self,
```