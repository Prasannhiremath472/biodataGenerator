import { ReactNode } from 'react';

export interface FieldRowProps {
  label: string;
  children: ReactNode;
  visible: boolean;
  onToggleVisible: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  error?: string;
}

export function FieldRow({
  label,
  children,
  visible,
  onToggleVisible,
  onMoveUp,
  onMoveDown,
  canMoveUp = true,
  canMoveDown = true,
  error,
}: FieldRowProps) {
  return (
    <div className={`rounded-md border p-3 ${visible ? 'bg-white' : 'bg-gray-50 opacity-60'}`}>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs text-gray-500">
            <input type="checkbox" checked={visible} onChange={onToggleVisible} />
            Include in biodata
          </label>
          {(onMoveUp || onMoveDown) && (
            <div className="flex flex-col">
              <button
                type="button"
                aria-label={`Move ${label} up`}
                disabled={!canMoveUp}
                onClick={onMoveUp}
                className="text-xs leading-none text-gray-500 disabled:opacity-30"
              >
                ▲
              </button>
              <button
                type="button"
                aria-label={`Move ${label} down`}
                disabled={!canMoveDown}
                onClick={onMoveDown}
                className="text-xs leading-none text-gray-500 disabled:opacity-30"
              >
                ▼
              </button>
            </div>
          )}
        </div>
      </div>
      {visible && children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
