import express from 'express';
import {
  addLabTest,
  getAllLabTests,
  createLabOrder,
  getPendingOrders,
  uploadLabResults,
  getPatientReports,
} from '../controllers/labController.js';
import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const labRouter = express.Router();

labRouter.use(authUser);

// LAB TESTS
labRouter.get('/tests', getAllLabTests);
labRouter.post('/tests/add', restrictTo('admin'), addLabTest);

// ORDERS & REPORTS
labRouter.post('/order', restrictTo('doctor', 'admin'), createLabOrder);
labRouter.get('/orders/pending', restrictTo('admin', 'staff', 'doctor'), getPendingOrders);
labRouter.post('/results/upload', restrictTo('admin', 'staff'), uploadLabResults);
labRouter.get('/patient/reports', getPatientReports);

export default labRouter;
