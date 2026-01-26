# 5e8c73c1:packages_cli_src_commands_agent_actions_lifecycle.ts:301-313

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/agent/actions/lifecycle.ts:301-313
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    console.info(`Stopping agent ${resolvedAgentId}`);

    // API Endpoint: POST /agents/:agentId/stop
    await agentsService.stopAgent(asUUID(resolvedAgentId));

    logger.success(`Successfully stopped agent ${opts.name}`);
    // Add direct console log for higher visibility
    console.log(`Agent ${opts.name} stopped successfully!`);
  } catch (error) {
    await checkServer(opts);
    handleError(error);
  }
}
```