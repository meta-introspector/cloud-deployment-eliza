# a7046c18:packages_docs_guides_deploy-a-project.mdx:301-438

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/deploy-a-project.mdx:301-438
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
<Steps>
  <Step title="Create your project">
    ```bash Terminal
    elizaos create my-agent --type project
    cd my-agent
    ```
    
    <Note>
    Both regular projects and TEE projects include Docker files. Use regular projects unless you specifically need TEE security features.
    </Note>
  </Step>

  <Step title="Install prerequisites">
    ```bash Terminal
    # Install Phala CLI
    npm install -g @phala/cli
    
    # Ensure Docker is installed and running
    # Download from docker.com if needed
    ```
  </Step>

  <Step title="Setup accounts and authentication">
    1. **Create Phala account** at [dashboard.phala.network](https://dashboard.phala.network)
    2. Add a credit card (small amounts for testing)
    3. Create API token in dashboard → API Tokens
    4. **Authenticate:**
    ```bash Terminal
    export PHALA_CLOUD_API_KEY=your_api_key_here
    
    # Also login to Docker Hub
    docker login
    # Enter Docker Hub credentials
    ```
  </Step>

  <Step title="Configure environment variables">
    Set up your production `.env` file with the variables your project needs:
    
    ```bash .env
    # If using Postgres (recommended for production)
    POSTGRES_URL=postgresql://user:password@host:5432/eliza
    
    # If your project has a frontend/web UI
    ELIZA_UI_ENABLE=true
    
    # Everything else in your .env
    OPENAI_API_KEY=your_openai_key
    DISCORD_APPLICATION_ID=your_app_id
    DISCORD_API_TOKEN=your_bot_token
    ... etc
    ```
    
    <Note>
    **What to add?** Check your `.env` file to see which variables your specific project needs. We recommend neon.tech for easy PostgreSQL setup.
    </Note>
  </Step>

  <Step title="Build and push Docker image">
    ```bash Terminal
    # Build your Docker image
    phala docker build --image my-agent --tag v1.0.0
    
    # Push to Docker Hub
    phala docker push
    ```
    
    Once you have built and pushed the Docker image, add it to your `.env`:
    ```bash .env
    DOCKER_IMAGE=yourusername/my-agent:v1.0.0  # [!code ++]
    ```
  </Step>

  <Step title="Deploy to Phala Cloud">
    ```bash Terminal
    phala cvms create --name my-agent --compose ./docker-compose.yaml --env-file ./.env
    ```
    
    When prompted for resources:
    - **vCPUs:** 2 (sufficient for most agents)
    - **Memory:** 4096 MB (4GB recommended)
    - **Disk:** 40 GB
    - **TEEPod:** Select any online TEE pod
  </Step>

  <Step title="Access your live agent">
    After running the `cvms create` command, you'll receive an **App URL** - this is your cloud dashboard where you can monitor everything.
    
    **To access your agent:**
    1. **Visit the App URL** provided after deployment (your cloud dashboard)
    2. In the dashboard, click **Network** → **"Endpoint #1"**
    3. This gives you your agent's public URL
    4. Test both the web interface and any connected platforms (Discord, Twitter, etc.)
  </Step>
</Steps>

### Other Self-Hosted Options

**Different approaches for self-hosting:**

**Platform-Assisted (Like Managed Cloud, but bring-your-own VPS):**
- **[Coolify](https://coolify.io)** - Railway-like UI on your VPS, builds from GitHub automatically
- Install: `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash` on any VPS

**Manual Docker Deployment:**
- Use any VPS provider: [Hetzner](https://www.hetzner.com/cloud), [DigitalOcean](https://www.digitalocean.com), [Netcup](https://www.netcup.eu)
- Process: Build Docker image → Push to Docker Hub → `docker run` on VPS

**Direct Node.js Deployment (No Docker):**
- Clone repo directly on VPS, install Node.js/Bun, run with PM2/systemd
- More manual but maximum control

<Warning>
**Security Warning:** Self-hosting requires proper server security setup. If you're new to server administration, you can accidentally expose sensitive data. Consider using managed cloud services (Option 1) which handle security for you, or follow platform-specific guides carefully.
</Warning>

<Note>
**Tons of tutorials available:** There are many excellent online tutorials for deploying with Coolify, Hetzner, DigitalOcean, and other providers. Search for "[Provider Name] Docker deployment tutorial" or "[Provider Name] Node.js deployment" for platform-specific guides.
</Note>

---

## See Also

<CardGroup cols={2}>
  <Card title="Create a Plugin" icon="puzzle-piece" href="/guides/create-a-plugin">
    Extend your agent with custom functionality
  </Card>
  <Card title="Add Multiple Agents" icon="users" href="/guides/add-multiple-agents">
    Deploy multiple agents working together
  </Card>
  <Card title="Test a Project" icon="flask" href="/guides/test-a-project">
    Learn comprehensive testing strategies for your agents
  </Card>
  <Card title="Publish a Plugin" icon="upload" href="/guides/publish-a-plugin">
    Share your custom plugins with the elizaOS community
  </Card>
</CardGroup>
```