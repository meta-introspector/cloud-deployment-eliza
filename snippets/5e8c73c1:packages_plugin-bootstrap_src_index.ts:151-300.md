# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      //   return { data: mediaBuffer, mediaType };
      // }
      throw new Error(`File not found: ${attachment.url}. Make sure the path is correct.`);
    })
  );
}

/**
 * Processes attachments by generating descriptions for supported media types.
 * Currently supports image description generation.
 *
 * @param {Media[]} attachments - Array of attachments to process
 * @param {IAgentRuntime} runtime - The agent runtime for accessing AI models
 * @returns {Promise<Media[]>} - Returns a new array of processed attachments with added description, title, and text properties
 */
export async function processAttachments(
  attachments: Media[],
  runtime: IAgentRuntime
): Promise<Media[]> {
  if (!attachments || attachments.length === 0) {
    return [];
  }
  runtime.logger.debug(
    { src: 'plugin:bootstrap', agentId: runtime.agentId, count: attachments.length },
    'Processing attachments'
  );

  const processedAttachments: Media[] = [];

  for (const attachment of attachments) {
    try {
      // Start with the original attachment
      const processedAttachment: Media = { ...attachment };

      const isRemote = /^(http|https):\/\//.test(attachment.url);
      const url = isRemote ? attachment.url : getLocalServerUrl(attachment.url);
      // Only process images that don't already have descriptions
      if (attachment.contentType === ContentType.IMAGE && !attachment.description) {
        runtime.logger.debug(
          { src: 'plugin:bootstrap', agentId: runtime.agentId, url: attachment.url },
          'Generating description for image'
        );

        let imageUrl = url;

        if (!isRemote) {
          // Only convert local/internal media to base64
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`Failed to fetch image: ${res.statusText}`);
          }

          const arrayBuffer = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType = res.headers.get('content-type') || 'application/octet-stream';
          imageUrl = `data:${contentType};base64,${buffer.toString('base64')}`;
        }

        try {
          const response = await runtime.useModel(ModelType.IMAGE_DESCRIPTION, {
            prompt: imageDescriptionTemplate,
            imageUrl,
          });

          if (typeof response === 'string') {
            // Parse XML response
            const parsedXml = parseKeyValueXml<ImageDescriptionXml>(response);

            if (parsedXml && (parsedXml.description || parsedXml.text)) {
              processedAttachment.description = parsedXml.description ?? '';
              processedAttachment.title = parsedXml.title ?? 'Image';
              processedAttachment.text = parsedXml.text ?? parsedXml.description ?? '';

              runtime.logger.debug(
                {
                  src: 'plugin:bootstrap',
                  agentId: runtime.agentId,
                  descriptionPreview: processedAttachment.description?.substring(0, 100),
                },
                'Generated description'
              );
            } else {
              // Fallback: Try simple regex parsing if parseKeyValueXml fails
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
                    src: 'plugin:bootstrap',
                    agentId: runtime.agentId,
                    descriptionPreview: processedAttachment.description?.substring(0, 100),
                  },
                  'Used fallback XML parsing'
                );
              } else {
                runtime.logger.warn(
                  { src: 'plugin:bootstrap', agentId: runtime.agentId },
                  'Failed to parse XML response for image description'
                );
              }
            }
          } else if (response && typeof response === 'object' && 'description' in response) {
            // Handle object responses for backwards compatibility
            processedAttachment.description = response.description;
            processedAttachment.title = response.title || 'Image';
            processedAttachment.text = response.description;

            runtime.logger.debug(
              {
                src: 'plugin:bootstrap',
                agentId: runtime.agentId,
                descriptionPreview: processedAttachment.description?.substring(0, 100),
              },
              'Generated description'
            );
          } else {
            runtime.logger.warn(
              { src: 'plugin:bootstrap', agentId: runtime.agentId },
              'Unexpected response format for image description'
            );
          }
        } catch (error) {
          runtime.logger.error(
            {
              src: 'plugin:bootstrap',
              agentId: runtime.agentId,
              error: error instanceof Error ? error.message : String(error),
            },
            'Error generating image description'
          );
          // Continue processing without description
        }
      } else if (attachment.contentType === ContentType.DOCUMENT && !attachment.text) {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch document: ${res.statusText}`);
        }

        const contentType = res.headers.get('content-type') || '';
        const isPlainText = contentType.startsWith('text/plain');

        if (isPlainText) {
          runtime.logger.debug(
```