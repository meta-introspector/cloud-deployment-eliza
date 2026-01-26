# a7046c18:packages_docs_runtime_sessions-api.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/sessions-api.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        
        // Optional: Clean up associated resources
        this.cleanupChannelResources(session.channelId);
      }
      // Issue expiration warnings
      else if (this.shouldWarn(session)) {
        session.markWarningState();
        stats.warned++;
        
        // Optional: Emit warning event
        this.emitExpirationWarning(session);
      }
    }
    
    if (stats.cleaned > 0 || stats.warned > 0) {
      logger.info('Cleanup cycle completed:', stats);
    }
  }
  
  stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
```

## Integration Examples

### React Hook with Session Management

```javascript
import { useState, useCallback, useEffect, useRef } from 'react';

function useElizaSession(agentId, userId) {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [expirationWarning, setExpirationWarning] = useState(false);
  const heartbeatInterval = useRef(null);

  const startSession = useCallback(async () => {
    const response = await fetch('/api/messaging/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        agentId, 
        userId,
        timeoutConfig: {
          timeoutMinutes: 30,
          autoRenew: true,
          maxDurationMinutes: 120,
          warningThresholdMinutes: 5
        }
      })
    });
    
    const data = await response.json();
    setSessionId(data.sessionId);
    setSessionStatus({
      expiresAt: data.expiresAt,
      timeoutConfig: data.timeoutConfig
    });
    
    // Start heartbeat
    startHeartbeat(data.sessionId);
    
    return data.sessionId;
  }, [agentId, userId]);

  const startHeartbeat = useCallback((sid) => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
    }
    
    heartbeatInterval.current = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/messaging/sessions/${sid}/heartbeat`,
          { method: 'POST' }
        );
        
        const status = await response.json();
        setSessionStatus(status);
        setExpirationWarning(status.isNearExpiration);
        
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, 60000); // Every minute
  }, []);

  const sendMessage = useCallback(async (content) => {
    if (!sessionId) {
      const newSessionId = await startSession();
      setSessionId(newSessionId);
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `/api/messaging/sessions/${sessionId}/messages`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        }
      );
      
      if (!response.ok) {
        if (response.status === 404 || response.status === 410) {
          // Session expired, create new one
          const newSessionId = await startSession();
          setSessionId(newSessionId);
          // Retry with new session
          return sendMessage(content);
        }
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      const message = await response.json();
      setMessages(prev => [...prev, message]);
      
      // Update session status if provided
      if (message.sessionStatus) {
        setSessionStatus(message.sessionStatus);
        setExpirationWarning(message.sessionStatus.isNearExpiration);
      }
      
      return message;
    } finally {
      setLoading(false);
    }
  }, [sessionId, startSession]);
  
  const renewSession = useCallback(async () => {
    if (!sessionId) return;
    
    const response = await fetch(
      `/api/messaging/sessions/${sessionId}/renew`,
      { method: 'POST' }
    );
    
    const status = await response.json();
    setSessionStatus(status);
    setExpirationWarning(false);
    
    return status;
  }, [sessionId]);
```