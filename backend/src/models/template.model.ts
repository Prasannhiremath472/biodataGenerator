import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';

export interface TemplateRecord extends RowDataPacket {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  config_json: string;
  is_premium: number;
  status: 'draft' | 'published' | 'archived';
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface TemplateCategoryRecord extends RowDataPacket {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export async function listPublishedTemplates(categorySlug?: string): Promise<TemplateRecord[]> {
  if (categorySlug) {
    const [rows] = await pool.query<TemplateRecord[]>(
      `SELECT t.* FROM templates t
       JOIN template_categories c ON c.id = t.category_id
       WHERE t.status = 'published' AND t.deleted_at IS NULL AND c.slug = ?
       ORDER BY t.name ASC`,
      [categorySlug],
    );
    return rows;
  }
  const [rows] = await pool.query<TemplateRecord[]>(
    `SELECT * FROM templates WHERE status = 'published' AND deleted_at IS NULL ORDER BY name ASC`,
  );
  return rows;
}

export async function findTemplateById(id: number): Promise<TemplateRecord | null> {
  const [rows] = await pool.query<TemplateRecord[]>(
    'SELECT * FROM templates WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [id],
  );
  return rows[0] ?? null;
}

export async function listTemplateCategories(): Promise<TemplateCategoryRecord[]> {
  const [rows] = await pool.query<TemplateCategoryRecord[]>(
    'SELECT * FROM template_categories WHERE deleted_at IS NULL ORDER BY sort_order ASC',
  );
  return rows;
}

export async function incrementTemplateUsage(id: number): Promise<void> {
  await pool.query('UPDATE templates SET usage_count = usage_count + 1 WHERE id = ?', [id]);
}
