import { useEffect } from 'react';

export interface KeyboardShortcutHandlers {
  onTriggerUpload?: () => void;
  onResetWorkspace?: () => void;
}

/**
 * Global keyboard shortcuts listener.
 * - Cmd+Enter / Ctrl+Enter: Triggers file selection
 * - Esc: Resets workspace
 */
export function useKeyboardShortcuts({
  onTriggerUpload,
  onResetWorkspace,
}: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept hotkeys if user is focused inside an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Cmd+Enter or Ctrl+Enter -> Trigger File Staging
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (onTriggerUpload) {
          e.preventDefault();
          onTriggerUpload();
        }
      }

      // Escape -> Reset Workspace
      if (e.key === 'Escape') {
        if (onResetWorkspace) {
          e.preventDefault();
          onResetWorkspace();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTriggerUpload, onResetWorkspace]);
}
