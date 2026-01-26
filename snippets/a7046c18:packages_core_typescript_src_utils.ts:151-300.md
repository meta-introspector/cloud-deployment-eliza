# a7046c18:packages_core_typescript_src_utils.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/utils.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 *
 * @param {string} header - The header to add to the body.
 * @param {string} body - The body to which to add the header.
 * @returns {string} The body with the header prepended.
 *
 * @example
 * // Given a header and a body
 * const header = "Header";
 * const body = "Body";
 *
 * // Adding the header to the body will result in:
 * // "Header\nBody"
 * const text = addHeader(header, body);
 */
export const addHeader = (header: string, body: string) => {
  return body.length > 0 ? `${header ? `${header}\n` : header}${body}\n` : "";
};

/**
 * Generates a string with random user names populated in a template.
 *
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
    uniqueNamesGenerator({ dictionaries: [names] }),
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
      (messagesA[messagesA.length - 1]?.createdAt || 0),
  );

  const formattedPosts = sortedRooms.map(([roomId, roomMessages]) => {
    const messageStrings = roomMessages
      .filter((message: Memory) => message.entityId)
      .map((message: Memory) => {
        const entity = entities.find(
          (entity: Entity) => entity.id === message.entityId,
        );
        if (!entity) {
          logger.warn(
            { src: "core:utils", entityId: message.entityId },
            "No entity found for message",
          );
        }
        const userName = entity?.names[0] || "Unknown User";
        const displayName = entity?.names[0] || "unknown";

        return `Name: ${userName} (@${displayName} EntityID:${message.entityId})
MessageID: ${message.id}${message.content.inReplyTo ? `\nIn reply to: ${message.content.inReplyTo}` : ""}
Source: ${message.content.source}
Date: ${formatTimestamp(message.createdAt || 0)}
Text:
${message.content.text}`;
      });

    const header = conversationHeader
      ? `Conversation: ${roomId.slice(-5)}\n`
      : "";
    return `${header}${messageStrings.join("\n\n")}`;
  });

  return formattedPosts.join("\n\n");
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
        entities.find((entity: Entity) => entity.id === message.entityId)
          ?.names[0] || "Unknown User";

      const attachments = (message.content as Content).attachments;

      const attachmentString =
        attachments && attachments.length > 0
          ? ` (Attachments: ${attachments
              .map((media) => {
                const lines = [`[${media.id} - ${media.title} (${media.url})]`];
                if (media.text) lines.push(`Text: ${media.text}`);
                if (media.description)
```