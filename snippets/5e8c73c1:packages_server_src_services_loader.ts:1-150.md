# 5e8c73c1:packages_server_src_services_loader.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/services/loader.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  type Character,
  logger,
  parseAndValidateCharacter,
  validateCharacter,
  getCharactersDir,
  stringToUuid,
} from '@elizaos/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Attempts to load a file from the given file path.
 *
 * @param {string} filePath - The path to the file to load.
 * @returns {string | null} The contents of the file as a string, or null if an error occurred.
 * @throws {Error} If an error occurs while loading the file.
 */
export function tryLoadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    throw new Error(`Error loading file ${filePath}: ${e}`);
  }
}

/**
 * Load characters from a specified URL and return them as an array of Character objects.
 * @param {string} url - The URL from which to load character data.
 * @returns {Promise<Character[]>} - A promise that resolves with an array of Character objects.
 */
export async function loadCharactersFromUrl(url: string): Promise<Character[]> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    const responseJson = await response.json();

    let characters: Character[] = [];
    if (Array.isArray(responseJson)) {
      characters = await Promise.all(responseJson.map((character) => jsonToCharacter(character)));
    } else {
      const character = await jsonToCharacter(responseJson);
      characters.push(character);
    }
    return characters;
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    logger.error({ src: 'http', url, error: errorMsg }, 'Error loading characters from URL');

    // Enhanced error handling for validation errors
    if (errorMsg.includes('Character validation failed') || errorMsg.includes('validation')) {
      throw new Error(
        `Invalid character data from URL '${url}'. The character data does not match the required schema: ${errorMsg}`
      );
    } else if (errorMsg.includes('JSON')) {
      throw new Error(
        `Invalid JSON response from URL '${url}'. The resource may not contain valid character data.`
      );
    } else if (e instanceof TypeError) {
      throw new Error(
        `Failed to fetch character from URL '${url}'. The URL may be incorrect or unavailable.`
      );
    } else {
      throw new Error(`Failed to load character from URL '${url}': ${errorMsg}`);
    }
  }
}

/**
 * Converts a JSON object representing a character into a validated Character object with additional settings and secrets.
 *
 * @param {unknown} character - The input data representing a character.
 * @returns {Promise<Character>} - A Promise that resolves to a validated Character object.
 * @throws {Error} If character validation fails.
 */
export async function jsonToCharacter(character: unknown): Promise<Character> {
  // First validate the base character data
  const validationResult = validateCharacter(character);

  if (!validationResult.success) {
    const errorDetails = validationResult.error?.issues
      ? validationResult.error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join('; ')
      : validationResult.error?.message || 'Unknown validation error';

    throw new Error(`Character validation failed: ${errorDetails}`);
  }

  // Type guard to ensure we have valid data
  if (!validationResult.data) {
    throw new Error('Validation succeeded but no data was returned');
  }

  const validatedCharacter = validationResult.data;

  // Ensure character has an ID - generate deterministic UUID from name if not present
  // This preserves backward compatibility and allows predictable environment variable naming
  if (!validatedCharacter.id) {
    if (!validatedCharacter.name) {
      throw new Error('Character must have either an id or a name to generate a deterministic ID');
    }
    validatedCharacter.id = stringToUuid(validatedCharacter.name);
  }

  // Add environment-based settings and secrets (preserve existing functionality)
  // Priority: name-based prefixes (backward compatible) first, then ID-based (for explicit IDs)
  const namePrefixes = validatedCharacter.name
    ? [
        `CHARACTER.${validatedCharacter.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}.`,
        `${validatedCharacter.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_`,
      ]
    : [];
  // ID-based prefix as fallback for explicitly set UUIDs
  const idPrefix = `CHARACTER.${validatedCharacter.id!.toUpperCase().replace(/-/g, '_')}.`;
  const allPrefixes = [...namePrefixes, idPrefix];

  const characterSettings = Object.entries(process.env)
    .filter(([key]) => allPrefixes.some((prefix) => key.startsWith(prefix)))
    .reduce((settings, [key, value]) => {
      // Find which prefix matched and remove it to get the setting key
      const matchedPrefix = allPrefixes.find((prefix) => key.startsWith(prefix));
      const settingKey = matchedPrefix ? key.slice(matchedPrefix.length) : key;
      return { ...settings, [settingKey]: value };
    }, {});

  if (Object.keys(characterSettings).length > 0) {
    // Collect all secrets from various sources with correct priority order:
    // 1. character.secrets (lowest - base level)
    // 2. character.settings.secrets (medium - from character.json merged with .env)
    // 3. characterSettings from CHARACTER.* prefix (highest - runtime overrides)
    const combinedSecrets = {
      ...(validatedCharacter.secrets || {}),
      ...(typeof validatedCharacter.settings?.secrets === 'object' &&
      validatedCharacter.settings?.secrets !== null
        ? validatedCharacter.settings.secrets
        : {}),
      ...characterSettings,
    };

    const updatedCharacter: Character = {
      ...validatedCharacter,
```