# a7046c18:packages_core_python_elizaos_runtime.py:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/runtime.py:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        message: Memory,
        state: State | None = None,
        did_respond: bool = False,
        callback: HandlerCallback | None = None,
        responses: list[Memory] | None = None,
    ) -> list[Evaluator] | None:
        """Run evaluators on a message."""
        ran_evaluators: list[Evaluator] = []

        for evaluator in self._evaluators:
            should_run = evaluator.always_run or did_respond

            if should_run:
                try:
                    is_valid = await evaluator.validate_fn(self, message, state)
                    if is_valid:
                        await evaluator.handler(
                            self,
                            message,
                            state,
                            HandlerOptions(),
                            callback,
                            responses,
                        )
                        ran_evaluators.append(evaluator)
                except Exception as e:
                    self.logger.error(f"Evaluator {evaluator.name} failed: {e}")

        return ran_evaluators if ran_evaluators else None

    # Connection management
    async def ensure_connections(
        self,
        entities: list[Entity],
        rooms: list[Room],
        _source: str,
        world: World,
    ) -> None:
        """Ensure connections are set up."""
        # Ensure world exists
        await self.ensure_world_exists(world)

        # Ensure rooms exist
        for room in rooms:
            await self.ensure_room_exists(room)

        # Ensure entities exist and are participants
        for entity in entities:
            if entity.id:
                await self.create_entities([entity])
                for room in rooms:
                    await self.ensure_participant_in_room(entity.id, room.id)

    async def ensure_connection(
        self,
        entity_id: UUID,
        room_id: UUID,
        world_id: UUID,
        user_name: str | None = None,
        name: str | None = None,
        world_name: str | None = None,
        source: str | None = None,
        channel_id: str | None = None,
        message_server_id: UUID | None = None,
        channel_type: str | None = None,
        user_id: UUID | None = None,
        metadata: dict[str, Any] | None = None,
    ) -> None:
        """Ensure a connection is set up."""
        # Implementation depends on database adapter
        pass

    async def ensure_participant_in_room(self, entity_id: UUID, room_id: UUID) -> None:
        """Ensure an entity is a participant in a room."""
        if self._adapter:
            is_participant = await self._adapter.is_room_participant(room_id, entity_id)
            if not is_participant:
                await self._adapter.add_participants_room([entity_id], room_id)

    async def ensure_world_exists(self, world: World) -> None:
        """Ensure a world exists."""
        if self._adapter:
            existing = await self._adapter.get_world(world.id)
            if not existing:
                await self._adapter.create_world(world)

    async def ensure_room_exists(self, room: Room) -> None:
        """Ensure a room exists."""
        if self._adapter:
            rooms = await self._adapter.get_rooms_by_ids([room.id])
            if not rooms or len(rooms) == 0:
                await self._adapter.create_rooms([room])

    # State composition
    async def compose_state(
        self,
        message: Memory,
        include_list: list[str] | None = None,
        only_include: bool = False,
        skip_cache: bool = False,
    ) -> State:
        """Compose state for a message."""
        cache_key = str(message.room_id)

        # Check cache
        if not skip_cache and cache_key in self._state_cache:
            return self._state_cache[cache_key]

        # Create new state
        state = State(
            values={},
            data=StateData(),
            text="",
        )

        # Run providers
        providers_to_run = self._providers
        if include_list and only_include:
            providers_to_run = [p for p in self._providers if p.name in include_list]
        elif include_list:
            providers_to_run = [
                p for p in self._providers if p.name not in include_list or p.name in include_list
            ]

        # Sort by position
        providers_to_run.sort(key=lambda p: p.position or 0)

        text_parts: list[str] = []
        for provider in providers_to_run:
            if provider.private:
                continue

            try:
                result = await provider.get(self, message, state)
                if result.text:
                    text_parts.append(result.text)
                if result.values:
                    state.values.update(result.values)
                if result.data:
                    if not state.data.providers:
                        state.data.providers = {}
                    state.data.providers[provider.name] = result.data
            except Exception as e:
                self.logger.error(f"Provider {provider.name} failed: {e}")

        state.text = "\n".join(text_parts)

        # Cache state
        if not skip_cache:
            self._state_cache[cache_key] = state
```