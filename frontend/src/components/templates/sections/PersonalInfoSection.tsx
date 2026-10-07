import { PersonalInfo } from '@/types/biodata';
import { Field } from './SectionCard';

export function PersonalInfoSection({ info }: { info: PersonalInfo }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      <Field label="Nick Name" value={info.nickName} />
      <Field label="Gender" value={info.gender} />
      <Field label="Date of Birth" value={info.dateOfBirth} />
      <Field label="Age" value={info.age} />
      <Field label="Height" value={info.height} />
      <Field label="Weight" value={info.weight} />
      <Field label="Blood Group" value={info.bloodGroup} />
      <Field label="Complexion" value={info.complexion} />
      <Field label="Religion" value={info.religion} />
      <Field label="Caste" value={info.caste} />
      <Field label="Sub Caste" value={info.subCaste} />
      <Field label="Gotra" value={info.gotra} />
      <Field label="Zodiac Sign" value={info.zodiacSign} />
      <Field label="Rashi" value={info.rashi} />
      <Field label="Nakshatra" value={info.nakshatra} />
      <Field label="Manglik Status" value={info.manglikStatus} />
      <Field label="Marital Status" value={info.maritalStatus} />
      <Field label="Mother Tongue" value={info.motherTongue} />
      <Field label="Nationality" value={info.nationality} />
    </div>
  );
}
