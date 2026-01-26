# a7046c18:packages_docs_plugin-registry_platform_twitter_developer-guide.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/developer-guide.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const actions: Action[] = [];
    
    for (const tweet of timeline) {
      // Like evaluation
      if (this.shouldLike(tweet)) {
        actions.push({
          type: 'like',
          target: tweet,
          score: this.calculateLikeScore(tweet)
        });
      }
      
      // Retweet evaluation
      if (this.shouldRetweet(tweet)) {
        actions.push({
          type: 'retweet',
          target: tweet,
          score: this.calculateRetweetScore(tweet)
        });
      }
      
      // Quote tweet evaluation
      if (this.shouldQuote(tweet)) {
        actions.push({
          type: 'quote',
          target: tweet,
          score: this.calculateQuoteScore(tweet)
        });
      }
    }
    
    // Sort by score
    return actions.sort((a, b) => b.score - a.score);
  }
}
```

## Authentication & Setup

### Developer Account Setup

1. **Apply for Developer Account**
   ```
   1. Go to https://developer.twitter.com
   2. Click "Sign up"
   3. Complete application process
   4. Wait for approval
   ```

2. **Create App**
   ```
   1. Go to Developer Portal
   2. Create new app
   3. Name your app
   4. Save app details
   ```

3. **Configure Permissions**
   ```
   1. Go to app settings
   2. Click "User authentication settings"
   3. Enable OAuth 1.0a
   4. Set permissions to "Read and write"
   5. Add callback URL: http://localhost:3000/callback
   6. Save settings
   ```

### OAuth Setup

**Critical: Use OAuth 1.0a, NOT OAuth 2.0!**

```typescript
// Correct credentials (OAuth 1.0a)
const credentials = {
  // From "Consumer Keys" section
  apiKey: process.env.TWITTER_API_KEY,              // Consumer API Key
  apiSecretKey: process.env.TWITTER_API_SECRET_KEY, // Consumer API Secret
  
  // From "Authentication Tokens" section
  accessToken: process.env.TWITTER_ACCESS_TOKEN,         // Access Token
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET // Access Token Secret
};

// WRONG - Don't use these (OAuth 2.0)
// ❌ Client ID
// ❌ Client Secret  
// ❌ Bearer Token
```

### Token Regeneration

After changing permissions:

1. Go to "Keys and tokens"
2. Under "Authentication Tokens"
3. Click "Regenerate" for Access Token & Secret
4. Copy new tokens
5. Update `.env` file

## Configuration

### Environment Variables

```bash
# Required OAuth 1.0a Credentials
TWITTER_API_KEY=                    # Consumer API Key
TWITTER_API_SECRET_KEY=             # Consumer API Secret  
TWITTER_ACCESS_TOKEN=               # Access Token (with write permissions)
TWITTER_ACCESS_TOKEN_SECRET=        # Access Token Secret

# Basic Configuration
TWITTER_DRY_RUN=false              # Test mode without posting
TWITTER_TARGET_USERS=              # Comma-separated usernames or "*"
TWITTER_RETRY_LIMIT=5              # Max retry attempts
TWITTER_POLL_INTERVAL=120          # Timeline polling interval (seconds)

# Post Generation
TWITTER_POST_ENABLE=false          # Enable autonomous posting
TWITTER_POST_INTERVAL_MIN=90       # Min interval (minutes)
TWITTER_POST_INTERVAL_MAX=180      # Max interval (minutes)
TWITTER_POST_IMMEDIATELY=false     # Post on startup
TWITTER_POST_INTERVAL_VARIANCE=0.2 # Interval variance (0.0-1.0)

# Interaction Settings
TWITTER_SEARCH_ENABLE=true         # Enable timeline monitoring
TWITTER_INTERACTION_INTERVAL_MIN=15    # Min interaction interval
TWITTER_INTERACTION_INTERVAL_MAX=30    # Max interaction interval
TWITTER_AUTO_RESPOND_MENTIONS=true     # Auto-respond to mentions
TWITTER_AUTO_RESPOND_REPLIES=true      # Auto-respond to replies
TWITTER_MAX_INTERACTIONS_PER_RUN=10    # Max interactions per cycle

# Timeline Algorithm
TWITTER_TIMELINE_ALGORITHM=weighted    # "weighted" or "latest"
TWITTER_TIMELINE_USER_BASED_WEIGHT=3   # User importance weight
TWITTER_TIMELINE_TIME_BASED_WEIGHT=2   # Recency weight
TWITTER_TIMELINE_RELEVANCE_WEIGHT=5    # Content relevance weight

# Advanced Settings
TWITTER_MAX_TWEET_LENGTH=4000      # Max tweet length
TWITTER_DM_ONLY=false             # Only process DMs
TWITTER_ENABLE_ACTION_PROCESSING=false  # Enable likes/RTs
TWITTER_ACTION_INTERVAL=240       # Action interval (minutes)
```

### Character Configuration

```typescript
const character = {
  name: "TwitterBot",
  clients: ["twitter"],
```