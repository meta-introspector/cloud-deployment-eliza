# a7046c18:packages_core_typescript_src_services_default-message-service.ts:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        if (isPlainText) {
          runtime.logger.debug(
            { src: "service:message", documentUrl: attachment.url },
            "Processing plain text document",
          );

          const textContent = await res.text();
          processedAttachment.text = textContent;
          processedAttachment.title = processedAttachment.title || "Text File";

          runtime.logger.debug(
            {
              src: "service:message",
              textPreview: processedAttachment.text?.substring(0, 100),
            },
            "Extracted text content",
          );
        } else {
          runtime.logger.warn(
            { src: "service:message", contentType },
            "Skipping non-plain-text document",
          );
        }
      }

      processedAttachments.push(processedAttachment);
    }

    return processedAttachments;
  }

  /**
   * Single-shot strategy: one LLM call to generate response
   */
  private async runSingleShotCore(
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    opts: ResolvedMessageOptions,
    responseId: UUID,
  ): Promise<StrategyResult> {
    state = await runtime.composeState(message, ["ACTIONS"]);

    if (!state.values?.actionNames) {
      runtime.logger.warn(
        { src: "service:message" },
        "actionNames data missing from state",
      );
    }

    const prompt = composePromptFromState({
      state,
      template:
        runtime.character.templates?.messageHandlerTemplate ||
        messageHandlerTemplate,
    });

    let responseContent: Content | null = null;

    // Retry if missing required fields
    let retries = 0;

    while (
      retries < opts.maxRetries &&
      (!responseContent?.thought || !responseContent?.actions)
    ) {
      const response = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt,
      });

      runtime.logger.info(
        {
          src: "service:message",
          responseLength: response.length,
          responsePreview: response.substring(0, 500),
        },
        "Raw LLM response received",
      );

      const parsedXml = parseKeyValueXml(response);
      runtime.logger.info(
        {
          src: "service:message",
          parsedXml: parsedXml
            ? {
                hasThought: !!parsedXml.thought,
                thoughtPreview:
                  typeof parsedXml.thought === "string"
                    ? parsedXml.thought.substring(0, 100)
                    : null,
                hasActions: !!parsedXml.actions,
                actions: parsedXml.actions,
                hasText: !!parsedXml.text,
                textPreview:
                  typeof parsedXml.text === "string"
                    ? parsedXml.text.substring(0, 100)
                    : null,
              }
            : null,
        },
        "Parsed XML content",
      );

      if (parsedXml) {
        const thought =
          typeof parsedXml.thought === "string" ? parsedXml.thought : "";
        const actions = Array.isArray(parsedXml.actions)
          ? parsedXml.actions.filter((a): a is string => typeof a === "string")
          : typeof parsedXml.actions === "string"
            ? [parsedXml.actions]
            : ["IGNORE"];
        const providers = Array.isArray(parsedXml.providers)
          ? parsedXml.providers.filter(
              (p): p is string => typeof p === "string",
            )
          : [];
        const text = typeof parsedXml.text === "string" ? parsedXml.text : "";
        const simple =
          typeof parsedXml.simple === "boolean" ? parsedXml.simple : false;

        responseContent = {
          ...parsedXml,
          thought,
          actions,
          providers,
          text,
          simple,
        };
      } else {
        responseContent = null;
        runtime.logger.warn(
          {
            src: "service:message",
            responsePreview: response.substring(0, 300),
          },
          "parseKeyValueXml returned null - XML parsing failed",
        );
      }

      retries++;
      if (!responseContent?.thought || !responseContent?.actions) {
        runtime.logger.warn(
          {
            src: "service:message",
            retries,
            maxRetries: opts.maxRetries,
            hasThought: !!responseContent?.thought,
            hasActions: !!responseContent?.actions,
            actionsValue: responseContent?.actions,
          },
```