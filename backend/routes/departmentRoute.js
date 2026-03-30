import express from 'express';
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDeparmentById,
  updateDepartment,
} from '../controllers/departmentController.js';

const departmentRouter = express.Router();

departmentRouter.post('/add', createDepartment);
departmentRouter.post('/update', updateDepartment);
departmentRouter.get('/list', getAllDepartments);
departmentRouter.post('/get', getDeparmentById);
departmentRouter.delete('/delete', deleteDepartment);

export default departmentRouter;
