# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      'Error processing standardized server data'
    );
  }
};

/**
 * Handles control messages for enabling or disabling UI elements in the frontend
 * @param {Object} params - Parameters for the handler
 * @param {IAgentRuntime} params.runtime - The runtime instance
 * @param {Object} params.message - The control message
 * @param {string} params.source - Source of the message
 */
const controlMessageHandler = async ({ runtime, message }: ControlMessagePayload) => {
  try {
    runtime.logger.debug(
      {
        src: 'plugin:bootstrap',
        agentId: runtime.agentId,
        action: message.payload.action,
        roomId: message.roomId,
      },
      'Processing control message'
    );

    // Here we would use a WebSocket service to send the control message to the frontend
    // This would typically be handled by a registered service with sendMessage capability

    // Get any registered WebSocket service
    const serviceNames = Array.from(runtime.getAllServices().keys()) as string[];
    const websocketServiceName = serviceNames.find(
      (name: string) =>
        name.toLowerCase().includes('websocket') || name.toLowerCase().includes('socket')
    );

    if (websocketServiceName) {
      const websocketService = runtime.getService(websocketServiceName);
      interface WebSocketServiceWithSendMessage {
        sendMessage: (message: { type: string; payload: unknown }) => Promise<void>;
      }
      if (websocketService && 'sendMessage' in websocketService) {
        // Send the control message through the WebSocket service
        await (websocketService as WebSocketServiceWithSendMessage).sendMessage({
          type: 'controlMessage',
          payload: {
            action: message.payload.action,
            target: message.payload.target,
            roomId: message.roomId,
          },
        });

        runtime.logger.debug(
          { src: 'plugin:bootstrap', agentId: runtime.agentId, action: message.payload.action },
          'Control message sent successfully'
        );
      } else {
        runtime.logger.error(
          { src: 'plugin:bootstrap', agentId: runtime.agentId },
          'WebSocket service does not have sendMessage method'
        );
      }
    } else {
      runtime.logger.error(
        { src: 'plugin:bootstrap', agentId: runtime.agentId },
        'No WebSocket service found to send control message'
      );
    }
  } catch (error) {
    runtime.logger.error(
      {
        src: 'plugin:bootstrap',
        agentId: runtime.agentId,
        error: error instanceof Error ? error.message : String(error),
      },
      'Error processing control message'
    );
  }
};

const events: PluginEvents = {
  [EventType.REACTION_RECEIVED]: [
    async (payload: MessagePayload) => {
      await reactionReceivedHandler(payload);
    },
  ],

  [EventType.POST_GENERATED]: [
    async (payload: InvokePayload) => {
      await postGeneratedHandler(payload);
    },
  ],

  [EventType.MESSAGE_SENT]: [
    async (payload: MessagePayload) => {
      payload.runtime.logger.debug(
        {
          src: 'plugin:bootstrap',
          agentId: payload.runtime.agentId,
          text: payload.message.content.text,
        },
        'Message sent'
      );
    },
  ],

  [EventType.WORLD_JOINED]: [
    async (payload: WorldPayload) => {
      await handleServerSync(payload);
    },
  ],

  [EventType.WORLD_CONNECTED]: [
    async (payload: WorldPayload) => {
      await handleServerSync(payload);
    },
  ],

  [EventType.ENTITY_JOINED]: [
    async (payload: EntityPayload) => {
      payload.runtime.logger.debug(
        { src: 'plugin:bootstrap', agentId: payload.runtime.agentId, entityId: payload.entityId },
        'ENTITY_JOINED event received'
      );

      if (!payload.worldId) {
        payload.runtime.logger.error(
          { src: 'plugin:bootstrap', agentId: payload.runtime.agentId },
          'No worldId provided for entity joined'
        );
        return;
      }
      if (!payload.roomId) {
        payload.runtime.logger.error(
          { src: 'plugin:bootstrap', agentId: payload.runtime.agentId },
          'No roomId provided for entity joined'
        );
        return;
      }
      if (!payload.metadata?.type) {
        payload.runtime.logger.error(
          { src: 'plugin:bootstrap', agentId: payload.runtime.agentId },
          'No type provided for entity joined'
        );
        return;
      }

      const channelType = payload.metadata?.type;
      if (typeof channelType !== 'string') {
        payload.runtime.logger.warn('Missing channel type in entity payload');
        return;
      }
```