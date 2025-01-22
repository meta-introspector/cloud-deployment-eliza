
`bash runlocaldocker2.sh`
```
]0;root@ip-10-0-4-156: /opt/agentroot@ip-10-0-4-156:/opt/agent# git pull
git pull
remote: Enumerating objects: 4, done.
remote: Counting objects: 100% (4/4), done.
remote: Total 4 (delta 3), reused 4 (delta 3), pack-reused 0 (from 0)
Unpacking objects: 100% (4/4), 897 bytes | 149.00 KiB/s, done.
From https://github.com/meta-introspector/cloud-deployment-eliza
   fb07ce79..18347ce5  feature/arm64_fastembed -> origin/feature/arm64_fastembed
Updating fb07ce79..18347ce5
Fast-forward
 notes.org          | 38 ++++++++++++++++++++++++++++++++++++++
 runlocaldocker2.sh |  3 ++-
 2 files changed, 40 insertions(+), 1 deletion(-)
]0;root@ip-10-0-4-156: /opt/agentroot@ip-10-0-4-156:/opt/agent# bash ./runlocaldocker2.sh
bash ./runlocaldocker2.sh
WARNING! Using --password via the CLI is insecure. Use --password-stdin.
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credential-stores

Login Succeeded
feature-arm64_fastembed: Pulling from agent/eliza
Digest: sha256:d13499b760ac4a41f189c779e419a10683f1ee123890458c964094662a9956fe
Status: Image is up to date for 767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed
767503528736.dkr.ecr.us-east-2.amazonaws.com/agent/eliza:feature-arm64_fastembed
+ apt update

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Get:1 http://deb.debian.org/debian bookworm InRelease [151 kB]
Get:2 http://deb.debian.org/debian bookworm-updates InRelease [55.4 kB]
Get:3 http://deb.debian.org/debian-security bookworm-security InRelease [48.0 kB]
Get:4 http://deb.debian.org/debian bookworm/main arm64 Packages [8693 kB]
Get:5 http://deb.debian.org/debian bookworm-updates/main arm64 Packages [13.3 kB]
Get:6 http://deb.debian.org/debian-security bookworm-security/main arm64 Packages [237 kB]
Fetched 9197 kB in 1s (7316 kB/s)
Reading package lists...
Building dependency tree...
Reading state information...
All packages are up to date.
+ apt install -y strace

WARNING: apt does not have a stable CLI interface. Use with caution in scripts.

Reading package lists...
Building dependency tree...
Reading state information...
The following NEW packages will be installed:
  strace
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.
Need to get 1193 kB of archives.
After this operation, 2514 kB of additional disk space will be used.
Get:1 http://deb.debian.org/debian bookworm/main arm64 strace arm64 6.1-0.1 [1193 kB]
debconf: delaying package configuration, since apt-utils is not installed
Fetched 1193 kB in 0s (14.4 MB/s)
Selecting previously unselected package strace.
(Reading database ... 11101 files and directories currently installed.)
Preparing to unpack .../strace_6.1-0.1_arm64.deb ...
Unpacking strace (6.1-0.1) ...
Setting up strace (6.1-0.1) ...
+ strace -f -o /opt/agent/strace.log -s99999 pnpm start --characters=characters/eliza.character.json
 WARN  Unsupported engine: wanted: {"node":"23.3.0"} (current: {"node":"v23.6.0","pnpm":"9.4.0"})

> eliza@ start /app
> pnpm --filter "@elizaos/agent" start --isRoot "--characters=characters/eliza.character.json"

.                                        |  WARN  Unsupported engine: wanted: {"node":"23.3.0"} (current: {"node":"v23.6.0","pnpm":"9.14.4"})

> @elizaos/agent@0.1.7 start /app/agent
> node --loader ts-node/esm src/index.ts "--isRoot" "--characters=characters/eliza.character.json"

(node:151) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-node/esm", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
(node:151) [DEP0180] DeprecationWarning: fs.Stats constructor is deprecated.
(Use `node --trace-deprecation ...` to show where the warning was created)
[ElizaLogger] Initializing with:
            isNode: true
            verbose: false
            VERBOSE env: undefined
            NODE_ENV: undefined
        
 ℹ INFORMATIONS
   Loading embedding settings: 
   {"OLLAMA_EMBEDDING_MODEL":"mxbai-embed-large"} 

 ℹ INFORMATIONS
   Loading character settings: 
   {"ARGV":["/usr/local/bin/node","/app/agent/src/index.ts","--isRoot","--characters=characters/eliza.character.json"],"CWD":"/app/agent"} 

 ℹ INFORMATIONS
   Parsed settings: 
   {"USE_OPENAI_EMBEDDING_TYPE":"undefined","USE_OLLAMA_EMBEDDING_TYPE":"undefined","OLLAMA_EMBEDDING_MODEL":"mxbai-embed-large"} 

 ℹ INFORMATIONS
   Environment sources 
   {"shellVars":[]} 


┌════════════════════════════════════════┐
│          AKASH NETWORK PLUGIN          │
├────────────────────────────────────────┤
│  Initializing Akash Network Plugin...  │
│  Version: 0.1.0                        │
└════════════════════════════════════════┘

┌───────────────────────────┬───┬───┬───┬───────────────────────────────────────────────────────────┐
│ Action                    │ H │ V │ E │ Similes                                                   │
├───────────────────────────┼───┼───┼───┼────────────────────────────────────────────────────────────┤
│ CREATE_DEPLOYMENT         │ ✓ │ ✓ │ ✓ │ DEPLOY, START_DEPLOYMENT, LAUNCH                             │
│ CLOSE_DEPLOYMENT          │ ✓ │ ✓ │ ✓ │ CLOSE_AKASH_DEPLOYMENT, STOP_DEPLOYMENT, TERMINATE_DEPLOYMENT │
│ GET_PROVIDER_INFO         │ ✓ │ ✓ │ ✓ │ CHECK_PROVIDER, PROVIDER_INFO, PROVIDER_STATUS, CHECK PROVIDER │
│ GET_DEPLOYMENT_STATUS     │ ✓ │ ✓ │ ✓ │ CHECK_DEPLOYMENT, DEPLOYMENT_STATUS, DEPLOYMENT_STATE, CHECK DSEQ │
│ ESTIMATE_GAS              │ ✓ │ ✓ │ ✓ │ CALCULATE_GAS, GET_GAS_ESTIMATE, CHECK_GAS                   │
│ GET_DEPLOYMENTS           │ ✓ │ ✓ │ ✓ │ LIST_DEPLOYMENTS, FETCH_DEPLOYMENTS, SHOW_DEPLOYMENTS        │
│ GET_GPU_PRICING           │ ✓ │ ✓ │ ✓ │ GET_PRICING, COMPARE_PRICES, CHECK_PRICING                   │
│ GET_MANIFEST              │ ✓ │ ✓ │ ✓ │ LOAD_MANIFEST, READ_MANIFEST, PARSE_MANIFEST                 │
│ GET_PROVIDERS_LIST        │ ✓ │ ✓ │ ✓ │ LIST_PROVIDERS, FETCH_PROVIDERS, GET_ALL_PROVIDERS           │
└───────────────────────────┴───┴───┴───┴──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│           Plugin Status             │
├─────────────────────────────────────┤
│ Name    : akash                     │
│ Actions : 9                         │
│ Status  : Loaded & Ready            │
└─────────────────────────────────────┘

bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)
 ["◎ DirectClient constructor"] 

 ℹ INFORMATIONS
   Trying paths: 
   [{"path":"characters/eliza.character.json","exists":false},{"path":"/app/agent/characters/eliza.character.json","exists":false},{"path":"/app/agent/agent/characters/eliza.character.json","exists":false},{"path":"/app/agent/src/characters/eliza.character.json","exists":false},{"path":"/app/agent/src/characters/eliza.character.json","exists":false},{"path":"/app/agent/characters/eliza.character.json","exists":false},{"path":"/app/characters/eliza.character.json","exists":true}] 

 ℹ INFORMATIONS
   Plugins are:  
   ["@elizaos/plugin-akash"] 

(node:151) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
 ["ℹ Successfully loaded character from: /app/characters/eliza.character.json"] 

 ⛔ ERRORS
   Failed to load sqlite-vec extensions: 
   {} 

 ⛔ ERRORS
   Error starting agent for character TINE-IntrospectorIsNotEliza: 
   {} 

 ["⛔ Error: Loadble extension for sqlite-vec not found. Was the sqlite-vec-linux-arm64 package installed?"] 

 ⛔ ERRORS
   Error starting agents: 
   {} 

 ["◎ Run `pnpm start:client` to start the client and visit the outputted URL (http://localhost:5173) to chat with your agents. When running multiple agents, use client with different port `SERVER_PORT=3001 pnpm start:client`"] 

 ["✓ REST API bound to 0.0.0.0:3000. If running locally, access it at http://localhost:3000."] 


```

