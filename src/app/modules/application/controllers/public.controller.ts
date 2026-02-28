import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { submitApplication } from '../services/application.service';

export const submitApplicationHandler = catchAsync(
  async (req: Request, res: Response) => {
    const application = await submitApplication(req.body);

    return sendResponse(req, res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  }
);

