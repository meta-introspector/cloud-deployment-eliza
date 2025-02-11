---
sidebar_position: 2
---

# Quickstart Guide

## Prerequisites

Before getting started with Eliza, ensure you have:

- [Node.js 23+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (using [nvm](https://github.com/nvm-sh/nvm) is recommended)
- [bun 9+](https://bun.io/installation)
- Git for version control
- A code editor ([VS Code](https://code.visualstudio.com/), [Cursor](https://cursor.com/) or [VSCodium](https://vscodium.com) recommended)
- [CUDA Toolkit](https://developer.nvidia.com/cuda-toolkit) (optional, for GPU acceleration)

---

## Automated Installation

Using https://github.com/elizaOS/eliza-starter

```bash
git clone https://github.com/elizaos/eliza-starter.git
cd eliza-starter
cp .env.example .env
pnpm i && pnpm build && pnpm start
```

## Manual Installation

After installing the prerequisites, clone the repository and enter the directory

```bash
git clone https://github.com/elizaOS/eliza.git
cd eliza
```

Switch to the latest [stable version tag](https://github.com/elizaOS/eliza/tags)
This project moves quick, checkout the latest release known to work:

```bash
git checkout $(git describe --tags --abbrev=0)
```

Install the dependencies

```bash
bun install
```

> **Note:** Please only use the `--no-frozen-lockfile` option when you're initially instantiating the repo or are bumping the version of a package or adding a new package to your package.json. This practice helps maintain consistency in your project's dependencies and prevents unintended changes to the lockfile.

Build the local libraries

```bash
bun run build
```

---

## Configure Environment

Copy example environment file

```bash
cp .env.example .env
```

Edit `.env` and add your values. Do NOT add this file to version control.

```bash
# Suggested quickstart environment variables
DISCORD_APPLICATION_ID=  # For Discord integration
DISCORD_API_TOKEN=      # Bot token
HEURIST_API_KEY=       # Heurist API key for LLM and image generation
OPENAI_API_KEY=        # OpenAI API key
GROK_API_KEY=          # Grok API key
ELEVENLABS_API_KEY= # API key from elevenlabs (for voice)
LIVEPEER_GATEWAY_URL=  # Livepeer gateway URL
```

## Choose Your Model

Eliza supports multiple AI models and you set which model to use inside the character JSON file.

- **Heurist**: Set `modelProvider: "heurist"` in your character file. Most models are uncensored.
- LLM: Select available LLMs [here](https://docs.heurist.ai/dev-guide/supported-models#large-language-models-llms) and configure `SMALL_HEURIST_MODEL`,`MEDIUM_HEURIST_MODEL`,`LARGE_HEURIST_MODEL`
- Image Generation: Select available Stable Diffusion or Flux models [here](https://docs.heurist.ai/dev-guide/supported-models#image-generation-models) and configure `HEURIST_IMAGE_MODEL` (default is FLUX.1-dev)
- **Llama**: Set `OLLAMA_MODEL` to your chosen model
- **Grok**: Set `GROK_API_KEY` to your Grok API key and set `modelProvider: "grok"` in your character file
- **OpenAI**: Set `OPENAI_API_KEY` to your OpenAI API key and set `modelProvider: "openai"` in your character file
- **Livepeer**: Set `LIVEPEER_IMAGE_MODEL` to your chosen Livepeer image model, available models [here](https://livepeer-eliza.com/)

- **Llama**: Set `XAI_MODEL=meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo`
- **Grok**: Set `XAI_MODEL=grok-beta`
- **OpenAI**: Set `XAI_MODEL=gpt-4o-mini` or `gpt-4o`
- **Livepeer**: Set `SMALL_LIVEPEER_MODEL`,`MEDIUM_LIVEPEER_MODEL`,`LARGE_LIVEPEER_MODEL` and `IMAGE_LIVEPEER_MODEL` to your desired models listed [here](https://livepeer-eliza.com/).

### For llama_local inference:

- The system will automatically download the model from Hugging Face
- `LOCAL_LLAMA_PROVIDER` can be blank

Note: llama_local requires a GPU, it currently will not work with CPU inference

### For Ollama inference:

- If `OLLAMA_SERVER_URL` is left blank, it defaults to `localhost:11434`
- If `OLLAMA_EMBEDDING_MODE` is left blank, it defaults to `mxbai-embed-large`

## Create Your First Agent

**Create a Character File**

Check out the `characters/` directory for a number of character files to try out.
Additionally you can read `packages/core/src/defaultCharacter.ts`.

Copy one of the example character files and make it your own

```bash
cp characters/sbf.character.json characters/deep-thought.character.json
```
📝 [Character Documentation](./core/characterfile.md)

**Start the Agent**

Inform it which character you want to run:

```bash
bun start --character="characters/deep-thought.character.json"
```

You can load multiple characters with a comma-separated list:

```bash
bun start --characters="characters/deep-thought.character.json, characters/sbf.character.json"
```

**Interact with the Agent**

Now you're ready to start a conversation with your agent.

Open a new terminal window and run the client's http server.

```bash
bun start:client
```

Once the client is running, you'll see a message like this:

```
➜  Local:   http://localhost:5173/
```

Simply click the link or open your browser to `http://localhost:5173/`. You'll see the chat interface connect to the system, and you can begin interacting with your character.

## Platform Integration

### Discord Bot Setup

1. Create a new application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot and get your token
3. Add bot to your server using OAuth2 URL generator
4. Set `DISCORD_API_TOKEN` and `DISCORD_APPLICATION_ID` in your `.env`

### Twitter Integration

Add to your `.env`:

```bash
TWITTER_USERNAME=  # Account username
TWITTER_PASSWORD=  # Account password
TWITTER_EMAIL=    # Account email
```

**Important:** Log in to the [Twitter Developer Portal](https://developer.twitter.com) and enable the "Automated" label for your account to avoid being flagged as inauthentic.

### Telegram Bot

1. Create a bot
2. Add your bot token to `.env`:

```bash
TELEGRAM_BOT_TOKEN=your_token_here
```

## Optional: GPU Acceleration

If you have an NVIDIA GPU:

```bash
# Install CUDA support
npx --no node-llama-cpp source download --gpu cuda

# Ensure CUDA Toolkit, cuDNN, and cuBLAS are installed
```

## Basic Usage Examples

### Chat with Your Agent

```bash
# Start chat interface
bun start
```

### Run Multiple Agents

```bash
bun start --characters="characters/trump.character.json,characters/tate.character.json"
```

## Common Issues & Solutions

1. **Node.js Version**

- Ensure Node.js 23.3.0 is installed
- Use `node -v` to check version
- Consider using [nvm](https://github.com/nvm-sh/nvm) to manage Node versions

NOTE: bun may be bundled with a different node version, ignoring nvm. If this is the case, you can use

```bash
bun env use --global 23.3.0
```

to force it to use the correct one.

2. **Sharp Installation**
If you see Sharp-related errors:

```bash
bun install --include=optional sharp
```

3. **CUDA Setup**

- Verify CUDA Toolkit installation
- Check GPU compatibility with toolkit
- Ensure proper environment variables are set

4. **Exit Status 1**
If you see

```
triggerUncaughtException(
^
[Object: null prototype] {
[Symbol(nodejs.util.inspect.custom)]: [Function: [nodejs.util.inspect.custom]]
}
```

You can try these steps, which aim to add `@types/node` to various parts of the project

```
# Add dependencies to workspace root
bun add -w -D ts-node typescript @types/node

# Add dependencies to the agent package specifically
bun add -D ts-node typescript @types/node --filter "@elizaos/agent"

# Also add to the core package since it's needed there too
bun add -D ts-node typescript @types/node --filter "@elizaos/core"

# Install all dependencies recursively
bun install -r

# Build the project
bun run build

# Then try to start
bun start
```

5. **Better sqlite3 was compiled against a different Node.js version**
If you see

```
Error starting agents: Error: The module '.../eliza-agents/dv/eliza/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 131. This version of Node.js requires
NODE_MODULE_VERSION 127. Please try re-compiling or re-installing
```

or 

```
Error: Could not locate the bindings file. Tried:
.../better_sqlite3.node
...
```

You can try this, which will attempt to rebuild better-sqlite3.

```bash
bun rebuild better-sqlite3
```

If that doesn't work, try clearing your node_modules in the root folder

```bash
rm -fr node_modules; bun store prune
```

Then reinstall the requirements

```bash
bun i
```

You can also add a postinstall script in your `package.json` if you want to automate this:
```json
scripts: {
    "postinstall": "npm rebuild better-sqlite3"
}
```

---

## FAQ

### Which Node.js version should I use?
Use Node.js v23.3.0 with pnpm v9.x for optimal compatibility.

### How do I run multiple agents?
Create separate projects with unique character files and run in separate terminals, or use `pnpm start --characters="characters/agent1.json,characters/agent2.json"`.

### How do I install and set up ElizaOS?
Clone the repository, run `pnpm install --no-frozen-lockfile`, then `pnpm build`. Requires Node.js version 23.3.0.

### What's the difference between eliza and eliza-starter?
Eliza-starter is a lightweight version for simpler setups, while the main eliza repository includes all advanced features and plugins.

### How do I fix build/installation issues?
Use Node v23.3.0, run `pnpm clean`, then `pnpm install --no-frozen-lockfile`, followed by `pnpm build`. If issues persist, checkout the latest stable tag.

### What are the minimum system requirements?
8GB RAM recommended for build process. For deployment, a t2.large instance on AWS with 20GB storage running Ubuntu is the minimum tested configuration.

### Which Node.js version should I use?
Use Node.js version 23+ (specifically 23.3.0 is recommended). You can use nvm to manage Node versions with `nvm install 23` and `nvm use 23`.

### How do I fix "Exit Status 1" errors?
If you see `triggerUncaughtException` errors, try:
1. Add dependencies to workspace root
2. Add dependencies to specific packages
3. Clean and rebuild

## Next Steps

Once you have your agent running, explore:

1. 🤖 [Understand Agents](./core/agents.md)
2. 📝 [Create Custom Characters](./core/characterfile.md)
3. ⚡ [Add Custom Actions](./core/actions.md)
4. 🔧 [Advanced Configuration](./guides/configuration.md)

Join our [Discord community](https://discord.gg/ai16z) for support and updates!
