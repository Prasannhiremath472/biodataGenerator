export const WIZARD_STEPS = [
  { key: 'personal', label: 'Personal Info' },
  { key: 'contact', label: 'Contact' },
  { key: 'education', label: 'Education' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'family', label: 'Family' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'partner', label: 'Partner Preferences' },
  { key: 'horoscope', label: 'Horoscope' },
  { key: 'about', label: 'About Me & Photo' },
] as const;

export type WizardStepKey = (typeof WIZARD_STEPS)[number]['key'];
