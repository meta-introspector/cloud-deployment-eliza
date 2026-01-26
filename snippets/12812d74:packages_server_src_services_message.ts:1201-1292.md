# 12812d74:packages_server_src_services_message.ts:1201-1292

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/server/src/services/message.ts:1201-1292
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
  getCentralMessageServerUrl(): string {
    const serverPort = process.env.SERVER_PORT;
    const envUrl = process.env.CENTRAL_MESSAGE_SERVER_URL;

    // Validate and sanitize server port
    let validatedPort: number | null = null;
    if (serverPort) {
      const portNum = parseInt(serverPort, 10);
      if (!isNaN(portNum) && portNum > 0 && portNum <= 65535) {
        validatedPort = portNum;
      } else {
        logger.warn({ src: 'service:message-bus', serverPort }, 'Invalid SERVER_PORT value');
      }
    }

    // On Windows, use 127.0.0.1 instead of localhost to avoid resolution issues
    const host = process.platform === 'win32' ? '127.0.0.1' : 'localhost';
    const defaultUrl = validatedPort ? `http://${host}:${validatedPort}` : `http://${host}:3000`;
    const baseUrl = envUrl ?? defaultUrl;

    // Strict validation to prevent SSRF attacks
    try {
      const url = new URL(baseUrl);

      // Only allow HTTP/HTTPS protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        logger.warn(
          { src: 'service:message-bus', protocol: url.protocol },
          'Unsafe protocol in CENTRAL_MESSAGE_SERVER_URL'
        );
        return defaultUrl;
      }

      // Only allow safe localhost variants and block private/internal IPs
      const allowedHosts = ['localhost', '127.0.0.1', '::1'];
      if (!allowedHosts.includes(url.hostname)) {
        logger.warn(
          { src: 'service:message-bus', hostname: url.hostname },
          'Unsafe hostname in CENTRAL_MESSAGE_SERVER_URL'
        );
        return defaultUrl;
      }

      // Validate port range
      if (url.port) {
        const portNum = parseInt(url.port, 10);
        if (isNaN(portNum) || portNum <= 0 || portNum > 65535) {
          logger.warn(
            { src: 'service:message-bus', port: url.port },
            'Invalid port in CENTRAL_MESSAGE_SERVER_URL'
          );
          return defaultUrl;
        }
      }

      // Remove any potentially dangerous URL components
      url.username = '';
      url.password = '';
      url.hash = '';

      return url.toString().replace(/\/$/, ''); // Remove trailing slash
    } catch (error) {
      logger.error(
        { src: 'service:message-bus', baseUrl },
        'Invalid URL format in CENTRAL_MESSAGE_SERVER_URL'
      );
      return defaultUrl;
    }
  }

  async stop(): Promise<void> {
    logger.info(
      {
        src: 'service:message-bus',
        agentId: this.runtime.agentId,
        agentName: this.runtime.character.name,
      },
      'MessageBusService stopping'
    );
    internalMessageBus.off('new_message', this.boundHandleIncomingMessage);
    internalMessageBus.off('server_agent_update', this.boundHandleServerAgentUpdate);
    internalMessageBus.off('message_deleted', this.boundHandleMessageDeleted);
    internalMessageBus.off('channel_cleared', this.boundHandleChannelCleared);
  }
}

// Minimal plugin definition to register the service
export const messageBusConnectorPlugin: Plugin = {
  name: 'internal-message-bus-connector',
  description: 'Internal service to connect agent to the message bus.',
  services: [MessageBusService],
};
```