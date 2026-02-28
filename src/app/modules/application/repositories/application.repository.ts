/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../../builder/QueryBuilder';
import { Application, IApplication } from './schemas/application.schema';
import {
  TApplicationFilterQuery,
  TCreateApplicationInput,
  TUpdateApplicationInput,
} from '../types/application.type';

export const createApplication = async (
  payload: TCreateApplicationInput
): Promise<IApplication> => {
  const application = await Application.create({
    job: payload.jobId,
    name: payload.name,
    email: payload.email,
    resumeLink: payload.resumeLink,
    coverNote: payload.coverNote,
  });

  return application;
};

export const getApplications = async (query: TApplicationFilterQuery) => {
  const initialQuery: any = {};
  if (query.jobId) {
    initialQuery.job = query.jobId;
  }
  if (query.email) {
    initialQuery.email = query.email.toLowerCase();
  }

  const builder = new QueryBuilder<IApplication>(
    Application.find(initialQuery),
    query as any
  )
    .sort()
    .paginate()
    .fields();

  const [data, meta] = await Promise.all([builder.modelQuery, builder.countTotal()]);

  return { data, meta };
};

export const getApplicationById = async (id: string): Promise<IApplication | null> => {
  const application = await Application.findById(id);
  return application;
};

export const updateApplicationById = async (
  id: string,
  payload: TUpdateApplicationInput
): Promise<IApplication | null> => {
  const updated = await Application.findByIdAndUpdate(
    id,
    {
      ...(payload.jobId && { job: payload.jobId }),
      ...(payload.name && { name: payload.name }),
      ...(payload.email && { email: payload.email.toLowerCase() }),
      ...(payload.resumeLink && { resumeLink: payload.resumeLink }),
      ...(payload.coverNote && { coverNote: payload.coverNote }),
    },
    { new: true }
  );

  return updated;
};

export const deleteApplicationById = async (
  id: string
): Promise<IApplication | null> => {
  const deleted = await Application.findByIdAndDelete(id);
  return deleted;
};

