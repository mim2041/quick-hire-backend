export type TCreateJobInput = {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  status?: 'active' | 'inactive';
};

export type TUpdateJobInput = Partial<TCreateJobInput>;

export type TJobFilterQuery = {
  searchTerm?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

