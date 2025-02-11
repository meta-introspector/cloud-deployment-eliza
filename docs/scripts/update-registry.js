const fs = require('fs');
const path = require('path');
const https = require('https');

const REGISTRY_URL = 'https://raw.githubusercontent.com/elizaos-plugins/registry/refs/heads/main/index.json';
const OUTPUT_FILE = path.join(__dirname, '../src/data/registry-users.tsx');

function getGithubPreviewUrl(repoPath) {
  return `https://opengraph.githubassets.com/1/${repoPath}`;
}

function transformRegistryToUsers(registryData) {
  return Object.entries(registryData).map(([name, repoUrl]) => {
    const repoPath = repoUrl.replace('github:', '');
    
    const displayName = name
      .replace('@elizaos-plugins/plugin-', '')
      .replace('@elizaos-plugins/client-', '')
      .replace('@elizaos-plugins/adapter-', '')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const type = name.includes('client-') ? 'client' :
                 name.includes('adapter-') ? 'adapter' :
                 'plugin';

    return {
      title: displayName,
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} for ${displayName}`,
      preview: getGithubPreviewUrl(repoPath),
      website: `https://github.com/${repoPath}`,
      source: `https://github.com/${repoPath}`,
      tags: [type]
    };
  });
}

function fetchRegistry() {
  return new Promise((resolve, reject) => {
    https.get(REGISTRY_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function generateUsersFile() {
  try {
    const registryData = await fetchRegistry();
    const users = transformRegistryToUsers(registryData);
    
    const fileContent = `// This file is auto-generated. Do not edit directly.
import {type User} from './users';

export const registryUsers: User[] = ${JSON.stringify(users, null, 2)};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log('Successfully updated registry users data!');
  } catch (error) {
    console.error('Failed to update registry:', error);
    process.exit(1);
  }
}

generateUsersFile();
