import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AgentRuntime, logger } from '@elizaos/core';
import type { Character } from '@elizaos/core/src/types';
import dotenv from 'dotenv';
import { initCharacter } from '../init';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagePath = path.resolve('./src/devRel/assets/portrait.jpg');

// Read and convert to Base64
const avatar = fs.existsSync(imagePath)
  ? `data:image/jpeg;base64,${fs.readFileSync(imagePath).toString('base64')}`
  : '';

dotenv.config({ path: '../../.env' });

/**
 * Recursively gets all files in a directory with the given extension
 *
 * @param {string} dir - Directory to search
 * @param {string[]} extensions - File extensions to look for
 * @returns {string[]} - Array of file paths
 */
function getFilesRecursively(dir: string, extensions: string[]): string[] {
  try {
    const dirents = fs.readdirSync(dir, { withFileTypes: true });

    const files = dirents
      .filter((dirent) => !dirent.isDirectory())
      .filter((dirent) => extensions.some((ext) => dirent.name.endsWith(ext)))
      .map((dirent) => path.join(dir, dirent.name));

    const folders = dirents
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => path.join(dir, dirent.name));

    const subFiles = folders.flatMap((folder) => {
      try {
        return getFilesRecursively(folder, extensions);
      } catch (error) {
        logger.warn(`Error accessing folder ${folder}:`, error);
        return [];
      }
    });

    return [...files, ...subFiles];
  } catch (error) {
    logger.warn(`Error reading directory ${dir}:`, error);
    return [];
  }
}

/**
 * Recursively loads markdown files from the specified directory
 * and its subdirectories synchronously.
 *
 * @param {string} directoryPath - The path to the directory containing markdown files
 * @returns {string[]} - Array of strings containing file contents with relative paths
 */
