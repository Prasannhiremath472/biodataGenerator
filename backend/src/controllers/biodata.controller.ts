import { Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import * as biodataService from '../services/biodata.service';
import * as customizationService from '../services/customization.service';

function userId(req: Request): number {
  if (!req.user) throw AppError.unauthorized();
  return req.user.id;
}

export async function createHandler(req: Request, res: Response): Promise<void> {
  const biodata = await biodataService.createBiodata(userId(req), req.body);
  res.status(201).json({ success: true, data: biodata });
}

export async function getByIdHandler(req: Request, res: Response): Promise<void> {
  const biodata = await biodataService.getBiodataById(Number(req.params.id), userId(req));
  res.status(200).json({ success: true, data: biodata });
}

export async function listHandler(req: Request, res: Response): Promise<void> {
  const { page, pageSize, status } = req.query as unknown as { page: number; pageSize: number; status?: 'draft' | 'completed' };
  const result = await biodataService.listBiodatas(userId(req), { page, pageSize, status });
  res.status(200).json({ success: true, ...result });
}

export async function updateHandler(req: Request, res: Response): Promise<void> {
  const biodata = await biodataService.patchBiodata(Number(req.params.id), userId(req), req.body);
  res.status(200).json({ success: true, data: biodata });
}

export async function deleteHandler(req: Request, res: Response): Promise<void> {
  await biodataService.deleteBiodata(Number(req.params.id), userId(req));
  res.status(200).json({ success: true, message: 'Biodata deleted' });
}

export async function duplicateHandler(req: Request, res: Response): Promise<void> {
  const biodata = await biodataService.duplicateBiodata(Number(req.params.id), userId(req));
  res.status(201).json({ success: true, data: biodata });
}

export async function getCustomizationHandler(req: Request, res: Response): Promise<void> {
  const customization = await customizationService.getCustomization(Number(req.params.id), userId(req));
  res.status(200).json({ success: true, data: customization });
}

export async function setCustomizationHandler(req: Request, res: Response): Promise<void> {
  const customization = await customizationService.setCustomization(Number(req.params.id), userId(req), req.body);
  res.status(200).json({ success: true, data: customization });
}
