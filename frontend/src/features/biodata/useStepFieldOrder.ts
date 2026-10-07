import { useCallback, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from './biodataForm.schema';

export function useStepFieldOrder(
  form: UseFormReturn<BiodataFormValues>,
  stepKey: string,
  defaultFieldKeys: string[],
) {
  const fieldOrder = form.watch('fieldOrder');
  const fieldVisibility = form.watch('fieldVisibility');

  const orderedKeys = useMemo(() => {
    const saved = fieldOrder?.[stepKey];
    if (!saved || saved.length === 0) return defaultFieldKeys;
    const known = saved.filter((k) => defaultFieldKeys.includes(k));
    const missing = defaultFieldKeys.filter((k) => !known.includes(k));
    return [...known, ...missing];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldOrder?.[stepKey], stepKey]);

  const isVisible = useCallback(
    (fieldKey: string) => fieldVisibility?.[`${stepKey}.${fieldKey}`] !== false,
    [fieldVisibility, stepKey],
  );

  const toggleVisible = useCallback(
    (fieldKey: string) => {
      const current = form.getValues('fieldVisibility') ?? {};
      const visKey = `${stepKey}.${fieldKey}`;
      form.setValue('fieldVisibility', { ...current, [visKey]: current[visKey] === false ? true : false });
    },
    [form, stepKey],
  );

  const moveField = useCallback(
    (fieldKey: string, direction: -1 | 1) => {
      const current = [...orderedKeys];
      const idx = current.indexOf(fieldKey);
      const targetIdx = idx + direction;
      if (idx === -1 || targetIdx < 0 || targetIdx >= current.length) return;
      [current[idx], current[targetIdx]] = [current[targetIdx], current[idx]];
      const allOrders = form.getValues('fieldOrder') ?? {};
      form.setValue('fieldOrder', { ...allOrders, [stepKey]: current });
    },
    [form, orderedKeys, stepKey],
  );

  return { orderedKeys, isVisible, toggleVisible, moveField };
}
