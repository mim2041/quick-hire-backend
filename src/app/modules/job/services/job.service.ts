import { TCreateJobInput, TJobFilterQuery } from '../types/job.type';
import {
  createJob as createJobRepo,
  deleteJobById,
  getJobById,
  getJobs as getJobsRepo,
} from '../repositories/job.repository';

export const createJob = (payload: TCreateJobInput) => createJobRepo(payload);

export const getJobs = (query: TJobFilterQuery) => getJobsRepo(query);

export const getSingleJob = (id: string) => getJobById(id);

export const removeJob = (id: string) => deleteJobById(id);