Tetsing Building locally with 
`docker build --platform linux/arm64 .`

# debug

`pnpm start:debug --characters=./characters/eliza.character.json`

start direct client here 

```
git clone  https://github.com/meta-introspector/eliza-starter.git  eliza-starter
cd eliza-starter
git checkout   feature/opentelemetry
pnpm start --characters=characters/eliza.character.json`
```

# Eliza 🤖

<div align="center">
  <img src="./docs/static/img/eliza_banner.jpg" alt="Eliza Banner" width="100%" />
</div>

<div align="center">

📖 [Documentation](https://elizaos.github.io/eliza/) | 🎯 [Examples](https://github.com/thejoven/awesome-eliza)

</div>

## 🌍 README Translations

[中文说明](./README_CN.md) | [日本語の説明](./README_JA.md) | [한국어 설명](./README_KOR.md) | [Français](./README_FR.md) | [Português](./README_PTBR.md) | [Türkçe](./README_TR.md) | [Русский](./README_RU.md) | [Español](./README_ES.md) | [Italiano](./README_IT.md) | [ไทย](./README_TH.md) | [Deutsch](./README_DE.md) | [Tiếng Việt](./README_VI.md) | [עִברִית](https://github.com/elizaos/Elisa/blob/main/README_HE.md) | [Tagalog](./README_TG.md) | [Polski](./README_PL.md) | [Arabic](./README_AR.md) | [Hungarian](./README_HU.md) | [Srpski](./README_RS.md) | [Română](./README_RO.md) | [Nederlands](./README_NL.md)

## 🚩 Overview

<div align="center">
  <img src="./docs/static/img/eliza_diagram.png" alt="Eliza Diagram" width="100%" />
</div>

## ✨ Features

- 🛠️ Full-featured Discord, Twitter and Telegram connectors
- 🔗 Support for every model (Llama, Grok, OpenAI, Anthropic, etc.)
- 👥 Multi-agent and room support
- 📚 Easily ingest and interact with your documents
- 💾 Retrievable memory and document store
- 🚀 Highly extensible - create your own actions and clients
- ☁️ Supports many models (local Llama, OpenAI, Anthropic, Groq, etc.)
- 📦 Just works!

## Video Tutorials

[AI Agent Dev School](https://www.youtube.com/watch?v=ArptLpQiKfI&list=PLx5pnFXdPTRzWla0RaOxALTSTnVq53fKL)

## 🎯 Use Cases

- 🤖 Chatbots
- 🕵️ Autonomous Agents
- 📈 Business Process Handling
- 🎮 Video Game NPCs
- 🧠 Trading

## 🚀 Quick Start

### Prerequisites

- [Python 2.7+](https://www.python.org/downloads/)
- [Node.js 23+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [pnpm](https://pnpm.io/installation)

> **Note for Windows Users:** [WSL 2](https://learn.microsoft.com/en-us/windows/wsl/install-manual) is required.

### Use the Starter (Recommended)

```bash
git clone https://github.com/elizaos/eliza-starter.git
cd eliza-starter
cp .env.example .env
pnpm i && pnpm build && pnpm start
```

Once the agent is running, you should see the message to run "pnpm start:client" at the end.
Open another terminal and move to same directory and then run below command and follow the URL to chat to your agent.

```bash
pnpm start:client
```

Then read the [Documentation](https://elizaos.github.io/eliza/) to learn how to customize your Eliza.

### Manually Start Eliza (Only recommended if you know what you are doing)

```bash
# Clone the repository
git clone https://github.com/elizaos/eliza.git

