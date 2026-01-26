# 5e8c73c1:packages_core_src_services_default-message-service.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/services/default-message-service.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    if (respondSources.some((pattern) => sourceStr.includes(pattern))) {
      return {
        shouldRespond: true,
        skipEvaluation: true,
        reason: `whitelisted source: ${sourceStr}`,
      };
    }

    // 3. Platform mentions and replies: always respond
    const hasPlatformMention = !!(mentionContext?.isMention || mentionContext?.isReply);
    if (hasPlatformMention) {
      const mentionType = mentionContext?.isMention ? 'mention' : 'reply';
      return { shouldRespond: true, skipEvaluation: true, reason: `platform ${mentionType}` };
    }

    // 4. All other cases: let the LLM decide
    return { shouldRespond: false, skipEvaluation: false, reason: 'needs LLM evaluation' };
  }

  /**
   * Processes attachments by generating descriptions for supported media types.
   */
  async processAttachments(runtime: IAgentRuntime, attachments: Media[]): Promise<Media[]> {
    if (!attachments || attachments.length === 0) {
      return [];
    }
    runtime.logger.debug(
      { src: 'service:message', count: attachments.length },
      'Processing attachments'
    );

    const processedAttachments: Media[] = [];

    for (const attachment of attachments) {
      const processedAttachment: Media = { ...attachment };

      const isRemote = /^(http|https):\/\//.test(attachment.url);
      const url = isRemote ? attachment.url : getLocalServerUrl(attachment.url);

      // Only process images that don't already have descriptions
      if (attachment.contentType === ContentType.IMAGE && !attachment.description) {
        runtime.logger.debug(
          { src: 'service:message', imageUrl: attachment.url },
          'Generating image description'
        );

        let imageUrl = url;

        if (!isRemote) {
          // Convert local/internal media to base64
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);

          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType = res.headers.get('content-type') || 'application/octet-stream';
          imageUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
        }

        const response = await runtime.useModel(ModelType.IMAGE_DESCRIPTION, {
          prompt: imageDescriptionTemplate,
          imageUrl,
        });

        if (typeof response === 'string') {
          const parsedXml = parseKeyValueXml(response);

          if (parsedXml && (parsedXml.description || parsedXml.text)) {
            processedAttachment.description =
              (typeof parsedXml.description === 'string' ? parsedXml.description : '') || '';
            processedAttachment.title =
              (typeof parsedXml.title === 'string' ? parsedXml.title : 'Image') || 'Image';
            processedAttachment.text =
              (typeof parsedXml.text === 'string' ? parsedXml.text : '') ||
              (typeof parsedXml.description === 'string' ? parsedXml.description : '') ||
              '';

            runtime.logger.debug(
              {
                src: 'service:message',
                descriptionPreview: processedAttachment.description?.substring(0, 100),
              },
              'Generated image description'
            );
          } else {
            // Fallback: Try simple regex parsing
            const responseStr = response as string;
            const titleMatch = responseStr.match(/<title>([^<]+)<\/title>/);
            const descMatch = responseStr.match(/<description>([^<]+)<\/description>/);
            const textMatch = responseStr.match(/<text>([^<]+)<\/text>/);

            if (titleMatch || descMatch || textMatch) {
              processedAttachment.title = titleMatch?.[1] || 'Image';
              processedAttachment.description = descMatch?.[1] || '';
              processedAttachment.text = textMatch?.[1] || descMatch?.[1] || '';

              runtime.logger.debug(
                {
                  src: 'service:message',
                  descriptionPreview: processedAttachment.description?.substring(0, 100),
                },
                'Used fallback XML parsing for description'
              );
            } else {
              runtime.logger.warn(
                { src: 'service:message' },
                'Failed to parse XML response for image description'
              );
            }
          }
        } else if (response && typeof response === 'object' && 'description' in response) {
          // Handle object responses for backwards compatibility
          const objResponse = response as ImageDescriptionResponse;
          processedAttachment.description = objResponse.description;
          processedAttachment.title = objResponse.title || 'Image';
          processedAttachment.text = objResponse.description;

          runtime.logger.debug(
            {
              src: 'service:message',
              descriptionPreview: processedAttachment.description?.substring(0, 100),
            },
            'Generated image description'
          );
        } else {
          runtime.logger.warn(
            { src: 'service:message' },
            'Unexpected response format for image description'
          );
        }
      } else if (attachment.contentType === ContentType.DOCUMENT && !attachment.text) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch document: ${res.statusText}`);

        const contentType = res.headers.get('content-type') || '';
        const isPlainText = contentType.startsWith('text/plain');

        if (isPlainText) {
          runtime.logger.debug(
            { src: 'service:message', documentUrl: attachment.url },
            'Processing plain text document'
          );

          const textContent = await res.text();
          processedAttachment.text = textContent;
          processedAttachment.title = processedAttachment.title || 'Text File';

          runtime.logger.debug(
            { src: 'service:message', textPreview: processedAttachment.text?.substring(0, 100) },
            'Extracted text content'
```