#!/bin/bash 
set -e
# Delete all images in a repository
# Usage: ./delete.sh <repository-name>
# Example: ./delete.sh agent/eliza
# Note: This script will not delete the repository itself, only the images in it


if [ -z "$1" ]; then
    echo "Error: Repository name is required."
    echo "Usage: ./delete.sh <repository-name>"
    exit 1
fi

echo "Deleting all images in repository: $1"
aws ecr batch-delete-image  \
    --repository-name "$1" \
    --image-ids "$(aws ecr list-images  --repository-name "$1" --query 'imageIds[*]' --output json)" || true
echo "Deletion process completed."