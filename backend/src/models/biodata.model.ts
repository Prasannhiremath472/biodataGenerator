import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';

export interface BiodataRecord extends RowDataPacket {
  id: number;
  user_id: number;
  template_id: number | null;
  language_id: number;
  title: string;
  public_slug: string | null;
  is_public: number;
  status: 'draft' | 'completed';
  data_json: string;
  about_me_html: string | null;
  qr_code_url: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export async function insertBiodata(input: {
  userId: number;
  templateId: number | null;
  languageId: number;
  title: string;
  dataJson: unknown;
  aboutMeHtml: string | null;
}): Promise<number> {
  const [result] = await pool.query(
    `INSERT INTO biodatas (user_id, template_id, language_id, title, data_json, about_me_html, created_by, updated_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.userId,
      input.templateId,
      input.languageId,
      input.title,
      JSON.stringify(input.dataJson),
      input.aboutMeHtml,
      input.userId,
      input.userId,
    ],
  );
  return (result as { insertId: number }).insertId;
}

export async function findBiodataById(id: number): Promise<BiodataRecord | null> {
  const [rows] = await pool.query<BiodataRecord[]>(
    'SELECT * FROM biodatas WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [id],
  );
  return rows[0] ?? null;
}

export async function findBiodataByPublicSlug(slug: string): Promise<BiodataRecord | null> {
  const [rows] = await pool.query<BiodataRecord[]>(
    'SELECT * FROM biodatas WHERE public_slug = ? AND is_public = 1 AND deleted_at IS NULL LIMIT 1',
    [slug],
  );
  return rows[0] ?? null;
}

export async function listBiodatasByUser(
  userId: number,
  opts: { page: number; pageSize: number; status?: 'draft' | 'completed' },
): Promise<{ rows: BiodataRecord[]; total: number }> {
  const offset = (opts.page - 1) * opts.pageSize;
  const statusClause = opts.status ? 'AND status = ?' : '';
  const params: unknown[] = [userId];
  if (opts.status) params.push(opts.status);

  const [rows] = await pool.query<BiodataRecord[]>(
    `SELECT * FROM biodatas WHERE user_id = ? AND deleted_at IS NULL ${statusClause}
     ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
    [...params, opts.pageSize, offset],
  );

  const [countRows] = await pool.query<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM biodatas WHERE user_id = ? AND deleted_at IS NULL ${statusClause}`,
    params,
  );

  return { rows, total: Number(countRows[0]?.total ?? 0) };
}

export async function updateBiodata(
  id: number,
  userId: number,
  fields: Partial<{
    title: string;
    templateId: number | null;
    languageId: number;
    dataJson: unknown;
    aboutMeHtml: string | null;
    status: 'draft' | 'completed';
    isPublic: boolean;
    publicSlug: string | null;
  }>,
): Promise<void> {
  const setClauses: string[] = [];
  const params: unknown[] = [];

  if (fields.title !== undefined) { setClauses.push('title = ?'); params.push(fields.title); }
  if (fields.templateId !== undefined) { setClauses.push('template_id = ?'); params.push(fields.templateId); }
  if (fields.languageId !== undefined) { setClauses.push('language_id = ?'); params.push(fields.languageId); }
  if (fields.dataJson !== undefined) { setClauses.push('data_json = ?'); params.push(JSON.stringify(fields.dataJson)); }
  if (fields.aboutMeHtml !== undefined) { setClauses.push('about_me_html = ?'); params.push(fields.aboutMeHtml); }
  if (fields.status !== undefined) { setClauses.push('status = ?'); params.push(fields.status); }
  if (fields.isPublic !== undefined) { setClauses.push('is_public = ?'); params.push(fields.isPublic ? 1 : 0); }
  if (fields.publicSlug !== undefined) { setClauses.push('public_slug = ?'); params.push(fields.publicSlug); }

  if (setClauses.length === 0) return;

  setClauses.push('updated_by = ?');
  params.push(userId);

  await pool.query(
    `UPDATE biodatas SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ? AND deleted_at IS NULL`,
    [...params, id, userId],
  );
}

export async function softDeleteBiodata(id: number, userId: number): Promise<void> {
  await pool.query('UPDATE biodatas SET deleted_at = NOW() WHERE id = ? AND user_id = ?', [id, userId]);
}

export async function incrementViewCount(id: number): Promise<void> {
  await pool.query('UPDATE biodatas SET view_count = view_count + 1 WHERE id = ?', [id]);
}

export async function countBiodatasByUser(userId: number): Promise<number> {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM biodatas WHERE user_id = ? AND deleted_at IS NULL',
    [userId],
  );
  return Number(rows[0]?.total ?? 0);
}
