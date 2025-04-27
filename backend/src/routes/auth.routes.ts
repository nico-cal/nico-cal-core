import express from 'express';
import { loginHandler, logoutHandler } from '../controllers/auth.controller';

const router = express.Router();

// Auth routes
router.post('/login', loginHandler);
router.post('/logout', logoutHandler);

export { router as authRoutes };
