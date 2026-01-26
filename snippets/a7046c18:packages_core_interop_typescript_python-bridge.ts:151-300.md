# a7046c18:packages_core_interop_typescript_python-bridge.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/python-bridge.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }

  /**
   * Handle incoming data from subprocess
   */
  private handleData(data: string): void {
    this.messageBuffer += data;

    // Process complete JSON messages (newline-delimited)
    const lines = this.messageBuffer.split("\n");
    this.messageBuffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.trim()) {
        try {
          const message: IPCResponse = JSON.parse(line);
          this.handleMessage(message);
        } catch (error) {
          console.error("Failed to parse IPC message:", line, error);
        }
      }
    }
  }

  /**
   * Handle a parsed IPC message
   */
  private handleMessage(message: IPCResponse): void {
    this.emit("message", message);

    // Check if this is a response to a pending request
    if (message.id && this.pendingRequests.has(message.id)) {
      const pending = this.pendingRequests.get(message.id);
      if (!pending) return;
      this.pendingRequests.delete(message.id);
      clearTimeout(pending.timeout);

      if (message.type === "error") {
        pending.reject(new Error((message as ErrorResponse).error));
      } else {
        pending.resolve(message);
      }
    }
  }

  /**
   * Send a request and wait for response
   */
  async sendRequest<T extends IPCResponse>(request: IPCRequest): Promise<T> {
    if (!this.process || !this.initialized) {
      throw new Error("Python bridge not started");
    }

    const id = `req_${++this.requestCounter}`;
    const requestWithId = { ...request, id };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout for ${request.type}`));
      }, this.options.timeout ?? 30000);

      this.pendingRequests.set(id, {
        resolve: resolve as (value: IPCResponse) => void,
        reject,
        timeout,
      });

      const json = `${JSON.stringify(requestWithId)}\n`;
      if (this.process && this.process.stdin) {
        this.process.stdin.write(json);
      }
    });
  }

  /**
   * Get the plugin manifest
   */
  getManifest(): PluginManifest | null {
    return this.manifest;
  }

  /**
   * Stop the Python subprocess
   */
  async stop(): Promise<void> {
    if (this.process) {
      this.process.kill("SIGTERM");

      // Wait for graceful shutdown
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          this.process?.kill("SIGKILL");
          resolve();
        }, 5000);

        this.process?.on("exit", () => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
    this.cleanup();
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.process = null;
    this.initialized = false;

    // Reject all pending requests
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeout);
      pending.reject(new Error("Bridge closed"));
    }
    this.pendingRequests.clear();
  }
}

/**
 * Load a Python plugin and return an elizaOS Plugin interface
 */
export async function loadPythonPlugin(
  options: PythonBridgeOptions,
): Promise<Plugin> {
  const bridge = new PythonPluginBridge(options);
  await bridge.start();

  const manifest = bridge.getManifest();
  if (!manifest) {
    throw new Error("Failed to get plugin manifest");
  }

  return createPluginFromBridge(manifest, bridge);
}

/**
 * Create a Plugin from a Python bridge
 */
function createPluginFromBridge(
  manifest: PluginManifest,
  bridge: PythonPluginBridge,
): Plugin {
  // Create action wrappers
  const actions: Action[] = (manifest.actions ?? []).map((actionDef) => ({
    name: actionDef.name,
    description: actionDef.description,
    similes: actionDef.similes,
```