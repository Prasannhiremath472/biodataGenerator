import { useMutation } from '@tanstack/react-query';
import { apiClient } from './client';
import { BiodataFormValues } from '@/features/biodata/biodataForm.schema';
import { Biodata } from '@/types/biodata';

function toApiPayload(values: BiodataFormValues) {
  return {
    title: values.title,
    languageId: values.languageId,
    templateId: values.templateId,
    aboutMeHtml: values.aboutMeHtml || undefined,
    data: {
      personalInfo: values.personalInfo,
      contactInfo: values.contactInfo,
      education: values.education,
      occupation: values.occupation,
      family: values.family,
      lifestyle: values.lifestyle,
      partnerPreferences: values.partnerPreferences,
      horoscope: values.horoscope,
    },
  };
}

export function useCreateBiodata() {
  return useMutation({
    mutationFn: async (values: BiodataFormValues) => {
      const { data } = await apiClient.post<{ success: boolean; data: Biodata }>('/biodatas', toApiPayload(values));
      return data.data;
    },
  });
}

export function useUpdateBiodata(id: number) {
  return useMutation({
    mutationFn: async (values: BiodataFormValues) => {
      const { data } = await apiClient.put<{ success: boolean; data: Biodata }>(`/biodatas/${id}`, toApiPayload(values));
      return data.data;
    },
  });
}
