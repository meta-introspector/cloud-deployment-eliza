# 5e8c73c1:packages_cli_src_commands_report_generate.ts:751-826

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/generate.ts:751-826
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      `<script id="report-data" type="application/json">\n  ${JSON.stringify(reportData, null, 2)}\n</script>`
    );

    // Write the complete HTML report
    await fs.writeFile(outputPath, htmlReport, 'utf-8');
  } catch (error) {
    throw new Error(
      `Failed to generate HTML report: ${(error as Error).message}. Make sure the HTML template exists at ${templatePath}`
    );
  }
}

/**
 * Generate PDF report file by first creating HTML then converting to PDF
 */
async function generatePdfReport(reportData: ReportData, outputPath: string): Promise<void> {
  console.log('📋 Generating PDF report...');

  try {
    // First generate the HTML content (same as HTML report)
    // Try built path first, then source path for development
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
    const templateContent = await fs.readFile(templatePath, 'utf-8');

    // Inject the real data into the template
    const htmlContent = templateContent.replace(
      /<script id="report-data" type="application\/json">\s*\{\s*<\/script>/s,
      `<script id="report-data" type="application/json">\n  ${JSON.stringify(reportData, null, 2)}\n</script>`
    );

    console.log('🔄 Converting HTML to PDF using Puppeteer...');

    // Use our PDF generator to convert HTML to PDF
    await generatePerformanceReportPdf(htmlContent, outputPath);

    console.log('✅ PDF report generated successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Provide helpful error messages for common issues
    if (errorMessage.includes('Could not find Chromium')) {
      throw new Error(
        'PDF generation failed: Chromium browser not found. Please install Puppeteer dependencies or use --format html instead.'
      );
    } else if (errorMessage.includes('Navigation timeout')) {
      throw new Error(
        'PDF generation failed: Timeout while loading report. The report may be too large or complex.'
      );
    } else {
      throw new Error(`Failed to generate PDF report: ${errorMessage}`);
    }
  }
}
```