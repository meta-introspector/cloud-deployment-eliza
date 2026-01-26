# a7046c18:packages_docs_runtime_sessions-api.mdx:1801-1950

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/sessions-api.mdx:1801-1950
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  constructor(private baseUrl: string = 'http://localhost:3000') {}
  
  async createSession(agentId: string, userId: string, config?: SessionTimeoutConfig) {
    const response = await fetch(`${this.baseUrl}/api/messaging/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, userId, timeoutConfig: config })
    });
    
    if (!response.ok) throw new Error(`Failed to create session: ${response.status}`);
    return response.json();
  }
  
  async sendMessage(sessionId: string, content: string, metadata?: object) {
    const response = await fetch(
      `${this.baseUrl}/api/messaging/sessions/${sessionId}/messages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, metadata })
      }
    );
    
    if (!response.ok) throw new Error(`Failed to send message: ${response.status}`);
    return response.json();
  }
  
  async getMessages(sessionId: string, limit = 50, before?: number) {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (before) params.append('before', before.toString());
    
    const response = await fetch(
      `${this.baseUrl}/api/messaging/sessions/${sessionId}/messages?${params}`
    );
    
    if (!response.ok) throw new Error(`Failed to get messages: ${response.status}`);
    return response.json();
  }
  
  async renewSession(sessionId: string) {
    const response = await fetch(
      `${this.baseUrl}/api/messaging/sessions/${sessionId}/renew`,
      { method: 'POST' }
    );
    
    if (!response.ok) throw new Error(`Failed to renew session: ${response.status}`);
    return response.json();
  }
  
  async sendHeartbeat(sessionId: string) {
    const response = await fetch(
      `${this.baseUrl}/api/messaging/sessions/${sessionId}/heartbeat`,
      { method: 'POST' }
    );
    
    if (!response.ok) throw new Error(`Heartbeat failed: ${response.status}`);
    return response.json();
  }
}
```

#### Python Client

```python
import requests
from typing import Optional, Dict, Any

class SessionsAPIClient:
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def create_session(
        self, 
        agent_id: str, 
        user_id: str,
        timeout_config: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a new session with an agent."""
        payload = {
            "agentId": agent_id,
            "userId": user_id
        }
        
        if timeout_config:
            payload["timeoutConfig"] = timeout_config
        
        response = self.session.post(
            f"{self.base_url}/api/messaging/sessions",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    def send_message(
        self,
        session_id: str,
        content: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Send a message in a session."""
        payload = {"content": content}
        
        if metadata:
            payload["metadata"] = metadata
        
        response = self.session.post(
            f"{self.base_url}/api/messaging/sessions/{session_id}/messages",
            json=payload
        )
        response.raise_for_status()
        return response.json()
    
    def get_messages(
        self,
        session_id: str,
        limit: int = 50,
        before: Optional[int] = None,
        after: Optional[int] = None
    ) -> Dict[str, Any]:
        """Retrieve messages from a session."""
        params = {"limit": str(limit)}
        
        if before:
            params["before"] = str(before)
        if after:
            params["after"] = str(after)
        
        response = self.session.get(
            f"{self.base_url}/api/messaging/sessions/{session_id}/messages",
            params=params
        )
        response.raise_for_status()
        return response.json()
    
    def renew_session(self, session_id: str) -> Dict[str, Any]:
        """Manually renew a session."""
        response = self.session.post(
            f"{self.base_url}/api/messaging/sessions/{session_id}/renew"
        )
        response.raise_for_status()
        return response.json()
    
    def send_heartbeat(self, session_id: str) -> Dict[str, Any]:
        """Send a heartbeat to keep session alive."""
        response = self.session.post(
            f"{self.base_url}/api/messaging/sessions/{session_id}/heartbeat"
        )
        response.raise_for_status()
        return response.json()
```