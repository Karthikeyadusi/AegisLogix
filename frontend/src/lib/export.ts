import type { AnalysisResponse } from '../types/api';

/**
 * Downloads a raw JSON object as a formatted file.
 */
export function exportToJson(data: AnalysisResponse, sourceFileName: string = 'container'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const baseName = sourceFileName.split('.')[0] || 'container';
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `aegislogix_telemetry_${baseName}_${Date.now()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a plain-text industrial compliance report.
 */
export function exportToTextReport(
  data: AnalysisResponse,
  sourceFileName: string
): void {
  const criticalCount = data.details.filter((d) => d.confidence >= 0.7).length;
  const minorCount = data.details.filter((d) => d.confidence < 0.7).length;

  const reportLines = [
    '==================================================',
    '       AEGISLOGIX INDUSTRIAL COMPLIANCE REPORT    ',
    '==================================================',
    `Timestamp:           ${new Date().toISOString()}`,
    `Target Image File:   ${sourceFileName}`,
    `Analysis Status:     ${data.status.toUpperCase()}`,
    `Total Issues Found:  ${data.total_issues}`,
    `  - Critical Severity (Conf >= 70%): ${criticalCount}`,
    `  - Minor Severity    (Conf < 70%):  ${minorCount}`,
    '',
    '--------------------------------------------------',
    'DETECTION TELEMETRY BREAKDOWN:',
    '--------------------------------------------------',
    ...data.details.map((detail, idx) => {
      const isCritical = detail.confidence >= 0.7;
      const confPct = (detail.confidence * 100).toFixed(1);
      const [x1, y1, x2, y2] = detail.bbox;
      return (
        `${idx + 1}. [${detail.class_name.toUpperCase()}]` +
        ` | Confidence: ${confPct}%` +
        ` | Severity: ${isCritical ? 'CRITICAL' : 'MINOR'}` +
        ` | BBox: [${x1}, ${y1}, ${x2}, ${y2}]`
      );
    }),
    '--------------------------------------------------',
    'AegisLogix v2.0.0 (STABLE) - Inspection Telemetry',
    '==================================================',
  ];

  const reportText = reportLines.join('\n');
  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const baseName = sourceFileName.split('.')[0] || 'container';
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `aegislogix_report_${baseName}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
