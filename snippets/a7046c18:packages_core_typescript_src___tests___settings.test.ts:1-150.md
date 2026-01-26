# a7046c18:packages_core_typescript_src___tests___settings.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/settings.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockFunction,
  mock,
  spyOn,
} from "bun:test";
import * as entities from "../entities";
import * as logger_module from "../logger";
import {
  clearSaltCache,
  createSettingFromConfig,
  decryptedCharacter,
  decryptObjectValues,
  decryptSecret,
  decryptStringValue,
  encryptedCharacter,
  encryptObjectValues,
  encryptStringValue,
  getSalt,
  getWorldSettings,
  initializeOnboarding,
  saltSettingValue,
  saltWorldSettings,
  unsaltSettingValue,
  unsaltWorldSettings,
  updateWorldSettings,
} from "../settings";
import type {
  Character,
  IAgentRuntime,
  OnboardingConfig,
  Setting,
  UUID,
  World,
  WorldSettings,
} from "../types";
import { getEnvironment } from "../utils/environment";

// Remove global module mocks - they interfere with other tests

describe("settings utilities", () => {
  let mockRuntime: IAgentRuntime;
  let mockWorld: World;
  let getWorldMock: MockFunction<(id: UUID) => Promise<World | null>>;
  let updateWorldMock: MockFunction<(world: World) => Promise<void>>;

  beforeEach(() => {
    mock.restore();

    // Set up scoped mocks for this test
    spyOn(entities, "createUniqueUuid").mockImplementation(
      (_runtime, serverId) => `world-${serverId}` as UUID,
    );

    // Mock logger if it doesn't have the methods
    if (logger_module.logger) {
      const methods = ["error", "info", "warn", "debug"];
      methods.forEach((method) => {
        if (typeof logger_module.logger[method] === "function") {
          spyOn(logger_module.logger, method).mockImplementation(() => {});
        } else {
          logger_module.logger[method] = mock(() => {});
        }
      });
    }

    // Mock process.env
    process.env.SECRET_SALT = "test-salt-value";
    // Clear environment cache after setting env var
    getEnvironment().clearCache();

    getWorldMock = mock<(id: UUID) => Promise<World | null>>();
    updateWorldMock = mock<(world: World) => Promise<void>>();

    mockRuntime = {
      agentId: "agent-123" as UUID,
      character: {
        id: "agent-123" as UUID,
        name: "TestAgent",
        username: "testagent",
        bio: [],
        messageExamples: [],
        postExamples: [],
        topics: [],
        style: { all: [], chat: [], post: [] },
        adjectives: [],
      },
      getWorld: getWorldMock,
      updateWorld: updateWorldMock,
    } as Partial<IAgentRuntime> as IAgentRuntime;

    mockWorld = {
      id: "world-123" as UUID,
      name: "Test World",
      agentId: "agent-123" as UUID,
      messageServerId: "server-123",
      metadata: {},
      createdAt: Date.now(),
    };
  });

  afterEach(() => {
    mock.restore();
    delete process.env.SECRET_SALT;
    getEnvironment().clearCache(); // Clear cache after cleanup
  });

  describe("createSettingFromConfig", () => {
    it("should create setting with all required fields", () => {
      const cfg = {
        name: "API_KEY",
        description: "API Key for service",
        usageDescription: "",
        required: true,
      };

      const setting = createSettingFromConfig(cfg);

      expect(setting).toEqual({
        name: "API_KEY",
        description: "API Key for service",
        usageDescription: "",
        value: null,
        required: true,
        validation: undefined,
        public: false,
        secret: false,
        dependsOn: [],
        onSetAction: undefined,
        visibleIf: undefined,
      });
    });

    it("should create setting with optional fields", () => {
      const validationFn = (value: string | boolean | null) => {
        if (typeof value === "string") {
          return /^[A-Z0-9]+$/.test(value);
        }
        return false;
      };
      const onSetActionFn = (_value: string | boolean | null) => "restart";
      const cfg = {
        name: "API_KEY",
        description: "API Key for service",
        usageDescription: "Enter your API key",
        required: false,
```