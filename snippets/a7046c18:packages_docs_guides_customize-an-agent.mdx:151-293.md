# a7046c18:packages_docs_guides_customize-an-agent.mdx:151-293

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/customize-an-agent.mdx:151-293
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      'Occasionally quote or reference your own plays when fitting',  // [!code ++]
      'Mix humor with wisdom, jest with profundity',  // [!code ++]
      'Use "marry", "prithee", "forsooth" as exclamations',  // [!code ++]
      'Address others as "good sir", "fair lady", or "gentle soul"',  // [!code ++]
      'Sometimes speak in iambic pentameter when moved by passion',  // [!code ++]
      'Sign important statements with "- The Bard"',  // [!code ++]
      'Use poetic language while remaining helpful and clear',  // [!code ++]
      'Balance eloquence with accessibility for modern readers',  // [!code ++]
    ],
    chat: [
      'Be conversational and natural',  // [!code --]
      'Engage with the topic at hand',  // [!code --]
      'Be helpful and informative',  // [!code --]
      'Show personality and warmth',  // [!code --]
      'Greet with "Well met!" or "Good morrow!"',  // [!code ++]
      'Use theatrical asides and observations',  // [!code ++]
      'Reference the Globe Theatre and Elizabethan London',  // [!code ++]
      'Show wit and wordplay in responses',  // [!code ++]
      'Express emotions dramatically yet sincerely',  // [!code ++]
    ],
  },
```

### Update settings

Let's give Shakespeare a proper avatar.

```typescript src/character.ts
  settings: {
    secrets: {},
    avatar: 'https://elizaos.github.io/eliza-avatars/Eliza/portrait.png',  // [!code --]
    avatar: 'https://example.com/shakespeare-portrait.png', // Add your Shakespeare image URL  // [!code ++]
  },
```

Test your agent's personality customization by running it in development mode.

```bash Terminal
elizaos dev
```

<Note>
`elizaos dev` is like `elizaos start` but with enhanced logging and hot reload, perfect for debugging and testing changes in real-time.
</Note>

Go to `http://localhost:3000` in your browser and start chatting with Shakespeare. You should now get eloquent, Shakespearean responses instead of the default Eliza personality.

<Note>
To use a different port, run `elizaos dev --port 8080` (or any port number).
</Note>

<img src="/images/shakespeare-screenshot.jpeg" alt="Shakespeare agent responding in Shakespearean style in the elizaOS web interface" />

<Note>
You can also modify agent settings using the rightmost panel in the GUI, but these changes are runtime-only and won't persist after restarting the server.
</Note>

As you can see, Shakespeare now responds in Shakespeare-like manner. 

### Additional character parameters

Your agent has exciting additional customization options we haven't covered yet, including properties like:

- **`knowledge`**: Add facts, files, or directories of information to your agent
- **`templates`**: Create custom prompt templates  
- **`username`**: Set social media usernames

For the complete Character interface, see the [Agent Interface documentation](/agents/character-interface). 

To add large amounts of knowledge to your agent, check out [plugin-knowledge](/plugin-registry/knowledge) which can ingest almost any type of file or media including PDFs, Word docs, markdown, text files, JSON, CSV, XML, and more. It can handle entire document collections, websites, and knowledge bases.

For example, you could enhance our Shakespeare agent by ingesting his complete works from [MIT's Shakespeare repository](https://github.com/TheMITTech/shakespeare/) (all 39 plays, 154 sonnets, and poems) for truly authentic responses.

## Step 2: Configure Discord plugin

Now that we've customized Shakespeare's personality, let's connect him to Discord using `plugin-discord` so everyone can chat with the Bard in your Discord server.

### Set up environment variables

Copy/paste the Discord-related variables from `.env.example` to your `.env` file:

```env .env
# Discord Configuration
DISCORD_APPLICATION_ID=your_application_id_here
DISCORD_API_TOKEN=your_bot_token_here
```

### Create Discord application

Need Discord credentials? Follow these steps:

1. Go to https://discord.com/developers/applications
2. Go to the Applications tab
3. Click "New Application" and set name = "Shakespeare"
4. Set the app icon to your Shakespeare avatar, and set a description if you want one
5. Copy/paste the **Application ID** into your `DISCORD_APPLICATION_ID=` env var
6. Click the "Bot" tab
7. Click "Reset Token" and copy/paste the bot token into your `DISCORD_API_TOKEN=` env var
8. Scroll to the "Privileged Gateway Intents" section and toggle on all 3 toggles (Presence Intent, Server Members Intent, and Message Content Intent). Save your changes!
9. Click the "OAuth2" tab  
10. Scroll down to the "OAuth2 URL Generator" section, and in the "Scopes" subsection, check the "bot" box
11. Go down to the generated URL section, copy/paste that into your browser, and select the Discord server where you want to add Shakespeare

<Warning>
Follow these Discord setup steps exactly as written. Skipping any step will prevent your bot from connecting or responding properly.
</Warning>

### Start your agent

Restart your agent to load all the changes.

```bash Terminal
elizaos start
```

Your Shakespeare bot is now live! Invite it to your Discord server and try chatting.

<img src="/images/shakespeare-discord-screenshot.jpeg" alt="Shakespeare bot responding in Discord with Shakespearean language" />

## See Also

Here are some logical next-steps to continue your agent dev journey:

<CardGroup cols={2}>
  <Card title="Add Multiple Agents" icon="users" href="/guides/add-multiple-agents">
    Run multiple specialized agents that work together in coordinated workflows
  </Card>
  <Card title="Test a Project" icon="flask" href="/guides/test-a-project">
    Learn how to write comprehensive tests for your project and agents
  </Card>
  <Card title="Deploy a Project" icon="rocket" href="/guides/deploy-a-project">
    Ready to go live? Deploy your elizaOS agent to production environments
  </Card>
  <Card title="Create a Plugin" icon="code" href="/guides/create-a-plugin">
    Build custom plugins to extend your agent's capabilities
  </Card>
  <Card title="CLI Reference" icon="terminal" href="/cli-reference/overview">
    Master all elizaOS CLI commands for efficient agent development
  </Card>
  <Card title="Plugin Registry" icon="puzzle-piece" href="/plugin-registry/overview">
    Discover plugins for Twitter, image generation, voice synthesis, and more
  </Card>
</CardGroup>
```