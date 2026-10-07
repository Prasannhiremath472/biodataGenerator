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

export interface Template {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  config: TemplateConfig;
  isPremium: boolean;
  status: 'draft' | 'published' | 'archived';
  usageCount: number;
}

export interface TemplateCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
}

export const SECTION_LABELS: Record<BiodataSectionKey, string> = {
  personal_info: 'Personal Information',
  contact: 'Contact Information',
  education: 'Education',
  occupation: 'Occupation',
  family: 'Family Information',
  lifestyle: 'Lifestyle',
  partner_preferences: 'Partner Preferences',
  horoscope: 'Horoscope',
  about_me: 'About Me',
  gallery: 'Gallery',
};
