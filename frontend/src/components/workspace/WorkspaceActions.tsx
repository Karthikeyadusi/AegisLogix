import { FileDown, FileJson, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import { exportToJson, exportToTextReport } from '../../lib/export';
import type { AnalysisResponse } from '../../types/api';

export interface WorkspaceActionsProps {
  data: AnalysisResponse;
  fileName: string;
  onReset: () => void;
  className?: string;
}

export function WorkspaceActions({
  data,
  fileName,
  onReset,
  className,
}: WorkspaceActionsProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToTextReport(data, fileName)}
          className="w-full justify-center text-xs font-mono uppercase"
        >
          <FileDown className="w-4 h-4" />
          Text Report
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => exportToJson(data, fileName)}
          className="w-full justify-center text-xs font-mono uppercase"
        >
          <FileJson className="w-4 h-4" />
          Export JSON
        </Button>
      </div>

      <Button
        variant="secondary"
        size="md"
        onClick={onReset}
        className="w-full justify-center text-xs font-mono uppercase"
      >
        <RefreshCw className="w-4 h-4" />
        New Inspection Scan
      </Button>
    </div>
  );
}
