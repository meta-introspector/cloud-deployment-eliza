# 5e8c73c1:packages_server_src_api_system_environment.ts:151-185

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/system/environment.ts:151-185
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

      const localEnvPath = getLocalEnvPath();
      if (!localEnvPath) {
        throw new Error('Local .env file not found');
      }

      const envString = serializeEnvObject(content);
      writeFileSync(localEnvPath, envString, 'utf-8');

      res.json({
        success: true,
        message: 'Local env updated',
      });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: '/local',
          error: error instanceof Error ? error.message : String(error),
        },
        'Error updating local envs'
      );
      res.status(500).json({
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update local envs',
          details: error instanceof Error ? error.message : String(error),
        },
      });
    }
  });

  return router;
}
```