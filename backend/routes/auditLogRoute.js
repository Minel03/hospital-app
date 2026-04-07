// routes/auditLogRoutes.js
import express from 'express';
import {
  getAllLogs,
  getLogsByEntity,
} from '../controllers/auditLogController.js';

const auditLogRouter = express.Router();

auditLogRouter.get('/list', getAllLogs);
auditLogRouter.post('/entity', getLogsByEntity);

export default auditLogRouter;
