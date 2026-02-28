/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { getJobs, getSingleJob } from '../services/job.service';

export const getJobsHandler = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await getJobs(req.query as any);

  return sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jobs fetched successfully',
    meta,
    data,
  });
});

export const getJobByIdHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const job = await getSingleJob(id);

  return sendResponse(req, res, {
    statusCode: job ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!job,
    message: job ? 'Job fetched successfully' : 'Job not found',
    data: job,
  });
});

