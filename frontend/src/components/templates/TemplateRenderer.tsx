import { BiodataData } from '@/types/biodata';
import { BiodataSectionKey, SECTION_LABELS, Template } from '@/types/template';
import { SectionCard } from './sections/SectionCard';
import { PersonalInfoSection } from './sections/PersonalInfoSection';
import { ContactSection } from './sections/ContactSection';
import { EducationSection } from './sections/EducationSection';
import { OccupationSection } from './sections/OccupationSection';
import { FamilySection } from './sections/FamilySection';
import { LifestyleSection } from './sections/LifestyleSection';
import { PartnerPreferencesSection } from './sections/PartnerPreferencesSection';
import { HoroscopeSection } from './sections/HoroscopeSection';
import { AboutMeSection } from './sections/AboutMeSection';
import { GallerySection } from './sections/GallerySection';

export interface TemplateRendererProps {
  template: Template;
  data: BiodataData;
  aboutMeHtml?: string | null;
  images?: string[];
  colorOverrides?: Partial<Template['config']['theme']>;
  fontOverrides?: { headingFont?: string; bodyFont?: string };
  sectionOrder?: BiodataSectionKey[];
}

const SECTION_RENDERERS: Record<BiodataSectionKey, (props: { data: BiodataData; aboutMeHtml?: string | null; images?: string[] }) => JSX.Element | null> = {
  personal_info: ({ data }) => <PersonalInfoSection info={data.personalInfo} />,
  contact: ({ data }) => <ContactSection info={data.contactInfo} />,
  education: ({ data }) => <EducationSection entries={data.education} />,
  occupation: ({ data }) => (data.occupation ? <OccupationSection occupation={data.occupation} /> : null),
  family: ({ data }) => (data.family ? <FamilySection family={data.family} /> : null),
  lifestyle: ({ data }) => (data.lifestyle ? <LifestyleSection lifestyle={data.lifestyle} /> : null),
  partner_preferences: ({ data }) =>
    data.partnerPreferences ? <PartnerPreferencesSection preferences={data.partnerPreferences} /> : null,
  horoscope: ({ data }) => (data.horoscope ? <HoroscopeSection horoscope={data.horoscope} /> : null),
  about_me: ({ aboutMeHtml }) => (aboutMeHtml ? <AboutMeSection html={aboutMeHtml} /> : null),
  gallery: ({ images }) => (images && images.length > 0 ? <GallerySection images={images} /> : null),
};

export function TemplateRenderer({
  template,
  data,
  aboutMeHtml,
  images,
  colorOverrides,
  fontOverrides,
  sectionOrder,
}: TemplateRendererProps) {
  const theme = { ...template.config.theme, ...colorOverrides, ...fontOverrides };
  const sections = sectionOrder ?? template.config.sections;
  const layout = template.config.layout;

  const containerClass =
    layout === 'two-column' || layout === 'sidebar'
      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
      : layout === 'photo-centric'
        ? 'flex flex-col items-center gap-6'
        : 'flex flex-col gap-6';

  return (
    <div
      className="mx-auto w-full max-w-3xl rounded-lg p-6 shadow-sm sm:p-10"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.bodyFont,
      }}
      data-template-slug={template.slug}
    >
      <h1
        className="mb-6 text-center text-2xl font-bold sm:text-3xl"
        style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}
      >
        {data.personalInfo.fullName}
      </h1>

      <div className={containerClass}>
        {sections.map((sectionKey) => {
          const Renderer = SECTION_RENDERERS[sectionKey];
          const content = Renderer({ data, aboutMeHtml, images });
          if (!content) return null;
          return (
            <SectionCard
              key={sectionKey}
              title={SECTION_LABELS[sectionKey]}
              theme={theme}
            >
              {content}
            </SectionCard>
          );
        })}
      </div>
    </div>
  );
}
