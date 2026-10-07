import { z } from 'zod';
import { BIODATA_SECTION_KEYS } from '../types/template';

export const customizationSchema = z.object({
  templateId: z.number().int().positive(),
  colorOverrides: z
    .object({
      primaryColor: z.string().trim().max(20).optional(),
      secondaryColor: z.string().trim().max(20).optional(),
      accentColor: z.string().trim().max(20).optional(),
      backgroundColor: z.string().trim().max(20).optional(),
      textColor: z.string().trim().max(20).optional(),
    })
    .optional(),
  fontOverrides: z
    .object({
      headingFont: z.string().trim().max(100).optional(),
      bodyFont: z.string().trim().max(100).optional(),
    })
    .optional(),
  layoutOverrides: z
    .object({
      variant: z.enum(['single-column', 'two-column', 'sidebar', 'photo-centric']).optional(),
      sectionOrder: z.array(z.enum(BIODATA_SECTION_KEYS)).optional(),
    })
    .optional(),
});

export type CustomizationInput = z.infer<typeof customizationSchema>;
