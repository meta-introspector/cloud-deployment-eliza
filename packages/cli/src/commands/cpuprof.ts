import { buildProject } from '@/src/utils/build-project';
import { logger, splitChunks } from '@elizaos/core';

import { Command } from 'commander';
import fs from 'node:fs';

import { loadCharacterTryPath } from '../server/loader';
//import { handleError } from '../utils/handle-error';

/**
 * A parsed .cpuprofile as defined previously
 */
export type Profile = {
  nodes: Array<ProfileNode>;
  startTime: number;
  endTime: number;
  samples: Array<number>;
  timeDeltas: Array<number>;
};

export type ProfileNode = {
  id: number;
  callFrame: {
    functionName?: string;
    scriptId: string;
    url: string;
    lineNumber: number;
    columnNumber: number;
  };
  hitCount?: number;
  children?: number[];
};

type ReportChunk = {
  title: string;
  content: string;
};

/**
 * Generates an overview function textual report from a CPU profile for LLM processing
 * @param profile The CPU profile to process
 * @returns An array of functions grouped by their function name and category
 *  */

export function generateFunctionalCategoryReport(profile: Profile): ReportChunk {
  const functionRegex = /([a-zA-Z0-9_]+)/g;
  const functions: { name: string; category: string }[] = [];
  const functionGroups: { [key: string]: string[] } = {};

  const nodeDetails = profile.nodes.map((node) => {
    const { functionName, scriptId, url, lineNumber, columnNumber } = node.callFrame;
    let match;

    //      if (!url.includes("eliza")) {
    //	  return []
    //      }
    //      if (url.includes("node_modules")) {
    //	  return []
    //      }
    let url2 = url.replaceAll(
      'file:///mnt/data1/nix/time/2025/03/14/cloud-deployment-eliza/',
      'PRJ'
    );

    //console.log(node)
    //while ((match = functionRegex.exec(functionName)) !== null) {
    //   const functionCategory = functionName.substring(0, match.index).trim();
    //   functions.push({ name: match[1], category: functionCategory });
    //functionGroups[ url ]
    //  }
    if (!functionGroups[url2]) {
      functionGroups[url2] = [];
    }
    functionGroups[url2].push(functionName);
    //console.log(url2, functionName);
  });
  //functions.forEach((func) => {
  //
  //});
  const report: ReportChunk = {
    title: 'Function Categories Report',
    content: `Functions by category:
${Object.entries(functionGroups)
  .map(([category, functions]) => {
    return `- ${category}:
${functions.join(', ')}`;
  })
  .join('\n')}`,
  };
  console.log(functionGroups);
  const chunks: ReportChunk = {
    title: 'Function Categories Report',
    content: `Functions by category:`,
  };
  return chunks;
  //return report;
}

function profileMetadata(profile: Profile): ReportChunk {
  const totalDuration = profile.endTime - profile.startTime;
  const chunk = {
    title: 'Profile Metadata',
    content: `
Profile Metadata:
- Start Time: ${profile.startTime} microseconds
- End Time: ${profile.endTime} microseconds
- Total Duration: ${totalDuration} microseconds
- Number of Nodes: ${profile.nodes.length}
- Number of Samples: ${profile.samples.length}
Summary: This CPU profile was captured over a ${totalDuration} microsecond period, tracking ${profile.nodes.length} distinct nodes across ${profile.samples.length} samples.
      `.trim(),
  };
  return chunk;
}

function nodeDetails(profile: Profile): ReportChunk {
  const chunk = {
    title: 'Node Details',
    content: `
Node Details:
${profile.nodes
  .map((node) => {
    const { functionName, scriptId, url, lineNumber, columnNumber } = node.callFrame;
    return `
Node ID: ${node.id}
Function Name: ${functionName || 'N/A'}
Script ID: ${scriptId}
URL: ${url}
Line Number: ${lineNumber}
Column Number: ${columnNumber}
          `.trim();
  })
  .join('\n\n')}
      `.trim(),
  };
  return chunk;
}

