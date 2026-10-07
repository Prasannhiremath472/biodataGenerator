import { UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';
import { TextInput } from '@/components/forms/TextInput';

export function HoroscopeStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <p className="sm:col-span-2 text-xs text-gray-500">Optional — fill in if relevant for your community/preferences.</p>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Birth Time</label>
        <TextInput type="time" {...form.register('horoscope.birthTime')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Birth Place</label>
        <TextInput {...form.register('horoscope.birthPlace')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Rashi</label>
        <TextInput {...form.register('horoscope.rashi')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nakshatra</label>
        <TextInput {...form.register('horoscope.nakshatra')} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Manglik</label>
        <TextInput {...form.register('horoscope.manglik')} />
      </div>
    </div>
  );
}
