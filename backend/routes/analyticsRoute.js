import express from 'express';
import { getDashboardSummary } from '../controllers/analyticsController.js';
import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const analyticsRouter = express.Router();

// Only Admins and Doctors can see dashboard analytics
analyticsRouter.get('/dashboard-summary', authUser, restrictTo('admin', 'doctor', 'accountant', 'receptionist', 'pharmacist', 'nurse', 'medtech'), getDashboardSummary);

export default analyticsRouter;
