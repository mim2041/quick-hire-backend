import { TCreateApplicationInput } from '../types/application.type';
import { createApplication as createApplicationRepo } from '../repositories/application.repository';

export const submitApplication = (payload: TCreateApplicationInput) =>
  createApplicationRepo(payload);

