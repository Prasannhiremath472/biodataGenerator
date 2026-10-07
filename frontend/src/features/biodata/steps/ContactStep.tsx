import { UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';
import { useStepFieldOrder } from '../useStepFieldOrder';
import { FieldRow } from '@/components/forms/FieldRow';
import { TextInput } from '@/components/forms/TextInput';

const FIELD_DEFS: Record<string, { label: string; render: (form: UseFormReturn<BiodataFormValues>) => JSX.Element }> = {
  mobileNumber: { label: 'Mobile Number', render: (form) => <TextInput {...form.register('contactInfo.mobileNumber')} /> },
  alternativeMobile: { label: 'Alternative Mobile', render: (form) => <TextInput {...form.register('contactInfo.alternativeMobile')} /> },
  email: { label: 'Email', render: (form) => <TextInput type="email" {...form.register('contactInfo.email')} /> },
  address: { label: 'Address', render: (form) => <textarea {...form.register('contactInfo.address')} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm" rows={2} /> },
  city: { label: 'City', render: (form) => <TextInput {...form.register('contactInfo.city')} /> },
  state: { label: 'State', render: (form) => <TextInput {...form.register('contactInfo.state')} /> },
  country: { label: 'Country', render: (form) => <TextInput {...form.register('contactInfo.country')} /> },
  pinCode: { label: 'Pin Code', render: (form) => <TextInput {...form.register('contactInfo.pinCode')} /> },
};

const DEFAULT_ORDER = Object.keys(FIELD_DEFS);

export function ContactStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  const { orderedKeys, isVisible, toggleVisible, moveField } = useStepFieldOrder(form, 'contact', DEFAULT_ORDER);
  const errors = form.formState.errors.contactInfo;

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
            error={(errors as Record<string, { message?: string }> | undefined)?.[key]?.message}
          >
            {def.render(form)}
          </FieldRow>
        );
      })}
    </div>
  );
}
