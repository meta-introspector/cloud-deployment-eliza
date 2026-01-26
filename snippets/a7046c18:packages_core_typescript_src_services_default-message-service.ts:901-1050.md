# a7046c18:packages_core_typescript_src_services_default-message-service.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/services/default-message-service.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

  /**
   * Processes attachments by generating descriptions for supported media types.
   */
  async processAttachments(
    runtime: IAgentRuntime,
    attachments: Media[],
  ): Promise<Media[]> {
    if (!attachments || attachments.length === 0) {
      return [];
    }
    runtime.logger.debug(
      { src: "service:message", count: attachments.length },
      "Processing attachments",
    );

    const processedAttachments: Media[] = [];

    for (const attachment of attachments) {
      const processedAttachment: Media = { ...attachment };

      const isRemote = /^(http|https):\/\//.test(attachment.url);
      const url = isRemote ? attachment.url : getLocalServerUrl(attachment.url);

      // Only process images that don't already have descriptions
      if (
        attachment.contentType === ContentType.IMAGE &&
        !attachment.description
      ) {
        runtime.logger.debug(
          { src: "service:message", imageUrl: attachment.url },
          "Generating image description",
        );

        let imageUrl = url;

        if (!isRemote) {
          // Convert local/internal media to base64
          const res = await fetch(url);
          if (!res.ok)
            throw new Error(`Failed to fetch image: ${res.statusText}`);

          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType =
            res.headers.get("content-type") || "application/octet-stream";
          imageUrl = `data:${contentType};base64,${buffer.toString("base64")}`;
        }

        const response = await runtime.useModel(ModelType.IMAGE_DESCRIPTION, {
          prompt: imageDescriptionTemplate,
          imageUrl,
        });

        if (typeof response === "string") {
          const parsedXml = parseKeyValueXml(response);

          if (parsedXml && (parsedXml.description || parsedXml.text)) {
            processedAttachment.description =
              (typeof parsedXml.description === "string"
                ? parsedXml.description
                : "") || "";
            processedAttachment.title =
              (typeof parsedXml.title === "string"
                ? parsedXml.title
                : "Image") || "Image";
            processedAttachment.text =
              (typeof parsedXml.text === "string" ? parsedXml.text : "") ||
              (typeof parsedXml.description === "string"
                ? parsedXml.description
                : "") ||
              "";

            runtime.logger.debug(
              {
                src: "service:message",
                descriptionPreview: processedAttachment.description?.substring(
                  0,
                  100,
                ),
              },
              "Generated image description",
            );
          } else {
            // Fallback: Try simple regex parsing
            const responseStr = response as string;
            const titleMatch = responseStr.match(/<title>([^<]+)<\/title>/);
            const descMatch = responseStr.match(
              /<description>([^<]+)<\/description>/,
            );
            const textMatch = responseStr.match(/<text>([^<]+)<\/text>/);

            if (titleMatch || descMatch || textMatch) {
              processedAttachment.title = titleMatch?.[1] || "Image";
              processedAttachment.description = descMatch?.[1] || "";
              processedAttachment.text = textMatch?.[1] || descMatch?.[1] || "";

              runtime.logger.debug(
                {
                  src: "service:message",
                  descriptionPreview:
                    processedAttachment.description?.substring(0, 100),
                },
                "Used fallback XML parsing for description",
              );
            } else {
              runtime.logger.warn(
                { src: "service:message" },
                "Failed to parse XML response for image description",
              );
            }
          }
        } else if (
          response &&
          typeof response === "object" &&
          "description" in response
        ) {
          // Handle object responses for backwards compatibility
          const objResponse = response as ImageDescriptionResponse;
          processedAttachment.description = objResponse.description;
          processedAttachment.title = objResponse.title || "Image";
          processedAttachment.text = objResponse.description;

          runtime.logger.debug(
            {
              src: "service:message",
              descriptionPreview: processedAttachment.description?.substring(
                0,
                100,
              ),
            },
            "Generated image description",
          );
        } else {
          runtime.logger.warn(
            { src: "service:message" },
            "Unexpected response format for image description",
          );
        }
      } else if (
        attachment.contentType === ContentType.DOCUMENT &&
        !attachment.text
      ) {
        const res = await fetch(url);
        if (!res.ok)
          throw new Error(`Failed to fetch document: ${res.statusText}`);

        const contentType = res.headers.get("content-type") || "";
        const isPlainText = contentType.startsWith("text/plain");

```