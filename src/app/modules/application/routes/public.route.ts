import { Router } from 'express';
import { upload } from '../../../middleware';
import validateRequest from '../../../middleware/validateRequest';
import { createApplicationSchema } from '../validations/application.validation';
import { submitApplicationHandler } from '../controllers/public.controller';

const router = Router();

// Public: POST /api/applications
router.post(
	'/',
	upload.single('resume'),
	validateRequest(createApplicationSchema),
	submitApplicationHandler
);

export default router;

