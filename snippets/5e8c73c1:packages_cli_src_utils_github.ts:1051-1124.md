# 5e8c73c1:packages_cli_src_utils_github.ts:1051-1124

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/github.ts:1051-1124
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        await bunExec('git', ['checkout', branch], { cwd });
      } catch (error) {
        // Branch doesn't exist, create it
        await bunExec('git', ['checkout', '-b', branch], { cwd });
        logger.info({ src: 'cli', util: 'github', branch }, 'Created and switched to branch');
      }
    }

    // Add all files
    await bunExec('git', ['add', '.'], { cwd });
    logger.info({ src: 'cli', util: 'github' }, 'Added files to git');

    // Set git user info if not already set
    try {
      await bunExec('git', ['config', 'user.email'], { cwd });
    } catch (error) {
      await bunExec('git', ['config', 'user.email', 'plugindev@elizaos.com'], { cwd });
      await bunExec('git', ['config', 'user.name', 'ElizaOS Plugin Dev'], { cwd });
      logger.info({ src: 'cli', util: 'github' }, 'Set git user info for commit');
    }

    // Commit if there are changes
    try {
      await bunExec('git', ['commit', '-m', 'Initial commit from ElizaOS CLI'], { cwd });
      logger.info({ src: 'cli', util: 'github' }, 'Committed changes');
    } catch (error) {
      // If no changes to commit, that's okay
      logger.info({ src: 'cli', util: 'github' }, 'No changes to commit');
    }

    // Push to GitHub
    try {
      await bunExec('git', ['push', '-u', 'origin', branch], { cwd });
      logger.success({ src: 'cli', util: 'github', repoUrl }, 'Pushed to GitHub repository');
      return true;
    } catch (error) {
      logger.error(
        {
          src: 'cli',
          util: 'github',
          error: error instanceof Error ? error.message : String(error),
        },
        'Failed to push to GitHub'
      );

      // Try force pushing if normal push fails
      try {
        logger.info({ src: 'cli', util: 'github' }, 'Attempting force push');
        // Use force-with-lease as a slightly safer option than force
        await bunExec('git', ['push', '-u', 'origin', 'main', '--force-with-lease'], {
          cwd,
        });
        return true;
      } catch (forcePushError) {
        logger.error(
          {
            src: 'cli',
            util: 'github',
            error:
              forcePushError instanceof Error ? forcePushError.message : String(forcePushError),
          },
          'Force push also failed'
        );
        return false;
      }
    }
  } catch (error) {
    logger.error(
      { src: 'cli', util: 'github', error: error instanceof Error ? error.message : String(error) },
      'Error in git operations'
    );
    return false;
  }
}
```