import { Horoscope } from '@/types/biodata';
import { Field } from './SectionCard';

export function HoroscopeSection({ horoscope }: { horoscope: Horoscope }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
      <Field label="Birth Time" value={horoscope.birthTime} />
      <Field label="Birth Place" value={horoscope.birthPlace} />
      <Field label="Rashi" value={horoscope.rashi} />
      <Field label="Nakshatra" value={horoscope.nakshatra} />
      <Field label="Manglik" value={horoscope.manglik} />
    </div>
  );
}
