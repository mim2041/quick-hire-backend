import { Router } from 'express';
import { getJobByIdHandler, getJobsHandler } from '../controllers/public.controller';

const router = Router();

// Public: GET /api/jobs
router.get('/', getJobsHandler);

// Public: GET /api/jobs/:id
router.get('/:id', getJobByIdHandler);

export default router;

