# 5e8c73c1:packages_cli_src_utils_github.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/github.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tree: [
                {
                  path: 'README.md',
                  mode: '100644',
                  type: 'blob',
                  sha: blobSha,
                },
              ],
            }),
          });

          if (treeResponse.status !== 201) {
            logger.error({ src: 'cli', util: 'github' }, 'Failed to create initial tree');
            return false;
          }

          const treeData = (await treeResponse.json()) as GitHubTreeResponse;
          const treeSha = treeData.sha;

          // Create a commit
          const commitResponse = await fetch(
            `${GITHUB_API_URL}/repos/${owner}/${repo}/git/commits`,
            {
              method: 'POST',
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: 'Initial commit',
                tree: treeSha,
              }),
            }
          );

          if (commitResponse.status !== 201) {
            logger.error({ src: 'cli', util: 'github' }, 'Failed to create initial commit');
            return false;
          }

          const commitData = (await commitResponse.json()) as GitHubCommitResponse;
          const commitSha = commitData.sha;

          // Create a reference for main branch
          const refResponse = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/git/refs`, {
            method: 'POST',
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ref: 'refs/heads/main',
              sha: commitSha,
            }),
          });

          if (refResponse.status !== 201) {
            logger.error({ src: 'cli', util: 'github' }, 'Failed to create main branch');
            return false;
          }

          logger.success({ src: 'cli', util: 'github' }, 'Created main branch with initial commit');

          // Now we can use this as our base
          baseResponse = await fetch(
            `${GITHUB_API_URL}/repos/${owner}/${repo}/git/ref/heads/main`,
            {
              headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github.v3+json',
              },
            }
          );
        }
      }
    }

    if (baseResponse.status !== 200) {
      logger.error(
        { src: 'cli', util: 'github', baseBranch, statusText: baseResponse.statusText },
        'Failed to get base branch'
      );
      return false;
    }

    const baseData = (await baseResponse.json()) as GitHubBranchResponse;
    const sha = baseData.object.sha;

    // Create the new branch
    const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: `refs/heads/${branch}`,
        sha,
      }),
    });

    if (response.status === 201) {
      logger.success({ src: 'cli', util: 'github', branch, owner, repo }, 'Created branch');
      return true;
    }

    logger.error(
      { src: 'cli', util: 'github', statusText: response.statusText },
      'Failed to create branch'
    );
    return false;
  } catch (error) {
    logger.error(
      { src: 'cli', util: 'github', error: error instanceof Error ? error.message : String(error) },
      'Failed to create branch'
    );
    return false;
  }
}

/**
 * Get content of a file from a repository
 */
export async function getFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch = 'main'
): Promise<string | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

```