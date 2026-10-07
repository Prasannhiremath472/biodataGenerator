export interface AccessTokenPayload {
  userId: number;
  role: 'user' | 'admin';
}

export interface AuthenticatedUser {
  id: number;
  role: 'user' | 'admin';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
