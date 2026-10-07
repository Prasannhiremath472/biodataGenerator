import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { getTemplateHandler, listCategoriesHandler, listTemplatesHandler } from '../controllers/template.controller';

const router = Router();

router.get('/', asyncHandler(listTemplatesHandler));
router.get('/categories', asyncHandler(listCategoriesHandler));
router.get('/:id', asyncHandler(getTemplateHandler));

export default router;
