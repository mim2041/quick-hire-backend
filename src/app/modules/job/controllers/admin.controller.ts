import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { createJob, removeJob } from '../services/job.service';

export const createJobHandler = catchAsync(async (req: Request, res: Response) => {
  const job = await createJob(req.body);

  return sendResponse(req, res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Job created successfully',
    data: job,
  });
});

export const deleteJobHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await removeJob(id);

  return sendResponse(req, res, {
    statusCode: deleted ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!deleted,
    message: deleted ? 'Job deleted successfully' : 'Job not found',
    data: deleted,
  });
});

