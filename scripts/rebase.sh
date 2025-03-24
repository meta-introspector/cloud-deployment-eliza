#!/bin/bash

# Daily Git Routine Script
# Date: March 24, 2025
# Purpose: Automate daily Git workflow for the eliza project

# Set variables
#REPO_DIR="$HOME/03/14/cloud-deployment-eliza"  # Adjust this path to your actual directory
DATE=$(date +%Y/%m/%d)                         # Dynamically set today's date (e.g., 2025/03/24)
BRANCH_NAME="docker/$DATE"                     # Dynamic branch name based on date

# Check if the repository directory exists
#if [ ! -d "$REPO_DIR" ]; then
#    echo "Error: Directory $REPO_DIR not found. Please check the path."
#    exit 1
#fi

# Navigate to the repository
#cd "$REPO_DIR" || {
#    echo "Error: Could not change to directory $REPO_DIR"
#    exit 1
#}

# Fetch all remote branches
git fetch --all

# Checkout the feature/v2/telegram branch
#git checkout feature/v2/telegram

# Add upstream remote only if it doesn't already exist
if ! git remote | grep -q "upstream"; then
    git remote add upstream https://github.com/elizaos/eliza
    echo "Added upstream remote."
else
    echo "Upstream remote already exists."
fi

# Fetch updates from upstream
git fetch upstream

# Rebase the current branch onto upstream/v2-develop
git rebase upstream/v2-develop

# Check the status of the repository
git status

# Print the current date for reference
date

# Create and checkout a new branch with today's date
git checkout -b "$BRANCH_NAME"

# Push the new branch and set upstream
git push --set-upstream origin "$BRANCH_NAME"

echo "Daily Git routine completed successfully!"
