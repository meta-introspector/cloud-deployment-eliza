# 5e8c73c1:packages_cli_src_utils_github.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/github.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        head,
        base,
      }),
    });

    if (response.status === 201) {
      const data = (await response.json()) as GitHubPullRequestResponse;
      logger.success({ src: 'cli', util: 'github', prUrl: data.html_url }, 'Created pull request');
      return data.html_url;
    }

    logger.error(
      { src: 'cli', util: 'github', statusText: response.statusText },
      'Failed to create pull request'
    );
    return null;
  } catch (error) {
    logger.error(
      { src: 'cli', util: 'github', error: error instanceof Error ? error.message : String(error) },
      'Failed to create pull request'
    );
    return null;
  }
}

/**
 * Get authenticated user information
 */
export async function getAuthenticatedUser(token: string): Promise<GitHubUserResponse | null> {
  try {
    const response = await fetch(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (response.status === 200) {
      return (await response.json()) as GitHubUserResponse;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Retrieves GitHub credentials from the environment, registry, or user prompt.
 *
 * Attempts to obtain a valid GitHub username and personal access token by first checking environment variables, then a stored registry, and finally prompting the user if necessary. Validates the token before returning credentials.
 *
 * @returns An object containing the GitHub username and token if valid credentials are found or provided, otherwise `null`.
 */
export async function getGitHubCredentials(): Promise<{
  username: string;
  token: string;
} | null> {
  const envInfo = await UserEnvironment.getInstanceInfo();

  logger.debug({ src: 'cli', util: 'github' }, 'Checking for credentials');

  // First check environment variables
  const envUsername = envInfo.env.GITHUB_USERNAME;
  const envToken = envInfo.env.GITHUB_TOKEN;

  if (envUsername && envToken) {
    // Validate the token
    if (await validateGitHubToken(envToken)) {
      return {
        username: envUsername,
        token: envToken,
      };
    }
    logger.warn(
      { src: 'cli', util: 'github' },
      'Invalid GitHub token found in environment variables'
    );
  }

  // If not in process.env, try to load from .env file
  const { getGitHubToken } = await import('./registry');
  const token = (await getGitHubToken()) || undefined;

  // If we have a token, validate it and try to get username if missing
  if (token) {
    const isValid = await validateGitHubToken(token);
    if (isValid) {
      // If we don't have a username, try to get it from GitHub
      const userInfo = await getAuthenticatedUser(token);
      if (userInfo) {
        const username = userInfo.login;
        // Save the username to env
        await saveGitHubCredentials(username, token);
        return { username, token };
      }
    } else {
      logger.warn(
        { src: 'cli', util: 'github' },
        'Stored GitHub token is invalid, will prompt for new credentials'
      );
    }
  }

  // No valid credentials found, prompt the user
  clack.intro('🔐 GitHub Authentication Required');

  clack.note(
    `To create a GitHub Personal Access Token (Classic):
1. Go to https://github.com/settings/tokens/new
2. Give your token a descriptive name (e.g., "ElizaOS CLI")
3. Select "No expiration" or any expiration date
4. Select the following scopes (all are required):
   - repo (Full control of private repositories)
   - read:org (Read org and team membership, read org projects)
   - workflow (Update GitHub Action workflows)
5. Click "Generate token" at the bottom of the page
6. Copy the displayed token (you won't be able to see it again!)

NOTE: You must use a Classic token, not a Fine-grained token`,
    'Setup Instructions'
  );

  // Then prompt for the username with a simple message
  const promptedUsername = await clack.text({
    message: 'Enter your GitHub username:',
    validate: (value) => (value ? undefined : 'Username is required'),
  });

  if (clack.isCancel(promptedUsername)) {
    clack.cancel('Operation cancelled.');
    return null;
  }

  const promptedToken = await clack.password({
    message: 'Enter your GitHub Personal Access Token (with repo, read:org, and workflow scopes):',
    validate: (value) => (value ? undefined : 'Token is required'),
  });

  if (clack.isCancel(promptedToken)) {
    clack.cancel('Operation cancelled.');
    return null;
  }

  // Validate token
  const isValid = await validateGitHubToken(promptedToken);
  if (!isValid) {
    logger.error({ src: 'cli', util: 'github' }, 'Invalid GitHub token');
    return null;
  }
```