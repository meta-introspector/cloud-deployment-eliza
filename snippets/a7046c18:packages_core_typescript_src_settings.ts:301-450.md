# a7046c18:packages_core_typescript_src_settings.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/settings.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    return null;
  }

  // Get settings from metadata
  const saltedSettings = world.metadata.settings as WorldSettings;

  // Remove salt from settings before returning
  const salt = getSalt();
  return unsaltWorldSettings(saltedSettings, salt);
}

/**
 * Initializes settings configuration for a server
 */
export async function initializeOnboarding(
  runtime: IAgentRuntime,
  world: World,
  config: OnboardingConfig,
): Promise<WorldSettings | null> {
  // Check if settings state already exists
  if (world.metadata?.settings) {
    logger.debug(
      { src: "core:settings", serverId: world.messageServerId },
      "Onboarding state already exists",
    );
    // Get settings from metadata and remove salt
    const saltedSettings = world.metadata.settings as WorldSettings;
    const salt = getSalt();
    return unsaltWorldSettings(saltedSettings, salt);
  }

  // Create new settings state
  const worldSettings: WorldSettings = {};

  // Initialize settings from config
  if (config.settings) {
    for (const [key, configSetting] of Object.entries(config.settings)) {
      worldSettings[key] = createSettingFromConfig(configSetting);
    }
  }

  // Save settings state to world metadata
  if (!world.metadata) {
    world.metadata = {};
  }

  // No need to salt here as the settings are just initialized with null values
  world.metadata.settings = worldSettings;

  await runtime.updateWorld(world);

  logger.info(
    { src: "core:settings", serverId: world.messageServerId },
    "Settings config initialized",
  );
  return worldSettings;
}

/**
 * Encrypts sensitive data in a Character object
 * @param {Character} character - The character object to encrypt secrets for
 * @returns {Character} - A copy of the character with encrypted secrets
 */
export function encryptedCharacter(character: Character): Character {
  // Create a deep copy to avoid modifying the original
  const encryptedChar = JSON.parse(JSON.stringify(character));
  const salt = getSalt();

  // Encrypt character.settings.secrets if it exists
  if (encryptedChar.settings?.secrets) {
    encryptedChar.settings.secrets = encryptObjectValues(
      encryptedChar.settings.secrets,
      salt,
    );
  }

  // Encrypt character.secrets if it exists
  if (encryptedChar.secrets) {
    encryptedChar.secrets = encryptObjectValues(encryptedChar.secrets, salt);
  }

  return encryptedChar;
}

/**
 * Decrypts sensitive data in a Character object
 * @param {Character} character - The character object with encrypted secrets
 * @param {IAgentRuntime} runtime - The runtime information needed for salt generation
 * @returns {Character} - A copy of the character with decrypted secrets
 */
export function decryptedCharacter(
  character: Character,
  _runtime: IAgentRuntime,
): Character {
  // Create a deep copy to avoid modifying the original
  const decryptedChar = JSON.parse(JSON.stringify(character));
  const salt = getSalt();

  // Decrypt character.settings.secrets if it exists
  if (decryptedChar.settings?.secrets) {
    decryptedChar.settings.secrets = decryptObjectValues(
      decryptedChar.settings.secrets,
      salt,
    );
  }

  // Decrypt character.secrets if it exists
  if (decryptedChar.secrets) {
    decryptedChar.secrets = decryptObjectValues(decryptedChar.secrets, salt);
  }

  return decryptedChar;
}

/**
 * Helper function to encrypt all string values in an object
 * @param {Record<string, unknown>} obj - Object with values to encrypt
 * @param {string} salt - The salt to use for encryption
 * @returns {Record<string, unknown>} - Object with encrypted values
 */
export function encryptObjectValues(
  obj: Record<string, unknown>,
  salt: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value) {
      result[key] = encryptStringValue(value, salt);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Helper function to decrypt all string values in an object
 * @param {Record<string, unknown>} obj - Object with encrypted values
 * @param {string} salt - The salt to use for decryption
 * @returns {Record<string, unknown>} - Object with decrypted values
 */
export function decryptObjectValues(
  obj: Record<string, unknown>,
  salt: string,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
```