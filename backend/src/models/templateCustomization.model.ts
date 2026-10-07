import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';

export interface TemplateCustomizationRecord extends RowDataPacket {
  id: number;
  biodata_id: number;
  template_id: number;
  color_overrides_json: string | null;
  font_overrides_json: string | null;
  layout_overrides_json: string | null;
}

export async function upsertCustomization(input: {
  biodataId: number;
  templateId: number;
  colorOverrides?: unknown;
  fontOverrides?: unknown;
  layoutOverrides?: unknown;
}): Promise<void> {
  await pool.query(
    `INSERT INTO template_customizations (biodata_id, template_id, color_overrides_json, font_overrides_json, layout_overrides_json)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       template_id = VALUES(template_id),
       color_overrides_json = VALUES(color_overrides_json),
       font_overrides_json = VALUES(font_overrides_json),
       layout_overrides_json = VALUES(layout_overrides_json)`,
    [
      input.biodataId,
      input.templateId,
      input.colorOverrides ? JSON.stringify(input.colorOverrides) : null,
      input.fontOverrides ? JSON.stringify(input.fontOverrides) : null,
      input.layoutOverrides ? JSON.stringify(input.layoutOverrides) : null,
    ],
  );
}

export async function findCustomizationByBiodataId(biodataId: number): Promise<TemplateCustomizationRecord | null> {
  const [rows] = await pool.query<TemplateCustomizationRecord[]>(
    'SELECT * FROM template_customizations WHERE biodata_id = ? AND deleted_at IS NULL LIMIT 1',
    [biodataId],
  );
  return rows[0] ?? null;
}
