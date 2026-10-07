import { PartnerPreferences } from '@/types/biodata';
import { Field } from './SectionCard';

export function PartnerPreferencesSection({ preferences }: { preferences: PartnerPreferences }) {
  return (
    <div className="space-y-1">
      <Field label="Preferred Age" value={preferences.preferredAge} />
      <Field label="Preferred Height" value={preferences.preferredHeight} />
      <Field label="Preferred Education" value={preferences.preferredEducation} />
      <Field label="Preferred Occupation" value={preferences.preferredOccupation} />
      <Field label="Preferred Location" value={preferences.preferredLocation} />
      <Field label="Additional Expectations" value={preferences.additionalExpectations} />
    </div>
  );
}