function sampleData(profile: Profile): ReportChunk {
  const chunk = {
    title: 'Sample Data',
    content: `
Sample Data:
${profile.samples
  .map((sample, index) => {
    const node = profile.nodes.find((node) => node.id === sample);
    const { functionName, scriptId, url, lineNumber, columnNumber } = node?.callFrame || {};
    return `
Sample ${index + 1}:
Node ID: ${sample}
Function Name: ${functionName || 'N/A'}
Script ID: ${scriptId}
URL: ${url}
Line Number: ${lineNumber}
Column Number: ${columnNumber}
          `.trim();
  })
  .join('\n\n')}
      `.trim(),
  };
  return chunk;
}

// const sampleData = profile.samples.map((sample, index) => {
//   const node = profile.nodes.find(node => node.id === sample);
//   const { functionName, scriptId, url, lineNumber, columnNumber } = node?.callFrame || {};
//   return `
// Sample ${index + 1}:
// Node ID: ${sample}
// Function Name: ${functionName || 'N/A'}
// Script ID: ${scriptId}
// URL: ${url}
// Line Number: ${lineNumber}
// Column Number: ${columnNumber}
//   `.trim();
// }).join('\n\n');
// chunks.push({
//   title: "Sample Data",
//   content: `
// Sample Data:
// ${sampleData}
//   `.trim()
// });

// const nodeDetails = profile.nodes.map(node => {
//   const { functionName, scriptId, url, lineNumber, columnNumber } = node.callFrame;
//   return `
// Node ID: ${node.id}
// Function Name: ${functionName || 'N/A'}
// Script ID: ${scriptId}
// URL: ${url}
// Line Number: ${lineNumber}
// Column Number: ${columnNumber}
// Hit Count: ${node.hitCount || 'N/A'}
// Children: ${node.children ? node.children.join(', ') : 'N/A'}
//   `.trim();
// }).join('\n\n');
// chunks.push({
//   title: "Node Details",
//   content: `
// Node Details:
// ${nodeDetails}
//   `.trim()
// });

function samepleData(profile: Profile): ReportChunk[] {
  // Chunk 4: Time Deltas
  const chunks: ReportChunk[] = [];
  const timeDeltas = profile.timeDeltas.map((delta, index) => {
    const node = profile.nodes.find((node) => node.id === delta);
    const { functionName, scriptId, url, lineNumber, columnNumber } = node?.callFrame || {};
    let content = `
Time Delta ${index + 1}:
Node ID: ${delta}
Function Name: ${functionName || 'N/A'}
Script ID: ${scriptId}
URL: ${url}
Line Number: ${lineNumber}
Column Number: ${columnNumber}`;

    const chunk = {
      title: 'Time Deltas',
      content: content,
    };
  });

  return chunks;
}

export function generateProfileReport(profile: Profile): ReportChunk[] {
  const chunks: ReportChunk[] = [];

  // Chunk 1: Profile Metadata

  //chunks.push(profileMetadata(profile));
  chunks.push(generateFunctionalCategoryReport(profile));
  //chunks.push(nodeDetails(profile));

  //chunks.push(sampleData(profile));

  // Chunk 3: Sample Data

  return chunks;
}

const profileAgents = async (options: { profile?: string }) => {
  let profile_file = options.profile;
  console.log('profile agents', profile_file);

  const profile = JSON.parse(fs.readFileSync(profile_file, 'utf-8'));
  //console.log(profile)
  const report = generateProfileReport(profile);
  console.log(report);
};

export const cpuprof = new Command()
  .name('cpuprof')
  .description('Process profile')
  .option('-p, --profile <trainer>', 'Profile to use')
  .action(async (options) => {
    console.log('Profile!');
    //displayBanner();

    //try {
    // Build the project first unless skip-build is specified
    if (options.build) {
      await buildProject(process.cwd());
    }

    // Collect server options
    const characterPath = options.character;

    if (characterPath) {
      options.characters = [];
      try {
        // if character path is a comma separated list, load all characters
        // can be remote path also
        if (characterPath.includes(',')) {
          const characterPaths = characterPath.split(',');
          for (const characterPath of characterPaths) {
            logger.info(`Loading character from ${characterPath}`);
            const characterData = await loadCharacterTryPath(characterPath);
            options.characters.push(characterData);
          }
        }
        await profileAgents(options);
      } catch (error) {
        logger.error(`Failed to load character: ${error}`);
        process.exit(1);
      }
    } else {
      await profileAgents(options);
    }
    // } catch (error) {
    //   handleError(error);
    // }
  });
