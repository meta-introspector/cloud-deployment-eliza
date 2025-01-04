#!/bin/sh

# Node.js version check
REQUIRED_NODE_VERSION=23.5.0
nvm use $REQUIRED_NODE_VERSION
CURRENT_NODE_VERSION=$(node -v | cut -d'.' -f1-3 | sed 's/v//')

# Compare Node versions
if [ "$(expr "$CURRENT_NODE_VERSION" \< "$REQUIRED_NODE_VERSION")" -eq 1 ]; then
    echo "\033[1;31mError: Node.js version must be $REQUIRED_NODE_VERSION or higher. Current version is $CURRENT_NODE_VERSION.\033[0m"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm >/dev/null 2>&1; then
    echo "\033[1;31mError: pnpm is not installed. Please install pnpm before running the script.\033[0m"
    exit 1
fi

# Navigate to project root
cd "$(dirname "$0")"/.. || exit 1

# Build project
echo "\033[1mBuilding project...\033[0m"
if ! pnpm build; then
    echo "\033[1;31mFailed to build project.\033[0m"
    exit 1
fi

# Start project
echo "\033[1mStarting project...\033[0m"
if ! pnpm start; then
    echo "\033[1;31mFailed to start project.\033[0m"
    exit 1
fi

