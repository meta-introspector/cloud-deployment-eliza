# a7046c18:packages_docs_guides_deploy-to-cloud.mdx:151-256

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/deploy-to-cloud.mdx:151-256
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```bash
elizaos containers delete --project-name my-agent
```

## Troubleshooting

### Login Issues

**"Browser didn't open"**

```bash
elizaos login --no-browser
```

**"Authentication timed out"**

```bash
elizaos login --timeout 600
```

**"API key not found after login"**

- Ensure you ran `elizaos login` from your project directory
- Check `.env` for `ELIZAOS_CLOUD_API_KEY`
- Verify the key starts with `eliza_`

### Deployment Issues

**"Docker not running"**

Start Docker Desktop, then verify with `docker info`.

**"API key invalid"**

- Check you copied the full key (starts with `eliza_`)
- Verify: `echo $ELIZAOS_CLOUD_API_KEY`

**"Build failed"**

- Ensure your project has a `Dockerfile`
- Check Docker has enough resources (Settings → Resources)
- Try: `docker build .`

**"Deployment stuck"**

- Check logs: `elizaos containers logs --project-name my-agent`
- Verify you have credits in your account

## CLI Reference

### Authentication

| Command | Description |
|---------|-------------|
| `elizaos login` | Authenticate (opens browser) |
| `elizaos login --no-browser` | Authenticate without browser |
| `elizaos login --timeout 600` | Custom timeout (seconds) |

### Deployment

| Command | Description |
|---------|-------------|
| `elizaos deploy --project-name <name>` | Deploy with project name |
| `elizaos deploy --api-key <key>` | Deploy with explicit API key |
| `elizaos deploy --port <port>` | Set container port (default: 3000) |
| `elizaos deploy --cpu <units>` | Set CPU units (default: 1792) |
| `elizaos deploy --memory <mb>` | Set memory in MB (default: 1792) |
| `elizaos deploy --desired-count <n>` | Set instance count (default: 1) |
| `elizaos deploy --env "KEY=VALUE"` | Add environment variable |
| `elizaos deploy --skip-build` | Skip Docker build |
| `elizaos deploy --platform <arch>` | Set Docker platform |

### Container Management

| Command | Description |
|---------|-------------|
| `elizaos containers list` | List all deployments |
| `elizaos containers list --json` | List as JSON |
| `elizaos containers logs` | View logs |
| `elizaos containers logs --follow` | Follow log output |
| `elizaos containers logs --tail <n>` | Show last N lines |
| `elizaos containers delete` | Delete deployment |
| `elizaos containers delete --force` | Delete without confirmation |

## Environment Variables

The CLI looks for API keys in this order:

1. `--api-key` flag (if provided)
2. `ELIZAOS_API_KEY` environment variable
3. `ELIZAOS_CLOUD_API_KEY` environment variable
4. `ELIZAOS_CLOUD_API_KEY` in project `.env` file

The `elizaos login` command writes to `ELIZAOS_CLOUD_API_KEY` in your project's `.env` file.

## Next Steps

<CardGroup cols={2}>
  <Card title="TEE Integration" icon="shield-halved" href="/guides/tee-integration">
    Deploy with Trusted Execution Environment for enhanced security
  </Card>
  <Card title="Self-Hosted Options" icon="server" href="/guides/deploy-a-project#option-2-self-hosted">
    Full control with your own infrastructure
  </Card>
</CardGroup>
```