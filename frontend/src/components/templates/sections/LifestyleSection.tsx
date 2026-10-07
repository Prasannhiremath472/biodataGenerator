import { Lifestyle } from '@/types/biodata';
import { Field } from './SectionCard';

export function LifestyleSection({ lifestyle }: { lifestyle: Lifestyle }) {
  return (
    <div className="space-y-1">
      <Field label="Diet" value={lifestyle.diet} />
      <Field label="Smoking" value={lifestyle.smoking} />
      <Field label="Drinking" value={lifestyle.drinking} />
      <Field label="Hobbies" value={lifestyle.hobbies?.join(', ')} />
      <Field label="Interests" value={lifestyle.interests?.join(', ')} />
    </div>
  );
}
