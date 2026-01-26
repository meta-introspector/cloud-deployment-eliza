# 5e8c73c1:packages_cli_src_commands_report_generate.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/generate.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    // Generate HTML report
    console.log('🌐 Generating HTML report...');
    await generateHtmlReport(reportData, htmlPath);

    // Generate PDF report using external Puppeteer (workaround for Chrome hanging issue)
    console.log('📄 Generating PDF report...');
    await generatePdfReportWorkaround(htmlPath, pdfPath);

    // Create run summary
    const readmePath = join(runDir, 'README.md');
    const readmeContent = createRunSummary(runId, reportData);
    await fs.writeFile(readmePath, readmeContent, 'utf-8');

    // Report success
    console.log(`✅ All reports generated successfully:`);
    console.log(`   • Location: ${runDir}`);
    console.log(`   • JSON Report: report.json`);
    console.log(`   • HTML Report: report.html`);
    console.log(`   • PDF Report: report.pdf`);
    console.log(`   • Run Summary: README.md`);
    console.log(`   • Total runs analyzed: ${reportData.summary_stats.total_runs}`);
    console.log(
      `   • Overall success rate: ${(reportData.summary_stats.overall_success_rate * 100).toFixed(1)}%`
    );
    console.log(
      `   • Average execution time: ${reportData.summary_stats.average_execution_time.toFixed(2)}s`
    );
    console.log(`   • Common trajectory patterns: ${reportData.common_trajectories.length}`);
  } catch (error) {
    throw new Error(
      `Failed to generate organized reports: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Generate a single format report (legacy behavior for specific format requests)
 */
async function generateSingleFormatReport(
  reportData: ReportData,
  format: string,
  inputDir: string,
  customOutputPath?: string
): Promise<void> {
  // Determine output path and format
  const defaultFileName =
    format === 'html' ? 'report.html' : format === 'pdf' ? 'report.pdf' : 'report.json';
  const outputPath = customOutputPath || join(inputDir, defaultFileName);
  const resolvedOutputPath = resolve(outputPath);

  // Ensure output directory exists
  await fs.mkdir(resolve(resolvedOutputPath, '..'), { recursive: true });

  // Generate output based on format
  if (format === 'html') {
    await generateHtmlReport(reportData, resolvedOutputPath);
  } else if (format === 'json') {
    await generateJsonReport(reportData, resolvedOutputPath);
  } else if (format === 'pdf') {
    await generatePdfReport(reportData, resolvedOutputPath);
  } else {
    throw new Error(`Unsupported format: ${format}. Supported formats: json, html, pdf, all`);
  }

  console.log(`✅ Report generated successfully:`);
  console.log(`   • Output file: ${resolvedOutputPath}`);
  console.log(`   • Total runs analyzed: ${reportData.summary_stats.total_runs}`);
  console.log(
    `   • Overall success rate: ${(reportData.summary_stats.overall_success_rate * 100).toFixed(1)}%`
  );
  console.log(
    `   • Average execution time: ${reportData.summary_stats.average_execution_time.toFixed(2)}s`
  );
  console.log(`   • Common trajectory patterns: ${reportData.common_trajectories.length}`);
}

/**
 * Create a run summary markdown file
 */
function createRunSummary(runId: string, reportData: ReportData): string {
  return `# Run Summary: ${runId}

## Generated Reports
- **JSON Report**: report.json - Raw data and analysis results
- **HTML Report**: report.html - Interactive web report with charts  
- **PDF Report**: report.pdf - Print-ready formatted report

## Run Details
- **Timestamp**: ${new Date().toISOString()}
- **Total Runs Analyzed**: ${reportData.summary_stats.total_runs}
- **Overall Success Rate**: ${(reportData.summary_stats.overall_success_rate * 100).toFixed(1)}%
- **Average Execution Time**: ${reportData.summary_stats.average_execution_time.toFixed(2)}s
- **Common Trajectory Patterns**: ${reportData.common_trajectories.length}

## Analysis Summary
${
  reportData.summary_stats.total_runs > 0
    ? `
- **Total Test Cases**: ${reportData.summary_stats.total_runs}
- **Successful Runs**: ${Math.round(reportData.summary_stats.total_runs * reportData.summary_stats.overall_success_rate)}
- **Failed Runs**: ${reportData.summary_stats.total_runs - Math.round(reportData.summary_stats.total_runs * reportData.summary_stats.overall_success_rate)}
- **Average Duration**: ${reportData.summary_stats.average_execution_time.toFixed(2)} seconds
`
    : 'No run data available.'
}

## Usage
- Open \`report.html\` in a web browser for interactive viewing
- Use \`report.json\` for programmatic analysis  
- Print or share \`report.pdf\` for formal reports

## Matrix Parameters
${
  Object.keys(reportData.results_by_parameter).length > 0
    ? Object.keys(reportData.results_by_parameter)
        .map(
          (param) =>
            `- **${param}**: ${Object.keys(reportData.results_by_parameter[param]).length} variations`
        )
        .join('\n')
    : 'No parameter variations detected.'
}
`;
}

/**
 * Generate PDF using external Puppeteer (workaround for Chrome hanging in CLI context)
 */
async function generatePdfReportWorkaround(htmlPath: string, pdfPath: string): Promise<void> {
  const { spawn } = await import('child_process');

  return new Promise((resolve, reject) => {
    const nodeScript = `
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  try {
    console.log('📄 Reading HTML from:', '${htmlPath}');
    const htmlContent = fs.readFileSync('${htmlPath}', 'utf-8');
    console.log('🚀 Launching Chrome for PDF conversion...');
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    console.log('📋 Generating PDF...');
    await page.pdf({ path: '${pdfPath}', format: 'A4', printBackground: true });
    await browser.close();
    console.log('✅ PDF generated successfully');
  } catch (error) {
    console.error('❌ PDF generation failed:', error.message);
```