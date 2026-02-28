import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import AppError from '../../../errors/AppError';
import { cloudinaryFileUploadService } from '../../../manager/cloudinary';
import { submitApplication } from '../services/application.service';

export const submitApplicationHandler = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Resume file is required');
    }

    const uploadResult = await cloudinaryFileUploadService.uploadFile(
      req.file,
      'applications/resumes'
    );

    const application = await submitApplication({
      ...req.body,
      resumeLink: uploadResult.secure_url,
    });

    return sendResponse(req, res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Application submitted successfully',
      data: application,
    });
  }
);

