import { Request, Response } from 'express';
import * as templateService from '../services/template.service';

export async function listTemplatesHandler(req: Request, res: Response): Promise<void> {
  const categorySlug = typeof req.query.category === 'string' ? req.query.category : undefined;
  const templates = await templateService.getTemplates(categorySlug);
  res.status(200).json({ success: true, data: templates });
}

export async function getTemplateHandler(req: Request, res: Response): Promise<void> {
  const template = await templateService.getTemplateById(Number(req.params.id));
  res.status(200).json({ success: true, data: template });
}

export async function listCategoriesHandler(_req: Request, res: Response): Promise<void> {
  const categories = await templateService.getCategories();
  res.status(200).json({ success: true, data: categories });
}
