# a7046c18:packages_core_typescript_src_services_default-message-service.ts:1351-1500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:1351-1500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          "No providers or action specified, forcing completion",
        );
        break;
      }

      // Total timeout for all providers running in parallel (configurable via PROVIDERS_TOTAL_TIMEOUT_MS env var)
      // Since providers run in parallel, this is the max wall-clock time allowed
      const PROVIDERS_TOTAL_TIMEOUT_MS = parseInt(
        String(runtime.getSetting("PROVIDERS_TOTAL_TIMEOUT_MS") || "1000"),
        10,
      );

      // Track which providers have completed (for timeout diagnostics)
      const completedProviders = new Set<string>();

      const providerPromises = providersArray
        .filter((name): name is string => typeof name === "string")
        .map(async (providerName) => {
          const provider = runtime.providers.find(
            (p) => p.name === providerName,
          );
          if (!provider) {
            runtime.logger.warn(
              { src: "service:message", providerName },
              "Provider not found",
            );
            completedProviders.add(providerName);
            return {
              providerName,
              success: false,
              error: `Provider not found: ${providerName}`,
            };
          }

          try {
            const providerResult = await provider.get(runtime, message, state);
            completedProviders.add(providerName);

            if (!providerResult) {
              runtime.logger.warn(
                { src: "service:message", providerName },
                "Provider returned no result",
              );
              return {
                providerName,
                success: false,
                error: "Provider returned no result",
              };
            }

            const success = !!providerResult.text;
            return {
              providerName,
              success,
              text: success ? providerResult.text : undefined,
              error: success ? undefined : "Provider returned no result",
            };
          } catch (err) {
            completedProviders.add(providerName);
            const errorMsg = err instanceof Error ? err.message : String(err);
            runtime.logger.error(
              { src: "service:message", providerName, error: errorMsg },
              "Provider execution failed",
            );
            return { providerName, success: false, error: errorMsg };
          }
        });

      // Create timeout promise for provider execution (with cleanup)
      let timeoutId: ReturnType<typeof setTimeout>;
      const timeoutPromise = new Promise<"timeout">((resolve) => {
        timeoutId = setTimeout(
          () => resolve("timeout"),
          PROVIDERS_TOTAL_TIMEOUT_MS,
        );
      });

      // Race between all providers completing and timeout
      const allProvidersPromise = Promise.allSettled(providerPromises);
      const raceResult = await Promise.race([
        allProvidersPromise,
        timeoutPromise,
      ]);

      // Clear timeout if providers completed first
      clearTimeout(timeoutId!);

      // Check if providers took too long - abort pipeline and notify user
      if (raceResult === "timeout") {
        // Identify which providers were still pending when timeout hit
        const allProviderNames = providersArray.filter(
          (name): name is string => typeof name === "string",
        );
        const pendingProviders = allProviderNames.filter(
          (name) => !completedProviders.has(name),
        );

        runtime.logger.error(
          {
            src: "service:message",
            timeoutMs: PROVIDERS_TOTAL_TIMEOUT_MS,
            pendingProviders,
            completedProviders: Array.from(completedProviders),
          },
          `Providers took too long (>${PROVIDERS_TOTAL_TIMEOUT_MS}ms) - slow providers: ${pendingProviders.join(", ")}`,
        );

        if (callback) {
          await callback({
            text: "Providers took too long to respond. Please optimize your providers or use caching.",
            actions: [],
            thought: "Provider timeout - pipeline aborted",
          });
        }

        return {
          responseContent: null,
          responseMessages: [],
          state,
          mode: "none",
        };
      }

      // Providers completed in time
      const providerResults = raceResult;

      // Process results and notify via callback
      for (const result of providerResults) {
        if (result.status === "fulfilled") {
          const { providerName, success, text, error } = result.value;
          traceActionResult.push({
            data: { actionName: providerName },
            success,
            text,
            error,
          });

          if (callback) {
            await callback({
              text: `🔎 Provider executed: ${providerName}`,
              actions: [providerName],
              thought: typeof thought === "string" ? thought : "",
            });
          }
        } else {
          runtime.logger.error(
            {
              src: "service:message",
              error: result.reason || "Unknown provider failure",
            },
```