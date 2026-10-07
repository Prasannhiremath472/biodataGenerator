import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';
import { TextInput } from '@/components/forms/TextInput';

export function EducationStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'education' });

  return (
    <div className="space-y-4">
      {fields.map((field, idx) => (
        <div key={field.id} className="rounded-md border p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium">Education #{idx + 1}</h3>
            <button type="button" onClick={() => remove(idx)} className="text-xs text-red-600 hover:underline">
              Remove
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <TextInput placeholder="Degree *" {...form.register(`education.${idx}.degree`)} />
            <TextInput placeholder="College" {...form.register(`education.${idx}.college`)} />
            <TextInput placeholder="University" {...form.register(`education.${idx}.university`)} />
            <TextInput placeholder="Year" {...form.register(`education.${idx}.year`)} />
            <TextInput placeholder="Percentage / CGPA" {...form.register(`education.${idx}.percentage`)} />
          </div>
          {form.formState.errors.education?.[idx]?.degree && (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.education[idx]?.degree?.message}</p>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ degree: '', college: '', university: '', year: '', percentage: '' })}
        className="rounded border border-dashed border-gray-400 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
      >
        + Add Education
      </button>
    </div>
  );
}
