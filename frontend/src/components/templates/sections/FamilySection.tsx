import { Family, SiblingEntry } from '@/types/biodata';
import { Field } from './SectionCard';

function SiblingList({ label, entries }: { label: string; entries?: SiblingEntry[] }) {
  if (!entries || entries.length === 0) return null;
  return (
    <div>
      <p className="font-medium">{label}</p>
      <ul className="ml-4 list-disc">
        {entries.map((s, idx) => (
          <li key={idx}>
            {[s.name, s.occupation, s.maritalStatus].filter(Boolean).join(' · ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FamilySection({ family }: { family: Family }) {
  return (
    <div className="space-y-2">
      <Field label="Father" value={[family.father?.name, family.father?.occupation].filter(Boolean).join(' - ')} />
      <Field label="Mother" value={[family.mother?.name, family.mother?.occupation].filter(Boolean).join(' - ')} />
      <SiblingList label="Brothers" entries={family.brothers} />
      <SiblingList label="Sisters" entries={family.sisters} />
      <Field label="Family Type" value={family.familyType} />
      <Field label="Family Status" value={family.familyStatus?.replace('_', ' ')} />
    </div>
  );
}
