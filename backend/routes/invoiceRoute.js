// routes/invoiceRoutes.js
import express from 'express';
import {
  createInvoice,
  getAllInvoices,
  updateInvoice,
  deleteInvoice,
  markAsPaid,
} from '../controllers/invoiceController.js';
import { getAutoBillData } from '../controllers/billingController.js';

import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const invoiceRouter = express.Router();

invoiceRouter.use(authUser);

invoiceRouter.post('/add', restrictTo('admin', 'accountant', 'receptionist'), createInvoice);
invoiceRouter.get('/list', restrictTo('admin', 'accountant', 'receptionist'), getAllInvoices);
invoiceRouter.post('/update', restrictTo('admin', 'accountant'), updateInvoice);
invoiceRouter.post('/delete', restrictTo('admin'), deleteInvoice);
invoiceRouter.post('/mark-paid', restrictTo('admin', 'accountant', 'receptionist'), markAsPaid);
invoiceRouter.get('/auto-calculate/:patientId', restrictTo('admin', 'accountant', 'receptionist'), getAutoBillData);

export default invoiceRouter;
