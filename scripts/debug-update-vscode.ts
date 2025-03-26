#!/usr/bin/env node
// UNTESTED AI generated code
// purpose to run debug inspect and update the inspector debugger command for vscode

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const bunArgs = ['--verbose', '--inspect-brk=9229', '../cli/dist/index.js', 'start'];
const port = 9229;
const workspaceFolder = path.resolve(__dirname);

// Function to run Bun and capture inspector URL
async function runBunAndGetInspectorUrl() {
  return new Promise((resolve, reject) => {
    const bunProcess = spawn('bun', bunArgs, {
      cwd: workspaceFolder,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let output = '';

    bunProcess.stdout.on('data', (data) => {
      output += data.toString();
      // Look for the inspector WebSocket URL
      const match = output.match(/ws:\/\/[0-9]+.[0-9]+.[0-9]+.[0-9]+:9229\/([a-z0-9]+)/i);
      if (match) {
        bunProcess.kill(); // Stop the process once we have the URL
        resolve(match[0]); // Return the full WebSocket URL
      }
    });

    bunProcess.stderr.on('data', (data) => {
      console.error('Error:', data.toString());
    });

    bunProcess.on('error', (err) => reject(err));

    // Timeout in case we don't get the URL
    setTimeout(() => {
      bunProcess.kill();
      reject(new Error('Timeout waiting for inspector URL'));
    }, 5000);
  });
}

// Generate VS Code launch configuration
async function generateLaunchConfig(inspectorUrl) {
  const config = {
    version: '0.2.0',
    configurations: [
      {
        type: 'bun',
        request: 'launch',
        name: 'Launch Bun with Inspector',
        program: '${workspaceFolder}/../cli/dist/index.js',
        args: ['start'],
        runtimeArgs: ['--verbose', `--inspect-brk=${port}`],
        cwd: '${workspaceFolder}',
        port: port,
        stopOnEntry: true,
      },
      {
        type: 'bun',
        request: 'attach',
        name: 'Attach to Bun Inspector',
        url: inspectorUrl,
      },
    ],
  };

  const vscodeDir = path.join(workspaceFolder, '.vscode');
  const launchFile = path.join(vscodeDir, 'launch.json');

  // Ensure .vscode directory exists
  await fs.mkdir(vscodeDir, { recursive: true });

  // Write the configuration file
  await fs.writeFile(launchFile, JSON.stringify(config, null, 2), 'utf8');

  console.log(`Generated launch.json at: ${launchFile}`);
  console.log('Inspector URL:', inspectorUrl);
}

// Main execution
async function main() {
  try {
    console.log('Starting Bun to capture inspector URL...');
    const inspectorUrl = await runBunAndGetInspectorUrl();
    console.log('Generating VS Code launch configuration...');
    await generateLaunchConfig(inspectorUrl);
    console.log('Done!');
  } catch (error) {
    console.error('Failed to generate launch configuration:', error.message);
    process.exit(1);
  }
}

main();
