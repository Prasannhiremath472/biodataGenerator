export function DraftRestoreBanner({ onRestore, onDismiss }: { onRestore: () => void; onDismiss: () => void }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-md border border-green-300 bg-green-50 px-4 py-2 text-sm text-green-800">
      <span>We found a saved draft of this biodata. Restore your progress?</span>
      <div className="flex gap-2">
        <button type="button" onClick={onRestore} className="rounded bg-green-700 px-3 py-1 text-xs font-medium text-white hover:bg-green-800">
          Restore
        </button>
        <button type="button" onClick={onDismiss} className="rounded px-3 py-1 text-xs text-green-800 hover:bg-green-100">
          Dismiss
        </button>
      </div>
    </div>
  );
}
