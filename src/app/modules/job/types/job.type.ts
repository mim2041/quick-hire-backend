export type TCreateJobInput = {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
};

export type TJobFilterQuery = {
  searchTerm?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

