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

const invoiceRouter = express.Router();

invoiceRouter.post('/add', createInvoice);
invoiceRouter.get('/list', getAllInvoices);
invoiceRouter.post('/update', updateInvoice);
invoiceRouter.post('/delete', deleteInvoice);
invoiceRouter.post('/mark-paid', markAsPaid);
invoiceRouter.get('/auto-calculate/:patientId', getAutoBillData);

export default invoiceRouter;
