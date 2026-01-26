# a7046c18:scripts_check-docs-consistency.sh:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/check-docs-consistency.sh:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/bin/bash

# elizaOS Documentation Consistency Checker
# This script checks if documentation is accurate and up-to-date with the codebase

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
DOCS_DIR="packages/docs/docs"
RESULTS_DIR="analysis-results"
TIMESTAMP=$(date -u '+%Y-%m-%d_%H-%M-%S')
REPORT_FILE="${RESULTS_DIR}/docs-consistency-report-${TIMESTAMP}.md"

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_section() {
    echo -e "${MAGENTA}[CHECKING]${NC} $1"
}

# Create results directory
mkdir -p "${RESULTS_DIR}"

# Initialize report
cat > "${REPORT_FILE}" << EOF
# elizaOS Documentation Consistency Report
Generated on: $(date -u '+%Y-%m-%d %H:%M:%S UTC')

This report checks if documentation accurately reflects the current codebase.

---

EOF

print_info "Starting elizaOS Documentation Consistency Check"
print_info "Results will be saved to: ${REPORT_FILE}"
echo ""

# Function to check if a code entity is documented
check_entity_documented() {
    local entity=$1
    local entity_type=$2

    if ! grep -r "$entity" "$DOCS_DIR" --include="*.md" >/dev/null 2>&1; then
        echo "- $entity_type '$entity' is not documented anywhere"
    fi
}

# Step 1: Check Core Classes/Interfaces Documentation
print_section "Core Classes and Interfaces Documentation"
{
    echo "## Core Classes and Interfaces Documentation"
    echo ""
    echo "### Checking if core types from types.ts are documented..."

    # Extract major interfaces and types from core/src/types.ts
    if [ -f "packages/core/src/types.ts" ]; then
        # Extract interface and type names
        grep -E "^export (interface|type) \w+" "packages/core/src/types.ts" | \
        sed -E 's/export (interface|type) (\w+).*/\2/' | \
        while read -r type_name; do
            check_entity_documented "$type_name" "Type/Interface"
        done | sort -u | head -20
    else
        echo "Could not find packages/core/src/types.ts"
    fi

    echo ""
    echo "### Checking if core services are documented..."
    # Check if services mentioned in code are documented
    find packages -name "*.ts" -path "*/services/*" -type f | while read -r service_file; do
        service_name=$(basename "$service_file" .ts)
        if [[ ! "$service_name" =~ test|spec|index ]]; then
            check_entity_documented "$service_name" "Service"
        fi
    done | sort -u | head -20
} >> "${REPORT_FILE}"

# Step 2: Check Plugin Documentation
print_section "Plugin Documentation"
{
    echo -e "\n---\n"
    echo "## Plugin Documentation"
    echo ""
    echo "### Checking if all plugins have documentation..."

    for plugin_dir in packages/plugin-*; do
        if [ -d "$plugin_dir" ]; then
            plugin_name=$(basename "$plugin_dir")
            if ! grep -r "$plugin_name" "$DOCS_DIR" --include="*.md" >/dev/null 2>&1; then
                echo "- Plugin '$plugin_name' has no documentation"

                # Check if plugin has a README
                if [ -f "$plugin_dir/README.md" ]; then
                    echo "  (Has README.md but not in main docs)"
                fi
            fi
        fi
    done
} >> "${REPORT_FILE}"

# Step 3: Check for Outdated Import Examples
print_section "Outdated Code Examples"
{
    echo -e "\n---\n"
    echo "## Outdated Code Examples in Documentation"
    echo ""

    echo "### Checking for outdated package names..."
    # Check for old package names
    grep -r "@ai16z/" "$DOCS_DIR" --include="*.md" 2>/dev/null | while read -r line; do
        file=$(echo "$line" | cut -d: -f1)
        echo "- $file: Contains old package name @ai16z/ (should be @elizaos/)"
    done | head -10

    echo ""
    echo "### Checking for incorrect import paths..."
    # Check for imports from packages/core instead of @elizaos/core
    grep -r "from ['\"]packages/core" "$DOCS_DIR" --include="*.md" 2>/dev/null | while read -r line; do
        file=$(echo "$line" | cut -d: -f1)
        echo "- $file: Imports from packages/core (should be @elizaos/core)"
    done | head -10

    echo ""
    echo "### Checking for non-bun commands..."
    # Check for npm/yarn/pnpm commands in docs
    grep -rE "(npm install|npm run|yarn|pnpm|npx)" "$DOCS_DIR" --include="*.md" 2>/dev/null | \
    grep -v "bun" | while read -r line; do
```