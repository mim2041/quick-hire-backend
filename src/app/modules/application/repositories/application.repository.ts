import { Application, IApplication } from './schemas/application.schema';
import { TCreateApplicationInput } from '../types/application.type';

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

