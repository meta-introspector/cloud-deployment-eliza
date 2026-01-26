# 5e8c73c1:packages_server_src___tests___test-utils_mocks.ts:451-494

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/test-utils/mocks.ts:451-494
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    filename: '',
    path: '',
    ...overrides,
  };
}

/**
 * Creates a mock fetch Response
 * Provides a properly typed Response mock for testing fetch calls
 */
export function createMockFetchResponse<T = any>(options: {
  ok?: boolean;
  status?: number;
  statusText?: string;
  data?: T;
  jsonError?: Error;
}) {
  const { ok = true, status = 200, statusText = 'OK', data, jsonError } = options;

  const mockResponse: Partial<globalThis.Response> = {
    ok,
    status,
    statusText,
    json: async () => {
      if (jsonError) {
        throw jsonError;
      }
      return data;
    },
    text: async () => JSON.stringify(data),
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: jest.fn() as any,
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData(),
  };

  return mockResponse as globalThis.Response;
}
```