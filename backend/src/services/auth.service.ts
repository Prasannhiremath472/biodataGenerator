import crypto from 'crypto';
import { AppError } from '../utils/AppError';
import { hashPassword, comparePassword } from '../utils/password';
import { generateRefreshToken, hashToken, refreshTokenExpiryDate, signAccessToken } from '../utils/jwt';
import {
  createUser,
  findUserByEmail,
  findUserByEmailVerifyToken,
  findUserById,
  findUserByPasswordResetToken,
  markEmailVerified,
  resetPassword as persistResetPassword,
  setPasswordResetToken,
  touchLastLogin,
} from '../models/user.model';
import {
  findActiveRefreshToken,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
  storeRefreshToken,
} from '../models/refreshToken.model';
import { RegisterInput, LoginInput } from '../validators/auth.validators';

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function publicUser(user: { id: number; full_name: string; email: string; mobile_number: string; role: string; is_email_verified: number; theme_preference: string }) {
  return {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    mobileNumber: user.mobile_number,
    role: user.role,
    isEmailVerified: Boolean(user.is_email_verified),
    themePreference: user.theme_preference,
  };
}

async function issueTokenPair(userId: number, role: 'user' | 'admin', meta?: { userAgent?: string; ipAddress?: string }) {
  const accessToken = signAccessToken({ userId, role });
  const refreshToken = generateRefreshToken();
  await storeRefreshToken({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: refreshTokenExpiryDate(),
    userAgent: meta?.userAgent,
    ipAddress: meta?.ipAddress,
  });
  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw AppError.conflict('An account with this email already exists');
  }

  const passwordHash = await hashPassword(input.password);
  const emailVerifyToken = crypto.randomBytes(32).toString('hex');

  const userId = await createUser({
    fullName: input.fullName,
    email: input.email,
    mobileNumber: input.mobileNumber,
    passwordHash,
    emailVerifyToken,
    emailVerifyExpiresAt: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
  });

  // In production this token is emailed via the SMTP service rather than returned directly.
  return { userId, emailVerifyToken };
}

export async function login(input: LoginInput, meta?: { userAgent?: string; ipAddress?: string }) {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }
  if (user.status === 'blocked') {
    throw AppError.forbidden('This account has been blocked');
  }

  const isValid = await comparePassword(input.password, user.password_hash);
  if (!isValid) {
    throw AppError.unauthorized('Invalid email or password');
  }

  await touchLastLogin(user.id);
  const tokens = await issueTokenPair(user.id, user.role, meta);
  return { ...tokens, user: publicUser(user) };
}

export async function refresh(refreshToken: string, meta?: { userAgent?: string; ipAddress?: string }) {
  const tokenHash = hashToken(refreshToken);
  const record = await findActiveRefreshToken(tokenHash);
  if (!record) {
    throw AppError.unauthorized('Invalid or expired refresh token');
  }

  const user = await findUserById(record.user_id);
  if (!user || user.status === 'blocked') {
    throw AppError.unauthorized('Account no longer active');
  }

  // rotate: revoke the used token, issue a new pair
  await revokeRefreshToken(tokenHash);
  const tokens = await issueTokenPair(user.id, user.role, meta);
  return { ...tokens, user: publicUser(user) };
}

export async function logout(refreshToken: string): Promise<void> {
  await revokeRefreshToken(hashToken(refreshToken));
}

export async function logoutEverywhere(userId: number): Promise<void> {
  await revokeAllUserRefreshTokens(userId);
}

export async function verifyEmail(token: string): Promise<void> {
  const user = await findUserByEmailVerifyToken(token);
  if (!user) {
    throw AppError.badRequest('Invalid or expired verification token');
  }
  await markEmailVerified(user.id);
}

export async function forgotPassword(email: string): Promise<{ resetToken: string } | null> {
  const user = await findUserByEmail(email);
  if (!user) {
    // Do not reveal whether the email exists.
    return null;
  }
  const resetToken = crypto.randomBytes(32).toString('hex');
  await setPasswordResetToken(user.id, resetToken, new Date(Date.now() + RESET_TOKEN_TTL_MS));
  return { resetToken };
}

export async function resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
  const user = await findUserByPasswordResetToken(token);
  if (!user) {
    throw AppError.badRequest('Invalid or expired reset token');
  }
  const passwordHash = await hashPassword(newPassword);
  await persistResetPassword(user.id, passwordHash);
  await revokeAllUserRefreshTokens(user.id);
}

export async function getCurrentUser(userId: number) {
  const user = await findUserById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }
  return publicUser(user);
}
