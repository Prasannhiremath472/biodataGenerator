import crypto from 'crypto';
import { AppError } from '../utils/AppError';
import {
  BiodataRecord,
  findBiodataById,
  insertBiodata,
  listBiodatasByUser,
  softDeleteBiodata,
  updateBiodata,
} from '../models/biodata.model';
import { CreateBiodataInput, UpdateBiodataInput } from '../validators/biodata.validators';

function serialize(record: BiodataRecord) {
  return {
    id: record.id,
    userId: record.user_id,
    templateId: record.template_id,
    languageId: record.language_id,
    title: record.title,
    publicSlug: record.public_slug,
    isPublic: Boolean(record.is_public),
    status: record.status,
    data: JSON.parse(record.data_json),
    aboutMeHtml: record.about_me_html,
    qrCodeUrl: record.qr_code_url,
    viewCount: record.view_count,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export async function getOwnedBiodataOrThrow(id: number, userId: number): Promise<BiodataRecord> {
  const record = await findBiodataById(id);
  if (!record) throw AppError.notFound('Biodata not found');
  if (record.user_id !== userId) throw AppError.forbidden('You do not have access to this biodata');
  return record;
}

export async function createBiodata(userId: number, input: CreateBiodataInput) {
  const id = await insertBiodata({
    userId,
    templateId: input.templateId ?? null,
    languageId: input.languageId,
    title: input.title,
    dataJson: input.data,
    aboutMeHtml: input.aboutMeHtml ?? null,
  });
  const record = await findBiodataById(id);
  return serialize(record!);
}

export async function getBiodataById(id: number, userId: number) {
  const record = await getOwnedBiodataOrThrow(id, userId);
  return serialize(record);
}

export async function listBiodatas(userId: number, opts: { page: number; pageSize: number; status?: 'draft' | 'completed' }) {
  const { rows, total } = await listBiodatasByUser(userId, opts);
  return {
    items: rows.map(serialize),
    pagination: { page: opts.page, pageSize: opts.pageSize, total, totalPages: Math.ceil(total / opts.pageSize) },
  };
}

export async function patchBiodata(id: number, userId: number, input: UpdateBiodataInput) {
  await getOwnedBiodataOrThrow(id, userId);

  let publicSlug: string | null | undefined;
  if (input.isPublic === true) {
    publicSlug = crypto.randomBytes(8).toString('hex');
  } else if (input.isPublic === false) {
    publicSlug = null;
  }

  await updateBiodata(id, userId, {
    title: input.title,
    templateId: input.templateId,
    languageId: input.languageId,
    dataJson: input.data,
    aboutMeHtml: input.aboutMeHtml,
    status: input.status,
    isPublic: input.isPublic,
    publicSlug,
  });

  const updated = await findBiodataById(id);
  return serialize(updated!);
}

export async function deleteBiodata(id: number, userId: number): Promise<void> {
  await getOwnedBiodataOrThrow(id, userId);
  await softDeleteBiodata(id, userId);
}

export async function duplicateBiodata(id: number, userId: number) {
  const original = await getOwnedBiodataOrThrow(id, userId);
  const newId = await insertBiodata({
    userId,
    templateId: original.template_id,
    languageId: original.language_id,
    title: `${original.title} (Copy)`,
    dataJson: JSON.parse(original.data_json),
    aboutMeHtml: original.about_me_html,
  });
  const record = await findBiodataById(newId);
  return serialize(record!);
}
