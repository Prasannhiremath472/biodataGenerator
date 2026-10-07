import { z } from 'zod';

export const educationEntrySchema = z.object({
  degree: z.string().trim().min(1, 'Degree is required'),
  college: z.string().trim().optional().or(z.literal('')),
  university: z.string().trim().optional().or(z.literal('')),
  year: z.string().trim().optional().or(z.literal('')),
  percentage: z.string().trim().optional().or(z.literal('')),
});

export const siblingEntrySchema = z.object({
  name: z.string().trim().optional().or(z.literal('')),
  occupation: z.string().trim().optional().or(z.literal('')),
  maritalStatus: z.string().trim().optional().or(z.literal('')),
});

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  nickName: z.string().trim().optional().or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().trim().min(1, 'Date of birth is required'),
  age: z.coerce.number().int().min(0).max(120).optional(),
  height: z.string().trim().optional().or(z.literal('')),
  weight: z.string().trim().optional().or(z.literal('')),
  bloodGroup: z.string().trim().optional().or(z.literal('')),
  complexion: z.string().trim().optional().or(z.literal('')),
  religion: z.string().trim().optional().or(z.literal('')),
  caste: z.string().trim().optional().or(z.literal('')),
  subCaste: z.string().trim().optional().or(z.literal('')),
  gotra: z.string().trim().optional().or(z.literal('')),
  zodiacSign: z.string().trim().optional().or(z.literal('')),
  rashi: z.string().trim().optional().or(z.literal('')),
  nakshatra: z.string().trim().optional().or(z.literal('')),
  manglikStatus: z.string().trim().optional().or(z.literal('')),
  maritalStatus: z.string().trim().optional().or(z.literal('')),
  motherTongue: z.string().trim().optional().or(z.literal('')),
  nationality: z.string().trim().optional().or(z.literal('')),
});

export const contactInfoSchema = z.object({
  mobileNumber: z.string().trim().min(7, 'Mobile number is required'),
  alternativeMobile: z.string().trim().optional().or(z.literal('')),
  email: z.string().trim().email().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().optional().or(z.literal('')),
  state: z.string().trim().optional().or(z.literal('')),
  country: z.string().trim().optional().or(z.literal('')),
  pinCode: z.string().trim().optional().or(z.literal('')),
});

export const occupationSchema = z.object({
  occupation: z.string().trim().optional().or(z.literal('')),
  companyName: z.string().trim().optional().or(z.literal('')),
  designation: z.string().trim().optional().or(z.literal('')),
  businessName: z.string().trim().optional().or(z.literal('')),
  annualIncome: z.string().trim().optional().or(z.literal('')),
  monthlyIncome: z.string().trim().optional().or(z.literal('')),
  workLocation: z.string().trim().optional().or(z.literal('')),
});

export const familySchema = z.object({
  father: z.object({ name: z.string().trim().optional().or(z.literal('')), occupation: z.string().trim().optional().or(z.literal('')) }).optional(),
  mother: z.object({ name: z.string().trim().optional().or(z.literal('')), occupation: z.string().trim().optional().or(z.literal('')) }).optional(),
  brothers: z.array(siblingEntrySchema).optional().default([]),
  sisters: z.array(siblingEntrySchema).optional().default([]),
  familyType: z.enum(['joint', 'nuclear']).optional(),
  familyStatus: z.enum(['middle_class', 'upper_middle_class', 'rich']).optional(),
});

export const lifestyleSchema = z.object({
  diet: z.string().trim().optional().or(z.literal('')),
  smoking: z.string().trim().optional().or(z.literal('')),
  drinking: z.string().trim().optional().or(z.literal('')),
  hobbies: z.array(z.string().trim()).optional().default([]),
  interests: z.array(z.string().trim()).optional().default([]),
});

export const partnerPreferencesSchema = z.object({
  preferredAge: z.string().trim().optional().or(z.literal('')),
  preferredHeight: z.string().trim().optional().or(z.literal('')),
  preferredEducation: z.string().trim().optional().or(z.literal('')),
  preferredOccupation: z.string().trim().optional().or(z.literal('')),
  preferredLocation: z.string().trim().optional().or(z.literal('')),
  additionalExpectations: z.string().trim().optional().or(z.literal('')),
});

export const horoscopeSchema = z.object({
  birthTime: z.string().trim().optional().or(z.literal('')),
  birthPlace: z.string().trim().optional().or(z.literal('')),
  rashi: z.string().trim().optional().or(z.literal('')),
  nakshatra: z.string().trim().optional().or(z.literal('')),
  manglik: z.string().trim().optional().or(z.literal('')),
});

export const fieldVisibilitySchema = z.record(z.string(), z.boolean()).default({});

export const biodataFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').default('My Biodata'),
  languageId: z.number().int().positive(),
  templateId: z.number().int().positive().optional(),
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  education: z.array(educationEntrySchema).default([]),
  occupation: occupationSchema.optional(),
  family: familySchema.optional(),
  lifestyle: lifestyleSchema.optional(),
  partnerPreferences: partnerPreferencesSchema.optional(),
  horoscope: horoscopeSchema.optional(),
  aboutMeHtml: z.string().optional().or(z.literal('')),
  fieldOrder: z.record(z.string(), z.array(z.string())).default({}),
  fieldVisibility: fieldVisibilitySchema,
});

export type BiodataFormValues = z.infer<typeof biodataFormSchema>;

export const BIODATA_FORM_DEFAULTS: BiodataFormValues = {
  title: 'My Biodata',
  languageId: 1,
  personalInfo: { fullName: '', gender: 'male', dateOfBirth: '' },
  contactInfo: { mobileNumber: '' },
  education: [],
  occupation: {},
  family: { brothers: [], sisters: [] },
  lifestyle: { hobbies: [], interests: [] },
  partnerPreferences: {},
  horoscope: {},
  aboutMeHtml: '',
  fieldOrder: {},
  fieldVisibility: {},
};
