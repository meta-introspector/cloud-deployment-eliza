# a7046c18:scripts_analyze-code-quality.sh:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/analyze-code-quality.sh:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/bin/bash

# elizaOS Code Quality Analysis Script
# This script performs comprehensive code quality checks similar to the GitHub workflow
# Runs the same analysis as the daily workflow (scheduled at 12:00 PM UTC)

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RESULTS_DIR="analysis-results"
TIMESTAMP=$(date -u '+%Y-%m-%d_%H-%M-%S')
REPORT_FILE="${RESULTS_DIR}/full-report-${TIMESTAMP}.md"

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

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Create results directory
mkdir -p "${RESULTS_DIR}"

print_info "Starting elizaOS Code Quality Analysis"
print_info "Results will be saved to: ${REPORT_FILE}"
echo ""

# Check for required tools
print_info "Checking required tools..."
if ! command_exists bun; then
    print_error "bun is not installed. Please install bun first."
    exit 1
fi

# Initialize report
cat > "${REPORT_FILE}" << EOF
# elizaOS Code Quality Analysis Report
Generated on: $(date -u '+%Y-%m-%d %H:%M:%S UTC')

This automated analysis checks for:
- Dead code using [Knip](https://knip.dev/)
- Code quality issues
- Security vulnerabilities
- Missing test coverage
- Type safety violations
- Documentation gaps
- Repository standard violations

---

EOF

# Step 1: Dead Code Analysis with Knip
print_info "Running dead code analysis with Knip..."
{
    echo "## Dead Code Analysis"
    echo ""
    echo "Analyzed using [Knip](https://knip.dev/) - a comprehensive dead code detection tool"
    echo ""

    # Check if Knip is installed
    if ! command_exists knip && ! bunx knip --version >/dev/null 2>&1; then
        print_warning "Knip not found. Installing..."
        bun add -D knip
    fi

    echo "### Knip Analysis Results"
    if [ -f "knip.config.ts" ] || [ -f "knip.json" ]; then
        bunx knip --reporter compact 2>&1 || echo "Knip analysis completed with issues"
    else
        print_warning "No Knip config found. Using default configuration..."
        # Create temporary Knip config
        cat > knip.temp.json << 'KNIPEOF'
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": ["packages/*/src/index.ts", "packages/*/src/index.js"],
  "project": ["packages/**/src/**/*.{ts,tsx,js,jsx}", "!packages/**/dist/**", "!packages/**/node_modules/**"],
  "ignore": ["**/*.test.ts", "**/*.spec.ts", "**/__tests__/**", "**/test/**", "**/tests/**"],
  "ignoreExportsUsedInFile": true
}
KNIPEOF
        bunx knip --config knip.temp.json --reporter compact 2>&1 || echo "Knip analysis completed with issues"
        rm -f knip.temp.json
    fi

    echo ""
    echo "### Potentially Orphaned Files"
    find packages -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | \
        grep -v node_modules | grep -v dist | while read file; do
        filename=$(basename "$file")
        if [[ ! "$filename" =~ \.(test|spec)\. ]]; then
            if ! grep -r "from.*${filename%.*}" packages --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist >/dev/null 2>&1; then
                echo "- $file"
            fi
        fi
    done | head -20 || echo "Analysis completed"
} >> "${REPORT_FILE}"

# Step 2: Code Quality Analysis
print_info "Analyzing code quality..."
{
    echo -e "\n---\n"
    echo "## Code Quality Analysis"
    echo ""

    echo "### Console.log Statements Found"
    grep -r "console\.log" packages --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -20 || echo "None found"

    echo ""
    echo "### TODO/FIXME Comments"
    grep -r "TODO\|FIXME" packages --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null | head -20 || echo "None found"

    echo "### Long Functions (>50 lines)"
    find packages -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | while read file; do
        awk '
        BEGIN {
            brace_count = 0
            in_function = 0
            function_start = 0
            function_name = ""
        }
        
        # Function declaration patterns - more specific and comprehensive
        /^(export\s+)?(async\s+)?function\s+\w+\s*\(/ ||
        /^(export\s+)?(async\s+)?const\s+\w+\s*=\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?const\s+\w+\s*:\s*\w*\s*=\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?let\s+\w+\s*=\s*(async\s*)?\(/ ||
        /^(export\s+)?(async\s+)?var\s+\w+\s*=\s*(async\s*)?\(/ ||
```