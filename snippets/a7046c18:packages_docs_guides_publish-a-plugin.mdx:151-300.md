# a7046c18:packages_docs_guides_publish-a-plugin.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/publish-a-plugin.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
This command will:
- Check your npm and GitHub authentication
- Validate your plugin structure  
- Check for required images and descriptions
- Show you exactly what would happen without making any changes

**Example output:**
```
✓ Found existing NPM login: your-username
✓ GitHub token validated
⚠ Plugin validation warnings:
  - Missing required logo.jpg in images/ directory (400x400px, max 500KB)
  - Missing required banner.jpg in images/ directory (1280x640px, max 1MB)
  - Description appears to be default generated description
Your plugin may get rejected if you submit without addressing these issues.
Do you wish to continue anyway? No
```

<Warning>
Address any validation errors before proceeding. Your plugin may be rejected by maintainers if it's missing required assets or has placeholder content.
</Warning>

### Run dry run (optional)

For an even more detailed preview:

```bash Terminal
elizaos publish --dry-run
```

This generates all the registry files locally in `packages/registry/` so you can see exactly what will be submitted.

---

## Step 4: Publish Your Plugin

Once your test passes and you're satisfied with the setup, run the actual publish command.

### Execute full publish

```bash Terminal  
elizaos publish
```

You will be asked for a scoped Github token and given these instructions:

<Steps>
  <Step title="Create GitHub Personal Access Token (when prompted)">
    1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
    2. Click **"Generate new token (classic)"**
    3. Name it **"elizaOS Publishing"**
    4. Select these scopes:
       - `repo` (Full control of private repositories)
       - `read:org` (Read organization membership)  
       - `workflow` (Update GitHub Action workflows)
    5. Click **"Generate token"**
    6. **Copy the token and paste it when prompted by the CLI**

    <img src="/images/github-token-scopes.png" alt="GitHub token scope selection showing repo, read:org, and workflow checked" />
  </Step>
</Steps>

<Note>
Make sure to test that your plugin is configured correctly before publishing, as it will cause unnecessary delay if something is wrong.
</Note>

**Example successful output:**

```
✓ Successfully published plugin-fal-ai@1.0.0 to npm
✓ Created GitHub repository: yourusername/plugin-fal-ai
✓ Registry pull request created: https://github.com/elizaos-plugins/registry/pull/123

Your plugin is now available at:
NPM: https://www.npmjs.com/package/plugin-fal-ai
GitHub: https://github.com/yourusername/plugin-fal-ai
```

---

## Step 5: Registry Review Process

### What happens next

1. **npm Package** - Available immediately at `https://npmjs.com/package/your-plugin-name`
2. **GitHub Repo** - Created immediately at `https://github.com/yourusername/plugin-name`
3. **Registry Pull Request** - Opened at [elizaos-plugins/registry](https://github.com/elizaos-plugins/registry/pulls)

### Registry approval

An elizaOS core team member will review your registry pull request to ensure all requirements are met, the plugin is free of malicious code, and it functions as intended with proper images and a quality description.

**Typical review time:** 1-3 business days

**If approved:** Your plugin appears in the official registry and can be discovered via `elizaos plugins list`

**If changes requested:** Address the feedback and update your plugin, then re-submit.

---

## Step 6: Post-Publishing

### Plugin is now live!

Once approved, users can install your plugin to their projects:

```bash Terminal
elizaos plugins add plugin-fal-ai
```

### Future updates

**For plugin updates after initial publishing:**

<Important>
The `elizaos publish` command is only for initial publication. For all future updates, use standard npm and Git workflows - never run `elizaos publish` again.
</Important>

```bash Terminal
# 1. Make your changes and test locally
# 2. Update version in package.json
npm version patch  # or minor/major

# 3. Build and test  
bun run build
elizaos test

# 4. Publish to npm
npm publish

# 5. Push to GitHub
git add .
git commit -m "Update to version x.y.z"
git push origin main
```

The elizaOS registry automatically syncs with npm updates, so you don't need to manually update the registry.

---

## See Also

<CardGroup cols={2}>
  <Card title="Contribute to Core" icon="heart" href="/guides/contribute-to-core">
    Help improve elizaOS by contributing to the core framework
  </Card>
  <Card title="Plugin Registry" icon="book" href="/plugin-registry/overview">
    Explore existing plugins and find inspiration
  </Card>
  <Card title="CLI Reference" icon="terminal" href="/cli-reference/overview">
```