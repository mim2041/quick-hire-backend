import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import {
  listApplications,
  getSingleApplication,
  updateApplication,
  removeApplication,
} from '../services/application.service';

export const getApplicationsHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { data, meta } = await listApplications(req.query);

    return sendResponse(req, res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Applications fetched successfully',
      meta,
      data,
    });
  }
);

export const getApplicationByIdHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const application = await getSingleApplication(id);

    return sendResponse(req, res, {
      statusCode: application ? httpStatus.OK : httpStatus.NOT_FOUND,
      success: !!application,
      message: application ? 'Application fetched successfully' : 'Application not found',
      data: application,
    });
  }
);

export const updateApplicationHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const application = await updateApplication(id, req.body);

    return sendResponse(req, res, {
      statusCode: application ? httpStatus.OK : httpStatus.NOT_FOUND,
      success: !!application,
      message: application ? 'Application updated successfully' : 'Application not found',
      data: application,
    });
  }
);

export const deleteApplicationHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await removeApplication(id);

    return sendResponse(req, res, {
      statusCode: deleted ? httpStatus.OK : httpStatus.NOT_FOUND,
      success: !!deleted,
      message: deleted ? 'Application deleted successfully' : 'Application not found',
      data: deleted,
    });
  }
);

