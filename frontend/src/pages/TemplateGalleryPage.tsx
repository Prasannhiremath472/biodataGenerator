import { useState } from 'react';
import { useTemplateCategories, useTemplates } from '@/api/templates';
import { Template } from '@/types/template';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';
import { SAMPLE_ABOUT_ME_HTML, SAMPLE_BIODATA } from '@/data/sampleBiodata';

function TemplateCard({ template, onPreview }: { template: Template; onPreview: (t: Template) => void }) {
  const theme = template.config.theme;
  return (
    <button
      onClick={() => onPreview(template)}
      className="flex flex-col overflow-hidden rounded-lg border text-left shadow-sm transition hover:shadow-md"
    >
      <div className="h-24 w-full" style={{ background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})` }} />
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{template.name}</h3>
          {template.isPremium && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Premium</span>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">{template.description}</p>
      </div>
    </button>
  );
}

export default function TemplateGalleryPage() {
  const [categorySlug, setCategorySlug] = useState<string | undefined>(undefined);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const { data: categories } = useTemplateCategories();
  const { data: templates, isLoading, isError } = useTemplates(categorySlug);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold">Template Gallery</h1>
      <p className="mt-1 text-gray-600">Browse templates and preview them with sample data before choosing one.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategorySlug(undefined)}
          className={`rounded-full border px-3 py-1 text-sm ${categorySlug === undefined ? 'bg-gray-900 text-white' : ''}`}
        >
          All
        </button>
        {categories?.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategorySlug(c.slug)}
            className={`rounded-full border px-3 py-1 text-sm ${categorySlug === c.slug ? 'bg-gray-900 text-white' : ''}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {isLoading && <p className="mt-8 text-gray-500">Loading templates...</p>}
      {isError && <p className="mt-8 text-red-600">Failed to load templates.</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates?.map((template) => (
          <TemplateCard key={template.id} template={template} onPreview={setPreviewTemplate} />
        ))}
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{previewTemplate.name}</h2>
              <button onClick={() => setPreviewTemplate(null)} className="rounded px-3 py-1 text-sm hover:bg-gray-100">
                Close
              </button>
            </div>
            <TemplateRenderer
              template={previewTemplate}
              data={SAMPLE_BIODATA}
              aboutMeHtml={SAMPLE_ABOUT_ME_HTML}
            />
          </div>
        </div>
      )}
    </main>
  );
}
