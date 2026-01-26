# a7046c18:packages_core_interop_typescript_python-bridge.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/python-bridge.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Python Plugin Bridge for elizaOS
 *
 * Loads Python plugins via subprocess IPC and adapts them
 * to the TypeScript Plugin interface.
 */

import { EventEmitter } from "node:events";
import type {
  Action,
  ActionResult,
  EvaluationExample,
  Evaluator,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  Plugin,
  Provider,
  ProviderResult,
  State,
} from "../../typescript/src/types";
import type {
  ActionResultResponse,
  ErrorResponse,
  IPCRequest,
  IPCResponse,
  PluginManifest,
  ProviderResultResponse,
  ValidationResponse,
} from "./types";

/**
 * Options for loading a Python plugin
 */
export interface PythonBridgeOptions {
  /** Python module name to import */
  moduleName: string;
  /** Path to Python executable (defaults to 'python3') */
  pythonPath?: string;
  /** Working directory for the subprocess */
  cwd?: string;
  /** Additional environment variables */
  env?: Record<string, string>;
  /** Path to the bridge script */
  bridgeScriptPath?: string;
  /** Connection timeout in milliseconds */
  timeout?: number;
}

/**
 * Pending request tracker
 */
interface PendingRequest {
  resolve: (value: IPCResponse) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
}

/**
 * Python plugin bridge that communicates via subprocess
 */
export class PythonPluginBridge extends EventEmitter {
  private process: ReturnType<typeof import("child_process").spawn> | null =
    null;
  private pendingRequests: Map<string, PendingRequest> = new Map();
  private messageBuffer: string = "";
  private manifest: PluginManifest | null = null;
  private initialized: boolean = false;
  private requestCounter: number = 0;

  constructor(private options: PythonBridgeOptions) {
    super();
  }

  /**
   * Start the Python subprocess
   */
  async start(): Promise<void> {
    const { spawn } = await import("node:child_process");

    const pythonPath = this.options.pythonPath ?? "python3";
    const bridgeScript =
      this.options.bridgeScriptPath ??
      new URL("../python/bridge_server.py", import.meta.url).pathname;

    this.process = spawn(
      pythonPath,
      ["-u", bridgeScript, "--module", this.options.moduleName],
      {
        cwd: this.options.cwd,
        env: { ...process.env, ...this.options.env },
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    // Handle stdout (JSON-RPC messages)
    if (this.process.stdout) {
      this.process.stdout.on("data", (data: Buffer) => {
        this.handleData(data.toString());
      });
    }

    // Handle stderr (logging)
    if (this.process.stderr) {
      this.process.stderr.on("data", (data: Buffer) => {
        console.error(
          `[Python Plugin ${this.options.moduleName}]`,
          data.toString(),
        );
      });
    }

    // Handle process exit
    this.process.on("exit", (code, signal) => {
      this.emit("exit", { code, signal });
      this.cleanup();
    });

    this.process.on("error", (error) => {
      this.emit("error", error);
    });

    // Wait for the ready message with manifest
    await this.waitForReady();
    this.initialized = true;
  }

  /**
   * Wait for the Python process to send ready message
   */
  private async waitForReady(): Promise<void> {
    const timeout = this.options.timeout ?? 30000;

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Python plugin startup timeout after ${timeout}ms`));
      }, timeout);

      const handler = (
        msg: IPCResponse | { type: "ready"; manifest: PluginManifest },
      ) => {
        if (msg.type === "ready" && "manifest" in msg) {
          clearTimeout(timer);
          this.manifest = (msg as { manifest: PluginManifest }).manifest;
          resolve();
        }
      };

      this.once("message", handler);
    });
```