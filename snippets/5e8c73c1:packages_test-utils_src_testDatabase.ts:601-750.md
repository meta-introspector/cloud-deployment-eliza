# 5e8c73c1:packages_test-utils_src_testDatabase.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/testDatabase.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          throw new Error('Room not found');
        }
        storage.rooms.set(room.id, room);
      },

      async deleteRoom(roomId: any) {
        storage.rooms.delete(roomId);
      },

      async getRoomsByIds(roomIds: any) {
        const rooms = [];
        for (const id of roomIds) {
          const room = storage.rooms.get(id);
          if (room) {
            rooms.push(room);
          }
        }
        return rooms;
      },

      async createRooms(rooms: any[]) {
        const ids = [];
        for (const room of rooms) {
          const id = room.id || uuidv4();
          const fullRoom = { ...room, id };
          storage.rooms.set(id, fullRoom);
          ids.push(id);
        }
        return ids;
      },

      async getRoomsByWorld(worldId: any) {
        return Array.from(storage.rooms.values()).filter((room) => room.worldId === worldId);
      },

      async deleteRoomsByWorldId(worldId: any) {
        const toDelete = [];
        for (const [id, room] of storage.rooms) {
          if (room.worldId === worldId) {
            toDelete.push(id);
          }
        }
        for (const id of toDelete) {
          storage.rooms.delete(id);
        }
      },

      async getWorlds(params: any) {
        let worlds = Array.from(storage.worlds.values());
        if (params?.agentId) {
          worlds = worlds.filter((w: any) => w.agentId === params.agentId);
        }
        return worlds;
      },

      async removeWorld(worldId: any) {
        storage.worlds.delete(worldId);
      },

      async updateWorld(world: any) {
        if (!world.id || !storage.worlds.has(world.id)) {
          throw new Error('World not found');
        }
        storage.worlds.set(world.id, world);
      },

      async createComponent(component: any) {
        // Store in a components map within the entity
        const entityComponents = storage.entities.get(component.entityId)?.components || [];
        entityComponents.push(component);

        const entity = storage.entities.get(component.entityId);
        if (entity) {
          entity.components = entityComponents;
          storage.entities.set(component.entityId, entity);
        }

        return true;
      },

      async getComponents(entityId: any) {
        const entity = storage.entities.get(entityId);
        return entity?.components || [];
      },

      async updateComponent(component: any) {
        const entity = storage.entities.get(component.entityId);
        if (entity && entity.components) {
          const index = entity.components.findIndex((c: any) => c.id === component.id);
          if (index >= 0) {
            entity.components[index] = component;
            storage.entities.set(component.entityId, entity);
            return;
          }
        }
        throw new Error('Component not found');
      },

      async deleteComponent(componentId: any) {
        for (const entity of storage.entities.values()) {
          if (entity.components) {
            const index = entity.components.findIndex((c: any) => c.id === componentId);
            if (index >= 0) {
              entity.components.splice(index, 1);
              storage.entities.set(entity.id, entity);
              return;
            }
          }
        }
      },

      async getComponent(entityId: any, type: any, worldId?: any, sourceEntityId?: any) {
        const entity = storage.entities.get(entityId);
        if (!entity?.components) {
          return null;
        }

        return (
          entity.components.find(
            (c: any) =>
              c.type === type &&
              (!worldId || c.worldId === worldId) &&
              (!sourceEntityId || c.sourceEntityId === sourceEntityId)
          ) || null
        );
      },

      async getParticipantsForEntity(entityId: any) {
        return Array.from(storage.participants.values()).filter(
          (p: any) => p.entityId === entityId
        );
      },

      async getRoomsForParticipant(entityId: any) {
        return Array.from(storage.participants.values())
          .filter((p: any) => p.entityId === entityId)
          .map((p: any) => p.roomId);
      },

      async getRoomsForParticipants(userIds: any[]) {
        const roomIds = new Set();
        for (const participant of storage.participants.values()) {
          if (userIds.includes(participant.entityId)) {
            roomIds.add(participant.roomId);
          }
        }
        return Array.from(roomIds);
      },

      async getParticipantUserState(_roomId: any, _entityId: any) {
```