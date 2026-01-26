# 5e8c73c1:packages_plugin-bootstrap_src_index.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/index.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            { src: 'plugin:bootstrap', agentId: runtime.agentId, url: attachment.url },
            'Processing plain text document'
          );

          const textContent = await res.text();
          processedAttachment.text = textContent;
          processedAttachment.title = processedAttachment.title || 'Text File';

          runtime.logger.debug(
            {
              src: 'plugin:bootstrap',
              agentId: runtime.agentId,
              textPreview: processedAttachment.text?.substring(0, 100),
            },
            'Extracted text content'
          );
        } else {
          runtime.logger.warn(
            { src: 'plugin:bootstrap', agentId: runtime.agentId, contentType },
            'Skipping non-plain-text document'
          );
        }
      }

      processedAttachments.push(processedAttachment);
    } catch (error) {
      runtime.logger.error(
        {
          src: 'plugin:bootstrap',
          agentId: runtime.agentId,
          attachmentUrl: attachment.url,
          error: error instanceof Error ? error.message : String(error),
        },
        'Failed to process attachment'
      );
      // Add the original attachment if processing fails
      processedAttachments.push(attachment);
    }
  }

  return processedAttachments;
}

/**
 * Determines whether the agent should respond to a message.
 * Uses simple rules for obvious cases (DM, mentions, specific sources) and defers to LLM for ambiguous cases.
 *
 * @returns Object containing:
 *  - shouldRespond: boolean - whether the agent should respond (only relevant if skipEvaluation is true)
 *  - skipEvaluation: boolean - whether we can skip the LLM evaluation (decision made by simple rules)
 *  - reason: string - explanation for debugging
 */
export function shouldRespond(
  runtime: IAgentRuntime,
  message: Memory,
  room?: Room,
  mentionContext?: MentionContext
): { shouldRespond: boolean; skipEvaluation: boolean; reason: string } {
  if (!room) {
    return { shouldRespond: false, skipEvaluation: true, reason: 'no room context' };
  }

  function normalizeEnvList(value: unknown): string[] {
    if (!value || typeof value !== 'string') {
      return [];
    }
    const cleaned = value.trim().replace(/^[\[]|[\]]$/g, '');
    return cleaned
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  // Channel types that always trigger a response (private channels)
  const alwaysRespondChannels = [
    ChannelType.DM,
    ChannelType.VOICE_DM,
    ChannelType.SELF,
    ChannelType.API,
  ];

  // Sources that always trigger a response
  const alwaysRespondSources = ['client_chat'];

  // Support runtime-configurable overrides via env settings
  // Accepts both new and legacy setting names for backwards compatibility
  const customChannels = normalizeEnvList(
    runtime.getSetting('ALWAYS_RESPOND_CHANNELS') ||
      runtime.getSetting('SHOULD_RESPOND_BYPASS_TYPES')
  );
  const customSources = normalizeEnvList(
    runtime.getSetting('ALWAYS_RESPOND_SOURCES') ||
      runtime.getSetting('SHOULD_RESPOND_BYPASS_SOURCES')
  );

  const respondChannels = new Set(
    [...alwaysRespondChannels.map((t) => t.toString()), ...customChannels].map((s: string) =>
      s.trim().toLowerCase()
    )
  );

  const respondSources = [...alwaysRespondSources, ...customSources].map((s: string) =>
    s.trim().toLowerCase()
  );

  const roomType = room.type?.toString().toLowerCase();
  const sourceStr = message.content.source?.toLowerCase() || '';

  // 1. DM/VOICE_DM/API channels: always respond (private channels)
  if (respondChannels.has(roomType)) {
    return { shouldRespond: true, skipEvaluation: true, reason: `private channel: ${roomType}` };
  }

  // 2. Specific sources (e.g., client_chat): always respond
  if (respondSources.some((pattern) => sourceStr.includes(pattern))) {
    return {
      shouldRespond: true,
      skipEvaluation: true,
      reason: `whitelisted source: ${sourceStr}`,
    };
  }

  // 3. Platform mentions and replies: always respond
  // This is the key feature from mentionContext - platform-detected mentions/replies
  const hasPlatformMention = !!(mentionContext?.isMention || mentionContext?.isReply);
  if (hasPlatformMention) {
    const mentionType = mentionContext?.isMention ? 'mention' : 'reply';
    return { shouldRespond: true, skipEvaluation: true, reason: `platform ${mentionType}` };
  }

  // 4. All other cases: let the LLM decide
  // The LLM will handle: text-based name detection, indirect questions, conversation context, etc.
  return { shouldRespond: false, skipEvaluation: false, reason: 'needs LLM evaluation' };
}

/**
 * Handles the receipt of a reaction message and creates a memory in the designated memory manager.
 *
 * @param {Object} params - The parameters for the function.
 * @param {IAgentRuntime} params.runtime - The agent runtime object.
 * @param {Memory} params.message - The reaction message to be stored in memory.
 * @returns {void}
 */
const reactionReceivedHandler = async ({
  runtime,
  message,
}: {
  runtime: IAgentRuntime;
  message: Memory;
}) => {
```