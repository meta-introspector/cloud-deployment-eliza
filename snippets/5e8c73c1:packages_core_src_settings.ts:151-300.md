# 5e8c73c1:packages_core_src_settings.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/settings.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

    // Verify IV length
    if (iv.length !== 16) {
      return value; // Return the original value without decryption
    }

    // Create key from the salt
    const key = cryptoUtils.createHash('sha256').update(salt).digest().slice(0, 32);

    // Decrypt the value
    const decipher = cryptoUtils.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    logger.error({ src: 'core:settings', error }, 'Decryption failed');
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
  if (setting.secret === true && typeof setting.value === 'string' && setting.value) {
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
  if (setting.secret === true && typeof setting.value === 'string' && setting.value) {
    settingCopy.value = decryptStringValue(setting.value, salt);
  }

  return settingCopy;
}

/**
 * Applies salt to all settings in a WorldSettings object
 */
export function saltWorldSettings(worldSettings: WorldSettings, salt: string): WorldSettings {
  const saltedSettings: WorldSettings = {};

  for (const [key, setting] of Object.entries(worldSettings)) {
    saltedSettings[key] = saltSettingValue(setting, salt);
  }

  return saltedSettings;
}

/**
 * Removes salt from all settings in a WorldSettings object
 */
export function unsaltWorldSettings(worldSettings: WorldSettings, salt: string): WorldSettings {
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
  worldSettings: WorldSettings
): Promise<boolean> {
  const worldId = createUniqueUuid(runtime, serverId);
  const world = await runtime.getWorld(worldId);

  if (!world) {
    logger.error({ src: 'core:settings', serverId }, 'World not found');
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
  serverId: string
): Promise<WorldSettings | null> {
  const worldId = createUniqueUuid(runtime, serverId);
  const world = await runtime.getWorld(worldId);

  if (!world || !world.metadata?.settings) {
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
  config: OnboardingConfig
): Promise<WorldSettings | null> {
  // Check if settings state already exists
  if (world.metadata?.settings) {
    logger.debug(
      { src: 'core:settings', serverId: world.messageServerId },
      'Onboarding state already exists'
    );
    // Get settings from metadata and remove salt
    const saltedSettings = world.metadata.settings as WorldSettings;
```