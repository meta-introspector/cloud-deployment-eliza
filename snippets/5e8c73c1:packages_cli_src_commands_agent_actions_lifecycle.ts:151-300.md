# 5e8c73c1:packages_cli_src_commands_agent_actions_lifecycle.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/agent/actions/lifecycle.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      name?: string;
      character?: { name?: string };
      [key: string]: unknown;
    }>;
    const result = data.data;

    if (!result) {
      console.error('Server responded OK, but no agent data was returned');
      throw new Error('Failed to start agent: No data returned from server');
    }

    // Get agent name from the response (either directly or from nested character)
    const agentName = result.name || result?.character?.name || 'unknown';

    // Only display one success message (no need for duplicates)
    console.log(`\x1b[32m[✓] Agent ${agentName} started successfully!\x1b[0m`);
  } catch (error) {
    // Check for agent not found error or any other error
    if (error instanceof Error) {
      const errorMsg = error.message;

      // If it's an agent not found error, show helpful error message
      if (errorMsg.startsWith('AGENT_NOT_FOUND:')) {
        const agentName = errorMsg.split(':')[1];
        console.error(`\nError: No agent found with name "${agentName}"`);

        // Show available agents if possible
        try {
          const agents = await getAgents(options);
          if (agents.length > 0) {
            console.error('\nAvailable agents in your project:');
            agents.forEach((agent, index) => {
              console.error(`  ${index}. ${agent.name}`);
            });
            console.error(
              `\nYou can create a new agent with: elizaos create --type agent ${agentName.toLowerCase()}`
            );
          }
        } catch (error) {
          // Ignore errors when showing agents
        }

        throw new Error('AGENT_NOT_FOUND_WITH_HELP');
      } else if (errorMsg === 'MISSING_CHARACTER_CONFIG') {
        throw new Error('MISSING_CHARACTER_CONFIG');
      } else {
        // Handle other errors
        await checkServer(options);
        handleError(error);
      }
    } else {
      await checkServer(options);
      handleError(error);
    }
    process.exit(1);
  }
}

/**
 * Stop command implementation - stops a running agent
 */
export async function stopAgent(opts: OptionValues): Promise<void> {
  const config = createApiClientConfig(opts);
  const agentsService = new AgentsService(config);

  try {
    // Validate that either --name or --all is provided
    const hasValidName = opts.name && opts.name !== true && opts.name !== '';
    if (!hasValidName && !opts.all) {
      console.error('\nError: Must provide either --name <name> or --all flag');
      console.error('Examples:');
      console.error('  elizaos agent stop --name eliza');
      console.error('  elizaos agent stop --all');
      process.exit(1);
    }

    // If --all flag is provided, stop all local ElizaOS processes
    if (opts.all) {
      logger.info({ src: 'cli', command: 'agent-stop' }, 'Stopping all ElizaOS agents');

      // Check platform compatibility
      if (process.platform === 'win32') {
        logger.error(
          { src: 'cli', command: 'agent-stop' },
          'The --all flag requires Unix-like commands (pgrep, kill)'
        );
        logger.error(
          { src: 'cli', command: 'agent-stop' },
          'On Windows, please use WSL 2 or stop agents individually with --name'
        );
        logger.error(
          {
            src: 'cli',
            command: 'agent-stop',
            url: 'https://learn.microsoft.com/en-us/windows/wsl/install-manual',
          },
          'See WSL installation guide'
        );
        process.exit(1);
      }

      try {
        const { bunExec } = await import('@/src/utils/bun-exec');

        // Unix-like: Use pgrep/xargs, excluding current CLI process to prevent self-termination
        // Support both node and bun executables, and look for common ElizaOS patterns
        const patterns = [
          '(node|bun).*elizaos',
          '(node|bun).*eliza.*start',
          '(node|bun).*dist/index.js.*start',
        ];

        for (const pattern of patterns) {
          try {
            const result = await bunExec('sh', ['-c', `pgrep -f "${pattern}"`]);
            const pids = result.stdout
              .trim()
              .split('\n')
              .filter((pid) => pid && pid !== process.pid.toString());

            if (pids.length > 0) {
              await bunExec('sh', ['-c', `echo "${pids.join(' ')}" | xargs -r kill`]);
            }
          } catch (pgrepError) {
            // pgrep returns exit code 1 when no processes match, which is expected
            // Only log actual errors, not "no processes found"
          }
        }

        logger.success(
          { src: 'cli', command: 'agent-stop' },
          'All ElizaOS agents stopped successfully'
        );
      } catch (error) {
        logger.error(
          {
            src: 'cli',
            command: 'agent-stop',
            error: error instanceof Error ? error.message : String(error),
          },
          'Error stopping processes'
        );
        process.exit(1);
      }
      return;
    }

    // Stop individual agent by name/ID
    const resolvedAgentId = await resolveAgentId(opts.name, opts);

```