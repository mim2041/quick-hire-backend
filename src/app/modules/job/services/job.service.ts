import { TCreateJobInput, TJobFilterQuery, TUpdateJobInput } from '../types/job.type';
import {
  createJob as createJobRepo,
  deleteJobById,
  getJobById,
  getJobs as getJobsRepo,
  updateJobById,
} from '../repositories/job.repository';

export const createJob = (payload: TCreateJobInput) => createJobRepo(payload);

export const getJobs = (query: TJobFilterQuery) => getJobsRepo(query);

export const getSingleJob = (id: string) => getJobById(id);

export const removeJob = (id: string) => deleteJobById(id);

export const updateJob = (id: string, payload: TUpdateJobInput) =>
  updateJobById(id, payload);

