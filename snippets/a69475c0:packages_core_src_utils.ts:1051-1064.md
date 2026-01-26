# a69475c0:packages_core_src_utils.ts:1051-1064

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/utils.ts:1051-1064
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
export const getContentTypeFromMimeType = (mimeType: string): ContentType | undefined => {
  if (mimeType.startsWith('image/')) return ContentType.IMAGE;
  if (mimeType.startsWith('video/')) return ContentType.VIDEO;
  if (mimeType.startsWith('audio/')) return ContentType.AUDIO;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.startsWith('text/')) {
    return ContentType.DOCUMENT;
  }
  return undefined;
};

export function getLocalServerUrl(path: string): string {
  const port = getEnv('SERVER_PORT', '3000');
  return `http://localhost:${port}${path}`;
}
```