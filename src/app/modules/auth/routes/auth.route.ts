import { Router } from 'express';
import validateRequest from '../../../middleware/validateRequest';
import { authenticate } from '../../../middleware/auth.middleware';
import { loginSchema, refreshSchema } from '../validations/auth.validation';
import { loginHandler, refreshHandler, logoutHandler, meHandler } from '../controllers/auth.controller';

const router = Router();

router.post('/login', validateRequest(loginSchema), loginHandler);
router.post('/refresh', validateRequest(refreshSchema), refreshHandler);
router.post('/logout', validateRequest(refreshSchema), logoutHandler);
router.get('/me', authenticate, meHandler);

export default router;
