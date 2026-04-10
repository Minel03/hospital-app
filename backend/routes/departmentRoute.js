import express from 'express';
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from '../controllers/departmentController.js';

import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const departmentRouter = express.Router();

departmentRouter.use(authUser);
departmentRouter.use(restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'medtech', 'accountant'));

departmentRouter.post('/add', restrictTo('admin'), createDepartment);
departmentRouter.post('/update', restrictTo('admin'), updateDepartment);
departmentRouter.get('/list', getAllDepartments);
departmentRouter.post('/get', getDepartmentById);
departmentRouter.delete('/delete', restrictTo('admin'), deleteDepartment);

export default departmentRouter;
