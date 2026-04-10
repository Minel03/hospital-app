import admissionModel from '../models/admissionModel.js';
import labReportModel from '../models/labReportModel.js';
import bedModel from '../models/bedModel.js';
import roomModel from '../models/roomModel.js';
import mongoose from 'mongoose';

export const getAutoBillData = async (req, res) => {
  try {
    const { patientId } = req.params;

    // 1. Find active admission
    const admission = await admissionModel.findOne({
      patient: patientId,
      status: 'Admitted',
    }).populate('bed');

    let billingItems = [];
    let admissionData = null;

    if (admission) {
      admissionData = admission;
      // 2. Calculate Room Charges (Calendar Days)
      const startDate = new Date(admission.admissionDate);
      const endDate = new Date(); // Current date for ongoing admission
      
      // Calculate difference in days
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1; // Minimum 1 day

      // Get Room Rate
      if (admission.bed) {
        const bed = await bedModel.findById(admission.bed._id).populate('room');
        if (bed && bed.room) {
          billingItems.push({
            name: 'Room & Board',
            amount: bed.room.ratePerNight * diffDays,
            quantity: diffDays,
            details: `Room ${bed.room.roomNumber}, Type: ${bed.room.type} (${diffDays} days)`,
          });
        }
      }
    }

    // 3. Fetch Unbilled Lab Reports
    const unbilledLabs = await labReportModel.find({
      patient: patientId,
      status: 'Completed',
      isBilled: false,
    }).populate('test');

    unbilledLabs.forEach((report) => {
      if (report.test) {
        billingItems.push({
          name: 'Laboratory',
          amount: report.test.price,
          quantity: 1,
          labTest: report.test._id,
          details: `Lab Test: ${report.test.name}`,
        });
      }
    });

    res.json({
      success: true,
      admission: admissionData,
      billingItems,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
