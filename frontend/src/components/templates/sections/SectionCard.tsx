import { ReactNode } from 'react';
import { TemplateTheme } from '@/types/template';

export function SectionCard({ title, theme, children }: { title: string; theme: TemplateTheme; children: ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <h2
        className="mb-2 border-b pb-1 text-lg font-semibold"
        style={{ color: theme.primaryColor, borderColor: theme.secondaryColor, fontFamily: theme.headingFont }}
      >
        {title}
      </h2>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function Field({ label, value }: { label: string; value?: string | number | null }) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <p>
      <span className="font-medium">{label}: </span>
      <span>{value}</span>
    </p>
  );
}
