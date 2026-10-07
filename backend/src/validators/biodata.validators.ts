import { z } from 'zod';

const educationEntrySchema = z.object({
  degree: z.string().trim().min(1).max(150),
  college: z.string().trim().max(200).optional(),
  university: z.string().trim().max(200).optional(),
  year: z.string().trim().max(10).optional(),
  percentage: z.string().trim().max(20).optional(),
});

const siblingEntrySchema = z.object({
  name: z.string().trim().max(150).optional(),
  occupation: z.string().trim().max(150).optional(),
  maritalStatus: z.string().trim().max(50).optional(),
});

const personalInfoSchema = z.object({
  fullName: z.string().trim().min(1).max(150),
  nickName: z.string().trim().max(100).optional(),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().trim().min(1),
  age: z.number().int().min(0).max(120).optional(),
  height: z.string().trim().max(20).optional(),
  weight: z.string().trim().max(20).optional(),
  bloodGroup: z.string().trim().max(10).optional(),
  complexion: z.string().trim().max(50).optional(),
  religion: z.string().trim().max(100).optional(),
  caste: z.string().trim().max(100).optional(),
  subCaste: z.string().trim().max(100).optional(),
  gotra: z.string().trim().max(100).optional(),
  zodiacSign: z.string().trim().max(50).optional(),
  rashi: z.string().trim().max(50).optional(),
  nakshatra: z.string().trim().max(50).optional(),
  manglikStatus: z.string().trim().max(50).optional(),
  maritalStatus: z.string().trim().max(50).optional(),
  motherTongue: z.string().trim().max(100).optional(),
  nationality: z.string().trim().max(100).optional(),
});

const contactInfoSchema = z.object({
  mobileNumber: z.string().trim().min(7).max(20),
  alternativeMobile: z.string().trim().max(20).optional(),
  email: z.string().trim().email().optional(),
  address: z.string().trim().max(500).optional(),
  city: z.string().trim().max(100).optional(),
  state: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  pinCode: z.string().trim().max(20).optional(),
});

const occupationSchema = z.object({
  occupation: z.string().trim().max(150).optional(),
  companyName: z.string().trim().max(200).optional(),
  designation: z.string().trim().max(150).optional(),
  businessName: z.string().trim().max(200).optional(),
  annualIncome: z.string().trim().max(50).optional(),
  monthlyIncome: z.string().trim().max(50).optional(),
  workLocation: z.string().trim().max(150).optional(),
});

const familySchema = z.object({
  father: z.object({ name: z.string().trim().max(150).optional(), occupation: z.string().trim().max(150).optional() }).optional(),
  mother: z.object({ name: z.string().trim().max(150).optional(), occupation: z.string().trim().max(150).optional() }).optional(),
  brothers: z.array(siblingEntrySchema).optional(),
  sisters: z.array(siblingEntrySchema).optional(),
  familyType: z.enum(['joint', 'nuclear']).optional(),
  familyStatus: z.enum(['middle_class', 'upper_middle_class', 'rich']).optional(),
});

const lifestyleSchema = z.object({
  diet: z.string().trim().max(50).optional(),
  smoking: z.string().trim().max(50).optional(),
  drinking: z.string().trim().max(50).optional(),
  hobbies: z.array(z.string().trim().max(100)).optional(),
  interests: z.array(z.string().trim().max(100)).optional(),
});

const partnerPreferencesSchema = z.object({
  preferredAge: z.string().trim().max(50).optional(),
  preferredHeight: z.string().trim().max(50).optional(),
  preferredEducation: z.string().trim().max(150).optional(),
  preferredOccupation: z.string().trim().max(150).optional(),
  preferredLocation: z.string().trim().max(150).optional(),
  additionalExpectations: z.string().trim().max(1000).optional(),
});

const horoscopeSchema = z.object({
  birthTime: z.string().trim().max(20).optional(),
  birthPlace: z.string().trim().max(150).optional(),
  rashi: z.string().trim().max(50).optional(),
  nakshatra: z.string().trim().max(50).optional(),
  manglik: z.string().trim().max(50).optional(),
});

export const biodataDataSchema = z.object({
  personalInfo: personalInfoSchema,
  contactInfo: contactInfoSchema,
  education: z.array(educationEntrySchema).optional().default([]),
  occupation: occupationSchema.optional(),
  family: familySchema.optional(),
  lifestyle: lifestyleSchema.optional(),
  partnerPreferences: partnerPreferencesSchema.optional(),
  horoscope: horoscopeSchema.optional(),
});

export const createBiodataSchema = z.object({
  title: z.string().trim().min(1).max(200).default('Untitled Biodata'),
  templateId: z.number().int().positive().optional(),
  languageId: z.number().int().positive(),
  data: biodataDataSchema,
  aboutMeHtml: z.string().max(20000).optional(),
});

export const updateBiodataSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  templateId: z.number().int().positive().nullable().optional(),
  languageId: z.number().int().positive().optional(),
  data: biodataDataSchema.optional(),
  aboutMeHtml: z.string().max(20000).optional(),
  status: z.enum(['draft', 'completed']).optional(),
  isPublic: z.boolean().optional(),
});

export const listBiodataQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(['draft', 'completed']).optional(),
});

export type CreateBiodataInput = z.infer<typeof createBiodataSchema>;
export type UpdateBiodataInput = z.infer<typeof updateBiodataSchema>;
