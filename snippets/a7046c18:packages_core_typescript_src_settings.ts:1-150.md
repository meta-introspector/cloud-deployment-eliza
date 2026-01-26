# a7046c18:packages_core_typescript_src_settings.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/settings.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { createUniqueUuid } from "./entities";
import { logger } from "./logger";
import type {
  Character,
  IAgentRuntime,
  OnboardingConfig,
  Setting,
  World,
  WorldSettings,
} from "./types";
import { BufferUtils } from "./utils/buffer";
import * as cryptoUtils from "./utils/crypto-compat";
import { getEnv } from "./utils/environment";

/**
 * Creates a Setting object from a configSetting object by omitting the 'value' property.
 *
 * @param {Omit<Setting, 'value'>} configSetting - The configSetting object to create the Setting from.
 * @returns {Setting} A new Setting object created from the provided configSetting object.
 */
export function createSettingFromConfig(
  configSetting: Omit<Setting, "value">,
): Setting {
  return {
    name: configSetting.name,
    description: configSetting.description,
    usageDescription: configSetting.usageDescription || "",
    value: null,
    required: configSetting.required,
    validation: configSetting.validation || undefined,
    public: configSetting.public || false,
    secret: configSetting.secret || false,
    dependsOn: configSetting.dependsOn || [],
    onSetAction: configSetting.onSetAction || undefined,
    visibleIf: configSetting.visibleIf || undefined,
  };
}

// Cache for salt value with TTL
interface SaltCache {
  value: string;
  timestamp: number;
}

let saltCache: SaltCache | null = null;
let saltErrorLogged = false;
const SALT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes TTL

/**
 * Gets the salt for the agent.
 *
 * @returns {string} The salt for the agent.
 */
export function getSalt(): string {
  // Always read current env first to detect changes
  const currentEnvSalt = getEnv("SECRET_SALT", "secretsalt") || "secretsalt";
  const now = Date.now();

  // Return cached value only if still valid AND matches current env
  if (saltCache !== null) {
    const cacheFresh = now - saltCache.timestamp < SALT_CACHE_TTL_MS;
    if (cacheFresh && saltCache.value === currentEnvSalt) {
      return saltCache.value;
    }
  }

  if (currentEnvSalt === "secretsalt" && !saltErrorLogged) {
    logger.warn(
      { src: "core:settings" },
      "SECRET_SALT is not set or using default value",
    );
    saltErrorLogged = true;
  }

  // Update cache with latest env-derived salt
  saltCache = {
    value: currentEnvSalt,
    timestamp: now,
  };

  return currentEnvSalt;
}

/**
 * Clears the salt cache - useful for tests or when environment changes
 */
export function clearSaltCache(): void {
  saltCache = null;
  saltErrorLogged = false;
}

/**
 * Common encryption function for string values
 * @param {string} value - The string value to encrypt
 * @param {string} salt - The salt to use for encryption
 * @returns {string} - The encrypted value in 'iv:encrypted' format
 */
export function encryptStringValue(value: string, salt: string): string {
  // Check if value is undefined or null
  if (value === undefined || value === null) {
    return value; // Return the value as is (undefined or null)
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  // Check if value is already encrypted (has the format "iv:encrypted")
  const parts = value.split(":");
  if (parts.length === 2) {
    try {
      // Try to parse the first part as hex to see if it's already encrypted
      const possibleIv = BufferUtils.fromHex(parts[0]);
      if (possibleIv.length === 16) {
        // Value is likely already encrypted, return as is
        return value;
      }
    } catch {
      // Not a valid hex string, proceed with encryption
    }
  }

  // Create key and iv from the salt
  const key = cryptoUtils
    .createHash("sha256")
    .update(salt)
    .digest()
    .slice(0, 32);
  const iv = BufferUtils.randomBytes(16);

  // Encrypt the value
  const cipher = cryptoUtils.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(value, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Store IV with the encrypted value so we can decrypt it later
  return `${BufferUtils.toHex(iv)}:${encrypted}`;
}

/**
 * Common decryption function for string values
 * @param value - The encrypted value in 'iv:encrypted' format
 * @param salt - The salt to use for decryption
 * @returns The decrypted string value, or original value if not encrypted
 */
export function decryptStringValue(value: string, salt: string): string {
```