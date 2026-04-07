// routes/invoiceRoutes.js
import express from 'express';
import {
  createInvoice,
  getAllInvoices,
  updateInvoice,
  deleteInvoice,
  markAsPaid,
} from '../controllers/invoiceController.js';

const invoiceRouter = express.Router();

invoiceRouter.post('/add', createInvoice);
invoiceRouter.get('/list', getAllInvoices);
invoiceRouter.post('/update', updateInvoice);
invoiceRouter.post('/delete', deleteInvoice);
invoiceRouter.post('/mark-paid', markAsPaid);

export default invoiceRouter;
