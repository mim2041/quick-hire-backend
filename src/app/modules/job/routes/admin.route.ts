import { Router } from 'express';
import validateRequest from '../../../middleware/validateRequest';
import { authenticate, requirePermission } from '../../../middleware/auth.middleware';
import { PERMISSIONS } from '../../../config/rbac';
import { createJobSchema } from '../validations/job.validation';
import { createJobHandler, deleteJobHandler } from '../controllers/admin.controller';

const router = Router();

// Guard chain: authenticate → requirePermission → validateRequest → controller
// Admin: POST /api/jobs
router.post(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.JOB_CREATE),
  validateRequest(createJobSchema),
  createJobHandler
);

// Admin: DELETE /api/jobs/:id
router.delete(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.JOB_DELETE),
  deleteJobHandler
);

export default router;

