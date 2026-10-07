import { EducationEntry } from '@/types/biodata';

export function EducationSection({ entries }: { entries: EducationEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <ul className="space-y-2">
      {entries.map((entry, idx) => (
        <li key={idx}>
          <p className="font-medium">{entry.degree}</p>
          <p className="text-xs opacity-80">
            {[entry.college, entry.university, entry.year, entry.percentage].filter(Boolean).join(' · ')}
          </p>
        </li>
      ))}
    </ul>
  );
}
