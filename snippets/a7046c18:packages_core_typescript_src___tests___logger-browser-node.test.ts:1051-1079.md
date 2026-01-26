# a7046c18:packages_core_typescript_src___tests___logger-browser-node.test.ts:1051-1079

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/logger-browser-node.test.ts:1051-1079
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            info: mock(),
            warn: mock(),
            error: mock(),
            debug: mock(),
            trace: mock(),
          },
        };
        globalThis.document = {};
        delete globalThis.process;

        expect(() => {
          const browserLogger = createLogger({ __forceType: "browser" });
          browserLogger.trace("Browser trace");
          browserLogger.debug("Browser debug");
          browserLogger.info("Browser info");
          browserLogger.warn("Browser warn");
          browserLogger.error("Browser error");
          browserLogger.fatal("Browser fatal");
          browserLogger.success("Browser success");
          browserLogger.progress("Browser progress");
        }).not.toThrow();

        // Clean up
        globalThis.process = savedProcess;
        delete process.env.LOG_JSON_FORMAT;
      });
    });
  });
});
```