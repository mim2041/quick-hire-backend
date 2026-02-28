/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../../builder/QueryBuilder';
import { Job, IJob } from './schemas/job.schema';
import { TCreateJobInput, TJobFilterQuery } from '../types/job.type';

export const createJob = async (payload: TCreateJobInput): Promise<IJob> => {
  const job = await Job.create(payload);
  return job;
};

export const deleteJobById = async (id: string): Promise<IJob | null> => {
  const job = await Job.findByIdAndDelete(id);
  return job;
};

export const getJobById = async (id: string): Promise<IJob | null> => {
  const job = await Job.findById(id);
  return job;
};

export const getJobs = async (query: TJobFilterQuery) => {
  const builder = new QueryBuilder<IJob>(Job.find(), query as any)
    .search(['title', 'company', 'location', 'category'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const [data, meta] = await Promise.all([builder.modelQuery, builder.countTotal()]);

  return { data, meta };
};

