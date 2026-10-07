export type TemplateLayout = 'single-column' | 'two-column' | 'sidebar' | 'photo-centric';

export const BIODATA_SECTION_KEYS = [
  'personal_info',
  'contact',
  'education',
  'occupation',
  'family',
  'lifestyle',
  'partner_preferences',
  'horoscope',
  'about_me',
  'gallery',
] as const;

export type BiodataSectionKey = (typeof BIODATA_SECTION_KEYS)[number];

export interface TemplateTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
}

export interface TemplateConfig {
  layout: TemplateLayout;
  theme: TemplateTheme;
  sections: BiodataSectionKey[];
}
