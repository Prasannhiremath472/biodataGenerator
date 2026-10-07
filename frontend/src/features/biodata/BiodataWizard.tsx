import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BIODATA_FORM_DEFAULTS, BiodataFormValues, biodataFormSchema } from './biodataForm.schema';
import { WIZARD_STEPS } from './wizardSteps';
import { StepIndicator } from './StepIndicator';
import { DraftRestoreBanner } from './DraftRestoreBanner';
import { useDraftAutosave } from './useDraftAutosave';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactStep } from './steps/ContactStep';
import { EducationStep } from './steps/EducationStep';
import { OccupationStep } from './steps/OccupationStep';
import { FamilyStep } from './steps/FamilyStep';
import { LifestyleStep } from './steps/LifestyleStep';
import { PartnerPreferencesStep } from './steps/PartnerPreferencesStep';
import { HoroscopeStep } from './steps/HoroscopeStep';
import { AboutMeStep } from './steps/AboutMeStep';
import { useCreateBiodata } from '@/api/biodatas';
import { useTemplates } from '@/api/templates';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

const STEP_COMPONENTS: Record<string, (props: { form: ReturnType<typeof useForm<BiodataFormValues>> }) => JSX.Element> = {
  personal: PersonalInfoStep,
  contact: ContactStep,
  education: EducationStep,
  occupation: OccupationStep,
  family: FamilyStep,
  lifestyle: LifestyleStep,
  partner: PartnerPreferencesStep,
  horoscope: HoroscopeStep,
  about: AboutMeStep,
};

const DRAFT_ID = 'new';

export function BiodataWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [savedBiodataId, setSavedBiodataId] = useState<number | null>(null);
  const form = useForm<BiodataFormValues>({
    resolver: zodResolver(biodataFormSchema),
    defaultValues: BIODATA_FORM_DEFAULTS,
    mode: 'onBlur',
  });

  const { hasRestorableDraft, restoreDraft, dismissDraft, discardDraft } = useDraftAutosave(DRAFT_ID, form);
  const createBiodata = useCreateBiodata();
  const { data: templates } = useTemplates();
  const previewTemplate = templates?.[0];

  const step = WIZARD_STEPS[stepIndex];
  const StepComponent = STEP_COMPONENTS[step.key];
  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;

  async function handleNext() {
    if (isLastStep) {
      const result = await createBiodata.mutateAsync(form.getValues());
      setSavedBiodataId(result.id);
      discardDraft();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, WIZARD_STEPS.length - 1));
  }

  function handlePrevious() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  const watchedValues = form.watch();

  if (savedBiodataId) {
    return (
      <div className="mx-auto max-w-2xl rounded-md border border-green-300 bg-green-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-green-800">Biodata saved!</h2>
        <p className="mt-1 text-sm text-green-700">Your biodata (#{savedBiodataId}) has been created.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold">Create Your Biodata</h1>
      <p className="mb-6 text-gray-600">Fill in your details step by step. Your progress is saved automatically.</p>

      {hasRestorableDraft && <DraftRestoreBanner onRestore={restoreDraft} onDismiss={dismissDraft} />}

      <StepIndicator currentIndex={stepIndex} onStepClick={setStepIndex} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">{step.label}</h2>
            <StepComponent form={form} />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={stepIndex === 0}
              className="rounded border px-4 py-2 text-sm disabled:opacity-40"
            >
              ← Previous
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={createBiodata.isPending}
              className="rounded bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-60"
            >
              {isLastStep ? (createBiodata.isPending ? 'Saving...' : 'Save Biodata') : 'Next →'}
            </button>
          </div>
          {createBiodata.isError && <p className="mt-2 text-sm text-red-600">Failed to save biodata. Please check the form and try again.</p>}
        </div>

        <div className="hidden lg:block">
          <h2 className="mb-2 text-sm font-semibold text-gray-500">Live Preview</h2>
          {previewTemplate ? (
            <div className="max-h-[80vh] overflow-y-auto rounded border bg-gray-50 p-4">
              <TemplateRenderer
                template={previewTemplate}
                data={{
                  personalInfo: watchedValues.personalInfo,
                  contactInfo: watchedValues.contactInfo,
                  education: watchedValues.education,
                  occupation: watchedValues.occupation,
                  family: watchedValues.family,
                  lifestyle: watchedValues.lifestyle,
                  partnerPreferences: watchedValues.partnerPreferences,
                  horoscope: watchedValues.horoscope,
                }}
                aboutMeHtml={watchedValues.aboutMeHtml}
              />
            </div>
          ) : (
            <p className="text-sm text-gray-400">Loading preview template...</p>
          )}
        </div>
      </div>
    </div>
  );
}
