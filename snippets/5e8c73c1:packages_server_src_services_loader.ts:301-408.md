# 5e8c73c1:packages_server_src_services_loader.ts:301-408

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/services/loader.ts:301-408
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  // Combine the paths to try both variants
  const pathsToTry = Array.from(new Set([...basePathsToTry, ...jsonPathsToTry]));

  let lastError: unknown = null;

  for (const tryPath of pathsToTry) {
    try {
      const content = tryLoadFile(tryPath);
      if (content !== null) {
        return safeLoadCharacter(tryPath);
      }
    } catch (e) {
      lastError = e;
      // Continue trying other paths
    }
  }

  // If we get here, all paths failed
  const errorMessage = lastError
    ? `${lastError}`
    : 'File not found in any of the expected locations';
  return handleCharacterLoadError(
    characterPath,
    `Character not found. Tried ${pathsToTry.length} locations. ${errorMessage}`
  );
}

/**
 * Converts a comma-separated string to an array of strings.
 *
 * @param {string} commaSeparated - The input comma-separated string.
 * @returns {string[]} An array of strings after splitting the input string by commas and trimming each value.
 */
function commaSeparatedStringToArray(commaSeparated: string): string[] {
  return commaSeparated?.split(',').map((value) => value.trim());
}

/**
 * Asynchronously reads character files from the storage directory and pushes their paths to the characterPaths array.
 * @param {string[]} characterPaths - An array of paths where the character files will be stored.
 * @returns {Promise<string[]>} - A promise that resolves with an updated array of characterPaths.
 */
async function readCharactersFromStorage(characterPaths: string[]): Promise<string[]> {
  try {
    const uploadDir = getCharactersDir();
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const fileNames = await fs.promises.readdir(uploadDir);
    for (const fileName of fileNames) {
      characterPaths.push(path.join(uploadDir, fileName));
    }
  } catch (err) {
    logger.error(
      { src: 'http', error: (err as Error).message },
      'Error reading character storage directory'
    );
  }

  return characterPaths;
}

export const hasValidRemoteUrls = () =>
  process.env.REMOTE_CHARACTER_URLS &&
  process.env.REMOTE_CHARACTER_URLS !== '' &&
  process.env.REMOTE_CHARACTER_URLS.startsWith('http');

/**
 * Load characters from local paths or remote URLs based on configuration.
 * @param charactersArg - A comma-separated list of local file paths or remote URLs to load characters from.
 * @returns A promise that resolves to an array of loaded characters.
 */
export async function loadCharacters(charactersArg: string): Promise<Character[]> {
  let characterPaths = commaSeparatedStringToArray(charactersArg);
  const loadedCharacters: Character[] = [];

  if (process.env.USE_CHARACTER_STORAGE === 'true') {
    characterPaths = await readCharactersFromStorage(characterPaths);
  }

  if (characterPaths?.length > 0) {
    for (const characterPath of characterPaths) {
      try {
        const character = await loadCharacterTryPath(characterPath);
        loadedCharacters.push(character);
      } catch (error) {
        // Log error but continue loading other characters
        const errorMsg = error instanceof Error ? error.message : String(error);
        logger.error(
          { src: 'http', path: characterPath, error: errorMsg },
          'Failed to load character'
        );
      }
    }
  }

  if (hasValidRemoteUrls()) {
    const characterUrls = commaSeparatedStringToArray(process.env.REMOTE_CHARACTER_URLS! || '');
    for (const characterUrl of characterUrls) {
      const characters = await loadCharactersFromUrl(characterUrl);
      loadedCharacters.push(...characters);
    }
  }

  if (loadedCharacters.length === 0) {
    logger.warn({ src: 'http' }, 'No characters found - server requires at least one character');
  }

  return loadedCharacters;
}
```