import express from 'express';
import {
  getAllLogs,
  getLogsByEntity,
} from '../controllers/auditLogController.js';
import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const auditLogRouter = express.Router();

// Only Admins can view audit logs
auditLogRouter.use(authUser);
auditLogRouter.use(restrictTo('admin'));

auditLogRouter.get('/list', getAllLogs);
auditLogRouter.post('/entity', getLogsByEntity);

export default auditLogRouter;
