import { Router } from 'express';
import validateRequest from '../../../middleware/validateRequest';
import { authenticate, requirePermission } from '../../../middleware/auth.middleware';
import { PERMISSIONS } from '../../../config/rbac';
import {
  getApplicationsQuerySchema,
  updateApplicationSchema,
} from '../validations/application.validation';
import {
  deleteApplicationHandler,
  getApplicationByIdHandler,
  getApplicationsHandler,
  updateApplicationHandler,
} from '../controllers/admin.controller';

const router = Router();

// Admin: GET /api/applications
router.get(
  '/',
  authenticate,
  requirePermission(PERMISSIONS.APPLICATION_READ),
  validateRequest(getApplicationsQuerySchema),
  getApplicationsHandler
);

// Admin: GET /api/applications/:id
router.get(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.APPLICATION_READ),
  getApplicationByIdHandler
);

// Admin: PATCH /api/applications/:id
router.patch(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.APPLICATION_UPDATE),
  validateRequest(updateApplicationSchema),
  updateApplicationHandler
);

// Admin: DELETE /api/applications/:id
router.delete(
  '/:id',
  authenticate,
  requirePermission(PERMISSIONS.APPLICATION_DELETE),
  deleteApplicationHandler
);

export default router;

