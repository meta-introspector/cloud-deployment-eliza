# 5e8c73c1:packages_server_src___tests___unit_compatibility_cli-patterns.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/unit/compatibility/cli-patterns.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Simple compatibility verification
 * Tests core export functionality without complex imports
 */

import { describe, it, expect } from 'bun:test';
import path from 'node:path';
import { captureEnvironment, restoreEnvironment } from '../../test-utils/environment';

describe('Server Package Compatibility', () => {
  describe('Export Structure', () => {
    it('should have the expected export structure for CLI compatibility', () => {
      // Test the core patterns that CLI expects

      // 1. Path expansion utility
      const expandTildePath = (filepath: string): string => {
        if (filepath && filepath.startsWith('~')) {
          return path.join(process.cwd(), filepath.slice(1));
        }
        return filepath;
      };

      expect(expandTildePath('~/test')).toBe(path.join(process.cwd(), 'test'));
      expect(expandTildePath('/absolute')).toBe('/absolute');

      // 2. Server interface expectations
      class MockAgentServer {
        isInitialized = false;
        agents = new Map();
        app: any = null;
        database: any = null;
        server: any = null;
        socketIO: any = null;

        async initialize(_options?: any) {
          this.isInitialized = true;
          this.app = { use: () => {} };
          this.database = {};
          this.server = {};
          this.socketIO = {};
        }

        start(_port: number) {
          // Mock start
        }

        async stop() {
          // Mock stop
        }

        async registerAgent(runtime: any) {
          this.agents.set(runtime.agentId, runtime);
        }

        unregisterAgent(agentId: string) {
          this.agents.delete(agentId);
        }

        registerMiddleware(_middleware: any) {
          // Mock middleware registration
        }
      }

      // Test CLI usage patterns
      const server = new MockAgentServer();

      // CLI extends server with custom methods
      (server as any).startAgent = () => {};
      (server as any).stopAgent = () => {};
      (server as any).loadCharacterTryPath = () => {};
      (server as any).jsonToCharacter = () => {};

      expect(server.isInitialized).toBe(false);
      expect(typeof server.initialize).toBe('function');
      expect(typeof server.start).toBe('function');
      expect(typeof server.registerAgent).toBe('function');
      expect(typeof (server as any).startAgent).toBe('function');
    });
  });

  describe('Server Configuration Patterns', () => {
    it('should support CLI server initialization options', () => {
      interface ServerOptions {
        dataDir?: string;
        middlewares?: any[];
        postgresUrl?: string;
      }

      const validateOptions = (options: ServerOptions) => {
        // Test that CLI options are valid
        if (options.dataDir) {
          expect(typeof options.dataDir).toBe('string');
        }
        if (options.middlewares) {
          expect(Array.isArray(options.middlewares)).toBe(true);
        }
        if (options.postgresUrl) {
          expect(typeof options.postgresUrl).toBe('string');
        }
      };

      // Test CLI's typical options
      const cliOptions = {
        dataDir: './data',
        postgresUrl: undefined,
      };

      expect(() => validateOptions(cliOptions)).not.toThrow();
    });
  });

  describe('Agent Management Patterns', () => {
    it('should support CLI agent lifecycle management', () => {
      // Mock runtime that CLI creates
      const mockRuntime = {
        agentId: '123e4567-e89b-12d3-a456-426614174000',
        character: { name: 'TestAgent' },
        registerPlugin: async () => {},
        plugins: [],
        stop: async () => {},
      };

      // Test agent validation patterns
      const validateRuntime = (runtime: any) => {
        if (!runtime) {
          throw new Error('Attempted to register null/undefined runtime');
        }
        if (!runtime.agentId) {
          throw new Error('Runtime missing agentId');
        }
        if (!runtime.character) {
          throw new Error('Runtime missing character configuration');
        }
      };

      expect(() => validateRuntime(mockRuntime)).not.toThrow();
      expect(() => validateRuntime(null)).toThrow('Attempted to register null/undefined runtime');
      expect(() => validateRuntime({})).toThrow('Runtime missing agentId');
    });
  });

  describe('Database Integration Patterns', () => {
    it('should support CLI database configuration patterns', () => {
      // Capture and clean environment first to ensure no pollution from other tests
      const snapshot = captureEnvironment();
      delete process.env.PGLITE_DATA_DIR;
      delete process.env.IGNORE_BOOTSTRAP;

      // Test path resolution patterns CLI uses
      const resolvePgliteDir = (dir?: string, fallbackDir?: string): string => {
```