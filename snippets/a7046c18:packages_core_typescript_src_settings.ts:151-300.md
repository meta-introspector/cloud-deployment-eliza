# a7046c18:packages_core_typescript_src_settings.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/settings.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  try {
    // Split the IV and encrypted value
    const parts = value.split(":");
    if (parts.length !== 2) {
      return value; // Return the original value without decryption
    }

    const iv = BufferUtils.fromHex(parts[0]);
    const encrypted = parts[1];

    // Verify IV length
    if (iv.length !== 16) {
      return value; // Return the original value without decryption
    }

    // Create key from the salt
    const key = cryptoUtils
      .createHash("sha256")
      .update(salt)
      .digest()
      .slice(0, 32);

    // Decrypt the value
    const decipher = cryptoUtils.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    logger.error({ src: "core:settings", error }, "Decryption failed");
    // Return the original value on error
    return value;
  }
}

/**
 * Applies salt to the value of a setting
 * Only applies to secret settings with string values
 */
export function saltSettingValue(setting: Setting, salt: string): Setting {
  const settingCopy = { ...setting };

  // Only encrypt string values in secret settings
  if (
    setting.secret === true &&
    typeof setting.value === "string" &&
    setting.value
  ) {
    settingCopy.value = encryptStringValue(setting.value, salt);
  }

  return settingCopy;
}

/**
 * Removes salt from the value of a setting
 * Only applies to secret settings with string values
 */
export function unsaltSettingValue(setting: Setting, salt: string): Setting {
  const settingCopy = { ...setting };

  // Only decrypt string values in secret settings
  if (
    setting.secret === true &&
    typeof setting.value === "string" &&
    setting.value
  ) {
    settingCopy.value = decryptStringValue(setting.value, salt);
  }

  return settingCopy;
}

/**
 * Applies salt to all settings in a WorldSettings object
 */
export function saltWorldSettings(
  worldSettings: WorldSettings,
  salt: string,
): WorldSettings {
  const saltedSettings: WorldSettings = {};

  for (const [key, setting] of Object.entries(worldSettings)) {
    saltedSettings[key] = saltSettingValue(setting, salt);
  }

  return saltedSettings;
}

/**
 * Removes salt from all settings in a WorldSettings object
 */
export function unsaltWorldSettings(
  worldSettings: WorldSettings,
  salt: string,
): WorldSettings {
  const unsaltedSettings: WorldSettings = {};

  for (const [key, setting] of Object.entries(worldSettings)) {
    unsaltedSettings[key] = unsaltSettingValue(setting, salt);
  }

  return unsaltedSettings;
}

/**
 * Updates settings state in world metadata
 */
export async function updateWorldSettings(
  runtime: IAgentRuntime,
  serverId: string,
  worldSettings: WorldSettings,
): Promise<boolean> {
  const worldId = createUniqueUuid(runtime, serverId);
  const world = await runtime.getWorld(worldId);

  if (!world) {
    logger.error({ src: "core:settings", serverId }, "World not found");
    return false;
  }

  // Initialize metadata if it doesn't exist
  if (!world.metadata) {
    world.metadata = {};
  }

  // Apply salt to settings before saving
  const salt = getSalt();
  const saltedSettings = saltWorldSettings(worldSettings, salt);

  // Update settings state
  world.metadata.settings = saltedSettings;

  // Save updated world
  await runtime.updateWorld(world);

  return true;
}

/**
 * Gets settings state from world metadata
 */
export async function getWorldSettings(
  runtime: IAgentRuntime,
  serverId: string,
): Promise<WorldSettings | null> {
  const worldId = createUniqueUuid(runtime, serverId);
  const world = await runtime.getWorld(worldId);

  if (!world || !world.metadata?.settings) {
```