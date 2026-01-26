# 5e8c73c1:packages_cli_src_commands_report_generate.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/generate.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    ...Object.fromEntries(
      Object.entries(baseMetrics).filter(
        ([key, value]) =>
          !['tokenCount', 'memoryUsage', 'diskUsage', 'cpuUsage'].includes(key) &&
          typeof value === 'number'
      )
    ),
  };

  return {
    run_id: matrixResult.runId,
    matrix_combination_id: matrixResult.combinationId,
    parameters: matrixResult.parameters,
    metrics: transformedMetrics,
    final_agent_response: finalResponse,
    evaluations: evaluations,
    trajectory: trajectory,
    error: matrixResult.error || null,
  };
}

export interface DataIngestionResult {
  validRuns: ScenarioRunResult[];
  matrixConfig: MatrixConfig;
  fileStats: {
    processed: number;
    skipped: number;
    errors: string[];
  };
}

/**
 * Create and configure the 'generate' subcommand
 */
export function createGenerateCommand(): Command {
  const command = new Command('generate')
    .description('Generate a comprehensive report from scenario matrix run data')
    .argument('<input_dir>', 'Directory containing run-*.json files from a matrix execution')
    .option(
      '--output-path <path>',
      'Path where the report file will be saved. When no format is specified, creates timestamped folder with all formats.'
    )
    .option(
      '--format <format>',
      'Output format: json, html, pdf, or all. If not specified, generates all formats in organized folder structure.'
    )
    .action(async (inputDir: string, options: GenerateCommandOptions) => {
      try {
        await executeGenerateCommand(inputDir, options);
      } catch (error) {
        console.error(
          '❌ Report generation failed:',
          error instanceof Error ? error.message : error
        );
        process.exit(1);
      }
    });

  return command;
}

/**
 * Main execution logic for the generate command
 */
export async function executeGenerateCommand(
  inputDir: string,
  options: GenerateCommandOptions
): Promise<void> {
  // Resolve input directory path
  const resolvedInputDir = resolve(inputDir);

  // Validate input directory exists
  await validateInputDirectory(resolvedInputDir);

  console.log(`🔍 Processing matrix run data from: ${resolvedInputDir}`);

  // Ingest and validate all run data
  const { validRuns, matrixConfig, fileStats } = await ingestRunData(resolvedInputDir);

  // Report file processing stats
  console.log(`📊 Data ingestion complete:`);
  console.log(`   • Valid runs processed: ${fileStats.processed}`);
  console.log(`   • Files skipped: ${fileStats.skipped}`);
  if (fileStats.errors.length > 0) {
    console.log(`   • Errors encountered: ${fileStats.errors.length}`);
    fileStats.errors.forEach((error) => console.log(`     - ${error}`));
  }

  if (validRuns.length === 0) {
    throw new Error('No valid run files found in the input directory');
  }

  // Generate report using the AnalysisEngine
  console.log(`⚙️  Analyzing ${validRuns.length} runs...`);
  const analysisEngine = new AnalysisEngine();
  const reportData = analysisEngine.processRunResults(validRuns, matrixConfig, resolvedInputDir, {
    processed: fileStats.processed,
    skipped: fileStats.skipped,
  });

  // Validate the generated report data
  try {
    ReportDataSchema.parse(reportData);
  } catch (validationError) {
    console.warn('⚠️  Generated report data failed schema validation:', validationError);
  }

  // Determine output behavior based on format option
  const format = options.format;

  if (!format || format === 'all') {
    // Default behavior: Generate all formats in organized timestamped folder
    await generateOrganizedReports(reportData, resolvedInputDir, options.outputPath);
  } else {
    // Specific format requested: Generate single format
    await generateSingleFormatReport(reportData, format, resolvedInputDir, options.outputPath);
  }
}

/**
 * Generate all report formats in an organized timestamped folder structure
 */
async function generateOrganizedReports(
  reportData: ReportData,
  _inputDir: string,
  customOutputPath?: string
): Promise<void> {
  // Create timestamped run folder
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19);
  const runId = `run-${timestamp}`;

  // Use custom output path or default to scenario logs subfolder
  const baseOutputDir = customOutputPath || join(__dirname, '..', 'scenario', '_logs_');
  const runDir = join(baseOutputDir, runId);

  // Ensure run directory exists
  await fs.mkdir(runDir, { recursive: true });

  console.log(`📁 Creating organized reports in: ${runDir}`);

  // Generate all three formats
  const jsonPath = join(runDir, 'report.json');
  const htmlPath = join(runDir, 'report.html');
  const pdfPath = join(runDir, 'report.pdf');

  try {
    // Generate JSON report
    console.log('📊 Generating JSON report...');
    await generateJsonReport(reportData, jsonPath);

```