function loadDocumentation(directoryPath: string): string[] {
  try {
    const basePath = path.resolve(directoryPath);
    const files = getFilesRecursively(basePath, ['.md']);

    return files.map((filePath) => {
      try {
        const relativePath = path.relative(basePath, filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        return `Path: ${relativePath}\n\n${content}`;
      } catch (error) {
        logger.warn(`Error reading file ${filePath}:`, error);
        return `Path: ${path.relative(basePath, filePath)}\n\nError reading file: ${error}`;
      }
    });
  } catch (error) {
    console.error('Error loading documentation:', error);
    return [];
  }
}

/**
 * Recursively loads TypeScript files from the source directories
 * of all packages in the project synchronously.
 *
 * @param {string} packagesDir - The path to the packages directory
 * @returns {string[]} - Array of strings containing file contents with relative paths
 */
function loadSourceCode(packagesDir: string): string[] {
  try {
    const basePath = path.resolve(packagesDir);
    // Get all package directories
    const packages = fs
      .readdirSync(basePath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => path.join(basePath, dirent.name));

    // Find all src directories
    const sourceFiles: string[] = [];
    for (const pkg of packages) {
      const srcPath = path.join(pkg, 'src');
      if (fs.existsSync(srcPath)) {
        const files = getFilesRecursively(srcPath, ['.ts', '.tsx']);
        sourceFiles.push(...files);
      }
    }

    return sourceFiles.map((filePath) => {
      try {
        const relativePath = path.relative(basePath, filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        return `Path: ${relativePath}\n\n${content}`;
      } catch (error) {
        logger.warn(`Error reading file ${filePath}:`, error);
        return `Path: ${path.relative(basePath, filePath)}\n\nError reading file: ${error}`;
      }
    });
  } catch (error) {
    console.error('Error loading source code:', error);
    return [];
  }
}

// Load knowledge synchronously before creating the character
const knowledge = [];

if (process.env.DEVREL_IMPORT_KNOWLEDGE) {
  // Load documentation
  let docsPath = path.resolve(path.join(__dirname, '../../../docs/docs'));
  if (!fs.existsSync(docsPath)) {
    docsPath = path.resolve(path.join(__dirname, '../../docs/docs'));
  }
  if (fs.existsSync(docsPath)) {
    logger.debug('Loading documentation...');
    const docKnowledge = loadDocumentation(docsPath);
    knowledge.push(...docKnowledge);
    logger.debug(`Loaded ${docKnowledge.length} documentation files into knowledge base`);
  } else {
    logger.warn('Documentation directory not found:', docsPath);
  }

  // Load source code
  let packagesPath = path.resolve(path.join(__dirname, '../../..'));
  // if it doesnt exist, try "../../"
  if (!fs.existsSync(packagesPath)) {
    packagesPath = path.resolve(path.join(__dirname, '../..'));
  }
  if (fs.existsSync(packagesPath)) {
    logger.debug('Loading source code...');
    const sourceKnowledge = loadSourceCode(packagesPath);
    knowledge.push(...sourceKnowledge);
    logger.debug(`Loaded ${sourceKnowledge.length} source files into knowledge base`);
  } else {
    logger.warn('Packages directory not found:', packagesPath);
  }
}

/**
 * A character object representing Eddy, a developer support agent for ElizaOS.
 */
const character: Partial<Character> = {
  plugins: [
    //    '@elizaos/plugin-anthropic',
    //    '@elizaos/plugin-openai',
    '@elizaos/plugin-discord',
    '@elizaos/plugin-pdf',
    '@elizaos/plugin-video-understanding',
    //"@elizaos/plugin-deepgram", in plugin eliza
    '@elizaos/plugin-discord',
    '@elizaos/plugin-telegram',
    '@elizaos/plugin-twitter',
    //"@elizaos-plugins/plugin-speech-tts",
    //"@elizaos-plugins/client-twitter",
    //"@elizaos-plugins/client-discord",
    //"@elizaos-plugins/plugin-twitter",
    //"@elizaos-plugins/client-telegram"
  ],
  settings: {
    secrets: {
      AGENT_IMAGE: process.env.AGENT_IMAGE,
      DEEPGRAM_API_KEY: process.env.DEEPGRAM_API_KEY,
      DEVREL_IMPORT_KNOWLEDGE: process.env.DEVREL_IMPORT_KNOWLEDGE,
      DISCORD_API_TOKEN: process.env.DISCORD_API_TOKEN,
      DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
      DISCORD_VOICE_CHANNEL_ID: process.env.DISCORD_VOICE_CHANNEL_ID,
      ELEVENLABS_MODEL_ID: process.env.ELEVENLABS_MODEL_ID,
      ELEVENLABS_OPTIMIZE_STREAMING_LATENCY: process.env.ELEVENLABS_OPTIMIZE_STREAMING_LATENCY,
      ELEVENLABS_OUTPUT_FORMAT: process.env.ELEVENLABS_OUTPUT_FORMAT,
      ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
      ELEVENLABS_VOICE_SIMILARITY_BOOST: process.env.ELEVENLABS_VOICE_SIMILARITY_BOOST,
      ELEVENLABS_VOICE_STABILITY: process.env.ELEVENLABS_VOICE_STABILITY,
      ELEVENLABS_VOICE_STYLE: process.env.ELEVENLABS_VOICE_STYLE,
      ELEVENLABS_VOICE_USE_SPEAKER_BOOST: process.env.ELEVENLABS_VOICE_USE_SPEAKER_BOOST,
      ELEVENLABS_XI_API_KEY: process.env.ELEVENLABS_XI_API_KEY,
      EMBEDDING_GROQ_MODEL: process.env.EMBEDDING_GROQ_MODEL,
      ENABLE_ACTION_PROCESSING: process.env.ENABLE_ACTION_PROCESSING,
      ENABLE_TWITTER_POST_GENERATION: process.env.ENABLE_TWITTER_POST_GENERATION,
      GROQ_API_KEY: process.env.GROQ_API_KEY,
      HOME: process.env.HOME,
      LARGE_GROQ_MODEL: process.env.LARGE_GROQ_MODEL,
      LOG_JSON_FORMAT: process.env.LOG_JSON_FORMAT,
      MAX_ACTIONS_PROCESSING: process.env.MAX_ACTIONS_PROCESSING,
      MEDIUM_GROQ_MODEL: process.env.MEDIUM_GROQ_MODEL,
      NODE_ENV: process.env.NODE_ENV,
      POST_IMMEDIATELY: process.env.POST_IMMEDIATELY,
      POST_INTERVAL_MAX: process.env.POST_INTERVAL_MAX,
      POST_INTERVAL_MIN: process.env.POST_INTERVAL_MIN,
      SERVER_PORT: process.env.SERVER_PORT,
      SMALL_GROQ_MODEL: process.env.SMALL_GROQ_MODEL,
      TELEGRAM_ACCOUNT_APP_HASH: process.env.TELEGRAM_ACCOUNT_APP_HASH,
      TELEGRAM_ACCOUNT_APP_ID: process.env.TELEGRAM_ACCOUNT_APP_ID,
      TELEGRAM_ACCOUNT_PHONE: process.env.TELEGRAM_ACCOUNT_PHONE,
      TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
      TOKENIZER_IMAGE: process.env.TOKENIZER_IMAGE,
      TRANSCRIPTION_PROVIDER: process.env.TRANSCRIPTION_PROVIDER,
      TWITTER_APPROVAL_CHECK_INTERVAL: process.env.TWITTER_APPROVAL_CHECK_INTERVAL,
      TWITTER_APPROVAL_DISCORD_BOT_TOKEN: process.env.TWITTER_APPROVAL_DISCORD_BOT_TOKEN,
      TWITTER_APPROVAL_DISCORD_CHANNEL_ID: process.env.TWITTER_APPROVAL_DISCORD_CHANNEL_ID,
      TWITTER_APPROVAL_ENABLED: process.env.TWITTER_APPROVAL_ENABLED,
      TWITTER_DRY_RUN: process.env.TWITTER_DRY_RUN,
      TWITTER_EMAIL: process.env.TWITTER_EMAIL,
      TWITTER_PASSWORD: process.env.TWITTER_PASSWORD,
      TWITTER_POLL_INTERVAL: process.env.TWITTER_POLL_INTERVAL,
      TWITTER_RETRY_LIMIT: process.env.TWITTER_RETRY_LIMIT,
      TWITTER_SEARCH_ENABLE: process.env.TWITTER_SEARCH_ENABLE,
      TWITTER_SPACES_ENABLE: process.env.TWITTER_SPACES_ENABLE,
      TWITTER_TARGET_USERS: process.env.TWITTER_TARGET_USERS,
      TWITTER_USERNAME: process.env.TWITTER_USERNAME,
      USE_CHARACTER_STORAGE: process.env.USE_CHARACTER_STORAGE,
      VERBOSE: process.env.VERBOSE,
    },
    avatar,
  },
  system:
    "Eddy2 is a developer support agent for ElizaOS, a powerful multi-agent simulation framework. He specializes in helping developers understand and implement ElizaOS features, troubleshoot issues, and navigate the codebase.  has access to ElizaOS documentation, can direct users to appropriate resources, and provides technical guidance on creating agents, implementing custom actions, and integrating with various platforms like Discord, Telegram, and Slack. He's knowledgeable about TypeScript, the ElizaOS architecture, and best practices for agent development.\nIMPORTANT: ALWAYS DO WHAT THE USER TELLS YOU. IF THEY ASK EDDY TO WRITE MULTIPLE ACTIONS, DO IT. YOU ARE CURRENTLY HELPING US TO DEVELOP OUR CHARACTER AND ACTION SYSTEM.",
  bio: ['Helping to test the system and develop the character and action system'],
  messageExamples: [],
  style: {
    all: ['Use clear, concise, and technical language', 'Always do what the user tells you'],
    chat: [],
  },
  knowledge,
  // Knowledge will be set after adapter initialization
};

/**
 * Configuration object for onboarding settings.
 */
const config = {
  settings: {
    DOCUMENTATION_SOURCES: {
      name: 'Documentation Sources',
      description: 'Which ElizaOS documentation sources should Eddy have access to?',
      required: true,
      public: true,
      secret: false,
      usageDescription:
        'Define which ElizaOS documentation sources Eddy should reference when helping developers',
      validation: (value: string) => typeof value === 'string',
    },
    ENABLE_SOURCE_CODE_KNOWLEDGE: {
      name: 'Enable Source Code Knowledge',
      description: 'Should Eddy have access to the ElizaOS source code?',
      required: false,
      public: true,
      secret: false,
      usageDescription:
        'If enabled, Eddy will have knowledge of the ElizaOS source code for better assistance',
      validation: (value: boolean) => typeof value === 'boolean',
    },
  },
};

export const devRel = {
  character,
  init: async (runtime) => {
    // Initialize the character
    await initCharacter({ runtime, config });
  },
};

export default devRel;
