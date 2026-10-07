import { UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';
import { useStepFieldOrder } from '../useStepFieldOrder';
import { FieldRow } from '@/components/forms/FieldRow';
import { TextInput } from '@/components/forms/TextInput';

const FIELD_DEFS: Record<string, { label: string; render: (form: UseFormReturn<BiodataFormValues>) => JSX.Element }> = {
  occupation: { label: 'Occupation', render: (form) => <TextInput {...form.register('occupation.occupation')} /> },
  companyName: { label: 'Company Name', render: (form) => <TextInput {...form.register('occupation.companyName')} /> },
  designation: { label: 'Designation', render: (form) => <TextInput {...form.register('occupation.designation')} /> },
  businessName: { label: 'Business Name', render: (form) => <TextInput {...form.register('occupation.businessName')} /> },
  annualIncome: { label: 'Annual Income', render: (form) => <TextInput {...form.register('occupation.annualIncome')} /> },
  monthlyIncome: { label: 'Monthly Income', render: (form) => <TextInput {...form.register('occupation.monthlyIncome')} /> },
  workLocation: { label: 'Work Location', render: (form) => <TextInput {...form.register('occupation.workLocation')} /> },
};

const DEFAULT_ORDER = Object.keys(FIELD_DEFS);

export function OccupationStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  const { orderedKeys, isVisible, toggleVisible, moveField } = useStepFieldOrder(form, 'occupation', DEFAULT_ORDER);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {orderedKeys.map((key, idx) => {
        const def = FIELD_DEFS[key];
        if (!def) return null;
        return (
          <FieldRow
            key={key}
            label={def.label}
            visible={isVisible(key)}
            onToggleVisible={() => toggleVisible(key)}
            onMoveUp={() => moveField(key, -1)}
            onMoveDown={() => moveField(key, 1)}
            canMoveUp={idx > 0}
            canMoveDown={idx < orderedKeys.length - 1}
          >
            {def.render(form)}
          </FieldRow>
        );
      })}
    </div>
  );
}
