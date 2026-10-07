import { UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';
import { TextInput } from '@/components/forms/TextInput';

export function PartnerPreferencesStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Preferred Age</label>
        <TextInput placeholder="e.g. 24-28" {...form.register('partnerPreferences.preferredAge')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Preferred Height</label>
        <TextInput {...form.register('partnerPreferences.preferredHeight')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Preferred Education</label>
        <TextInput {...form.register('partnerPreferences.preferredEducation')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Preferred Occupation</label>
        <TextInput {...form.register('partnerPreferences.preferredOccupation')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Preferred Location</label>
        <TextInput {...form.register('partnerPreferences.preferredLocation')} />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-700">Additional Expectations</label>
        <textarea
          {...form.register('partnerPreferences.additionalExpectations')}
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm"
        />
      </div>
    </div>
  );
}
