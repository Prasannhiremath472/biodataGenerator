import { useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { BiodataFormValues } from '../biodataForm.schema';

export function AboutMeStep({ form }: { form: UseFormReturn<BiodataFormValues> }) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">About Me</label>
        <Controller
          control={form.control}
          name="aboutMeHtml"
          render={({ field }) => (
            <textarea
              {...field}
              rows={5}
              placeholder="Write a short paragraph about yourself..."
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          )}
        />
        <p className="mt-1 text-xs text-gray-500">
          Plain text for now — a rich text editor will be added when the gallery/export phase ships.
        </p>
      </div>

      <div className="rounded-md border border-dashed p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded bg-gray-100">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <span className="text-xs text-gray-400">No photo</span>
            )}
          </div>
          <div>
            <label className="inline-block cursor-pointer rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
              Upload Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
            <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
              <li>Use a clear, recent photo with good lighting</li>
              <li>Face should be clearly visible and centered</li>
              <li>Avoid group photos or heavily filtered images</li>
            </ul>
          </div>
        </div>
        <p className="mt-2 text-xs text-amber-600">
          Photo upload is preview-only in this build — saving uploaded images to the server lands with the gallery/export phase.
        </p>
      </div>
    </div>
  );
}
