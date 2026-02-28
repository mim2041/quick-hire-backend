import { z } from 'zod';

const statusEnum = z.enum(['active', 'inactive']);

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    company: z.string().min(1, 'Company is required'),
    location: z.string().min(1, 'Location is required'),
    category: z.string().min(1, 'Category is required'),
    description: z.string().min(1, 'Description is required'),
    status: statusEnum.optional(),
  }),
});

export const updateJobSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    company: z.string().min(1).optional(),
    location: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    status: statusEnum.optional(),
  }),
});

export const getJobsQuerySchema = z.object({
  query: z.object({
    searchTerm: z.string().optional(),
    category: z.string().optional(),
    location: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    sort: z.string().optional(),
  }),
});

