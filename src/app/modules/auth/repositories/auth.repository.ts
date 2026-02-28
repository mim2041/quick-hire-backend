import { User } from '../../user/repositories/schemas/user.schema';
import { RefreshToken } from '../../user/repositories/schemas/refreshToken.schema';
import { Types } from 'mongoose';

export async function findUserByEmail(email: string) {
  return User.findOne({ email: email.toLowerCase() }).select('+password');
}

export async function findUserById(id: string) {
  return User.findById(id).select('-password');
}

export async function createRefreshToken(userId: Types.ObjectId, token: string, expiresAt: Date) {
  return RefreshToken.create({ user: userId, token, expiresAt });
}

export async function findRefreshToken(token: string) {
  return RefreshToken.findOne({ token }).populate('user');
}

export async function deleteRefreshToken(token: string) {
  return RefreshToken.deleteOne({ token });
}

export async function deleteRefreshTokensByUser(userId: Types.ObjectId) {
  return RefreshToken.deleteMany({ user: userId });
}
