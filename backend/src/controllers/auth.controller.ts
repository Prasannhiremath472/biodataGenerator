import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AppError } from '../utils/AppError';

function requestMeta(req: Request) {
  return { userAgent: req.headers['user-agent'], ipAddress: req.ip };
}

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: { userId: result.userId, ...(process.env.NODE_ENV !== 'production' ? { emailVerifyToken: result.emailVerifyToken } : {}) },
  });
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body, requestMeta(req));
  res.status(200).json({ success: true, data: result });
}

export async function refreshHandler(req: Request, res: Response): Promise<void> {
  const result = await authService.refresh(req.body.refreshToken, requestMeta(req));
  res.status(200).json({ success: true, data: result });
}

export async function logoutHandler(req: Request, res: Response): Promise<void> {
  await authService.logout(req.body.refreshToken);
  res.status(200).json({ success: true, message: 'Logged out' });
}

export async function verifyEmailHandler(req: Request, res: Response): Promise<void> {
  await authService.verifyEmail(req.body.token);
  res.status(200).json({ success: true, message: 'Email verified successfully' });
}

export async function forgotPasswordHandler(req: Request, res: Response): Promise<void> {
  const result = await authService.forgotPassword(req.body.email);
  res.status(200).json({
    success: true,
    message: 'If an account exists for this email, a reset link has been sent.',
    ...(process.env.NODE_ENV !== 'production' && result ? { data: result } : {}),
  });
}

export async function resetPasswordHandler(req: Request, res: Response): Promise<void> {
  await authService.resetPasswordWithToken(req.body.token, req.body.newPassword);
  res.status(200).json({ success: true, message: 'Password reset successfully' });
}

export async function meHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) throw AppError.unauthorized();
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ success: true, data: user });
}
