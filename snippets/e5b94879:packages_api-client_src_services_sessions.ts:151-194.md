# e5b94879:packages_api-client_src_services_sessions.ts:151-194

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/api-client/src/services/sessions.ts:151-194
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
   */
  async getMessages(sessionId: string, params?: GetMessagesParams): Promise<GetMessagesResponse> {
    validateRequiredParam(sessionId, 'sessionId');

    const queryParams: SessionMessageQueryParams = {};

    if (params?.limit) {
      queryParams.limit = params.limit.toString();
    }

    // Convert date parameters with validation
    const beforeTimestamp = toTimestampString(params?.before, 'before');
    if (beforeTimestamp) {
      queryParams.before = beforeTimestamp;
    }

    const afterTimestamp = toTimestampString(params?.after, 'after');
    if (afterTimestamp) {
      queryParams.after = afterTimestamp;
    }

    return this.get<GetMessagesResponse>(`/api/messaging/sessions/${sessionId}/messages`, {
      params: queryParams,
    });
  }

  /**
   * Delete a session
   * @param sessionId Session ID
   * @returns Success response
   */
  async deleteSession(sessionId: string): Promise<{ success: boolean }> {
    validateRequiredParam(sessionId, 'sessionId');
    return this.delete<{ success: boolean }>(`/api/messaging/sessions/${sessionId}`);
  }

  /**
   * List all active sessions (admin endpoint)
   * @returns List of active sessions
   */
  async listSessions(): Promise<ListSessionsResponse> {
    return this.get<ListSessionsResponse>('/api/messaging/sessions');
  }
}
```