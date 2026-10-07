import { useEffect, useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from './biodataForm.schema';

const DRAFT_KEY_PREFIX = 'biodata-draft:';
const SAVE_DEBOUNCE_MS = 800;

function draftKey(draftId: string): string {
  return `${DRAFT_KEY_PREFIX}${draftId}`;
}

export function loadDraft(draftId: string): BiodataFormValues | null {
  try {
    const raw = localStorage.getItem(draftKey(draftId));
    return raw ? (JSON.parse(raw) as BiodataFormValues) : null;
  } catch {
    return null;
  }
}

export function clearDraft(draftId: string): void {
  localStorage.removeItem(draftKey(draftId));
}

export function useDraftAutosave(draftId: string, form: UseFormReturn<BiodataFormValues>) {
  const [hasRestorableDraft, setHasRestorableDraft] = useState(() => loadDraft(draftId) !== null);
  const [restored, setRestored] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        localStorage.setItem(draftKey(draftId), JSON.stringify(values));
      }, SAVE_DEBOUNCE_MS);
    });
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftId]);

  function restoreDraft(): void {
    const draft = loadDraft(draftId);
    if (draft) {
      form.reset(draft);
      setRestored(true);
    }
    setHasRestorableDraft(false);
  }

  function dismissDraft(): void {
    clearDraft(draftId);
    setHasRestorableDraft(false);
  }

  function discardDraft(): void {
    clearDraft(draftId);
  }

  return { hasRestorableDraft, restored, restoreDraft, dismissDraft, discardDraft };
}
