# 5e8c73c1:packages_cli_src_commands_scenario_src_LocalEnvironmentProvider.ts:151-289

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/LocalEnvironmentProvider.ts:151-289
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      } else if (step.input) {
        if (!this.server || !this.agentId) {
          throw new Error(
            'LocalEnvironmentProvider requires a pre-created server and agent for NL input'
          );
        }
        const { response, roomId } = await askAgentViaApi(
          this.server,
          this.agentId,
          step.input,
          90000, // timeout
          this.serverPort // Pass the actual server port
        );

        // Give database time to write logs before reconstructing trajectory
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 second delay to allow async DB writes

        // Reconstruct trajectory from database logs (Ticket #5785 - Non-invasive approach)
        const trajectory =
          this.trajectoryReconstructor && roomId
            ? await this.trajectoryReconstructor.getLatestTrajectory(roomId)
            : [];

        const endedAtMs = Date.now();
        const durationMs = endedAtMs - startedAtMs;

        results.push({
          exitCode: 0,
          stdout: response,
          stderr: '',
          files: await this.captureFileSystem(),
          startedAtMs,
          endedAtMs,
          durationMs,
          trajectory, // Add trajectory to execution result
        });
      } else if (step.code) {
        // Construct appropriate command and arguments based on language
        // Use proper argument arrays to prevent command injection
        let execCommand: string;
        let execArgs: string[];

        switch (step.lang) {
          case 'bash':
          case 'sh':
            execCommand = 'sh';
            execArgs = ['-c', step.code];
            break;
          case 'node':
          case 'javascript':
            execCommand = 'node';
            execArgs = ['-e', step.code];
            break;
          case 'python':
          case 'python3':
            execCommand = 'python3';
            execArgs = ['-c', step.code];
            break;
          default:
            // For other languages, try the -c flag pattern
            execCommand = step.lang || 'bash';
            execArgs = ['-c', step.code];
            break;
        }

        try {
          const result = await bunExec(execCommand, execArgs, { cwd: this.tempDir });
          const { stdout, stderr } = result;

          // Capture file system state after this step
          const files = await this.captureFileSystem();

          const endedAtMs = Date.now();
          const durationMs = endedAtMs - startedAtMs;

          results.push({
            exitCode: result.exitCode || 0,
            stdout,
            stderr,
            files,
            startedAtMs,
            endedAtMs,
            durationMs,
          });
        } catch (error: unknown) {
          // Capture file system state even on error
          const files = await this.captureFileSystem();

          const endedAtMs = Date.now();
          const durationMs = endedAtMs - startedAtMs;

          // Handle different error types from bunExec
          let exitCode = 1;
          let stderr = '';
          let stdout = '';

          const errorObj = error as {
            exitCode?: number;
            stderr?: string;
            stdout?: string;
            message?: string;
          };
          if (errorObj.exitCode !== undefined) {
            exitCode = errorObj.exitCode;
          }
          if (errorObj.stderr) {
            stderr = errorObj.stderr;
          }
          if (errorObj.stdout) {
            stdout = errorObj.stdout;
          }
          if (!stderr && errorObj.message) {
            stderr = errorObj.message;
          }

          results.push({
            exitCode,
            stdout,
            stderr,
            files: files,
            startedAtMs,
            endedAtMs,
            durationMs,
          });
        }
      } else {
        throw new Error('Step must have either input or code');
      }
    }
    return results;
  }

  async teardown(): Promise<void> {
    if (this.tempDir) {
      await fs.rm(this.tempDir, { recursive: true, force: true });
      this.tempDir = null;
    }
  }
}
```