import express from 'express';
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from '../controllers/departmentController.js';

const departmentRouter = express.Router();

departmentRouter.post('/add', createDepartment);
departmentRouter.post('/update', updateDepartment);
departmentRouter.get('/list', getAllDepartments);
departmentRouter.post('/get', getDepartmentById);
departmentRouter.delete('/delete', deleteDepartment);

export default departmentRouter;
