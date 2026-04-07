// controllers/invoiceController.js
import invoiceModel from '../models/invoiceModel.js';
import { createLog } from './auditLogController.js';

export const createInvoice = async (req, res) => {
  try {
    const { patient, admission, appointment, doctor, services, dueDate } =
      req.body;
    const totalAmount = services.reduce((sum, s) => sum + s.amount, 0);
    const invoice = await invoiceModel.create({
      patient,
      doctor,
      services,
      totalAmount,
      dueDate,
      admission: admission || null,
      appointment: appointment || null,
    });

    await createLog({
      entity: 'Invoice',
      entityId: invoice._id,
      action: 'Invoice Created',
      patient: invoice.patient,
      doctor: invoice.doctor,
      details: `Invoice of $${totalAmount} created.`,
    });

    res.json({ success: true, message: 'Invoice created', invoice });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceModel
      .find()
      .populate('patient')
      .populate('doctor')
      .populate('admission')
      .populate('appointment')
      .sort({ createdAt: -1 });
    res.json({ success: true, invoices });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const {
      invoiceId,
      services,
      dueDate,
      status,
      admission,
      appointment,
      doctor,
      patient,
    } = req.body;
    const totalAmount = services?.reduce((sum, s) => sum + s.amount, 0);
    const updated = await invoiceModel.findByIdAndUpdate(
      invoiceId,
      {
        patient,
        doctor,
        admission,
        appointment,
        services,
        totalAmount,
        dueDate,
        status,
      },
      { new: true },
    );
    if (!updated)
      return res.json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, message: 'Invoice updated', invoice: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    await invoiceModel.findByIdAndDelete(invoiceId);
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const markAsPaid = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const invoice = await invoiceModel.findByIdAndUpdate(
      invoiceId,
      { status: 'Paid' },
      { new: true },
    );
    if (!invoice)
      return res.json({ success: false, message: 'Invoice not found' });

    await createLog({
      entity: 'Invoice',
      entityId: invoiceId,
      action: 'Invoice Paid',
      patient: invoice.patient,
      doctor: invoice.doctor,
      details: `Invoice marked as paid.`,
    });

    res.json({ success: true, message: 'Marked as paid', invoice });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
