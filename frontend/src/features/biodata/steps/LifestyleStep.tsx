import { Controller, UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';
import { TextInput } from '@/components/forms/TextInput';

function TagListInput({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <TextInput
      placeholder={placeholder}
      defaultValue={value?.join(', ') ?? ''}
      onBlur={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
    />
  );
}

export function LifestyleStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Diet</label>
        <select {...form.register('lifestyle.diet')} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm">
          <option value="">Select</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
          <option value="Eggetarian">Eggetarian</option>
          <option value="Vegan">Vegan</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Smoking</label>
        <select {...form.register('lifestyle.smoking')} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm">
          <option value="">Select</option>
          <option value="No">No</option>
          <option value="Occasionally">Occasionally</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Drinking</label>
        <select {...form.register('lifestyle.drinking')} className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm">
          <option value="">Select</option>
          <option value="No">No</option>
          <option value="Occasionally">Occasionally</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Hobbies (comma separated)</label>
        <Controller
          control={form.control}
          name="lifestyle.hobbies"
          render={({ field }) => <TagListInput value={field.value ?? []} onChange={field.onChange} placeholder="Reading, Trekking, ..." />}
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Interests (comma separated)</label>
        <Controller
          control={form.control}
          name="lifestyle.interests"
          render={({ field }) => <TagListInput value={field.value ?? []} onChange={field.onChange} placeholder="Travel, Music, ..." />}
        />
      </div>
    </div>
  );
}
