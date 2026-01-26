# a69475c0:packages_core_src_utils.ts:151-300

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils.ts:151-300
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
 * This function generates random user names and populates placeholders
 * in the provided template with these names. Placeholders in the template should follow the format `{{userX}}`
 * where `X` is the position of the user (e.g., `{{name1}}`, `{{name2}}`).
 *
 * @param {string} template - The template string containing placeholders for random user names.
 * @param {number} length - The number of random user names to generate.
 * @returns {string} The template string with placeholders replaced by random user names.
 *
 * @example
 * // Given a template and a length
 * const template = "Hello, {{name1}}! Meet {{name2}} and {{name3}}.";
 * const length = 3;
 *
 * // Composing the random user string will result in:
 * // "Hello, John! Meet Alice and Bob."
 * const result = composeRandomUser(template, length);
 */
const composeRandomUser = (template: string, length: number) => {
  const exampleNames = Array.from({ length }, () =>
    uniqueNamesGenerator({ dictionaries: [names] })
  );
  let result = template;
  for (let i = 0; i < exampleNames.length; i++) {
    result = result.replaceAll(`{{name${i + 1}}}`, exampleNames[i]);
  }

  return result;
};

export const formatPosts = ({
  messages,
  entities,
  conversationHeader = true,
}: {
  messages: Memory[];
  entities: Entity[];
  conversationHeader?: boolean;
}) => {
  // Group messages by roomId
  const groupedMessages: { [roomId: string]: Memory[] } = {};
  messages.forEach((message) => {
    if (message.roomId) {
      if (!groupedMessages[message.roomId]) {
        groupedMessages[message.roomId] = [];
      }
      groupedMessages[message.roomId].push(message);
    }
  });

  // Sort messages within each roomId by createdAt (oldest to newest)
  Object.values(groupedMessages).forEach((roomMessages) => {
    roomMessages.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  });

  // Sort rooms by the newest message's createdAt
  const sortedRooms = Object.entries(groupedMessages).sort(
    ([, messagesA], [, messagesB]) =>
      (messagesB[messagesB.length - 1]?.createdAt || 0) -
      (messagesA[messagesA.length - 1]?.createdAt || 0)
  );

  const formattedPosts = sortedRooms.map(([roomId, roomMessages]) => {
    const messageStrings = roomMessages
      .filter((message: Memory) => message.entityId)
      .map((message: Memory) => {
        const entity = entities.find((entity: Entity) => entity.id === message.entityId);
        if (!entity) {
          logger.warn(
            { src: 'core:utils', entityId: message.entityId },
            'No entity found for message'
          );
        }
        const userName = entity?.names[0] || 'Unknown User';
        const displayName = entity?.names[0] || 'unknown';

        return `Name: ${userName} (@${displayName} EntityID:${message.entityId})
MessageID: ${message.id}${message.content.inReplyTo ? `\nIn reply to: ${message.content.inReplyTo}` : ''}
Source: ${message.content.source}
Date: ${formatTimestamp(message.createdAt || 0)}
Text:
${message.content.text}`;
      });

    const header = conversationHeader ? `Conversation: ${roomId.slice(-5)}\n` : '';
    return `${header}${messageStrings.join('\n\n')}`;
  });

  return formattedPosts.join('\n\n');
};

/**
 * Format messages into a string
 * @param {Object} params - The formatting parameters
 * @param {Memory[]} params.messages - List of messages to format
 * @param {Entity[]} params.entities - List of entities for name resolution
 * @returns {string} Formatted message string with timestamps and user information
 */
export const formatMessages = ({
  messages,
  entities,
}: {
  messages: Memory[];
  entities: Entity[];
}) => {
  const messageStrings = messages
    .reverse()
    .filter((message: Memory) => message.entityId)
    .map((message: Memory) => {
      const messageText = (message.content as Content).text;

      const messageActions = (message.content as Content).actions;
      const messageThought = (message.content as Content).thought;
      const formattedName =
        entities.find((entity: Entity) => entity.id === message.entityId)?.names[0] ||
        'Unknown User';

      const attachments = (message.content as Content).attachments;

      const attachmentString =
        attachments && attachments.length > 0
          ? ` (Attachments: ${attachments
              .map((media) => {
                const lines = [`[${media.id} - ${media.title} (${media.url})]`];
                if (media.text) lines.push(`Text: ${media.text}`);
                if (media.description) lines.push(`Description: ${media.description}`);
                return lines.join('\n');
              })
              .join(
                // Use comma separator only if all attachments are single-line (no text/description)
                attachments.every((media) => !media.text && !media.description) ? ', ' : '\n'
              )})`
          : null;

      const messageTime = new Date(message.createdAt || 0);
      const hours = messageTime.getHours().toString().padStart(2, '0');
      const minutes = messageTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      const timestamp = formatTimestamp(message.createdAt || 0);

      // const shortId = message.entityId.slice(-5);

      const thoughtString = messageThought
        ? `(${formattedName}'s internal thought: ${messageThought})`
        : null;

      const timestampString = `${timeString} (${timestamp}) [${message.entityId}]`;
      const textString = messageText ? `${timestampString} ${formattedName}: ${messageText}` : null;
      const actionString =
        messageActions && messageActions.length > 0
```