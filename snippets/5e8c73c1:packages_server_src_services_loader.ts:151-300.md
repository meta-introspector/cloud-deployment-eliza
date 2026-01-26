# 5e8c73c1:packages_server_src_services_loader.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/services/loader.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    };

    if (validatedCharacter.settings || Object.keys(combinedSecrets).length > 0) {
      updatedCharacter.settings = validatedCharacter.settings || {};
    }

    if (Object.keys(combinedSecrets).length > 0) {
      updatedCharacter.secrets = combinedSecrets;
    }

    // Re-validate the updated character to ensure it's still valid
    const revalidationResult = validateCharacter(updatedCharacter);
    if (!revalidationResult.success) {
      logger.warn({ src: 'http' }, 'Character became invalid after adding environment settings');
      return validatedCharacter;
    }

    if (!revalidationResult.data) {
      logger.warn({ src: 'http' }, 'Revalidation succeeded but no data returned');
      return validatedCharacter;
    }

    return revalidationResult.data;
  }

  return validatedCharacter;
}

/**
 * Loads a character from the specified file path with safe JSON parsing and validation.
 *
 * @param {string} filePath - The path to the character file.
 * @returns {Promise<Character>} A Promise that resolves to the validated Character object.
 * @throws {Error} If the character file is not found, has invalid JSON, or fails validation.
 */
export async function loadCharacter(filePath: string): Promise<Character> {
  const content = tryLoadFile(filePath);
  if (!content) {
    throw new Error(`Character file not found: ${filePath}`);
  }

  // Use safe JSON parsing and validation
  const parseResult = parseAndValidateCharacter(content);

  if (!parseResult.success) {
    throw new Error(`Failed to load character from ${filePath}: ${parseResult.error?.message}`);
  }

  // Apply environment settings (this will also re-validate)
  return jsonToCharacter(parseResult.data!);
}

/**
 * Handles errors when loading a character from a specific path.
 *
 * @param {string} path - The path from which the character is being loaded.
 * @param {unknown} error - The error that occurred during the loading process.
 * @returns {never}
 */
function handleCharacterLoadError(path: string, error: unknown): never {
  const errorMsg = error instanceof Error ? error.message : String(error);

  // Check for different types of errors and provide appropriate messages
  if (errorMsg.includes('ENOENT') || errorMsg.includes('no such file')) {
    logger.error({ src: 'http', path }, 'Character file not found');
    throw new Error(
      `Character '${path}' not found. Please check if the file exists and the path is correct.`
    );
  } else if (errorMsg.includes('Character validation failed')) {
    logger.error({ src: 'http', path }, 'Character validation failed');
    throw new Error(`Character file '${path}' contains invalid character data. ${errorMsg}`);
  } else if (errorMsg.includes('JSON') || errorMsg.includes('Invalid JSON')) {
    logger.error({ src: 'http', path }, 'JSON parsing error in character file');
    throw new Error(`Character file '${path}' has malformed JSON. Please check the file content.`);
  } else {
    logger.error({ src: 'http', path, error: errorMsg }, 'Error loading character');
    throw new Error(`Failed to load character '${path}': ${errorMsg}`);
  }
}

/**
 * Asynchronously loads a character from the specified path while handling any potential errors.
 *
 * @param {string} path - The path to load the character from.
 * @returns {Promise<Character>} A promise that resolves to the loaded character.
 */
async function safeLoadCharacter(path: string): Promise<Character> {
  try {
    return await loadCharacter(path);
  } catch (e) {
    return handleCharacterLoadError(path, e);
  }
}

/**
 * Asynchronously loads a character from the specified path.
 * If the path is a URL, it loads the character from the URL.
 * If the path is a local file path, it tries multiple possible locations and
 * loads the character from the first valid location found.
 *
 * @param {string} characterPath - The path to load the character from.
 * @returns {Promise<Character>} A Promise that resolves to the loaded character.
 */
export async function loadCharacterTryPath(characterPath: string): Promise<Character> {
  if (characterPath.startsWith('http')) {
    try {
      const characters = await loadCharactersFromUrl(characterPath);
      if (!characters || characters.length === 0) {
        throw new Error('No characters found in the URL response');
      }
      return characters[0];
    } catch (error) {
      // The error is already formatted by loadCharactersFromUrl, so just re-throw it
      throw error;
    }
  }

  // Create path variants with and without .json extension
  const hasJsonExtension = characterPath.toLowerCase().endsWith('.json');
  const basePath = hasJsonExtension ? characterPath : characterPath;
  const jsonPath = hasJsonExtension ? characterPath : `${characterPath}.json`;

  const basePathsToTry = [
    basePath,
    path.resolve(process.cwd(), basePath),
    path.resolve(process.cwd(), '..', '..', basePath),
    path.resolve(process.cwd(), '..', '..', '..', basePath),
    path.resolve(process.cwd(), 'agent', basePath),
    path.resolve(__dirname, basePath),
    path.resolve(__dirname, 'characters', path.basename(basePath)),
    path.resolve(__dirname, '../characters', path.basename(basePath)),
    path.resolve(__dirname, '../../characters', path.basename(basePath)),
    path.resolve(__dirname, '../../../characters', path.basename(basePath)),
  ];

  const jsonPathsToTry = hasJsonExtension
    ? []
    : [
        jsonPath,
        path.resolve(process.cwd(), jsonPath),
        path.resolve(process.cwd(), '..', '..', jsonPath),
        path.resolve(process.cwd(), '..', '..', '..', jsonPath),
        path.resolve(process.cwd(), 'agent', jsonPath),
        path.resolve(__dirname, jsonPath),
        path.resolve(__dirname, 'characters', path.basename(jsonPath)),
        path.resolve(__dirname, '../characters', path.basename(jsonPath)),
        path.resolve(__dirname, '../../characters', path.basename(jsonPath)),
        path.resolve(__dirname, '../../../characters', path.basename(jsonPath)),
      ];

```