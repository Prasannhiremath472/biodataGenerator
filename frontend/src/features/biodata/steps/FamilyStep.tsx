import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';
import { TextInput } from '@/components/forms/TextInput';

function SiblingFieldArray({ form, name, label }: { form: UseFormReturn<BiodataFormValues>; name: 'family.brothers' | 'family.sisters'; label: string }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name });

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium">{label}</h3>
      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div key={field.id} className="flex flex-wrap items-center gap-2 rounded border p-2">
            <TextInput placeholder="Name" {...form.register(`${name}.${idx}.name`)} className="flex-1" />
            <TextInput placeholder="Occupation" {...form.register(`${name}.${idx}.occupation`)} className="flex-1" />
            <TextInput placeholder="Marital Status" {...form.register(`${name}.${idx}.maritalStatus`)} className="flex-1" />
            <button type="button" onClick={() => remove(idx)} className="text-xs text-red-600 hover:underline">
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ name: '', occupation: '', maritalStatus: '' })}
        className="mt-2 rounded border border-dashed border-gray-400 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
      >
        + Add {label.slice(0, -1)}
      </button>
    </div>
  );
}

export function FamilyStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Father&apos;s Name</label>
          <TextInput {...form.register('family.father.name')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Father&apos;s Occupation</label>
          <TextInput {...form.register('family.father.occupation')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mother&apos;s Name</label>
          <TextInput {...form.register('family.mother.name')} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mother&apos;s Occupation</label>
          <TextInput {...form.register('family.mother.occupation')} />
        </div>
      </div>

      <SiblingFieldArray form={form} name="family.brothers" label="Brothers" />
      <SiblingFieldArray form={form} name="family.sisters" label="Sisters" />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Family Type</label>
          <select {...form.register('family.familyType')} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm">
            <option value="">Select</option>
            <option value="joint">Joint</option>
            <option value="nuclear">Nuclear</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Family Status</label>
          <select {...form.register('family.familyStatus')} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm">
            <option value="">Select</option>
            <option value="middle_class">Middle Class</option>
            <option value="upper_middle_class">Upper Middle Class</option>
            <option value="rich">Rich</option>
          </select>
        </div>
      </div>
    </div>
  );
}
