import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    jobId: z.string().min(1, 'Job ID is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    resumeLink: z.string().url('Resume link must be a valid URL'),
    coverNote: z.string().min(1, 'Cover note is required'),
  }),
});

