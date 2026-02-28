import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'Job ID is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    coverNote: z.string().min(1, 'Cover note is required'),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    resumeLink: z.string().url().optional(),
    coverNote: z.string().min(1).optional(),
  }),
});

export const getApplicationsQuerySchema = z.object({
  query: z.object({
    jobId: z.string().optional(),
    email: z.string().email().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
  }),
});

