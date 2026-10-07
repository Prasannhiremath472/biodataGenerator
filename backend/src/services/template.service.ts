import { AppError } from '../utils/AppError';
import {
  TemplateRecord,
  findTemplateById,
  incrementTemplateUsage,
  listPublishedTemplates,
  listTemplateCategories,
} from '../models/template.model';

function serialize(record: TemplateRecord) {
  return {
    id: record.id,
    categoryId: record.category_id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    thumbnailUrl: record.thumbnail_url,
    config: JSON.parse(record.config_json),
    isPremium: Boolean(record.is_premium),
    status: record.status,
    usageCount: record.usage_count,
  };
}

export async function getTemplates(categorySlug?: string) {
  const records = await listPublishedTemplates(categorySlug);
  return records.map(serialize);
}

export async function getTemplateById(id: number) {
  const record = await findTemplateById(id);
  if (!record || record.status !== 'published') {
    throw AppError.notFound('Template not found');
  }
  return serialize(record);
}

export async function getCategories() {
  const records = await listTemplateCategories();
  return records.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    sortOrder: c.sort_order,
  }));
}

export async function recordTemplateUsage(id: number): Promise<void> {
  await incrementTemplateUsage(id);
}
