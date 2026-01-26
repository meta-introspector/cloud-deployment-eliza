# e5b94879:packages_client_src_lib_utils.ts:151-199

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/client/src/lib/utils.ts:151-199
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```

export function getAttachmentType(contentType: string | undefined): AttachmentType {
  if (!contentType) return 'file';

  if (contentType.startsWith('image/')) return 'image';
  if (contentType.startsWith('audio/')) return 'audio';
  if (contentType.startsWith('video/')) return 'video';
  if (
    contentType === 'application/pdf' ||
    contentType.startsWith('application/msword') ||
    contentType.startsWith('application/vnd.openxmlformats-officedocument') ||
    contentType === 'text/plain'
  ) {
    return 'document';
  }

  return 'file';
}

export const generateGroupName = (
  channel: Partial<ClientMessageChannel> | undefined,
  participants: Partial<Agent>[] | undefined,
  currentUserId: CoreUUID | string | undefined
): string => {
  if (channel?.name && channel.name.trim() !== '') {
    return channel.name;
  }
  if (participants && participants.length > 0) {
    const otherParticipants = participants.filter((p) => p.id !== currentUserId && p.name); // Ensure name exists
    if (
      otherParticipants.length === 0 &&
      participants.some((p) => p.id === currentUserId && p.name)
    ) {
      // If only current user is a participant (and has a name), or no other named participants
      const currentUserParticipant = participants.find((p) => p.id === currentUserId);
      if (currentUserParticipant) return currentUserParticipant.name || 'Unnamed Group';
      return 'Unnamed Group'; // Fallback if current user somehow has no name
    }
    if (otherParticipants.length > 0) {
      return (
        otherParticipants
          .map((p) => p.name)
          .slice(0, 3)
          .join(', ') + (otherParticipants.length > 3 ? '...' : '')
      );
    }
  }
  return 'Unnamed Group';
};
```