# Checkout the latest release
# This project iterates fast, so we recommend checking out the latest release
git checkout $(git describe --tags --abbrev=0)
```

### Start Eliza with Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/elizaos/eliza/tree/main)

### Edit the .env file

Copy .env.example to .env and fill in the appropriate values.

```
cp .env.example .env
```

Note: .env is optional. If you're planning to run multiple distinct agents, you can pass secrets through the character JSON

### Automatically Start Eliza

This will run everything to set up the project and start the bot with the default character.

```bash
sh scripts/start.sh
```

### Edit the character file

1. Open `packages/core/src/defaultCharacter.ts` to modify the default character. Uncomment and edit.

2. To load custom characters:
    - Use `pnpm start --characters="path/to/your/character.json"`
    - Multiple character files can be loaded simultaneously
3. Connect with X (Twitter)
    - change `"clients": []` to `"clients": ["twitter"]` in the character file to connect with X

### Manually Start Eliza

```bash
pnpm i
pnpm build
pnpm start

# The project iterates fast, sometimes you need to clean the project if you are coming back to the project
pnpm clean
```

#### Additional Requirements

You may need to install Sharp. If you see an error when starting up, try installing it with the following command:

```
pnpm install --include=optional sharp
```

### Community & contact

- [GitHub Issues](https://github.com/elizaos/eliza/issues). Best for: bugs you encounter using Eliza, and feature proposals.
- [Discord](https://discord.gg/ai16z). Best for: sharing your applications and hanging out with the community.

## Contributors

<a href="https://github.com/elizaos/eliza/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=elizaos/eliza" />
</a>

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=elizaos/eliza&type=Date)](https://star-history.com/#elizaos/eliza&Date)

