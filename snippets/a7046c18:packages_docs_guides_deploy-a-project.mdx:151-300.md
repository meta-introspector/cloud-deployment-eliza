# a7046c18:packages_docs_guides_deploy-a-project.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/deploy-a-project.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    DISCORD_API_TOKEN=your_bot_token
    ... etc
    ```
    
    <Note>
    **What to add?** Check your `.env` file to see which variables your specific project needs. The exact variables depend on your project's configuration and integrations.
    </Note>
  
  </Step>

  <Step title="Deploy your app">
    1. Once environment variables are set, click **"Deploy"** to start deployment
    2. Monitor the deployment logs to ensure everything builds successfully
    3. Wait for deployment to complete (you'll see "Build completed" in logs)
  </Step>

  <Step title="Get your production URL">
    1. Go to **Settings** → **Networking**
    2. Click **"Generate Domain"** (or add custom domain if you own one)
    3. Railway may ask you to specify the port - set it to **3000** (default)
    4. Your agent is now live at your generated URL!
    
    <img src="/images/railway-generate-domain.png" alt="Railway domain generation settings" />
  </Step>
</Steps>

### Render

[Render website](https://render.com) | [Render docs](https://docs.render.com)

Render is comparable to Railway, but its Free/Hobby plan is less generous and slower (Render turns your instance off when its not in use). Still it's a good option.

<Steps>
  <Step title="Create your project">
    ```bash Terminal
    elizaos create my-agent --type project
    cd my-agent
    ```
  </Step>

  <Step title="Push to GitHub repo">
    Create a GitHub repository and push your code. Choose one approach:
    
    **Option A: Public Repository (Recommended)**
    - Create a PUBLIC GitHub repository
    - Keep `.env` in your `.gitignore` (stays secure)
    - You'll add environment variables in Render dashboard (Step 5)
    
    **Option B: Private Repository** 
    - Create a PRIVATE GitHub repository
    - Remove `.env` from your `.gitignore` 
    - Commit your `.env` file (secure since repo is private)
    - ⚠️ **Still need Step 5** - Render requires env vars on their side even with private repos
    
    <Note>
    Unlike Railway, Render always requires you to add environment variables on their platform, even if you have a private repo with committed .env file.
    </Note>
  </Step>

  <Step title="Sign up for Render">
    1. Go to [render.com](https://render.com)
    2. Create a Render account with your GitHub profile
    
  </Step>

  <Step title="Select Web Service and connect GitHub">
    1. Click **"Web Services"** when asked to select a service type
    
    <img src="/images/render-service.png" alt="Render service type selection" />
    
    2. Select **Git Provider** → **GitHub** to give Render access to your repos
    
    <img src="/images/render-gh-auth.png" alt="Render GitHub authorization" />
    
    3. Select the repository you want to deploy
  </Step>

  <Step title="Configure build settings">
    Render will ask you about Build and Start commands:
    
    - **Build Command:** `bun install && bun run build`
    - **Start Command:** `bun run start`
    - **Instance Type:** Free (Hobby) - works but slower, or paid for faster performance
    
    <Note>
    Render automatically detects the port, so no port configuration needed!
    </Note>
  </Step>

  <Step title="Add environment variables">
    Put all your environment variables in here, even if you commited your .env file, you still need to add it on Render-side:
    
    <img src="/images/render-env.png" alt="Render environment variables configuration" />
    
    Add your variables:
    ```bash env
    # If your project has a frontend/web UI
    ELIZA_UI_ENABLE=true
    
    # If using Postgres (can add PostgreSQL service in Render)
    POSTGRES_URL=your_postgres_connection_string
    
    # Everything else in your .env
    OPENAI_API_KEY=your_openai_key
    DISCORD_APPLICATION_ID=your_app_id
    DISCORD_API_TOKEN=your_bot_token
    ... etc
    ```
    
    <Note>
    **What to add?** Check your `.env` file to see which variables your specific project needs. The exact variables depend on your project's configuration and integrations.
    </Note>
  </Step>

  <Step title="Deploy and access your app">
    1. Click **"Create Web Service"** to start deployment
    2. Monitor the build logs as Render builds and deploys
    3. Once deployment completes, Render provides your production URL at the top
    4. Visit your URL - your agent is now live!
    
    <img src="/images/render-prod-url.png" alt="Render production URL ready" />
    
    <Tip>
    **Free tier note:** Free (Hobby) services spin down after 15 minutes of inactivity and are slower. Upgrade to paid plans for always-on hosting and better performance.
    </Tip>
  </Step>
</Steps>

---

## Option 2: Self-Hosted

Deploy on your own Virtual Private Server (VPS) for more control and predictable costs. Different platforms handle the build process differently. Some build from GitHub (like Coolify), others use Docker (like Phala).

### Pros & Cons

| ✅ Pros | ❌ Cons |
|---------|---------|
| **Lower costs** - Fixed monthly VPS cost regardless of traffic | **Requires server knowledge** - Need basic Linux/Docker skills |
| **Complete control** - Full access to your infrastructure | **More setup time** - Initial configuration takes longer |
| **Better security** - Your data never leaves your servers | **You handle maintenance** - Updates, backups, monitoring are your responsibility |
| **Predictable pricing** - No surprise bills from traffic spikes | **Downtime risk** - If your server goes down, you fix it |
| **Performance control** - Choose exact CPU/RAM specifications | **Learning curve** - Need to understand Docker, networking basics |

### Phala Network (Recommended)

[Phala website](https://phala.network) | [Phala docs](https://docs.phala.network) | [Video Tutorial](https://www.youtube.com/watch?v=paoryBje404&t=8s)

Phala offers secure deployment with excellent elizaOS integration and a good CLI. Perfect for production agents requiring a good mix of cost-effective and good security.

```