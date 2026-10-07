import { UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';
import { useStepFieldOrder } from '../useStepFieldOrder';
import { FieldRow } from '@/components/forms/FieldRow';
import { TextInput } from '@/components/forms/TextInput';

const FIELD_DEFS: Record<string, { label: string; render: (form: UseFormReturn<BiodataFormValues>) => JSX.Element }> = {
  fullName: {
    label: 'Full Name',
    render: (form) => <TextInput {...form.register('personalInfo.fullName')} />,
  },
  nickName: {
    label: 'Nick Name',
    render: (form) => <TextInput {...form.register('personalInfo.nickName')} />,
  },
  gender: {
    label: 'Gender',
    render: (form) => (
      <select {...form.register('personalInfo.gender')} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm">
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
    ),
  },
  dateOfBirth: {
    label: 'Date of Birth',
    render: (form) => <TextInput type="date" {...form.register('personalInfo.dateOfBirth')} />,
  },
  age: { label: 'Age', render: (form) => <TextInput type="number" {...form.register('personalInfo.age')} /> },
  height: { label: 'Height', render: (form) => <TextInput placeholder={`e.g. 5'9"`} {...form.register('personalInfo.height')} /> },
  weight: { label: 'Weight', render: (form) => <TextInput placeholder="e.g. 70 kg" {...form.register('personalInfo.weight')} /> },
  bloodGroup: { label: 'Blood Group', render: (form) => <TextInput {...form.register('personalInfo.bloodGroup')} /> },
  complexion: { label: 'Complexion', render: (form) => <TextInput {...form.register('personalInfo.complexion')} /> },
  religion: { label: 'Religion', render: (form) => <TextInput {...form.register('personalInfo.religion')} /> },
  caste: { label: 'Caste', render: (form) => <TextInput {...form.register('personalInfo.caste')} /> },
  subCaste: { label: 'Sub Caste', render: (form) => <TextInput {...form.register('personalInfo.subCaste')} /> },
  gotra: { label: 'Gotra', render: (form) => <TextInput {...form.register('personalInfo.gotra')} /> },
  zodiacSign: { label: 'Zodiac Sign', render: (form) => <TextInput {...form.register('personalInfo.zodiacSign')} /> },
  rashi: { label: 'Rashi', render: (form) => <TextInput {...form.register('personalInfo.rashi')} /> },
  nakshatra: { label: 'Nakshatra', render: (form) => <TextInput {...form.register('personalInfo.nakshatra')} /> },
  manglikStatus: { label: 'Manglik Status', render: (form) => <TextInput {...form.register('personalInfo.manglikStatus')} /> },
  maritalStatus: { label: 'Marital Status', render: (form) => <TextInput {...form.register('personalInfo.maritalStatus')} /> },
  motherTongue: { label: 'Mother Tongue', render: (form) => <TextInput {...form.register('personalInfo.motherTongue')} /> },
  nationality: { label: 'Nationality', render: (form) => <TextInput {...form.register('personalInfo.nationality')} /> },
};

const DEFAULT_ORDER = Object.keys(FIELD_DEFS);

export function PersonalInfoStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  const { orderedKeys, isVisible, toggleVisible, moveField } = useStepFieldOrder(form, 'personal', DEFAULT_ORDER);
  const errors = form.formState.errors.personalInfo;

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
