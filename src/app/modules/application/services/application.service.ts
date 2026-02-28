import {
  TApplicationFilterQuery,
  TCreateApplicationInput,
  TUpdateApplicationInput,
} from '../types/application.type';
import {
  createApplication as createApplicationRepo,
  getApplications,
  getApplicationById,
  updateApplicationById,
  deleteApplicationById,
} from '../repositories/application.repository';

export const submitApplication = (payload: TCreateApplicationInput) =>
  createApplicationRepo(payload);

export const listApplications = (query: TApplicationFilterQuery) =>
  getApplications(query);

export const getSingleApplication = (id: string) => getApplicationById(id);

export const updateApplication = (id: string, payload: TUpdateApplicationInput) =>
  updateApplicationById(id, payload);

export const removeApplication = (id: string) => deleteApplicationById(id);

