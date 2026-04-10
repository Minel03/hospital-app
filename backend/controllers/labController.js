import labTestModel from '../models/labTestModel.js';
import labReportModel from '../models/labReportModel.js';
import { createLog } from './auditLogController.js';
import { sendLabResultEmail } from '../utils/emailHelper.js';

/* =========================================================
   LAB TESTS (Definitions)
========================================================= */
export const addLabTest = async (req, res) => {
  try {
    const test = await labTestModel.create(req.body);
    res.json({ success: true, message: 'Lab test definition added', test });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllLabTests = async (req, res) => {
  try {
    const tests = await labTestModel.find().sort({ name: 1 });
    res.json({ success: true, tests });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   LAB REPORTS (Orders & Results)
========================================================= */
export const createLabOrder = async (req, res) => {
  try {
    const { patient, doctor, test } = req.body;
    const testDef = await labTestModel.findById(test);
    
    const order = await labReportModel.create({
      patient,
      doctor,
      test,
      normalRangeSnapshot: testDef?.normalRange || 'N/A'
    });

    await createLog({
      entity: 'Patient',
      entityId: patient,
      action: 'Lab Order Created',
      details: `Lab test ordered: ${testDef?.name}`,
    });

    res.json({ success: true, message: 'Lab test ordered', order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPendingOrders = async (req, res) => {
  try {
    const orders = await labReportModel.find({ status: { $ne: 'Completed' } })
      .populate('patient')
      .populate('doctor')
      .populate('test')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const uploadLabResults = async (req, res) => {
  try {
    const { id, resultValue, findings, status } = req.body;
    const order = await labReportModel.findById(id).populate('test').populate('patient');
    
    if (!order) return res.json({ success: false, message: 'Order not found' });

    order.resultValue = resultValue;
    order.findings = findings;
    order.status = status || 'Completed';
    if (order.status === 'Completed') {
      order.completedAt = new Date();
      
      // Trigger Email Notification (Non-blocking)
      if (order.patient?.email) {
        sendLabResultEmail(order.patient.email, {
          testName: order.test.name,
          patientName: order.patient.name,
        }).catch(err => console.error('Lab Report Email Error:', err));
      }
    }
    await order.save();

    await createLog({
      entity: 'Patient',
      entityId: order.patient,
      action: 'Lab Results Uploaded',
      details: `Results uploaded for test: ${order.test.name}`,
    });

    res.json({ success: true, message: 'Lab results updated', order });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.query;
    const reports = await labReportModel.find({ patient: patientId, status: 'Completed' })
        .populate('test')
        .populate('doctor');
    res.json({ success: true, reports });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}
