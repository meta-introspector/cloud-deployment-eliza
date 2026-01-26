# 5e8c73c1:packages_server_src___tests___test-utils_mocks.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/test-utils/mocks.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

    ...overrides,
  };

  return baseAdapter as any;
}

/**
 * Creates a mock Express Request
 */
export function createMockRequest(overrides?: Partial<Request>): Request {
  return {
    params: {},
    query: {},
    body: {},
    headers: {},
    method: 'GET',
    originalUrl: '/test',
    url: '/test',
    path: '/test',
    ip: '127.0.0.1',
    get: jest.fn((_header: string) => ''),
    header: jest.fn((_header: string) => ''),
    accepts: jest.fn(),
    acceptsCharsets: jest.fn(),
    acceptsEncodings: jest.fn(),
    acceptsLanguages: jest.fn(),
    is: jest.fn(),
    ...overrides,
  } as any;
}

/**
 * Creates a mock Express Response
 */
export function createMockResponse(): Response {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    removeHeader: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    header: jest.fn().mockReturnThis(),
    type: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    attachment: jest.fn().mockReturnThis(),
    sendFile: jest.fn((_path: string, options?: any, callback?: any) => {
      if (typeof options === 'function') {
        callback = options;
      }
      if (callback) {
        callback();
      }
    }),
    headersSent: false,
    locals: {},
  };

  return res as any;
}

/**
 * Creates a mock Express NextFunction
 */
export function createMockNext(): NextFunction {
  return jest.fn() as any;
}

/**
 * Creates a mock Socket.IO Server
 */
export function createMockSocketIO() {
  return {
    on: jest.fn(),
    emit: jest.fn(),
    to: jest.fn(() => ({
      emit: jest.fn(),
    })),
    sockets: {
      sockets: new Map(),
    },
    close: jest.fn((callback?: () => void) => {
      if (callback) {
        callback();
      }
    }),
  };
}

/**
 * Creates a mock HTTP Server
 */
export function createMockHttpServer() {
  return {
    listen: jest.fn((_port: number, callback?: () => void) => {
      if (callback) {
        callback();
      }
    }),
    close: jest.fn((callback?: () => void) => {
      if (callback) {
        callback();
      }
    }),
    listeners: jest.fn(() => []),
    removeAllListeners: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    emit: jest.fn(),
    address: jest.fn(() => ({ port: 3000 })),
    timeout: 0,
    keepAliveTimeout: 5000,
  };
}

/**
 * Creates a mock Service
 */
export function createMockService(overrides?: Partial<Service>): Service {
  return {
    name: 'MockService',
    description: 'A mock service for testing',
    serviceType: ServiceType.WEB_SEARCH,
    getInstance: jest.fn(),
    start: jest.fn(() => Promise.resolve()),
    stop: jest.fn(() => Promise.resolve()),
    ...overrides,
  } as any;
}

/**
 * Creates mock multer file
 */
export function createMockUploadedFile(
  overrides?: Partial<Express.Multer.File>
): Express.Multer.File {
  return {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 12345,
    stream: undefined as any,
    destination: '',
```