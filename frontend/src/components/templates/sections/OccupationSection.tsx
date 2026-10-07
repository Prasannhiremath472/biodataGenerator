import { Occupation } from '@/types/biodata';
import { Field } from './SectionCard';

export function OccupationSection({ occupation }: { occupation: Occupation }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      <Field label="Occupation" value={occupation.occupation} />
      <Field label="Company" value={occupation.companyName} />
      <Field label="Designation" value={occupation.designation} />
      <Field label="Business Name" value={occupation.businessName} />
      <Field label="Annual Income" value={occupation.annualIncome} />
      <Field label="Monthly Income" value={occupation.monthlyIncome} />
      <Field label="Work Location" value={occupation.workLocation} />
    </div>
  );
}
