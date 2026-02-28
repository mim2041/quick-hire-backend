import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AppError from '../errors/AppError';
import { hasPermission, Permission } from '../config/rbac';
import env from '../config/env';

const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    if (!env.jwtAccessSecret) {
      throw new AppError(500, 'Server auth configuration error');
    }

    const decoded = jwt.verify(token, env.jwtAccessSecret) as {
      id: string;
      email: string;
      role: string;
      iat?: number;
      exp?: number;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err instanceof AppError) next(err);
    else if (err instanceof jwt.JsonWebTokenError)
      next(new AppError(401, 'Invalid or expired token'));
    else if (err instanceof jwt.TokenExpiredError)
      next(new AppError(401, 'Token expired'));
    else next(err);
  }
};

const requirePermission = (permission: Permission) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }
    if (!hasPermission(req.user.role, permission)) {
      return next(new AppError(403, 'You do not have permission for this action'));
    }
    next();
  };
};

export { authenticate, requirePermission };
