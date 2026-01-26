# a7046c18:packages_docs_plugin-registry_platform_twitter_examples.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/examples.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

### Reply Bot

Bot that responds to mentions and replies:

```typescript
const replyBot = {
  name: "ReplyBot",
  description: "Responds to mentions and conversations",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  settings: {
    TWITTER_POST_ENABLE: "false",  // Don't post autonomously
    TWITTER_SEARCH_ENABLE: "true",
    TWITTER_AUTO_RESPOND_MENTIONS: "true",
    TWITTER_AUTO_RESPOND_REPLIES: "true",
    TWITTER_POLL_INTERVAL: "60",  // Check every minute
    TWITTER_INTERACTION_INTERVAL_MIN: "5",
    TWITTER_INTERACTION_INTERVAL_MAX: "15"
  },
  responseExamples: [
    {
      input: "What do you think about AI?",
      output: "AI is a tool that amplifies human capability. The key is ensuring it serves humanity's best interests."
    },
    {
      input: "Can you help me with coding?",
      output: "I'd be happy to help! What specific coding challenge are you working on?"
    }
  ]
};
```

### Mention Handler

Bot that processes specific mentions:

```typescript
const mentionHandler = {
  name: "MentionBot",
  description: "Handles mentions with specific commands",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  settings: {
    TWITTER_SEARCH_ENABLE: "true",
    TWITTER_AUTO_RESPOND_MENTIONS: "true"
  }
};

// Custom mention handler
const handleMentionAction: Action = {
  name: "HANDLE_MENTION",
  description: "Process mention commands",
  
  handler: async (runtime, message, state, options, callback) => {
    const text = message.content.text.toLowerCase();
    const twitterService = runtime.getService('twitter');
    
    // Command: @bot summarize [url]
    if (text.includes('summarize')) {
      const urlMatch = text.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const summary = await summarizeUrl(urlMatch[0]);
        await callback({
          text: `Summary: ${summary}`,
          replyTo: message.id
        });
      }
    }
    
    // Command: @bot remind me [message] in [time]
    else if (text.includes('remind me')) {
      const reminderMatch = text.match(/remind me (.+) in (\d+) (minutes?|hours?)/);
      if (reminderMatch) {
        const [, message, amount, unit] = reminderMatch;
        const delay = unit.startsWith('hour') ? amount * 60 * 60 * 1000 : amount * 60 * 1000;
        
        setTimeout(async () => {
          await twitterService.client.tweet(
            `@${message.username} Reminder: ${message}`,
            { reply: { in_reply_to_tweet_id: message.id } }
          );
        }, delay);
        
        await callback({
          text: `I'll remind you in ${amount} ${unit}! ⏰`,
          replyTo: message.id
        });
      }
    }
    
    return true;
  }
};
```

### Quote Tweet Bot

Bot that quotes interesting tweets:

```typescript
const quoteTweetBot = {
  name: "QuoteTweeter",
  description: "Quotes and comments on interesting tweets",
  plugins: [bootstrapPlugin, twitterPlugin],
  clients: ["twitter"],
  settings: {
    TWITTER_SEARCH_ENABLE: "true",
    TWITTER_TIMELINE_ALGORITHM: "weighted",
    TWITTER_TIMELINE_RELEVANCE_WEIGHT: "7",  // Prioritize relevant content
    TWITTER_TARGET_USERS: "sama,pmarca,naval,elonmusk"  // Quote these users
  }
};

// Quote tweet evaluation
const quoteEvaluator = {
  shouldQuote: (tweet: Tweet): boolean => {
    // Check if tweet is quotable
    if (tweet.text.length < 50) return false;  // Too short
    if (tweet.public_metrics.retweet_count < 10) return false;  // Not popular enough
    if (hasAlreadyQuoted(tweet.id)) return false;
    
    // Check content relevance
    const relevantKeywords = ['AI', 'future', 'technology', 'innovation'];
    return relevantKeywords.some(keyword => 
      tweet.text.toLowerCase().includes(keyword.toLowerCase())
    );
  },
  
  generateQuoteComment: async (tweet: Tweet, runtime: IAgentRuntime): Promise<string> => {
    const response = await runtime.generateText({
      messages: [{
        role: "system",
        content: "Add insightful commentary to this tweet. Be thoughtful and add value."
      }, {
        role: "user",
        content: tweet.text
      }],
      maxTokens: 100
    });
    
    return response.text;
  }
};
```

## Search & Monitor Bots

### Keyword Monitor

```