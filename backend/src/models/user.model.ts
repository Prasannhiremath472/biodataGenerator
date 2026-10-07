import { RowDataPacket } from 'mysql2';
import { pool } from '../config/db';

export interface UserRecord extends RowDataPacket {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  password_hash: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  is_email_verified: number;
  email_verify_token: string | null;
  email_verify_expires_at: string | null;
  password_reset_token: string | null;
  password_reset_expires_at: string | null;
  preferred_language_id: number | null;
  theme_preference: 'light' | 'dark';
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const [rows] = await pool.query<UserRecord[]>(
    'SELECT * FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1',
    [email],
  );
  return rows[0] ?? null;
}

export async function findUserById(id: number): Promise<UserRecord | null> {
  const [rows] = await pool.query<UserRecord[]>(
    'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1',
    [id],
  );
  return rows[0] ?? null;
}

export async function findUserByEmailVerifyToken(token: string): Promise<UserRecord | null> {
  const [rows] = await pool.query<UserRecord[]>(
    'SELECT * FROM users WHERE email_verify_token = ? AND email_verify_expires_at > NOW() AND deleted_at IS NULL LIMIT 1',
    [token],
  );
  return rows[0] ?? null;
}

export async function findUserByPasswordResetToken(token: string): Promise<UserRecord | null> {
  const [rows] = await pool.query<UserRecord[]>(
    'SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires_at > NOW() AND deleted_at IS NULL LIMIT 1',
    [token],
  );
  return rows[0] ?? null;
}

export async function createUser(input: {
  fullName: string;
  email: string;
  mobileNumber: string;
  passwordHash: string;
  emailVerifyToken: string;
  emailVerifyExpiresAt: Date;
}): Promise<number> {
  const [result] = await pool.query(
    `INSERT INTO users (full_name, email, mobile_number, password_hash, email_verify_token, email_verify_expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      input.fullName,
      input.email,
      input.mobileNumber,
      input.passwordHash,
      input.emailVerifyToken,
      input.emailVerifyExpiresAt,
    ],
  );
  return (result as { insertId: number }).insertId;
}

export async function markEmailVerified(userId: number): Promise<void> {
  await pool.query(
    'UPDATE users SET is_email_verified = 1, email_verify_token = NULL, email_verify_expires_at = NULL WHERE id = ?',
    [userId],
  );
}

export async function setPasswordResetToken(userId: number, token: string, expiresAt: Date): Promise<void> {
  await pool.query('UPDATE users SET password_reset_token = ?, password_reset_expires_at = ? WHERE id = ?', [
    token,
    expiresAt,
    userId,
  ]);
}

export async function resetPassword(userId: number, passwordHash: string): Promise<void> {
  await pool.query(
    'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires_at = NULL WHERE id = ?',
    [passwordHash, userId],
  );
}

export async function touchLastLogin(userId: number): Promise<void> {
  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [userId]);
}
