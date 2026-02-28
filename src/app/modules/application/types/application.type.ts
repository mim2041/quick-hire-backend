export type TCreateApplicationInput = {
  jobId: string;
  name: string;
  email: string;
  resumeLink: string;
  coverNote: string;
};

export type TUpdateApplicationInput = Partial<Omit<TCreateApplicationInput, 'jobId'>> & {
  jobId?: string;
};

export type TApplicationFilterQuery = {
  jobId?: string;
  email?: string;
  page?: number;
  limit?: number;
};

