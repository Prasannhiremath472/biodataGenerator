import { ContactInfo } from '@/types/biodata';
import { Field } from './SectionCard';

export function ContactSection({ info }: { info: ContactInfo }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      <Field label="Mobile" value={info.mobileNumber} />
      <Field label="Alternative Mobile" value={info.alternativeMobile} />
      <Field label="Email" value={info.email} />
      <Field label="Address" value={info.address} />
      <Field label="City" value={info.city} />
      <Field label="State" value={info.state} />
      <Field label="Country" value={info.country} />
      <Field label="Pin Code" value={info.pinCode} />
    </div>
  );
}
