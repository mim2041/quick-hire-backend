import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AppError from '../../../errors/AppError';
import env from '../../../config/env';
import {
  findUserByEmail,
  findUserById,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from '../repositories/auth.repository';

const ACCESS_EXPIRES = env.jwtAccessExpiresIn;
const REFRESH_EXPIRES = env.jwtRefreshExpiresIn;

function signAccessToken(payload: { id: string; email: string; role: string }) {
  const secret = env.jwtAccessSecret;
  if (!secret) throw new AppError(500, 'Server auth configuration error');
  return jwt.sign(payload, secret, { expiresIn: ACCESS_EXPIRES } as jwt.SignOptions);
}

function signRefreshToken(payload: { id: string }) {
  const secret = env.jwtRefreshSecret;
  if (!secret) throw new AppError(500, 'Server auth configuration error');
  return jwt.sign(payload, secret, { expiresIn: REFRESH_EXPIRES } as jwt.SignOptions);
}

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError(401, 'Invalid email or password');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError(401, 'Invalid email or password');

  const accessToken = signAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const refreshTokenValue = signRefreshToken({ id: user._id.toString() });
  const decoded = jwt.decode(refreshTokenValue) as { exp?: number };
  const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await createRefreshToken(user._id, refreshTokenValue, expiresAt);

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken: refreshTokenValue,
    expiresIn: ACCESS_EXPIRES,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  if (!env.jwtRefreshSecret) throw new AppError(500, 'Server auth configuration error');

  let decoded: { id?: string };
  try {
    decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as { id: string };
  } catch {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const stored = await findRefreshToken(refreshToken);
  if (!stored) throw new AppError(401, 'Refresh token not found or revoked');

  const user = await findUserById(decoded.id!);
  if (!user) throw new AppError(401, 'User not found');

  const accessToken = signAccessToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    expiresIn: ACCESS_EXPIRES,
  };
}

export async function logoutUser(refreshToken?: string) {
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }
  return { message: 'Logged out successfully' };
}

export async function getMe(userId: string) {
  const user = await findUserById(userId);
  if (!user) throw new AppError(404, 'User not found');
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}
