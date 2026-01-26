# 5e8c73c1:packages_cli_src_utils_github.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/utils/github.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

  // Save credentials
  await saveGitHubCredentials(promptedUsername, promptedToken);
  logger.success({ src: 'cli', util: 'github' }, 'GitHub credentials saved successfully');

  return { username: promptedUsername, token: promptedToken };
}

/**
 * Saves the provided GitHub username and token to the `.env` file in the user's `.eliza` directory.
 *
 * Updates or adds the `GITHUB_USERNAME` and `GITHUB_TOKEN` entries in the file and sets them in the current process environment.
 */
export async function saveGitHubCredentials(username: string, token: string): Promise<void> {
  const envInfo = await UserEnvironment.getInstanceInfo();
  const { elizaDir, envFilePath } = envInfo.paths;

  logger.debug({ src: 'cli', util: 'github' }, 'Saving credentials');

  // Ensure .eliza directory exists
  if (!existsSync(elizaDir)) {
    await fs.mkdir(elizaDir, { recursive: true });
  }

  // Ensure .env file exists
  if (!existsSync(envFilePath)) {
    await fs.writeFile(envFilePath, '', { encoding: 'utf8' });
  }

  // Read current content
  const currentContent = await fs.readFile(envFilePath, 'utf8');
  const lines = currentContent.split('\n');

  // Update or add GITHUB_USERNAME
  const usernameLineIndex = lines.findIndex((line) => line.startsWith('GITHUB_USERNAME='));
  const usernameLine = `GITHUB_USERNAME=${username}`;
  if (usernameLineIndex >= 0) {
    lines[usernameLineIndex] = usernameLine;
  } else {
    lines.push(usernameLine);
  }

  // Update or add GITHUB_TOKEN
  const tokenLineIndex = lines.findIndex((line) => line.startsWith('GITHUB_TOKEN='));
  const tokenLine = `GITHUB_TOKEN=${token}`;
  if (tokenLineIndex >= 0) {
    lines[tokenLineIndex] = tokenLine;
  } else {
    lines.push(tokenLine);
  }

  // Write back to file
  await fs.writeFile(envFilePath, lines.join('\n'));

  // Set in current process
  process.env.GITHUB_USERNAME = username;
  process.env.GITHUB_TOKEN = token;

  logger.success({ src: 'cli', util: 'github' }, 'GitHub credentials saved');
}

/**
 * Ensure a directory exists in the repository
 */
export async function ensureDirectory(
  token: string,
  repo: string,
  path: string,
  branch: string
): Promise<boolean> {
  try {
    // First check if the directory already exists
    try {
      const response = await fetch(
        `${GITHUB_API_URL}/repos/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );

      // Directory exists
      if (response.status === 200) {
        logger.info({ src: 'cli', util: 'github', path }, 'Directory already exists');
        return true;
      }
    } catch (error) {
      // Directory doesn't exist, we'll create it
      logger.info({ src: 'cli', util: 'github', path }, 'Directory does not exist, creating it');
    }

    // Split repo into owner and repo name for updateFile
    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      logger.error(
        { src: 'cli', util: 'github', repo },
        'Invalid repository format. Expected format: owner/repo'
      );
      return false;
    }

    // Create a placeholder file in the directory
    // (GitHub doesn't have a concept of empty directories)
    const placeholderPath = `${path}/.gitkeep`;
    const result = await updateFile(
      token,
      owner,
      repoName,
      placeholderPath,
      '', // Empty content for placeholder
      `Create directory: ${path}`,
      branch
    );

    if (result) {
      logger.success({ src: 'cli', util: 'github', path }, 'Created directory');
      return true;
    }

    logger.error({ src: 'cli', util: 'github', path }, 'Failed to create directory');
    return false;
  } catch (error) {
    logger.error(
      { src: 'cli', util: 'github', error: error instanceof Error ? error.message : String(error) },
      'Error creating directory'
    );
    return false;
  }
}

/**
 * Create a new GitHub repository
 */
export async function createGitHubRepository(
  token: string,
  repoName: string,
  description: string,
  isPrivate = false,
  topics: string[] = []
): Promise<{ success: boolean; repoUrl?: string; message?: string }> {
  try {
    // Get the authenticated user to check repository existence
    const userResponse = await fetch(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
```