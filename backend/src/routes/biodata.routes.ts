import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { requireAuth } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import { createBiodataSchema, listBiodataQuerySchema, updateBiodataSchema } from '../validators/biodata.validators';
import { customizationSchema } from '../validators/customization.validators';
import {
  createHandler,
  deleteHandler,
  duplicateHandler,
  getByIdHandler,
  getCustomizationHandler,
  listHandler,
  setCustomizationHandler,
  updateHandler,
} from '../controllers/biodata.controller';

const router = Router();

router.use(requireAuth);

router.get('/', validateQuery(listBiodataQuerySchema), asyncHandler(listHandler));
router.post('/', validateBody(createBiodataSchema), asyncHandler(createHandler));
router.get('/:id', asyncHandler(getByIdHandler));
router.put('/:id', validateBody(updateBiodataSchema), asyncHandler(updateHandler));
router.delete('/:id', asyncHandler(deleteHandler));
router.post('/:id/duplicate', asyncHandler(duplicateHandler));
router.get('/:id/customization', asyncHandler(getCustomizationHandler));
router.put('/:id/customization', validateBody(customizationSchema), asyncHandler(setCustomizationHandler));

export default router;
