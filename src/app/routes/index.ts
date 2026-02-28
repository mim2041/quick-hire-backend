import { Router } from 'express';
import jobPublicRoutes from '../modules/job/routes/public.route';
import jobAdminRoutes from '../modules/job/routes/admin.route';
import applicationPublicRoutes from '../modules/application/routes/public.route';
import authRoutes from '../modules/auth/routes/auth.route';

const router = Router();

router.use('/auth', authRoutes);

// Public job routes
router.use('/jobs', jobPublicRoutes);

// Admin job routes (protected)
router.use('/jobs', jobAdminRoutes);

// Public applications route
router.use('/applications', applicationPublicRoutes);

export default router;