import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { loginUser, refreshAccessToken, logoutUser, getMe } from '../services/auth.service';

export const loginHandler = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);
  return sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const refreshHandler = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await refreshAccessToken(refreshToken);
  return sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token refreshed',
    data: result,
  });
});

export const logoutHandler = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await logoutUser(refreshToken);
  return sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const meHandler = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(req, res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Not authenticated',
      data: null,
    });
  }
  const user = await getMe(req.user.id);
  return sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile fetched',
    data: user,
  });
});
