import { getOwnedBiodataOrThrow } from './biodata.service';
import { findCustomizationByBiodataId, upsertCustomization } from '../models/templateCustomization.model';
import { updateBiodata } from '../models/biodata.model';
import { CustomizationInput } from '../validators/customization.validators';

function serialize(record: { template_id: number; color_overrides_json: string | null; font_overrides_json: string | null; layout_overrides_json: string | null }) {
  return {
    templateId: record.template_id,
    colorOverrides: record.color_overrides_json ? JSON.parse(record.color_overrides_json) : null,
    fontOverrides: record.font_overrides_json ? JSON.parse(record.font_overrides_json) : null,
    layoutOverrides: record.layout_overrides_json ? JSON.parse(record.layout_overrides_json) : null,
  };
}

export async function setCustomization(biodataId: number, userId: number, input: CustomizationInput) {
  await getOwnedBiodataOrThrow(biodataId, userId);

  await upsertCustomization({
    biodataId,
    templateId: input.templateId,
    colorOverrides: input.colorOverrides,
    fontOverrides: input.fontOverrides,
    layoutOverrides: input.layoutOverrides,
  });
  await updateBiodata(biodataId, userId, { templateId: input.templateId });

  const record = await findCustomizationByBiodataId(biodataId);
  return serialize(record!);
}

export async function getCustomization(biodataId: number, userId: number) {
  await getOwnedBiodataOrThrow(biodataId, userId);
  const record = await findCustomizationByBiodataId(biodataId);
  return record ? serialize(record) : null;
}
