# GitHub Pages Setup

## Enable GitHub Pages

1. Go to repository settings: https://github.com/meta-introspector/cloud-deployment-eliza/settings/pages

2. Under "Build and deployment":
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Click Save

3. The site will be available at:
   https://meta-introspector.github.io/cloud-deployment-eliza/

## Workflow

The GitHub Actions workflow (`.github/workflows/generate-docs.yml`) will:

1. **Trigger on:**
   - Push to `main` or `zos-meme-timeline` branches
   - Manual workflow dispatch

2. **Generate:**
   - Novelty analysis report (JSON)
   - Static HTML documentation site
   - Deploy to `gh-pages` branch

3. **Content:**
   - Repository statistics
   - Top concepts from analysis
   - Links to ZOS timeline and reports

## Manual Trigger

Run manually from GitHub Actions tab:
https://github.com/meta-introspector/cloud-deployment-eliza/actions/workflows/generate-docs.yml

Click "Run workflow" button.
