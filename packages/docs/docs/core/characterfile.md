# Character Files in ElizaOS

Character files define AI personas within the ElizaOS ecosystem, combining personality traits, knowledge bases, and interaction patterns to create consistent and effective AI agents.

## Core Components

### Required Fields
```json
{
    "name": "character_name",           // Character's display name
    "modelProvider": "openai",          // AI model provider (e.g., anthropic, openai, groq, mistral, google)
    "clients": ["discord", "direct"],   // Supported client types
    "plugins": [],                      // Array of plugins to use
    "settings": {                       // Configuration settings
        "ragKnowledge": false,          // Enable RAG for knowledge (default: false)
        "secrets": {},                  // API keys and sensitive data
        "voice": {},                    // Voice configuration
        "model": "string",              // Optional model override
        "modelConfig": {}               // Optional model configuration
    },
    "bio": [],                         // Character background
    "style": {                         // Interaction style guide
        "all": [],                     // General style rules
        "chat": [],                    // Chat-specific style
        "post": []                     // Post-specific style
    }
}
```

### Optional but Recommended Fields
```json
{
    "username": "handle",              // Character's username/handle
    "system": "System prompt text",    // Custom system prompt
    "lore": [],                       // Additional background/history
    "knowledge": [                     // Knowledge base entries
        "Direct string knowledge",
        { "path": "file/path.md", "shared": false },
        { "directory": "knowledge/path", "shared": false }
    ],
    "messageExamples": [],           // Example conversations
    "postExamples": [],             // Example social posts
    "topics": [],                  // Areas of expertise
    "adjectives": []              // Character traits
}
```

## Knowledge Management

The character system supports two knowledge modes:

### Classic Mode (Default)
- Direct string knowledge added to character's context
- No chunking or semantic search
- Enabled by default (`settings.ragKnowledge: false`)
- Only processes string knowledge entries
- Simpler but less sophisticated

### RAG Mode
- Advanced knowledge processing with semantic search
- Chunks content and uses embeddings
- Must be explicitly enabled (`settings.ragKnowledge: true`)
- Supports three knowledge types:
  1. Direct string knowledge
  2. Single file references: `{ "path": "path/to/file.md", "shared": false }`
  3. Directory references: `{ "directory": "knowledge/dir", "shared": false }`
- Supported file types: .md, .txt, .pdf
- Optional `shared` flag for knowledge reuse across characters

### Knowledge Path Configuration
- Knowledge files are relative to the `characters/knowledge` directory
- Paths should not contain `../` (sanitized for security)
- Both shared and private knowledge supported
- Files automatically reloaded if content changes

## Client Types

Supported client integrations in `clients` array:
- `discord`: Discord bot integration
- `telegram`: Telegram bot  
- `twitter`: Twitter/X bot
- `slack`: Slack integration
- `direct`: Direct chat interface
- `simsai`: SimsAI platform integration

## Settings Configuration

The `settings` object supports:
```json
{
    "settings": {
        "ragKnowledge": false,         // Enable RAG knowledge mode
        "voice": {
            "model": "string",         // Voice synthesis model
            "url": "string"           // Optional voice API URL
        },
        "secrets": {                  // API keys (use env vars in production)
            "API_KEY": "string"
        },
        "model": "string",           // Optional model override
        "modelConfig": {             // Optional model parameters
            "temperature": 0.7,
            "maxInputTokens": 4096,
            "maxOutputTokens": 1024,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0
        },
        "imageSettings": {          // Optional image generation settings
            "steps": 20,
            "width": 1024,
            "height": 1024,
            "cfgScale": 7.5,
            "negativePrompt": "string"
        }
    }
}
```

## Character Definition Components

### Bio & Lore
Core identity and background elements:
```json
{
    "bio": [
        "Expert in blockchain development",
        "Specializes in DeFi protocols"
    ],
    "lore": [
        "Created first DeFi protocol in 2020",
        "Helped launch multiple DAOs"
    ]
}
```

### Style Guidelines
Define interaction patterns:
```json
{
    "style": {
        "all": [                     // Applied to all interactions
            "Keep responses clear",
            "Maintain professional tone"
        ],
        "chat": [                    // Chat-specific style
            "Engage with curiosity",
            "Provide explanations"
        ],
        "post": [                    // Social post style
            "Keep posts informative",
            "Focus on key points"
        ]
    }
}
```

## Example Implementation
```json
{
    "name": "Tech Helper",
    "modelProvider": "anthropic",
    "clients": ["discord"],
    "plugins": [],
    "settings": {
        "ragKnowledge": true,
        "voice": {
            "model": "en_US-male-medium"
        }
    },
    "bio": [
        "Friendly technical assistant",
        "Specializes in explaining complex topics simply"
    ],
    "knowledge": [
        {
            "directory": "tech_guides",
            "shared": true
        }
    ],
    "style": {
        "all": ["Clear", "Patient", "Educational"],
        "chat": ["Interactive", "Supportive"],
        "post": ["Concise", "Informative"]
    }
}
```
