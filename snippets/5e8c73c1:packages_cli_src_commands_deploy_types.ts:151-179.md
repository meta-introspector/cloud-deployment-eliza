# 5e8c73c1:packages_cli_src_commands_deploy_types.ts:151-179

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/deploy/types.ts:151-179
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 */
export interface ImageBuildRequest {
  projectId: string;
  version: string;
  metadata?: Record<string, string>;
}

/**
 * Image build and push response from Cloud API
 * Returns ECR repository and authentication information
 */
export interface ImageBuildResponse {
  ecrRepositoryUri: string;
  ecrImageUri: string; // Full image URI with tag
  ecrImageTag: string;
  authToken: string; // ECR authorization token for Docker login
  authTokenExpiresAt: string;
  registryEndpoint: string;
}

/**
 * Docker build context
 */
export interface DockerBuildContext {
  projectPath: string;
  dockerfile?: string;
  buildArgs?: Record<string, string>;
  target?: string;
}
```