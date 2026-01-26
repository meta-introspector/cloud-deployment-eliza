# 5e8c73c1:packages_cli_src_commands_report_generate.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/generate.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        fileStats.skipped++;
        const fileName = filePath.split('/').pop() || filePath;
        if (error instanceof SyntaxError) {
          fileStats.errors.push(`${fileName}: Invalid JSON format`);
        } else {
          fileStats.errors.push(`${fileName}: ${(error as Error).message}`);
        }
        console.warn(`⚠️  Skipping malformed file: ${fileName}`);
      }
    }

    // Extract matrix parameters from the run data if not available in config
    if (matrixConfig.matrix.length === 0 && validRuns.length > 0) {
      matrixConfig = inferMatrixConfigFromRuns(matrixConfig, validRuns);
    }
  } catch (error) {
    throw new Error(`Failed to process input directory: ${(error as Error).message}`);
  }

  return {
    validRuns,
    matrixConfig,
    fileStats,
  };
}

/**
 * Infer matrix configuration from the parameter variations found in run data
 */
function inferMatrixConfigFromRuns(
  baseConfig: MatrixConfig,
  runs: ScenarioRunResult[]
): MatrixConfig {
  const parameterVariations: Map<string, Set<any>> = new Map();

  // Collect all parameter variations
  runs.forEach((run) => {
    collectParameterPaths(run.parameters, '', parameterVariations);
  });

  // Convert to matrix axes
  const matrixAxes = Array.from(parameterVariations.entries())
    .filter(([_, values]) => values.size > 1) // Only include parameters that vary
    .map(([parameter, values]) => ({
      parameter,
      values: Array.from(values),
    }));

  return {
    ...baseConfig,
    matrix: matrixAxes,
  };
}

/**
 * Recursively collect all parameter paths and their values
 */
function collectParameterPaths(
  obj: unknown,
  currentPath: string,
  variations: Map<string, Set<string | number | boolean | null>>,
  maxDepth = 3,
  currentDepth = 0
): void {
  if (currentDepth >= maxDepth || obj === null || typeof obj !== 'object') {
    return;
  }

  const objRecord = obj as Record<string, unknown>;
  Object.entries(objRecord).forEach(([key, value]) => {
    const paramPath = currentPath ? `${currentPath}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recurse into nested objects
      collectParameterPaths(value, paramPath, variations, maxDepth, currentDepth + 1);
    } else {
      // Leaf value - track this parameter
      if (!variations.has(paramPath)) {
        variations.set(paramPath, new Set<string | number | boolean | null>());
      }
      const valueToAdd = value as string | number | boolean | null;
      variations.get(paramPath)!.add(valueToAdd);
    }
  });
}

/**
 * Generate JSON report file
 */
async function generateJsonReport(reportData: ReportData, outputPath: string): Promise<void> {
  await fs.writeFile(outputPath, JSON.stringify(reportData, null, 2), 'utf8');
}

/**
 * Generate HTML report file using the template
 */
async function generateHtmlReport(reportData: ReportData, outputPath: string): Promise<void> {
  // Load the HTML template - try built path first, then source path for development
  const builtTemplatePath = join(__dirname, 'src', 'assets', 'report_template.html');
  const sourceTemplatePath = join(
    __dirname,
    '..',
    '..',
    '..',
    'src',
    'commands',
    'report',
    'src',
    'assets',
    'report_template.html'
  );

  let templatePath: string;
  if (existsSync(builtTemplatePath)) {
    templatePath = builtTemplatePath;
  } else if (existsSync(sourceTemplatePath)) {
    templatePath = sourceTemplatePath;
  } else {
    throw new Error(
      `HTML template not found. Searched:\n- ${builtTemplatePath}\n- ${sourceTemplatePath}`
    );
  }

  try {
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // Inject the real data into the template
    const dataIslandStart = templateContent.indexOf(
      '<script id="report-data" type="application/json">'
    );
    if (dataIslandStart !== -1) {
      const dataIslandEnd = templateContent.indexOf('</script>', dataIslandStart);
      if (dataIslandEnd !== -1) {
        const dataIslandContent = templateContent.substring(dataIslandStart, dataIslandEnd + 8);

        // Replace the entire data island
        const htmlReport = templateContent.replace(
          dataIslandContent,
          `<script id="report-data" type="application/json">\n  ${JSON.stringify(reportData, null, 2)}\n</script>`
        );

        // Write the complete HTML report
        await fs.writeFile(outputPath, htmlReport, 'utf-8');
        return;
      }
    }

    // Fallback to regex approach if exact match fails
    const htmlReport = templateContent.replace(
      /<script id="report-data" type="application\/json">[\s\S]*?<\/script>/,
```