import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { validateBody } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../validators/auth.validators';
import {
  forgotPasswordHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  refreshHandler,
  registerHandler,
  resetPasswordHandler,
  verifyEmailHandler,
} from '../controllers/auth.controller';

const router = Router();

router.post('/register', authRateLimiter, validateBody(registerSchema), asyncHandler(registerHandler));
router.post('/login', authRateLimiter, validateBody(loginSchema), asyncHandler(loginHandler));
router.post('/refresh', validateBody(refreshTokenSchema), asyncHandler(refreshHandler));
router.post('/logout', validateBody(refreshTokenSchema), asyncHandler(logoutHandler));
router.post('/verify-email', validateBody(verifyEmailSchema), asyncHandler(verifyEmailHandler));
router.post('/forgot-password', authRateLimiter, validateBody(forgotPasswordSchema), asyncHandler(forgotPasswordHandler));
router.post('/reset-password', validateBody(resetPasswordSchema), asyncHandler(resetPasswordHandler));
router.get('/me', requireAuth, asyncHandler(meHandler));

export default router;
