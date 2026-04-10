// controllers/invoiceController.js
import invoiceModel from '../models/invoiceModel.js';
import medicineModel from '../models/medicineModel.js';
import labReportModel from '../models/labReportModel.js';
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

    // Mark lab reports as billed
    for (const service of services) {
      if (service.name === 'Laboratory' && service.labTest) {
        await labReportModel.updateMany(
          { patient: patient, test: service.labTest, isBilled: false },
          { isBilled: true }
        );
      }
    }

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

    // Mark lab reports as billed for updated services
    if (services) {
      for (const service of services) {
        if (service.name === 'Laboratory' && service.labTest) {
          await labReportModel.updateMany(
            { patient: updated.patient, test: service.labTest, isBilled: false },
            { isBilled: true }
          );
        }
      }
    }

    await createLog({
      entity: 'Invoice',
      entityId: invoiceId,
      action: 'Invoice Updated',
      patient: updated.patient,
      doctor: updated.doctor,
      details: `Invoice details updated. Total amount: $${updated.totalAmount}.`,
    });

    res.json({ success: true, message: 'Invoice updated', invoice: updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const invoice = await invoiceModel.findById(invoiceId);
    if (invoice) {
      await createLog({
        entity: 'Invoice',
        entityId: invoiceId,
        action: 'Invoice Deleted',
        patient: invoice.patient,
        doctor: invoice.doctor,
        details: `Invoice for $${invoice.totalAmount} was deleted.`,
      });
    }
    await invoiceModel.findByIdAndDelete(invoiceId);
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const markAsPaid = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const invoice = await invoiceModel.findById(invoiceId);

    if (!invoice)
      return res.json({ success: false, message: 'Invoice not found' });

    if (invoice.status === 'Paid') {
      return res.json({ success: false, message: 'Invoice already paid' });
    }

    // Update status to Paid
    invoice.status = 'Paid';
    await invoice.save();

    // Decrement stock for medicines in the invoice
    for (const service of invoice.services) {
      if (service.medicine && service.quantity) {
        const medicine = await medicineModel.findById(service.medicine);
        if (medicine) {
          medicine.stock = Math.max(0, medicine.stock - service.quantity);
          await medicine.save();
        }
      }
    }

    await createLog({
      entity: 'Invoice',
      entityId: invoiceId,
      action: 'Invoice Paid',
      patient: invoice.patient,
      doctor: invoice.doctor,
      details: `Invoice marked as paid. Stock deducted for pharmacy items.`,
    });

    res.json({ success: true, message: 'Marked as paid', invoice });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
